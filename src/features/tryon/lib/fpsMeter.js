/** Rendered-frames-per-second, smoothed over roughly the last second. */
export function createFpsMeter() {
  let last = 0;
  let avgMs = 0;
  return {
    tick(now) {
      if (last) {
        const dt = now - last;
        avgMs = avgMs ? avgMs + (dt - avgMs) * 0.1 : dt;
      }
      last = now;
    },
    fps() {
      return avgMs ? Math.round(1000 / avgMs) : 0;
    },
  };
}
