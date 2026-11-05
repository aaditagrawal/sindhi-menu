/** The saved values and storage key are shared with earlier versions of the site. */
export type Theme = "light" | "dark" | "system";

export const THEME_INIT = {
  __html:
    '(()=>{let t="light";try{t=localStorage.getItem("theme")||"light"}catch{}const d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);const r=document.documentElement;r.classList.remove("light","dark");r.classList.add(d?"dark":"light");r.style.colorScheme=d?"dark":"light"})()',
};

function readTheme(): Theme {
  try {
    const value = localStorage.getItem("theme");
    return value === "dark" || value === "system" ? value : "light";
  } catch {
    return "light";
  }
}

let theme: Theme = "light";
const listeners = new Set<() => void>();
let disconnect: (() => void) | undefined;

function applyTheme() {
  const root = document.documentElement;
  const dark =
    theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  const resolved = dark ? "dark" : "light";
  if (root.classList.contains(resolved) && root.style.colorScheme === resolved) return;

  // Resolve the new colors with transitions blocked before removing the rule.
  const blocker = document.createElement("style");
  blocker.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.append(blocker);
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
  getComputedStyle(document.body);
  setTimeout(() => blocker.remove(), 1);
}

function publish() {
  for (const listener of listeners) listener();
}

export function setTheme(value: Theme) {
  theme = value;
  try {
    localStorage.setItem("theme", value);
  } catch {
    // A blocked or full store must not prevent changing the current page's theme.
  }
  applyTheme();
  publish();
}

export function getTheme() {
  return theme;
}

export function getServerTheme(): undefined {
  return undefined;
}

/** Attach browser listeners only while React has a subscriber. */
export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    theme = readTheme();
    applyTheme();
    const media = matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (theme === "system") applyTheme();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "theme" && event.key !== null) return;
      try {
        if (event.storageArea && event.storageArea !== localStorage) return;
      } catch {
        return;
      }
      // Read the event value so synchronization also works with unavailable storage.
      theme = event.newValue === "dark" || event.newValue === "system" ? event.newValue : "light";
      applyTheme();
      publish();
    };
    media.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    disconnect = () => {
      media.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
    publish();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      disconnect?.();
      disconnect = undefined;
    }
  };
}
