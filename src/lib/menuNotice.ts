type NoticePhase = "waiting" | "visible" | "leaving" | "hidden";
interface NoticeClock {
  performance: Pick<Performance, "now">;
  setTimeout: Window["setTimeout"];
  clearTimeout: Window["clearTimeout"];
}

/** One notice, with a delayed entrance and a pausable visible lifetime. */
export function createMenuNotice(clock: NoticeClock, onChange: (phase: NoticePhase) => void) {
  let phase: NoticePhase = "waiting";
  let remaining = 1500;
  let started = 0;
  let timer: number | undefined;
  const pauses = new Set<string>();

  const dismiss = () => {
    if (phase !== "visible") return;
    clock.clearTimeout(timer);
    phase = "leaving";
    onChange(phase);
    timer = clock.setTimeout(() => {
      phase = "hidden";
      onChange(phase);
    }, 200);
  };
  const resume = () => {
    if (phase !== "visible" || pauses.size > 0) return;
    started = clock.performance.now();
    timer = clock.setTimeout(dismiss, remaining);
  };
  timer = clock.setTimeout(() => {
    phase = "visible";
    onChange(phase);
    resume();
  }, 1000);

  return {
    dismiss,
    pause(reason: string) {
      if (phase === "visible" && pauses.size === 0) {
        remaining = Math.max(0, remaining - (clock.performance.now() - started));
        clock.clearTimeout(timer);
      }
      pauses.add(reason);
    },
    resume(reason: string) {
      if (pauses.delete(reason) && pauses.size === 0) resume();
    },
    dispose() {
      clock.clearTimeout(timer);
      phase = "hidden";
    },
  };
}
