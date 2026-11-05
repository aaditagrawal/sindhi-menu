"use client";

import { useEffect, useRef, useState } from "react";
import { createMenuNotice } from "@/lib/menuNotice";

/** Keep this reading region reachable with Tab and Alt+T for keyboard users. */
export function MenuNotice({ message }: { message: string }) {
  const [phase, setPhase] = useState("waiting");
  const notice = useRef<ReturnType<typeof createMenuNotice> | null>(null);
  const element = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const swipe = useRef<{
    x: number;
    y: number;
    time: number;
    axis: "x" | "y" | null;
    offset: number;
  } | null>(null);

  useEffect(() => {
    const timer = createMenuNotice(window, setPhase);
    notice.current = timer;
    const onVisibility = () => {
      if (document.hidden) timer.pause("hidden");
      else timer.resume("hidden");
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey && event.code === "KeyT" && element.current) {
        event.preventDefault();
        element.current.focus({ preventScroll: true });
      }
      if (event.code === "Escape" && document.activeElement === element.current) {
        timer.dismiss();
      }
    };
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("keydown", onKey);
    return () => {
      timer.dispose();
      notice.current = null;
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("keydown", onKey);
      previousFocus.current?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (phase === "leaving" && document.activeElement === element.current) {
      previousFocus.current?.focus({ preventScroll: true });
    }
  }, [phase]);

  return (
    <section aria-label="Notifications alt+T" aria-live="polite" aria-relevant="additions text">
      {phase === "visible" || phase === "leaving" ? (
        <div
          ref={element}
          className="menu-notice"
          data-phase={phase}
          role="region"
          aria-label="Menu notice"
          tabIndex={0}
          onMouseEnter={() => notice.current?.pause("hover")}
          onMouseLeave={() => notice.current?.resume("hover")}
          onFocus={(event) => {
            previousFocus.current =
              event.relatedTarget instanceof HTMLElement ? event.relatedTarget : null;
            notice.current?.pause("focus");
          }}
          onBlur={() => {
            previousFocus.current = null;
            notice.current?.resume("focus");
          }}
          onPointerDown={(event) => {
            if (event.button === 2) return;
            swipe.current = {
              x: event.clientX,
              y: event.clientY,
              time: performance.now(),
              axis: null,
              offset: 0,
            };
            event.currentTarget.setAttribute("data-dragging", "true");
            event.currentTarget.setPointerCapture(event.pointerId);
            notice.current?.pause("pointer");
          }}
          onPointerUp={(event) => {
            const start = swipe.current;
            let dismissed = false;
            if (start) {
              const distance = -start.offset;
              const elapsed = Math.max(1, performance.now() - start.time);
              if (
                start.axis === "y" &&
                distance > 0 &&
                (distance >= 45 || distance / elapsed > 0.11)
              ) {
                dismissed = true;
                event.currentTarget.setAttribute("data-dismissal", "swipe");
                notice.current?.dismiss();
              }
            }
            swipe.current = null;
            event.currentTarget.removeAttribute("data-dragging");
            if (!dismissed) event.currentTarget.style.removeProperty("--notice-drag");
            notice.current?.resume("pointer");
          }}
          onPointerMove={(event) => {
            const start = swipe.current;
            if (start && !window.getSelection()?.toString()) {
              const dx = event.clientX - start.x;
              const dy = event.clientY - start.y;
              if (!start.axis && (Math.abs(dx) > 1 || Math.abs(dy) > 1)) {
                start.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
              }
              start.offset = start.axis === "y" ? Math.min(0, dy) : 0;
              event.currentTarget.style.setProperty("--notice-drag", `${start.offset}px`);
            }
          }}
          onPointerCancel={(event) => {
            swipe.current = null;
            event.currentTarget.removeAttribute("data-dragging");
            event.currentTarget.style.removeProperty("--notice-drag");
            notice.current?.resume("pointer");
          }}
        >
          {message}
        </div>
      ) : null}
    </section>
  );
}
