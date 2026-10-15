import threading
import time
from collections import deque

from ..exceptions import ApiError


class RateLimiter:
    """In-process sliding-window limiter. Per worker process — use a shared store
    (e.g. Redis) if the API is scaled to multiple processes."""

    def __init__(self) -> None:
        self._hits: dict[str, deque[float]] = {}
        self._lock = threading.Lock()

    def check(self, key: str, limit: int, window_s: float = 60.0) -> None:
        now = time.monotonic()
        with self._lock:
            q = self._hits.setdefault(key, deque())
            while q and q[0] <= now - window_s:
                q.popleft()
            if len(q) >= limit:
                retry = int(q[0] + window_s - now) + 1
                raise ApiError(
                    429, "RATE_LIMITED", "Too many attempts. Please wait and try again.",
                    headers={"Retry-After": str(retry)},
                )
            q.append(now)
            if len(self._hits) > 10_000:  # bound memory
                self._hits = {k: v for k, v in self._hits.items() if v and v[-1] > now - window_s}

    def reset(self) -> None:
        with self._lock:
            self._hits.clear()


rate_limiter = RateLimiter()
