/** Lifecycle for the site's one notice, including its reading time and input cleanup. */
export function attachMenuNotification(region: HTMLElement) {
  const notice = region.firstElementChild;
  if (!(notice instanceof HTMLElement)) return () => {};
  const initialUserSelect = notice.style.userSelect;
  const initialWebkitUserSelect = notice.style.getPropertyValue("-webkit-user-select");
  let remaining = 1500;
  let started = 0;
  let timer: ReturnType<typeof setTimeout>;
  let visible = false;
  let dismissed = false;
  let exit: Animation | undefined;
  let previousFocus: HTMLElement | null = null;
  let pointerStart: { x: number; y: number; at: number } | null = null;
  let pointerAxis: "x" | "y" | undefined;
  let dragY = 0;
  const paused = new Set<string>();

  const restoreFocus = () => {
    if (notice.contains(document.activeElement) || document.activeElement === document.body)
      previousFocus?.focus({ preventScroll: true });
    previousFocus = null;
  };
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    visible = false;
    clearTimeout(timer);
    restoreFocus();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      notice.hidden = true;
    } else {
      exit = notice.animate(
        [
          { opacity: 1, transform: `translateY(${Math.min(0, dragY)}px)` },
          { opacity: 0, transform: `translateY(calc(${Math.min(0, dragY)}px - 100%))` },
        ],
        { duration: 200, easing: "ease", fill: "forwards" },
      );
      exit.finished
        .then(() => {
          notice.hidden = true;
        })
        .catch(() => {});
    }
  };
  const resume = () => {
    if (!visible || paused.size > 0) return;
    started = performance.now();
    clearTimeout(timer);
    timer = setTimeout(dismiss, remaining);
  };
  const pause = (reason: string) => {
    if (visible && paused.size === 0) {
      remaining = Math.max(0, remaining - (performance.now() - started));
      clearTimeout(timer);
    }
    paused.add(reason);
  };
  const unpause = (reason: string) => {
    if (paused.delete(reason)) resume();
  };
  const onVisibility = () => {
    if (document.hidden) pause("hidden");
    else unpause("hidden");
  };
  const onEnter = () => pause("hover");
  const onLeave = () => unpause("hover");
  const onFocus = (event: FocusEvent) => {
    if (event.relatedTarget instanceof HTMLElement && !notice.contains(event.relatedTarget)) {
      previousFocus = event.relatedTarget;
    }
  };
  const onBlur = (event: FocusEvent) => {
    if (event.relatedTarget instanceof Node && notice.contains(event.relatedTarget)) return;
    // A null target can be DOM removal; cleanup still needs the return-focus target.
    if (event.relatedTarget !== null) previousFocus = null;
    unpause("focus");
  };
  const onKey = (event: KeyboardEvent) => {
    if (!visible) return;
    if (event.altKey && event.code === "KeyT") {
      if (!notice.contains(document.activeElement)) {
        previousFocus =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
      }
      notice.focus({ preventScroll: true });
      pause("focus");
      event.preventDefault();
    } else if (event.key === "Escape" && notice.contains(document.activeElement)) {
      // Leave reading mode, as the old single-toast stack did, without discarding its time.
      if (paused.has("focus") || paused.has("hover")) {
        paused.delete("focus");
        paused.delete("hover");
        resume();
      }
    }
  };
  const onPointerDown = (event: PointerEvent) => {
    if (event.button === 2) return;
    pointerStart = { x: event.clientX, y: event.clientY, at: performance.now() };
    pointerAxis = undefined;
    dragY = 0;
    notice.setPointerCapture(event.pointerId);
    pause("pointer");
  };
  const onPointerMove = (event: PointerEvent) => {
    if (!pointerStart || window.getSelection()?.toString()) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    if (!pointerAxis && Math.max(Math.abs(dx), Math.abs(dy)) > 1) {
      pointerAxis = Math.abs(dy) >= Math.abs(dx) ? "y" : "x";
    }
    if (pointerAxis !== "y") return;
    if (notice.style.userSelect !== "none") {
      notice.style.userSelect = "none";
      notice.style.setProperty("-webkit-user-select", "none");
    }
    dragY = dy;
    // Follow upward drags; resist movement back into the page.
    notice.style.transform = `translateY(${dy <= 0 ? dy : Math.min(12, Math.sqrt(dy))}px)`;
  };
  const resetPointer = () => {
    pointerStart = null;
    pointerAxis = undefined;
    dragY = 0;
    notice.style.removeProperty("transform");
    notice.style.userSelect = initialUserSelect;
    notice.style.setProperty("-webkit-user-select", initialWebkitUserSelect);
    unpause("pointer");
  };
  const onPointerUp = (event: PointerEvent) => {
    if (!pointerStart) return;
    const elapsed = performance.now() - pointerStart.at;
    // Only the top direction dismisses this top-center notice, including quick flicks.
    if (pointerAxis === "y" && dragY < 0 && (-dragY >= 45 || -dragY / elapsed > 0.11)) dismiss();
    if (notice.hasPointerCapture(event.pointerId)) notice.releasePointerCapture(event.pointerId);
    resetPointer();
  };

  timer = setTimeout(() => {
    visible = true;
    started = performance.now();
    notice.hidden = false;
    onVisibility();
    if (notice.matches(":hover")) pause("hover");
    resume();
  }, 1000);
  document.addEventListener("visibilitychange", onVisibility);
  document.addEventListener("keydown", onKey);
  notice.addEventListener("mouseenter", onEnter);
  notice.addEventListener("mousemove", onEnter);
  notice.addEventListener("mouseleave", onLeave);
  notice.addEventListener("focusin", onFocus);
  notice.addEventListener("focusout", onBlur);
  notice.addEventListener("pointerdown", onPointerDown);
  notice.addEventListener("pointermove", onPointerMove);
  notice.addEventListener("pointerup", onPointerUp);
  notice.addEventListener("pointercancel", resetPointer);
  return () => {
    // Restoring focus can dispatch blur before the handlers are detached.
    visible = false;
    clearTimeout(timer);
    exit?.cancel();
    notice.style.userSelect = initialUserSelect;
    notice.style.setProperty("-webkit-user-select", initialWebkitUserSelect);
    restoreFocus();
    notice.hidden = true;
    document.removeEventListener("visibilitychange", onVisibility);
    document.removeEventListener("keydown", onKey);
    notice.removeEventListener("mouseenter", onEnter);
    notice.removeEventListener("mousemove", onEnter);
    notice.removeEventListener("mouseleave", onLeave);
    notice.removeEventListener("focusin", onFocus);
    notice.removeEventListener("focusout", onBlur);
    notice.removeEventListener("pointerdown", onPointerDown);
    notice.removeEventListener("pointermove", onPointerMove);
    notice.removeEventListener("pointerup", onPointerUp);
    notice.removeEventListener("pointercancel", resetPointer);
  };
}
