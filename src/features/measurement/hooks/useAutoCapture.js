import { useEffect, useMemo, useRef, useState } from 'react';
import { createVoiceGuide } from '../lib/voiceGuide';

const TICK_MS = 150;
const TURN_GRACE_MS = 3000; // time to turn / walk into position after each step change
const READY_HOLD_MS = 400; // must stay ready this long before the countdown starts
const COUNTDOWN_S = 3;
const HINT_AFTER_MS = 1500; // only speak a correction once it has persisted

const freshMachine = (graceUntil) => ({ phase: 'aligning', graceUntil, readySince: 0, hintCode: null, hintSince: 0 });

/** One state-machine step; mutates `m` and returns what the UI should show. */
function advance(m, { tracking, onCapture }, voice, now) {
  if (m.phase === 'captured') return { phase: 'captured', count: 0 };
  if (now < m.graceUntil) return { phase: 'turning', count: 0 };

  if (m.phase === 'countdown') {
    if (!tracking.ready) {
      m.phase = 'aligning';
      m.readySince = 0;
      voice.say(tracking.hint, { force: true });
      return { phase: 'aligning', count: 0 };
    }
    const count = COUNTDOWN_S - Math.floor((now - m.countdownStart) / 1000);
    if (count <= 0) {
      m.phase = 'captured';
      onCapture();
      voice.say('Got it.', { force: true });
      return { phase: 'captured', count: 0 };
    }
    if (count !== m.spokenCount) {
      voice.say(String(count), { force: true });
      m.spokenCount = count;
    }
    return { phase: 'countdown', count };
  }

  if (tracking.ready) {
    m.readySince ||= now;
    if (now - m.readySince >= READY_HOLD_MS) {
      m.phase = 'countdown';
      m.countdownStart = now;
      m.spokenCount = null;
    }
    return { phase: 'aligning', count: 0 };
  }
  m.readySince = 0;
  if (tracking.code !== m.hintCode) {
    m.hintCode = tracking.code;
    m.hintSince = now;
  } else if (now - m.hintSince >= HINT_AFTER_MS && tracking.status === 'tracking') {
    voice.say(tracking.hint); // throttled inside the voice guide
  }
  return { phase: 'aligning', count: 0 };
}

/**
 * Hands-free capture: when the user is in pose and still, count down and take the photo,
 * then announce the next view. Phases: turning → aligning → countdown → captured.
 */
export function useAutoCapture({ enabled, voiceOn, tracking, step, hasPhoto, onCapture }) {
  const voice = useMemo(() => createVoiceGuide(), []);
  const [view, setView] = useState({ phase: 'turning', count: 0 });
  const live = useRef({ tracking, onCapture });
  const machine = useRef(freshMachine(0));

  useEffect(() => {
    live.current = { tracking, onCapture };
  });
  useEffect(() => voice.setEnabled(voiceOn), [voice, voiceOn]);
  useEffect(() => () => voice.cancel(), [voice]);

  // Each new view (or a retake) restarts the sequence and tells the user what to do.
  useEffect(() => {
    if (!enabled || hasPhoto) return;
    machine.current = freshMachine(performance.now() + TURN_GRACE_MS);
    voice.say(step.instruction, { force: true });
  }, [enabled, hasPhoto, step.key, step.instruction, voice]);

  useEffect(() => {
    if (!enabled) return undefined;
    const id = setInterval(() => {
      const next = advance(machine.current, live.current, voice, performance.now());
      setView((v) => (v.phase === next.phase && v.count === next.count ? v : next));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [enabled, voice]);

  return view;
}
