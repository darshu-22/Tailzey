# Tailzey

Custom-outfit design with camera-based body measurement.

Users design a garment and take guided photos — hands-free: the browser checks their pose, talks them through it and takes each photo itself. They get tailoring measurements with an honest ± error, then pick a size, try the garment on live over their camera, view it on a 3D mannequin shaped from their measurements, and export a design report.

**Features**
- **Design studio:** garment, colour, style, fit and garment-specific options with a live preview.
- **Camera measurement:** hands-free capture with voice guidance; server-side estimation with ± error per value.
- **Bust & cup size (opt-in):** underbust from tape or camera (side-view bust fold), with an EU / UK / US bra-size guide shown as a range for camera estimates.
- **Fit & Size:** edit values, add ease, choose size and fit, save measurement profiles.
- **Live try-on (AR):** the chosen garment drawn on you in real time — runs entirely on the device.
- **3D studio:** a detailed women's or men's mannequin (MakeHuman, CC0) fitted to your measurements in the browser, always dressed (garment, base layer, hair, shoes), with cloth physics so every garment drapes over the body and over the layer beneath. Garments are recoloured to your design; the kurta is cut from the body itself.
- **Design report:** a printable, tailor-ready spec (print / save as PDF).

| Part | Stack |
|---|---|
| Frontend | React 19, Vite 8, feature-sliced architecture, hash router with lazy-loaded pages, Three.js, MediaPipe Tasks Vision (in-browser) |
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
npm run dev          # http://localhost:5173 — /api is proxied to :8000 (first run also self-hosts the in-browser pose model)
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
  shared/           ui/ (Button, Card, PageHeader, states…), layout/ (AppShell, marketing Header/Footer),
                    data/ (catalogues), garments/ (options + SVG previews), measurements/, vision/ (MediaPipe),
                    utils/units.js
  features/
    auth/ home/ dashboard/ designer/ measurement/ results/ tryon/ viewer3d/ report/
                    each with pages/ components/ hooks/ lib/ styles/
  styles/           design tokens, base + layout primitives, shared UI styles
```

- **Pages take no props.** They read shared state through hooks. `WorkspaceProvider` holds the in-progress design and measurement profile, and saves or loads them through the services.
- **Routes are code-split.** Private routes render inside one `AppShell` (header + navigation), redirect to sign-in and return to the requested page afterwards. Three.js and MediaPipe load only on the pages that use them.
- **Design system:** light, simple palette with one accent; self-hosted Inter + Playfair Display; semantic tokens only; mobile-first, full-height layouts; WCAG AA contrast and visible focus.
- **One source of truth for the catalogue.** The backend validates against `src/shared/data`, exported by `backend/scripts/export_catalog.mjs`.
- **3D assets are prebuilt.** `backend/scripts/build_mannequin.py` turns MakeHuman's CC0 base mesh, morph targets and garments into compact binaries and WebP textures in `public/models/mannequin/` (about 0.5 MB gzipped for a body, 30–350 KB per garment), loaded only by the 3D studio. Fitting, cloth physics and subdivision run in a Web Worker.

## Measurement accuracy

Mean absolute error on people the model never saw (BodyM testA, front + side photos):

| Chest | Waist | Hip | Shoulder | Arm | Inseam |
|---|---|---|---|---|---|
| 2.6 cm | 2.6 cm | 2.0 cm | 0.9 cm | 1.0 cm | 1.6 cm |

The full breakdown is in the [accuracy report](backend/ml/reports/accuracy.md): front-only photos, a harder test set, and a raw-geometry baseline. These figures come from BodyM's silhouettes. Real phone photos also add segmentation error, so expect somewhat larger errors in practice.

The app shows each estimate with this ± error. Users should confirm critical measurements with a tape measure.

## Credits

- Measurement model training data: BodyM (CC BY 4.0), see [backend/README.md](backend/README.md).
- 3D mannequin, morph targets and garments: [MakeHuman](http://www.makehumancommunity.org) assets, released as CC0 1.0. Only the CC0 assets are used; no MakeHuman (AGPL) code is included.

## Privacy

- Photos are analysed in memory on the server and discarded. They are never stored, logged or returned.
- Hands-free pose checks and live try-on run entirely in the browser; video never leaves the device.
- Bust measurement is opt-in. Turning it off removes the underbust from the profile.
- Users can delete their account, which removes all of their data.
