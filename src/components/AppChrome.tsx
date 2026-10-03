"use client";

import * as stylex from "@stylexjs/stylex";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Toaster } from "@/components/ui/sonner";
import { MenuNotification } from "@/components/MenuNotification";

const styles = stylex.create({
  themeSwitcher: {
    position: "fixed",
    top: "1rem",
    right: "1rem",
    zIndex: 50,
  },
});

export function AppChrome() {
  return (
    <>
      <div {...stylex.props(styles.themeSwitcher)}>
        <ThemeSwitcher />
      </div>
      <MenuNotification />
      <Toaster />
    </>
  );
}
