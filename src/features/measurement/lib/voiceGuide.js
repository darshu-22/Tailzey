const REPEAT_AFTER_MS = 6000;

/**
 * Spoken guidance (Web Speech API) so users standing away from the screen know what to do.
 * Repeated phrases are throttled; `force` speaks immediately (countdowns, step changes).
 */
export function createVoiceGuide() {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
  let enabled = true;
  let last = { text: '', at: 0 };

  return {
    supported: Boolean(synth),
    setEnabled(value) {
      enabled = value;
      if (!value) synth?.cancel();
    },
    say(text, { force = false } = {}) {
      if (!synth || !enabled || !text) return;
      const now = Date.now();
      if (!force && text === last.text && now - last.at < REPEAT_AFTER_MS) return;
      if (force) synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      synth.speak(utterance);
      last = { text, at: now };
    },
    cancel() {
      synth?.cancel();
    },
  };
}
