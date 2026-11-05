"use client";

import { useRef } from "react";
import * as stylex from "@stylexjs/stylex";
import { useMountEffect } from "@/hooks/useMountEffect";
import { attachMenuNotification } from "@/lib/menuNotification";

const enter = stylex.keyframes({
  from: { opacity: 0, transform: "translateY(-100%)" },
  to: { opacity: 1, transform: "translateY(0)" },
});
const styles = stylex.create({
  region: {
    position: "fixed",
    top: { default: "24px", "@media (max-width: 600px)": "16px" },
    left: "50%",
    transform: "translateX(-50%)",
    width: { default: "356px", "@media (max-width: 600px)": "calc(100% - 32px)" },
    zIndex: 100,
  },
  notice: {
    padding: "16px",
    borderWidth: "1px",
    borderColor: "var(--border)",
    borderRadius: "8px",
    backgroundColor: "var(--popover)",
    color: "var(--popover-foreground)",
    boxShadow: {
      default: "0 4px 12px rgb(0 0 0 / 10%)",
      ":focus-visible": "0 4px 12px rgb(0 0 0 / 10%), 0 0 0 2px var(--ring)",
    },
    outlineStyle: "none",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    lineHeight: 1.5,
    overflowWrap: "anywhere",
    touchAction: "none",
    animationName: { default: enter, "@media (prefers-reduced-motion: reduce)": "none" },
    animationDuration: "400ms",
  },
});

export function MenuNotification() {
  const region = useRef<HTMLElement>(null);
  useMountEffect(() => {
    if (region.current) return attachMenuNotification(region.current);
  });
  return (
    <section
      ref={region}
      aria-label="Notifications Alt+T"
      aria-live="polite"
      aria-atomic="true"
      {...stylex.props(styles.region)}
    >
      <div hidden tabIndex={-1} {...stylex.props(styles.notice)}>
        Data as put on the Sindhi Mess banner.
      </div>
    </section>
  );
}
