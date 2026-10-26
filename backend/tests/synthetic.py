"""Synthetic A-pose silhouettes with known dimensions (1 px = 0.2 cm at 180 cm tall)."""

import cv2
import numpy as np

from app.cv.detector import ViewDetection

H_IMG, W_IMG = 1000, 600
TOP, BOTTOM = 50, 950
HEIGHT_CM = (BOTTOM - TOP) * 0.2  # 180 cm


def _landmarks(points: dict[int, tuple[float, float]]) -> np.ndarray:
    lms = np.zeros((33, 4))
    for i, (x, y) in points.items():
        lms[i] = (x, y, 0.0, 1.0)  # unlisted landmarks stay invisible
    return lms


def _canvas():
    m = np.zeros((H_IMG, W_IMG), np.uint8)

    def rect(x0, y0, x1, y1):
        cv2.rectangle(m, (x0, y0), (x1 - 1, y1 - 1), 1, -1)

    return m, rect


def front_body(arms_touching: bool = False) -> ViewDetection:
    m, rect = _canvas()
    rect(250, TOP, 350, 170)          # head
    rect(270, 170, 330, 200)          # neck: 60 px = 12 cm
    rect(150, 200, 450, 230)          # shoulder line
    rect(200, 200, 400, 380)          # chest: 200 px = 40 cm
    rect(220, 380, 380, 450)          # waist: 160 px = 32 cm
    rect(205, 450, 395, 560)          # hips: 190 px = 38 cm
    rect(210, 560, 290, BOTTOM)       # legs, gap 290..310 -> crotch at y=560
    rect(310, 560, 390, BOTTOM)
    gap = 0 if arms_touching else 15
    rect(150, 200, 200 - gap, 600)    # arms
    rect(400 + gap, 200, 450, 600)
    lms = _landmarks({
        0: (300, 110), 9: (290, 140), 10: (310, 140),
        11: (190, 210), 12: (410, 210), 13: (168, 400), 14: (432, 400),
        15: (168, 580), 16: (432, 580), 19: (168, 600), 20: (432, 600),
        23: (250, 470), 24: (350, 470), 25: (250, 690), 26: (350, 690), 27: (250, 900), 28: (350, 900),
    })
    return ViewDetection(lms, m.astype(bool), people=1)


def side_body(bust: bool = False) -> ViewDetection:
    m, rect = _canvas()
    rect(250, TOP, 360, 170)          # head
    rect(280, 170, 330, 200)          # neck depth: 50 px = 10 cm
    rect(250, 200, 370, 380)          # chest depth: 120 px = 24 cm
    if bust:
        rect(370, 260, 390, 320)      # bust: 4 cm projection, fold at y=320
    rect(260, 380, 360, 450)          # waist depth: 100 px = 20 cm
    rect(250, 450, 370, 560)          # hip depth: 120 px = 24 cm
    rect(270, 560, 340, BOTTOM)       # legs
    lms = _landmarks({0: (330, 110), 9: (320, 140), 10: (320, 140), 11: (310, 210), 12: (312, 210),
                      23: (310, 470), 24: (312, 470), 25: (309, 690), 26: (311, 690),
                      27: (305, 900), 28: (307, 900)})
    return ViewDetection(lms, m.astype(bool), people=1)
