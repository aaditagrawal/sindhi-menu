export type Theme = "light" | "dark" | "system";

function parseTheme(value: string | null): Theme {
  return value === "dark" || value === "system" ? value : "light";
}

/** This function is also serialized into the document. Keep it self-contained. */
export function initializeTheme(browser: Window) {
  let preference = "light";
  try {
    const stored = browser.localStorage.getItem("theme");
    if (stored === "dark" || stored === "system") preference = stored;
  } catch {
    // Storage can be unavailable in private or restricted browsing contexts.
  }
  const dark =
    preference === "dark" ||
    (preference === "system" && browser.matchMedia("(prefers-color-scheme: dark)").matches);
  const root = browser.document.documentElement;
  root.classList.toggle("dark", dark);
  root.classList.toggle("light", !dark);
  root.style.colorScheme = dark ? "dark" : "light";
}

export const themeInitialization = `(${initializeTheme.toString()})(window)`;

/** Own the three supported preferences and their browser subscriptions. */
export function createThemeStore(browser: Window) {
  let theme: Theme = "light";
  try {
    theme = parseTheme(browser.localStorage.getItem("theme"));
  } catch {
    // Keep the in-memory preference usable when storage is denied.
  }
  const media = browser.matchMedia("(prefers-color-scheme: dark)");
  const listeners = new Set<() => void>();
  let transitionStyle: HTMLStyleElement | undefined;
  let transitionTimer: number | undefined;

  const clearTransition = () => {
    browser.clearTimeout(transitionTimer);
    transitionStyle?.remove();
    transitionStyle = undefined;
  };

  const apply = () => {
    clearTransition();
    transitionStyle = browser.document.createElement("style");
    transitionStyle.textContent = "*,*::before,*::after{transition:none!important}";
    browser.document.head.appendChild(transitionStyle);
    const root = browser.document.documentElement;
    const dark = theme === "dark" || (theme === "system" && media.matches);
    root.classList.toggle("dark", dark);
    root.classList.toggle("light", !dark);
    root.style.colorScheme = dark ? "dark" : "light";
    // Flush the theme change before restoring transitions in the next task.
    void browser.getComputedStyle(root).opacity;
    transitionTimer = browser.setTimeout(clearTransition, 0);
  };

  const publish = () => {
    apply();
    for (const listener of listeners) listener();
  };
  const onMediaChange = () => {
    if (theme === "system") apply();
  };
  const setTheme = (next: Theme) => {
    const changed = theme !== next;
    theme = next;
    try {
      browser.localStorage.setItem("theme", next);
    } catch {
      // A denied write must not prevent a theme change in this tab.
    }
    if (changed) publish();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== "theme") return;
    if (!event.newValue) {
      setTheme("light");
      return;
    }
    const next = parseTheme(event.newValue);
    if (theme === next) return;
    theme = next;
    publish();
  };

  return {
    getSnapshot: () => theme,
    setTheme,
    subscribe(listener: () => void) {
      if (listeners.size === 0) {
        try {
          theme = parseTheme(browser.localStorage.getItem("theme"));
        } catch {
          // Retain the in-memory preference if storage is still unavailable.
        }
        media.addEventListener("change", onMediaChange);
        browser.addEventListener("storage", onStorage);
        apply();
      }
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          media.removeEventListener("change", onMediaChange);
          browser.removeEventListener("storage", onStorage);
          clearTransition();
        }
      };
    },
  };
}
