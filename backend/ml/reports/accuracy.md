# Measurement accuracy

Generated 2026-10-14 by `python -m ml.train`.

Training data: BodyM train split. It has 4460 front + side silhouette pairs from 1599 people, with tape-style ground truth. Photo pairs with the head or feet cut off are excluded, the same rule the live API applies.

Each cell is **MAE / 90th-percentile absolute error in cm**, measured on people the model never saw.

## testA: in-distribution held-out people

1053 photo pairs from 87 people.

| Measurement | Geometry only | Model, front photo only | Model, front + side |
|---|---|---|---|
| chest | 27.24 / 36.94 | 3.34 / 7.13 | 2.59 / 5.23 |
| waist | 6.76 / 10.80 | 3.19 / 6.47 | 2.55 / 5.11 |
| hip | 4.58 / 7.86 | 2.30 / 4.74 | 1.98 / 3.96 |
| shoulderWidth | 10.73 / 20.78 | 1.00 / 1.94 | 0.87 / 1.73 |
| armLength | 26.32 / 34.51 | 1.00 / 2.00 | 1.00 / 1.96 |
| legLength | 12.00 / 19.98 | 1.60 / 3.66 | 1.63 / 3.38 |

## testB: harder held-out set (different capture conditions)

610 photo pairs from 334 people.

| Measurement | Geometry only | Model, front photo only | Model, front + side |
|---|---|---|---|
| chest | 23.82 / 34.54 | 4.14 / 8.73 | 3.64 / 7.64 |
| waist | 8.29 / 14.05 | 4.32 / 9.25 | 4.56 / 10.68 |
| hip | 6.18 / 11.41 | 3.70 / 8.07 | 3.45 / 7.20 |
| shoulderWidth | 8.57 / 20.00 | 1.05 / 2.26 | 0.97 / 2.13 |
| armLength | 23.07 / 34.05 | 1.01 / 1.96 | 0.99 / 1.92 |
| legLength | 11.14 / 20.46 | 1.55 / 3.25 | 1.55 / 3.15 |

## Notes

- **Units and scale.** Height is the user-supplied value (BodyM `height_cm`), so the scale comes from it.
- **Shoulder width and arm length** follow BodyM's definitions (biacromial breadth; shoulder to wrist). These can differ slightly from a tailor's tape method.
- **What the app reports.** The ± values the live API shows are the testA MAE of the model actually used.
- **Neck** is not in BodyM and still uses the landmark geometry method.
- **Real-world error may be higher.** Expect larger errors from loose clothing, poor segmentation, or camera tilt, which are not represented in BodyM.
