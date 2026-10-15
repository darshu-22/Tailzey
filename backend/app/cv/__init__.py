import os

# Guard against decompression bombs before OpenCV is imported anywhere (≈40 MP max).
os.environ.setdefault("CV_IO_MAX_IMAGE_PIXELS", str(40_000_000))
# Silence MediaPipe/TFLite C++ info logs (they go straight to stderr).
os.environ.setdefault("GLOG_minloglevel", "2")
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
