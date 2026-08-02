// Programmatic call ringtone via the Web Audio API — no audio asset needed.
//  • "incoming" → a two-tone warble for the callee while a call is ringing
//  • "outgoing" → a single ringback tone for the caller while waiting
// Browsers may keep the AudioContext suspended until a user gesture; we call
// resume() best-effort (works once the user has interacted with the page).

let ctx: AudioContext | null = null;
let timer: ReturnType<typeof setInterval> | null = null;

const getCtx = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  return ctx;
};

const tone = (
  context: AudioContext,
  freq: number,
  start: number,
  dur: number,
  gain = 0.14,
) => {
  const osc = context.createOscillator();
  const g = context.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  osc.connect(g);
  g.connect(context.destination);
  const t = context.currentTime + start;
  // Short attack/release envelope to avoid clicks (exp ramps need >0 targets).
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.03);
  g.gain.setValueAtTime(gain, t + Math.max(0.05, dur - 0.06));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.start(t);
  osc.stop(t + dur + 0.03);
};

export function startRing(kind: "incoming" | "outgoing") {
  const context = getCtx();
  if (!context) return;
  if (context.state === "suspended") context.resume().catch(() => {});
  stopRing();

  const burst = () => {
    if (kind === "incoming") {
      tone(context, 880, 0, 0.35);
      tone(context, 988, 0.42, 0.35);
    } else {
      tone(context, 440, 0, 0.8, 0.09);
    }
  };

  burst();
  timer = setInterval(burst, kind === "incoming" ? 2400 : 3200);
}

export function stopRing() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
