# AGENTS.md — Tailzey

Guide for AI coding agents working in this repository. Read it fully before changing code.

## What this project is

Tailzey is a custom-tailoring web app. A user:
1. designs a garment;
2. takes guided front and side photos;
3. gets body measurements estimated by computer vision, each with an honest ± error;
4. picks a size, previews the outfit on a sample 3D mannequin, and prints a design report.

| Part | Location | Stack |
|---|---|---|
| Frontend | `src/` | React 19 + Vite 8 (JavaScript), hash router, no UI framework |
| Backend API | `backend/app/` | Python 3.14, FastAPI, SQLAlchemy 2, Alembic, pydantic v2 |
| Computer vision | `backend/app/cv/` | MediaPipe PoseLandmarker (landmarks + person mask), numpy |
| Model training | `backend/ml/` | BodyM dataset, ridge + XGBoost (CUDA GPU only) |

## Commands

Run every command from the folder shown. The OS is Windows: use `.venv/Scripts/…`, not `.venv/bin/…`.

| Task | Where | Command |
|---|---|---|
| Install frontend | repo root | `npm ci` |
| Run frontend | repo root | `npm run dev` (http://localhost:5173; `/api` is proxied to :8000) |
| Build / lint frontend | repo root | `npm run build` · `npm run lint` |
| Install backend | `backend/` | `py -3.14 -m venv .venv` then `.venv/Scripts/python -m pip install -r requirements-dev.txt` |
| Pose model (once) | `backend/` | `.venv/Scripts/python scripts/download_models.py` |
| Database | `backend/` | `.venv/Scripts/alembic upgrade head` |
| Run API | `backend/` | `.venv/Scripts/uvicorn app.main:app --reload --port 8000` (docs at `/api/v1/docs`) |
| Test / lint backend | `backend/` | `.venv/Scripts/python -m pytest` · `.venv/Scripts/ruff check app ml tests scripts` |
| Re-export catalogue | repo root | `node backend/scripts/export_catalog.mjs` |
| Train model (GPU) | `backend/` | `pip install -r requirements-ml.txt`, then `python -m ml.download_bodym`, then `python -m ml.train` |
| Evaluate live pipeline | `backend/` | `.venv/Scripts/python -m ml.e2e_eval 200` |

## Before you call a task done

- `npm run build` succeeds and `npm run lint` reports zero warnings.
- `pytest` passes, and `ruff check` passes.
- After changing a model, run `alembic revision --autogenerate -m "…"`. The test suite runs `alembic check` and fails if models and migrations drift.
- After editing `src/shared/data/*.js`, run the catalogue export and commit `backend/app/data/catalog.json`.
- If you changed behaviour, run the app and check it. Builds and tests alone don't prove it works.

## Frontend architecture (`src/`)

```
app/        App root · AppProviders · hooks.js · providers/{auth,workspace,toast} · router/{routes,RouteOutlet}
core/       api/httpClient.js (fetch wrapper → ApiError) · config/env.js
services/   authService · designService · profileService · measurementService (the only modules that call the API)
shared/     ui/ (Button, Card, StatusBadge, Loading/Empty/ErrorState…) · layout/ (Header, Footer)
            data/ (catalogues; garments/ has one file per garment) · measurements/ (field rules, ± formatting) · utils/units.js
features/   auth · home · dashboard · designer · measurement · results · viewer3d · report
            each split into pages/ components/ hooks/ lib/ styles/
styles/     index.css (global entry) · variables · global · ui/ · app.css · responsive.css
```

Rules:
- **Pages take no props.** Use the hooks from `src/app/hooks.js`: `useAuth`, `useWorkspace`, `useToast`, `useRouter`. Navigate with `navigate('designer')`. Route ids are in `app/router/routes.js`.
- **`useWorkspace()` is the single source of truth** for the in-progress `design` and `measurement`.
  - Don't copy that state into local state that can drift.
  - Change it through its actions: `updateDesign`, `setValue`, `setUnit`, `applyCameraAnalysis`, `saveDesign`, `saveProfile`, `openDesign`, `openProfile`, and so on.
- **Network calls go only through `src/services/*`.** Components never call `fetch`. Errors arrive as `ApiError {status, code, message, fieldErrors}`. Show `fieldErrors` inline and other errors via `useToast().notify`.
- **Never show success before the server confirms it.** Handle loading, empty, error, offline and 401 states.
- **Keep files small:** JSX and JS at most about 200 lines, CSS at most about 400. Split into components, hooks and `lib/` helpers.
- **Cross-feature code goes in `src/shared/`.** A feature must not import another feature's internals.
- **Styles:** each feature's CSS is imported from its `styles/index.css`, which `src/styles/index.css` imports. Reuse existing class names and design tokens from `variables.css`. Don't add a CSS framework.
- **Units:** measurement values live in `measurement.unit` (`cm` or `in`). Convert only with `shared/utils/units.js`. Missing values are `null`, never `0`.
- **Browser storage:** don't use `localStorage` or `sessionStorage` for user data. The only exception is the sign-in return route.

## Backend architecture (`backend/app/`)

A request flows `api/v1/<router>` → `services/<use case>` → `repositories/` or `cv/`.

| Folder | Contents |
|---|---|
| `core/` | config (env vars / `.env`), database, exceptions (`ApiError`, `not_found`, `validation_error`), error envelope, middleware, `security/` (passwords, sessions, rate_limit) |
| `models/` | one table per file |
| `schemas/` | pydantic, camelCase on the wire |
| `repositories/` | data access; `OwnedRepository` scopes queries by owner |
| `services/` | business rules and catalogue validation |
| `api/` | thin routers plus `deps.py` (`CurrentUser`, `DbSession`, pagination) |

Rules:
- **Routers stay thin.** They parse input and shape output; logic goes in services.
- **Response shapes:**
  - success `{"data": …}`
  - lists `{"data": […], "meta": {total, limit, offset}}`
  - errors `{"error": {code, message, fieldErrors?, requestId}}`

  Raise `ApiError` (or a helper); never return ad-hoc error JSON.
- **Ownership:**
  - User identity always comes from the session cookie, never from the request body.
  - Every record query is scoped to the owner.
  - A record that is missing and a record owned by someone else must both return 404.
- **Request schemas** are strict (`extra="forbid"`) with bounded lengths and ranges.
- **Datetimes:** use `UTCDateTime` and `utcnow()` (`models/base.py`). Never use naive datetimes.
- **Sessions:**
  - The cookie is HttpOnly, `SameSite=Lax`, `Path=/api`.
  - Only a SHA-256 hash of the token is stored.
  - CORS is an exact allowlist; never use a wildcard.

## Computer vision and model: rules that keep it honest

- **Pipeline** (`cv/pipeline.py`): detect, then quality gates (`cv/quality.py`, user-facing fix-it messages), then silhouette features (`cv/silhouette.py`), then the trained model (`cv/regressor.py`). Neck uses landmark geometry (`cv/neck.py`).
- **Never fabricate a measurement.** If something can't be measured, return `null` with a `reason`.
- **Every camera value carries `uncertainty`.** It is the model's measured error on held-out people. Don't hard-code or "improve" these numbers by hand.
- **Training and inference share `app/cv/silhouette.py`.** If you change features, you must retrain (`python -m ml.train`) and commit `app/cv/models/measurement_model.{npz,json}` plus `ml/reports/accuracy.md`.
- **Never tune on the test sets.** Hyper-parameters and blend weights come only from grouped cross-validation on the training split. testA and testB are for reporting.
- **Training is GPU-only.** XGBoost uses `device="cuda"` and `ml/trees.py` refuses to run without CUDA. Model variants train in parallel worker processes.
- **The runtime needs no ML library.** Trees are exported to numpy arrays (`Forest`). Don't add scikit-learn, XGBoost or torch to `requirements.txt`.
- **Privacy:** photos stay in memory for a single request. Never write them to disk, the database or logs, and never return them.
- **BodyM** (training data) is licensed CC BY 4.0. Keep the attribution in `backend/README.md` and in the model metadata.

## Gotchas

- **Python 3.14 venv in `backend/.venv`.** `mediapipe` 1.1.0 has no `mp.solutions`; use the Tasks API (`mediapipe.tasks.python.vision`).
- **OpenCV conflict.** `mediapipe` installs `opencv-contrib-python`. Don't also install `opencv-python` or `opencv-python-headless`, because both provide `cv2`.
- **No GPU for MediaPipe on Windows.** The GPU delegate isn't supported in Python on Windows (`NotImplementedError`), so pose detection at runtime runs on the CPU.
- **Git-ignored files:**
  - Pose model `.task` files in `backend/models/`; get them with `scripts/download_models.py`.
  - The BodyM dataset in `backend/ml/data/`.
  - `*.db`, `.env*` (except `.env.example`), and `.venv/`.
- **Front-camera stills are mirrored.** That's harmless, because left and right side views are treated the same.
- **The dev frontend calls `/api/v1` through the Vite proxy.** In production, set `VITE_API_BASE_URL` and the backend `CORS_ALLOWED_ORIGINS`.
- **Secrets:** never put secrets in `VITE_*` variables, because they ship to the browser.

## Not implemented yet (don't pretend otherwise)

- Password reset, which needs an email provider.
- Production hosting: Postgres, HTTPS, and a shared rate-limit store.
- Personalised 3D bodies. The 3D viewer is an illustrative sample mannequin and must stay labelled that way.
