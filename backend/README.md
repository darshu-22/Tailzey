# Tailzey Backend

FastAPI service for Tailzey. It provides:
- accounts and cookie sessions
- saved outfit designs and measurement profiles
- body measurements estimated from photos

## Setup

From `backend/`, using Python 3.14:

```bash
py -3.14 -m venv .venv
.venv/Scripts/python -m pip install -r requirements-dev.txt   # use .venv/bin/... on macOS/Linux
cp .env.example .env
.venv/Scripts/python scripts/download_models.py               # MediaPipe pose model (~31 MB, git-ignored)
.venv/Scripts/alembic upgrade head
.venv/Scripts/uvicorn app.main:app --reload --port 8000
```

- API docs: http://localhost:8000/api/v1/docs
- Health check: `GET /api/v1/health`
- Tests: `.venv/Scripts/python -m pytest`

The trained measurement model (`app/cv/models/measurement_model.*`, about 3 MB) is committed. You only need to retrain it if you change the features or the training data.

## Architecture

```
app/
  main.py              app factory
  core/                config · database · exceptions + error envelope · middleware (CORS, Origin
                       check, request ids, security headers) · security/ (passwords, sessions, rate limit)
  models/              SQLAlchemy tables, one per file (user, auth_session, design, measurement_profile)
  schemas/             request/response models (camelCase on the wire)
  repositories/        data access; OwnedRepository scopes every query to the owner
  services/            use cases: auth, designs, profiles, measurement analysis, catalogue validation
  api/                 deps.py (current user, pagination, rate limits) + v1/ thin routers
  cv/                  detector (MediaPipe) · quality (photo gates) · views · silhouette (features)
                       regressor (numpy model runtime) · neck · pipeline (views → measurements)
  data/catalog.json    exported from the frontend catalogue (scripts/export_catalog.mjs)
ml/                    offline training and evaluation (BodyM dataset, GPU)
migrations/            Alembic
```

A request flows **router → service → repository/cv**. Routers only parse input and shape output; all rules live in services.

## API (`/api/v1`)

Responses use these envelopes:
- **Success:** `{"data": ...}`
- **Lists:** `{"data": [...], "meta": {total, limit, offset}}`
- **Errors:** `{"error": {code, message, fieldErrors?, requestId}}`

| Route | Notes |
|---|---|
| `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET/DELETE /auth/me` | Cookie session. Login uses a generic 401 and is rate-limited. `DELETE /auth/me` erases the account and all of its data. |
| `GET/POST /designs`, `GET/PATCH/DELETE /designs/{id}` | Validated against the catalogue. The merged record is re-validated on PATCH. |
| `GET/POST /measurement-profiles`, `GET/PATCH/DELETE /measurement-profiles/{id}` | Values are stored in the profile's own unit. PATCH merges per key, and `null` clears a value. |
| `POST /measurements/analyze` | Camera measurement (below). |
| `GET /catalog`, `GET /health` | |

Every record belongs to one user. A record owned by someone else returns 404, the same as a missing one.

## Camera measurement

`POST /measurements/analyze` takes `multipart/form-data` and requires sign-in.

| Field | Required | Notes |
|---|---|---|
| `heightCm` | yes | The user's barefoot height; it sets the scale. |
| `consent` | yes | Must be `true`. |
| `front`, `back` | at least one | JPEG, PNG or WebP files, each ≤ 8 MB. |
| `left-side`, `right-side` | no | Same format. A side view enables the more accurate model. |
| `includeBust` | no | Opt-in (women's fit): also estimate the underbust for a cup size. Default `false`. |

### Pipeline

1. **Detect.** MediaPipe PoseLandmarker (heavy) returns 33 landmarks and a person mask for each photo. Photos run in parallel on a bounded pool, with one warm model per worker thread.
2. **Quality gates** (`cv/quality.py`). Each failure produces a user-facing fix-it message.
   - **Framing:** a person is found; the head and feet are in frame; there is only one person.
   - **View:** front and profile views aren't swapped.
   - **Posture:** knees straight, arms lowered (A-pose), feet hip-width apart.
3. **Silhouette features** (`cv/silhouette.py`), all in cm using the user's height:
   - widths (front) and depths (side) at 51 body levels
   - ellipse girths
   - crotch height
   - arm reach, traced along the arm so the legs are never mistaken for arms

   Front and back profiles are averaged, and so are left and right.
4. **Model** (`cv/regressor.py`). For each measurement, a ridge regression is blended with gradient-boosted trees. Both are stored as plain numpy arrays, so the API needs no ML library. With no side photo, a front-only model is used, with its own larger error.
5. **Neck** uses landmark geometry, because no training data exists for it. It is labelled low confidence.
   **Underbust** (only with `includeBust`, `cv/bust.py`) works the same way: in the side profile the bust apex is the deepest upper-chest row and the fold is the knee of the curve below it; the underbust is the front-width × side-depth ellipse at the fold, scaled by how far that ellipse misses the model's waist. It is unvalidated, so it is low confidence with ± 4 cm, and is dropped if it isn't clearly smaller than the chest.
6. **Honesty rules:**
   - Every value carries `uncertainty`: the model's error on held-out people, widened for weaker captures.
   - Out-of-range results become `null` with a `reason`.

### Accuracy

[ml/reports/accuracy.md](ml/reports/accuracy.md) is regenerated by training. It compares the untrained silhouette geometry, the front-only model and the front + side model on held-out people (BodyM testA) and on a harder set (testB).

## 3D studio assets

`scripts/build_mannequin.py` builds the 3D studio's mannequin from [MakeHuman](http://www.makehumancommunity.org) assets released as CC0 1.0: the base mesh and morph targets (pinned commit), and CC0 garments, hair, shoes and eyes from the official asset packs. It downloads them once into `.cache/mannequin/` (git-ignored, ~400 MB of packs), then writes quantised binaries, WebP textures and `manifest.json` to `../public/models/mannequin/`, which are committed. The build also:

- derives tape-measure landmarks from the mesh and targets, and prints both base bodies' measurements as a check;
- finds the skin each garment covers by ray-casting, so the studio can hide it;
- marks each texture's main fabric (for shoes, the socks) so the studio can recolour it;
- stores the skin as quads, which the studio subdivides for a smooth surface.

`tests/test_mannequin_assets.py` checks the committed output.

## Training the model (GPU)

```bash
.venv/Scripts/python -m pip install -r requirements-ml.txt   # CUDA-enabled XGBoost
.venv/Scripts/python -m ml.download_bodym                    # ~18k silhouette PNGs into ml/data (git-ignored)
.venv/Scripts/python -m ml.train                             # writes app/cv/models/* and ml/reports/accuracy.md
.venv/Scripts/python -m ml.e2e_eval 200                      # live pipeline vs ground truth
```

How training works:
- **GPU only.** Tree training refuses to run without a CUDA GPU. Several model variants train in parallel worker processes so the GPU stays busy.
- **Tuning on training data only.** Hyper-parameters and the ridge/tree blend weight are chosen by cross-validation on the training split. Folds are grouped by person, so one person's photos never span folds. The test sets are used only for the final report.
- **Same features as production.** Training uses the exact runtime feature code (`app/cv/silhouette.py`), so production sees identical features.

The training data is BodyM (Ruiz et al., *Human Body Measurement Estimation with Adversarial Augmentation*, 3DV 2022): https://registry.opendata.aws/bodym/, licensed CC BY 4.0. That licence requires attribution, which this README provides.

### Hardware note

MediaPipe's GPU delegate is not supported in Python on Windows (it raises `NotImplementedError`), so pose detection at request time runs on the CPU. That takes about 50–100 ms per photo with the heavy model. The trained model's inference is pure numpy and takes well under 1 ms.

## Security

- **Passwords and sessions:** passwords are hashed with Argon2id. Sessions use opaque tokens, and only their SHA-256 hash is stored. Sessions expire after 14 days.
- **Session cookie:** `HttpOnly; SameSite=Lax; Path=/api`, plus `Secure` in production.
- **Cross-origin protection:** CORS uses an exact-origin allowlist, and state-changing requests from other origins are rejected.
- **Rate limits:** on login, registration and analysis. The limiter is in-process, so use Redis if you run multiple workers.
- **Input validation:**
  - Schemas are strict: unknown fields are rejected, so a client can't supply `userId`.
  - Images are capped by size, type and decompressed pixel count.
- **Error responses** contain no stack traces.
- **Photos** are never written to disk, stored, logged or returned.

## Not yet implemented

- Password reset (needs an email provider)
- Production hosting (Postgres + `psycopg`, HTTPS)
