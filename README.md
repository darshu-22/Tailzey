# Tailzey

Custom-outfit design with camera-based body measurement.

Users design a garment, take guided front and side photos, and get tailoring measurements with an honest ± error. They can then review sizes, preview the outfit on a sample mannequin, and export a design report.

| Part | Stack |
|---|---|
| Frontend | React 19, Vite 8, feature-sliced architecture, hash router with lazy-loaded pages |
| Backend | FastAPI, SQLAlchemy 2, Alembic, Argon2id, HttpOnly cookie sessions |
| Computer vision | MediaPipe Pose (landmarks + person mask), silhouette features, and a ridge + XGBoost model trained on BodyM (GPU) |

## Quick start

**Backend** (Python 3.14), from `backend/`. See [backend/README.md](backend/README.md) for details.

```bash
py -3.14 -m venv .venv
.venv/Scripts/python -m pip install -r requirements-dev.txt
.venv/Scripts/python scripts/download_models.py
.venv/Scripts/alembic upgrade head
.venv/Scripts/uvicorn app.main:app --reload --port 8000
```

**Frontend** (Node 24), from the repo root:

```bash
npm ci
npm run dev          # http://localhost:5173 — /api is proxied to :8000
npm run build && npm run lint
```

`VITE_API_BASE_URL` defaults to `/api/v1`, which uses the dev proxy. See [.env.example](.env.example).

## Frontend architecture

```
src/
  app/              App root, providers (auth, workspace, toast), hash router + route guards
    hooks.js        useAuth · useWorkspace · useToast · useRouter
  core/             api/httpClient.js (fetch wrapper, ApiError), config/env.js
  services/         authService, designService, profileService, measurementService
  shared/           ui/ (Button, Card, states…), layout/ (Header, Footer), data/ (catalogues),
                    measurements/ (field rules, estimate formatting), utils/units.js
  features/
    auth/ home/ dashboard/ designer/ measurement/ results/ viewer3d/ report/
                    each with pages/ components/ hooks/ lib/ styles/
  styles/           design tokens, base, shared UI styles, responsive rules
```

- **Pages take no props.** They read shared state through hooks. `WorkspaceProvider` holds the in-progress design and measurement profile, and saves or loads them through the services.
- **Routes are code-split.** Private routes redirect to sign-in and return to the requested page afterwards.
- **One source of truth for the catalogue.** The backend validates against `src/shared/data`, exported by `backend/scripts/export_catalog.mjs`.

## Measurement accuracy

Mean absolute error on people the model never saw (BodyM testA, front + side photos):

| Chest | Waist | Hip | Shoulder | Arm | Inseam |
|---|---|---|---|---|---|
| 2.6 cm | 2.6 cm | 2.0 cm | 0.9 cm | 1.0 cm | 1.6 cm |

The full breakdown is in the [accuracy report](backend/ml/reports/accuracy.md): front-only photos, a harder test set, and a raw-geometry baseline. These figures come from BodyM's silhouettes. Real phone photos also add segmentation error, so expect somewhat larger errors in practice.

The app shows each estimate with this ± error. Users should confirm critical measurements with a tape measure.

## Privacy

- Photos are analysed in memory on the server and discarded. They are never stored, logged or returned.
- Users can delete their account, which removes all of their data.
