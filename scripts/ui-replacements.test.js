import { describe, expect, test } from "bun:test";
import { runInNewContext } from "node:vm";
import { createThemeStore, initializeTheme, themeInitialization } from "../src/lib/theme.ts";
import { createMenuNotice } from "../src/lib/menuNotice.ts";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { useTheme } from "../src/components/useTheme.ts";

function makeClock() {
  let now = 0;
  let sequence = 0;
  const tasks = new Map();
  return {
    performance: { now: () => now },
    setTimeout(callback, delay) {
      const id = ++sequence;
      tasks.set(id, { at: now + delay, callback });
      return id;
    },
    clearTimeout(id) {
      tasks.delete(id);
    },
    advance(duration) {
      const end = now + duration;
      for (;;) {
        const next = [...tasks].sort((a, b) => a[1].at - b[1].at)[0];
        if (!next || next[1].at > end) break;
        now = next[1].at;
        tasks.delete(next[0]);
        next[1].callback();
      }
      now = end;
    },
    get pending() {
      return tasks.size;
    },
  };
}

function makeBrowser(stored = null, dark = false, denied = false) {
  const clock = makeClock();
  const classes = new Set(["stylex-marker"]);
  const storageListeners = new Set();
  const mediaListeners = new Set();
  const styles = new Set();
  const root = {
    classList: { toggle: (name, enabled) => (enabled ? classes.add(name) : classes.delete(name)) },
    style: {},
  };
  const media = {
    matches: dark,
    addEventListener: (_, listener) => mediaListeners.add(listener),
    removeEventListener: (_, listener) => mediaListeners.delete(listener),
  };
  const browser = {
    ...clock,
    localStorage: {
      getItem() {
        if (denied) throw new Error("Storage denied");
        return stored;
      },
      setItem(_, value) {
        if (denied) throw new Error("Storage denied");
        stored = value;
      },
    },
    document: {
      documentElement: root,
      head: { appendChild: (style) => styles.add(style) },
      createElement: () => {
        const style = { remove: () => styles.delete(style) };
        return style;
      },
    },
    getComputedStyle: () => ({ opacity: "1" }),
    matchMedia: () => media,
    addEventListener: (_, listener) => storageListeners.add(listener),
    removeEventListener: (_, listener) => storageListeners.delete(listener),
  };
  return {
    browser,
    clock,
    root,
    classes,
    styles,
    storageListeners,
    mediaListeners,
    changeSystem(next) {
      media.matches = next;
      for (const listener of mediaListeners) listener();
    },
    storage(value, key = "theme") {
      stored = value;
      for (const listener of storageListeners) listener({ key, newValue: value });
    },
  };
}

describe("theme preference and prepaint script", () => {
  test("server rendering keeps the hydration placeholder without browser globals", () => {
    function ThemeProbe() {
      const { theme } = useTheme();
      return createElement("button", { disabled: !theme }, theme || "Toggle theme");
    }
    expect(renderToString(createElement(ThemeProbe))).toBe(
      '<button disabled="">Toggle theme</button>',
    );
  });
  for (const [stored, systemDark, expected] of [
    [null, true, "light"],
    ["light", true, "light"],
    ["dark", false, "dark"],
    ["system", true, "dark"],
    ["system", false, "light"],
    ["invalid", true, "light"],
  ]) {
    test(`${stored} preference, system dark=${systemDark}`, () => {
      const state = makeBrowser(stored, systemDark);
      runInNewContext(themeInitialization, { window: state.browser });
      expect(state.root.style.colorScheme).toBe(expected);
      expect([...state.classes].sort()).toEqual([expected, "stylex-marker"].sort());
      const store = createThemeStore(state.browser);
      expect(store.getSnapshot()).toBe(stored === "dark" || stored === "system" ? stored : "light");
    });
  }

  test("cycles, persists, follows system and other tabs, and cleans up", () => {
    const state = makeBrowser();
    const store = createThemeStore(state.browser);
    const values = [];
    const unsubscribe = store.subscribe(() => values.push(store.getSnapshot()));
    state.clock.advance(0);
    store.setTheme("light");
    expect(state.browser.localStorage.getItem("theme")).toBe("light");
    expect(state.styles.size).toBe(0);
    expect(values).toEqual([]);
    store.setTheme("dark");
    expect(state.browser.localStorage.getItem("theme")).toBe("dark");
    state.changeSystem(false);
    expect(state.root.style.colorScheme).toBe("dark");
    store.setTheme("system");
    state.changeSystem(true);
    expect(state.root.style.colorScheme).toBe("dark");
    state.changeSystem(false);
    expect(state.root.style.colorScheme).toBe("light");
    state.storage("dark");
    expect(state.root.style.colorScheme).toBe("dark");
    state.storage("system", "unrelated");
    expect(store.getSnapshot()).toBe("dark");
    state.storage(null);
    expect(state.root.style.colorScheme).toBe("light");
    expect(state.browser.localStorage.getItem("theme")).toBe("light");
    expect(values).toEqual(["dark", "system", "dark", "light"]);
    state.clock.advance(0);
    expect(state.styles.size).toBe(0);
    store.setTheme("dark");
    state.storage(null, null);
    expect(store.getSnapshot()).toBe("dark");
    expect(state.root.style.colorScheme).toBe("dark");
    unsubscribe();
    expect(state.styles.size).toBe(0);
    expect(state.storageListeners.size).toBe(0);
    expect(state.mediaListeners.size).toBe(0);
    expect(state.clock.pending).toBe(0);
  });

  test("denied storage keeps initialization and in-tab switching usable", () => {
    const state = makeBrowser(null, true, true);
    initializeTheme(state.browser);
    expect(state.root.style.colorScheme).toBe("light");
    const store = createThemeStore(state.browser);
    const unsubscribe = store.subscribe(() => {});
    store.setTheme("dark");
    expect(store.getSnapshot()).toBe("dark");
    expect(state.root.style.colorScheme).toBe("dark");
    unsubscribe();
  });

  test("resubscribing reads changes made while no view was subscribed", () => {
    const state = makeBrowser();
    const store = createThemeStore(state.browser);
    store.subscribe(() => {})();
    state.storage("dark");
    const unsubscribe = store.subscribe(() => {});
    expect(store.getSnapshot()).toBe("dark");
    expect(state.root.style.colorScheme).toBe("dark");
    unsubscribe();
  });
});

describe("single menu notice", () => {
  test("waits one second, displays for 1.5 seconds, then finishes exit", () => {
    const clock = makeClock();
    const phases = [];
    createMenuNotice(clock, (phase) => phases.push(phase));
    clock.advance(999);
    expect(phases).toEqual([]);
    clock.advance(1);
    expect(phases).toEqual(["visible"]);
    clock.advance(1499);
    expect(phases).toEqual(["visible"]);
    clock.advance(1);
    expect(phases).toEqual(["visible", "leaving"]);
    clock.advance(199);
    expect(phases).toEqual(["visible", "leaving"]);
    clock.advance(1);
    expect(phases).toEqual(["visible", "leaving", "hidden"]);
    expect(clock.pending).toBe(0);
  });

  test("overlapping hover, focus and hidden-tab pauses preserve remaining time", () => {
    const clock = makeClock();
    const phases = [];
    const notice = createMenuNotice(clock, (phase) => phases.push(phase));
    notice.pause("hidden");
    clock.advance(3000);
    expect(phases).toEqual(["visible"]);
    notice.resume("hidden");
    clock.advance(500);
    notice.pause("hover");
    notice.pause("focus");
    clock.advance(5000);
    notice.resume("hover");
    clock.advance(5000);
    expect(phases).toEqual(["visible"]);
    notice.resume("focus");
    clock.advance(999);
    expect(phases).toEqual(["visible"]);
    clock.advance(1);
    expect(phases).toEqual(["visible", "leaving"]);
    notice.dispose();
    expect(clock.pending).toBe(0);
  });

  test("dismissal and disposal are idempotent and cancel all pending callbacks", () => {
    const clock = makeClock();
    const phases = [];
    const notice = createMenuNotice(clock, (phase) => phases.push(phase));
    notice.dispose();
    clock.advance(10000);
    expect(phases).toEqual([]);
    const visible = createMenuNotice(clock, (phase) => phases.push(phase));
    clock.advance(1000);
    visible.dismiss();
    visible.dismiss();
    visible.dispose();
    clock.advance(10000);
    expect(phases).toEqual(["visible", "leaving"]);
    expect(clock.pending).toBe(0);
  });
});
