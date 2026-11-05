// Run with Bun. BASELINE_MODULES must contain the packages locked at BASELINE_REF.
// Browser checks additionally need PLAYWRIGHT_MODULE and optionally CHROMIUM_EXECUTABLE.
import "next/dist/server/node-environment-baseline";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync, globSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { transformSync } from "next/dist/compiled/babel/core";
import React from "react";
import { renderToString } from "react-dom/server";

const root = process.cwd();
const verifyOnly = process.argv.includes("--verify");
const base = process.env.BASELINE_REF || "3c58e308c1306fc8e6702737aec667ef881f9a0c";
assert.ok(
  process.env.BASELINE_MODULES,
  "Set BASELINE_MODULES to an isolated install of the starting lockfile",
);
const baseline = createRequire(
  path.join(path.resolve(process.env.BASELINE_MODULES), "../package.json"),
);
const local = createRequire(path.join(root, "package.json"));
const temporary = mkdtempSync(path.join(tmpdir(), "fc-owned-ui-"));
const source = (file) => execFileSync("git", ["show", `${base}:${file}`], { encoding: "utf8" });
const baselineLock = source("bun.lock");
for (const name of [
  "@radix-ui/react-slot",
  "lucide-react",
  "next-themes",
  "sonner",
  "react",
  "react-dom",
]) {
  const manifest = JSON.parse(readFileSync(baseline.resolve(`${name}/package.json`), "utf8"));
  assert.ok(
    baselineLock.includes(`"${name}@${manifest.version}"`),
    `${name} must match the starting lockfile`,
  );
}
const modulePath = (label, name) => path.join(temporary, `${label}-${name}.mjs`);
const options = local("./stylex.config.cjs");
const generatedCss = [];
function compile(file, label, name) {
  let code = label === "baseline" ? source(file) : readFileSync(file, "utf8");
  code = code
    .replaceAll('"@/components/ui/button"', JSON.stringify(modulePath(label, "button")))
    .replaceAll('"@/components/ui/sonner"', JSON.stringify(modulePath(label, "sonner")))
    .replaceAll(
      '"@/components/ui/icons"',
      JSON.stringify(path.join(root, "src/components/ui/icons.tsx")),
    )
    .replaceAll('"@/lib/theme"', JSON.stringify(path.join(root, "src/lib/theme.ts")))
    .replaceAll(
      '"@/lib/menuNotification"',
      JSON.stringify(path.join(root, "src/lib/menuNotification.ts")),
    )
    .replaceAll(
      '"@/hooks/useMountEffect"',
      JSON.stringify(path.join(root, "src/hooks/useMountEffect.ts")),
    );
  for (const dependency of [
    "react",
    "next/link",
    "@radix-ui/react-slot",
    "lucide-react",
    "next-themes",
    "sonner",
  ]) {
    if (code.includes(`"${dependency}"`)) {
      code = code.replaceAll(
        `"${dependency}"`,
        JSON.stringify(
          (label === "baseline" && dependency !== "react" && dependency !== "next/link"
            ? baseline
            : local
          ).resolve(dependency === "next/link" ? "next/dist/client/app-dir/link" : dependency),
        ),
      );
    }
  }
  const result = transformSync(code, {
    caller: {
      name: "next-babel-turbo-loader",
      supportsStaticESM: true,
      supportsDynamicImport: true,
      hasJsxRuntime: true,
      isDev: false,
      isServer: false,
    },
    filename: path.join(root, file),
    configFile: false,
    babelrc: false,
    presets: ["next/babel"],
    plugins: [["@stylexjs/babel-plugin", { ...options, dev: false }]],
  });
  let compiled = result.code.replaceAll(
    '"@/lib/tokens.stylex"',
    JSON.stringify(modulePath(label, "tokens")),
  );
  compiled = compiled.replaceAll(
    JSON.stringify(local.resolve("next/dist/client/app-dir/link")),
    JSON.stringify(modulePath("shared", "link")),
  );
  if (label === "baseline")
    compiled = compiled.replaceAll(
      JSON.stringify(baseline.resolve("@radix-ui/react-slot")),
      JSON.stringify(modulePath("baseline", "slot")),
    );
  compiled = compiled.replace(
    /from "([^".\/][^"]*)"/g,
    (_, dependency) => `from ${JSON.stringify(local.resolve(dependency))}`,
  );
  compiled = compiled.replace(
    /require\("([^".\/][^"]*)"\)/g,
    (_, dependency) => `require(${JSON.stringify(local.resolve(dependency))})`,
  );
  for (const [, css] of result.metadata.stylex || []) generatedCss.push(css.ltr);
  writeFileSync(modulePath(label, name), compiled);
}
function stats(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    median_ms: sorted[Math.floor(sorted.length / 2)],
    min_ms: sorted[0],
    max_ms: sorted.at(-1),
    samples_ms: values,
  };
}
const result = {
  baseline: base,
  runtime: { bun: Bun.version, node: process.version },
  verification_only: verifyOnly,
  warmup_batches: verifyOnly ? 0 : 5,
  measured_batches: verifyOnly ? 0 : 15,
  results: {},
};
let browser;
let server;
let stage = "compile fixtures";
try {
  // Next normally supplies this SSR-client alias in its compiler. Bundle the real
  // App Router Link once for both sides rather than substituting an anchor.
  const sharedLink = await Bun.build({
    entrypoints: [local.resolve("next/dist/client/app-dir/link")],
    target: "bun",
    define: { "process.env.NODE_ENV": '"production"' },
    plugins: [
      {
        name: "next-client-aliases",
        setup(build) {
          build.onResolve({ filter: /^react-server-dom-webpack\/client$/ }, () => ({
            path: local.resolve(
              "next/dist/server/route-modules/app-page/vendored/ssr/react-server-dom-webpack-client",
            ),
            external: true,
          }));
          build.onResolve({ filter: /^(react|react-dom)(\/.*)?$/ }, (args) => ({
            path: local.resolve(args.path),
            external: true,
          }));
        },
      },
    ],
  });
  assert.ok(sharedLink.success, sharedLink.logs.join("\n"));
  writeFileSync(modulePath("shared", "link-bundle"), await sharedLink.outputs[0].text());
  writeFileSync(
    modulePath("shared", "link"),
    'import * as link from "./shared-link-bundle.mjs"; const value = link.default || link; export default value.default || value;',
  );
  const baselineSlot = await Bun.build({
    entrypoints: [baseline.resolve("@radix-ui/react-slot")],
    target: "bun",
    plugins: [
      {
        name: "shared-slot-react",
        setup(build) {
          build.onResolve({ filter: /^react$/ }, () => ({
            path: local.resolve("react"),
            external: true,
          }));
        },
      },
    ],
  });
  assert.ok(baselineSlot.success, baselineSlot.logs.join("\n"));
  writeFileSync(modulePath("baseline", "slot-bundle"), await baselineSlot.outputs[0].text());
  writeFileSync(
    modulePath("baseline", "slot"),
    'import * as slot from "./baseline-slot-bundle.mjs"; export const Slot = (slot.default || slot).Slot;',
  );
  for (const label of ["baseline", "candidate"]) {
    compile("src/lib/tokens.stylex.ts", label, "tokens");
    compile("src/components/ui/button.tsx", label, "button");
    compile("src/components/ThemeSwitcher.tsx", label, "switcher");
    compile("src/components/MenuNotification.tsx", label, "notification");
  }
  compile("src/components/ui/button-link.tsx", "candidate", "button-link");
  compile("src/components/ui/sonner.tsx", "baseline", "sonner");
  const oldButton = (await import(pathToFileURL(modulePath("baseline", "button")))).Button;
  const newButton = (await import(pathToFileURL(modulePath("candidate", "button")))).Button;
  const newButtonLink = (await import(pathToFileURL(modulePath("candidate", "button-link"))))
    .ButtonLink;
  // The baseline install has a separate physical React copy. Bundle its icons while
  // keeping React external at the candidate's identical, locked React instance.
  const baselineIcons = await Bun.build({
    entrypoints: [baseline.resolve("lucide-react")],
    target: "bun",
    plugins: [
      {
        name: "shared-ssr-react",
        setup(build) {
          build.onResolve({ filter: /^react$/ }, () => ({
            path: local.resolve("react"),
            external: true,
          }));
        },
      },
    ],
  });
  assert.ok(baselineIcons.success, baselineIcons.logs.join("\n"));
  const iconFixture = path.join(temporary, "baseline-icons.mjs");
  writeFileSync(iconFixture, await baselineIcons.outputs[0].text());
  const importedIcons = await import(pathToFileURL(iconFixture));
  const oldIcons = importedIcons.default || importedIcons;
  const newIcons = await import(pathToFileURL(path.join(root, "src/components/ui/icons.tsx")));
  const Link = (await import(pathToFileURL(modulePath("shared", "link")))).default;
  const iconNames = [
    "UtensilsCrossed",
    "Moon",
    "Leaf",
    "Beef",
    "Grid3X3",
    "ChevronDown",
    "Sun",
    "Monitor",
    "ArrowLeft",
    "Calendar",
  ];
  const workloads = {
    buttons: (label) =>
      React.createElement(
        "div",
        null,
        [false, true].map((disabled) =>
          React.createElement(
            label === "baseline" ? oldButton : newButton,
            { variant: "outline", size: "icon", disabled, key: String(disabled) },
            "Theme",
          ),
        ),
      ),
    icons: (label) =>
      React.createElement(
        "div",
        null,
        iconNames.map((name) =>
          React.createElement((label === "baseline" ? oldIcons : newIcons)[name], {
            key: name,
            width: 16,
            height: 16,
            strokeWidth: 1.75,
          }),
        ),
      ),
    links: (label) =>
      React.createElement(
        "div",
        null,
        ["/week/1", "/week/1/full", "/week/2", "/week/2/full"].map((href) =>
          label === "baseline"
            ? React.createElement(
                oldButton,
                { asChild: true, variant: "outline", size: "sm", key: href },
                React.createElement(Link, { href, title: "View menu" }, "Menu"),
              )
            : React.createElement(
                newButtonLink,
                { href, title: "View menu", variant: "outline", size: "sm", key: href },
                "Menu",
              ),
        ),
      ),
  };
  for (const [name, workload] of Object.entries(workloads)) {
    stage = `SSR ${name}`;
    if (verifyOnly) continue;
    const samples = { baseline: [], candidate: [] };
    for (let round = -5; round < 15; round++) {
      for (const label of round % 2 ? ["baseline", "candidate"] : ["candidate", "baseline"]) {
        const start = performance.now();
        for (let iteration = 0; iteration < 500; iteration++) renderToString(workload(label));
        if (round >= 0) samples[label].push(performance.now() - start);
      }
    }
    result.results[`ssr_${name}_500_renders`] = Object.fromEntries(
      Object.entries(samples).map(([key, values]) => [key, stats(values)]),
    );
  }
  // Verify anchors, styling, labels and decorative SVG semantics independently of timing.
  assert.equal(
    renderToString(workloads.buttons("candidate")),
    renderToString(workloads.buttons("baseline")),
  );
  for (const attribute of ["href", "title", "class"]) {
    const pattern = new RegExp(attribute + '="([^"]*)"', "g");
    assert.deepEqual(
      [...renderToString(workloads.links("candidate")).matchAll(pattern)].map((m) => m[1]),
      [...renderToString(workloads.links("baseline")).matchAll(pattern)].map((m) => m[1]),
    );
  }
  for (const name of iconNames) {
    const markup = renderToString(React.createElement(newIcons[name]));
    assert.match(markup, /aria-hidden="true"/);
    assert.match(
      renderToString(React.createElement(newIcons[name], { "aria-label": name })),
      /aria-label=/,
    );
    assert.doesNotMatch(
      renderToString(React.createElement(newIcons[name], { "aria-label": name })),
      /aria-hidden="true"/,
    );
  }
  result.ssr_checks = "identical anchor markup/styles and original icon accessibility passed";
  if (process.env.PLAYWRIGHT_MODULE) {
    stage = "bundle browser fixtures";
    const { chromium } = await import(pathToFileURL(path.resolve(process.env.PLAYWRIGHT_MODULE)));
    const fixture = `import React from ${JSON.stringify(local.resolve("react"))};
      import {createRoot} from ${JSON.stringify(local.resolve("react-dom/client"))};
      import {flushSync} from ${JSON.stringify(local.resolve("react-dom"))};
      import {ThemeProvider,useTheme} from ${JSON.stringify(baseline.resolve("next-themes"))};
      import {ThemeSwitcher as OldSwitcher} from ${JSON.stringify(modulePath("baseline", "switcher"))};
      import {ThemeSwitcher as NewSwitcher} from ${JSON.stringify(modulePath("candidate", "switcher"))};
      import {MenuNotification as OldNotice} from ${JSON.stringify(modulePath("baseline", "notification"))};
      import {MenuNotification as NewNotice} from ${JSON.stringify(modulePath("candidate", "notification"))};
      import {Toaster} from ${JSON.stringify(modulePath("baseline", "sonner"))};
      import * as theme from ${JSON.stringify(path.join(root, "src/lib/theme.ts"))};
      import {attachMenuNotification} from ${JSON.stringify(path.join(root, "src/lib/menuNotification.ts"))};
      window.fixture={theme,attachMenuNotification};
      const root=createRoot(document.getElementById('root'));
      const nextTheme=value=>value==='light'?'dark':value==='dark'?'system':'light';
      function OldThemeProbe(){const {theme,setTheme}=useTheme();return <button onClick={()=>setTheme(nextTheme(theme))}>{theme}</button>}
      function NewThemeProbe(){const value=React.useSyncExternalStore(theme.subscribeTheme,theme.getTheme,theme.getServerTheme);return <button onClick={()=>theme.setTheme(nextTheme(value))}>{value}</button>}
      window.mountTheme=(label)=>flushSync(()=>root.render(label==='baseline'
        ? <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange><OldThemeProbe/></ThemeProvider>
        : <NewThemeProbe/>));
      // Equal baseline provider overhead on both notice-only sides prevents other
      // replacements from hiding a notification regression.
      window.mountNotice=(label)=>flushSync(()=>root.render(
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>{label==='baseline'?<><OldNotice/><Toaster/></>:<NewNotice/>}</ThemeProvider>));
      window.mount=(label)=>flushSync(()=>root.render(label==='baseline'
        ? <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange><OldSwitcher/><OldNotice/><Toaster/></ThemeProvider>
        : <><NewSwitcher/><NewNotice/></>));
      window.unmount=()=>flushSync(()=>root.render(null));
      window.measureTheme=()=>{const button=document.querySelector('#root button');for(let i=0;i<60;i++)flushSync(()=>button.click());};`;
    const entry = path.join(temporary, "browser.tsx");
    writeFileSync(entry, fixture);
    const bundled = await Bun.build({
      entrypoints: [entry],
      target: "browser",
      minify: true,
      define: { "process.env.NODE_ENV": '"production"' },
      plugins: [
        {
          name: "shared-react",
          setup(build) {
            build.onResolve({ filter: /^(react|react-dom)(\/.*)?$/ }, (args) => ({
              path: local.resolve(args.path),
            }));
          },
        },
      ],
    });
    assert.ok(bundled.success, bundled.logs.join("\n"));
    const javascript = await bundled.outputs[0].text();
    const cssRoot = path.resolve(process.env.BENCHMARK_CSS_ROOT || "out");
    const stylesheets = globSync(path.join(cssRoot, "_next/static/**/*.css"));
    assert.ok(
      stylesheets.length,
      "Build the application first or set BENCHMARK_CSS_ROOT to its export",
    );
    const css =
      stylesheets.map((f) => readFileSync(f, "utf8")).join("\n") + generatedCss.join("\n");
    const sample =
      readFileSync(path.join(cssRoot, "index.html"), "utf8").match(/<main[\s\S]*?<\/main>/)?.[0] ||
      "";
    result.browser_fixture = {
      stylesheets: stylesheets.length,
      css_bytes: css.length,
      representative_main_bytes: sample.length,
    };
    const bootstrap = (await import(pathToFileURL(path.join(root, "src/lib/theme.ts")))).THEME_INIT
      .__html;
    server = Bun.serve({
      hostname: "127.0.0.1",
      port: 0,
      fetch: () =>
        new Response(
          `<!doctype html><html><head><script>${bootstrap}</script><style>${css}</style></head><body><button id="outside">Outside</button><div id="root"></div>${sample}</body></html>`,
          { headers: { "content-type": "text/html" } },
        ),
    });
    browser = await chromium.launch({
      executablePath: process.env.CHROMIUM_EXECUTABLE,
      headless: true,
    });
    for (const [saved, system, expected] of [
      [null, "dark", "light"],
      ["dark", "light", "dark"],
      ["system", "dark", "dark"],
    ]) {
      const firstPaint = await browser.newPage({ colorScheme: system });
      await firstPaint.addInitScript((saved) => {
        if (saved) localStorage.setItem("theme", saved);
        else localStorage.removeItem("theme");
      }, saved);
      await firstPaint.goto(server.url.href, { waitUntil: "domcontentloaded" });
      assert.equal(
        await firstPaint.evaluate(() => document.documentElement.style.colorScheme),
        expected,
      );
      await firstPaint.close();
    }
    const page = await browser.newPage({ reducedMotion: "reduce" });
    await page.goto(server.url.href);
    await page.addScriptTag({ content: javascript });
    await page.evaluate(() => window.mount("candidate"));
    await page.waitForFunction(() => !document.querySelector("#root button")?.disabled);
    await page.evaluate(() => {
      window.fixture.theme.setTheme("dark");
    });
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
    assert.equal(await page.evaluate(() => localStorage.getItem("theme")), "dark");
    await page.evaluate(() => window.fixture.theme.setTheme("system"));
    await page.emulateMedia({ colorScheme: "dark" });
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
    await page.emulateMedia({ colorScheme: "light" });
    await page.waitForFunction(() => document.documentElement.classList.contains("light"));
    await page.evaluate(() =>
      dispatchEvent(new StorageEvent("storage", { key: "theme", newValue: "dark" })),
    );
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
    await page.evaluate(() => dispatchEvent(new StorageEvent("storage", { key: null })));
    await page.waitForFunction(() => document.documentElement.classList.contains("light"));
    const blocked = await page.evaluate(() => {
      const descriptor =
        Object.getOwnPropertyDescriptor(Window.prototype, "localStorage") ||
        Object.getOwnPropertyDescriptor(window, "localStorage");
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get() {
          throw new DOMException("blocked", "SecurityError");
        },
      });
      window.fixture.theme.setTheme("dark");
      const ok = document.documentElement.classList.contains("dark");
      if (descriptor) Object.defineProperty(window, "localStorage", descriptor);
      return ok;
    });
    assert.ok(blocked);
    stage = "notice delay and hover pause";
    // Notification delay, remaining-time pause, keyboard focus restore, dismissal and cleanup.
    await page.evaluate(() => window.unmount());
    const controlledTime = new Date("2026-11-05T14:00:00.000Z");
    await page.clock.install({ time: controlledTime });
    await page.clock.pauseAt(new Date(controlledTime.getTime() + 1000));
    await page.evaluate(() => window.mount("candidate"));
    const notice = page.locator('[aria-label="Notifications Alt+T"] > div');
    assert.equal(await notice.isVisible(), false);
    await page.clock.runFor(999);
    assert.equal(await notice.isVisible(), false);
    await page.clock.runFor(1);
    assert.equal(await notice.isVisible(), true);
    await notice.dispatchEvent("mouseenter");
    await page.clock.runFor(2000);
    assert.equal(await notice.isVisible(), true);
    await notice.dispatchEvent("mouseleave");
    await page.clock.runFor(1499);
    assert.equal(await notice.isVisible(), true);
    await page.clock.runFor(1);
    assert.equal(await notice.isVisible(), false);
    await page.evaluate(() => {
      window.unmount();
      window.mount("candidate");
    });
    await page.clock.runFor(1000);
    await page.locator("#outside").focus();
    stage = "notice keyboard reading mode";
    await page.keyboard.press("Alt+t");
    await page.clock.runFor(2000);
    assert.equal(await notice.isVisible(), true);
    await page.keyboard.press("Escape");
    assert.equal(await notice.isVisible(), true);
    await page.clock.runFor(1499);
    assert.equal(await notice.isVisible(), true);
    await page.clock.runFor(1);
    assert.equal(await notice.isVisible(), false);
    assert.equal(
      await page.locator("#outside").evaluate((e) => e === document.activeElement),
      true,
    );
    await page.evaluate(() => {
      window.unmount();
      window.mount("candidate");
    });
    await page.clock.runFor(1000);
    await page.locator("#outside").focus();
    await page.keyboard.press("Alt+t");
    await page.evaluate(() => {
      window.fixture.cleanupNode = document.querySelector(
        '[aria-label="Notifications Alt+T"] > div',
      );
      window.unmount();
    });
    stage = "focused notice cleanup";
    await page.clock.runFor(20);
    assert.equal(
      await page.locator("#outside").evaluate((e) => e === document.activeElement),
      true,
    );
    await page.evaluate(() => {
      window.fixture.cleanupMutations = 0;
      window.fixture.cleanupObserver = new MutationObserver((records) => {
        window.fixture.cleanupMutations += records.length;
      });
      window.fixture.cleanupObserver.observe(window.fixture.cleanupNode, { attributes: true });
    });
    await page.clock.runFor(5000);
    assert.equal(await page.evaluate(() => window.fixture.cleanupMutations), 0);
    await page.evaluate(() => window.fixture.cleanupObserver.disconnect());
    await page.evaluate(() => {
      window.unmount();
      window.mount("candidate");
      window.unmount();
    });
    await page.clock.runFor(5000);
    assert.equal(await page.locator('[aria-label="Notifications Alt+T"]').count(), 0);
    const transitionCounts = [];
    await page.emulateMedia({ reducedMotion: "no-preference" });
    for (const label of ["baseline", "candidate"]) {
      stage = `isolated probe ${label}`;
      await page.evaluate((label) => {
        window.unmount();
        localStorage.setItem("theme", "light");
        window.mountTheme(label);
      }, label);
      await page.clock.runFor(20);
      await page.waitForFunction(() => document.documentElement.classList.contains("light"));
      await page.evaluate(() => {
        const probe = document.createElement("div");
        probe.style.cssText =
          "width:1px;height:1px;background-color:var(--background);transition:background-color 10s";
        document.body.append(probe);
        getComputedStyle(probe).backgroundColor;
        window.fixture.transitionProbe = probe;
      });
      await page.locator("#root button").click();
      await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
      await page.clock.runFor(2);
      transitionCounts.push(
        await page.evaluate(() => {
          const probe = window.fixture.transitionProbe;
          const count = probe.getAnimations().length;
          probe.remove();
          return count;
        }),
      );
      await page.evaluate(() => window.unmount());
      await page.evaluate((label) => window.mountNotice(label), label);
      await page.clock.runFor(1100);
      const isolatedNotice = page.locator(
        label === "baseline" ? "[data-sonner-toast]" : '[aria-label="Notifications Alt+T"] > div',
      );
      await isolatedNotice.waitFor({ state: "visible" });
      await page.mouse.move(0, 500);
      await page.clock.runFor(2000);
      await isolatedNotice.waitFor({ state: "hidden" });
      await page.evaluate(() => window.unmount());
    }
    assert.equal(
      transitionCounts[1],
      transitionCounts[0],
      "theme transition suppression must match",
    );
    result.theme_transition_counts = {
      baseline: transitionCounts[0],
      candidate: transitionCounts[1],
    };
    await page.emulateMedia({ reducedMotion: "reduce" });
    if (!verifyOnly) {
      const session = await page.context().newCDPSession(page);
      await session.send("Performance.enable");
      const mainThread = async () => {
        const { metrics } = await session.send("Performance.getMetrics");
        return metrics.find((metric) => metric.name === "TaskDuration").value * 1000;
      };
      for (const isolated of [true, false]) {
        stage = `measure theme ${isolated ? "isolated" : "shell"}`;
        const samples = { baseline: [], candidate: [] };
        for (let round = -5; round < 15; round++) {
          for (const label of round % 2 ? ["baseline", "candidate"] : ["candidate", "baseline"]) {
            await page.evaluate(
              ({ label, isolated }) => {
                window.unmount();
                localStorage.setItem("theme", "light");
                if (isolated) window.mountTheme(label);
                else window.mount(label);
              },
              { label, isolated },
            );
            await page.clock.runFor(20);
            await page.waitForFunction(() => !document.querySelector("#root button")?.disabled);
            const start = await mainThread();
            await page.evaluate(() => window.measureTheme());
            await page.clock.runFor(2);
            const elapsed = (await mainThread()) - start;
            if (round >= 0) samples[label].push(elapsed);
          }
        }
        result.results[`browser_theme_60_cycles_${isolated ? "isolated" : "shell"}`] =
          Object.fromEntries(Object.entries(samples).map(([key, values]) => [key, stats(values)]));
      }
      for (const motion of ["reduce", "no-preference"]) {
        await page.emulateMedia({ reducedMotion: motion });
        for (const isolated of [true, false]) {
          stage = `measure notice ${motion} ${isolated ? "isolated" : "shell"}`;
          const noticeSamples = { baseline: [], candidate: [] };
          // TaskDuration measures main-thread CPU for mount/show/hover/slow drag/expiry/unmount,
          // excluding the shared clock's intentional one-second delay and reading time.
          for (let round = -5; round < 15; round++) {
            for (const label of round % 2 ? ["baseline", "candidate"] : ["candidate", "baseline"]) {
              await page.evaluate(() => window.unmount());
              const start = await mainThread();
              await page.evaluate(
                ({ label, isolated }) => {
                  if (isolated) window.mountNotice(label);
                  else window.mount(label);
                },
                { label, isolated },
              );
              await page.clock.runFor(1100);
              const toast = page.locator(
                label === "baseline"
                  ? "[data-sonner-toast]"
                  : '[aria-label="Notifications Alt+T"] > div',
              );
              await toast.waitFor({ state: "visible" });
              if (label === "baseline")
                await page.waitForFunction(
                  () =>
                    document.querySelector("[data-sonner-toast]")?.getAttribute("data-mounted") ===
                    "true",
                );
              await toast.hover();
              await page.clock.runFor(1800);
              assert.equal(await toast.isVisible(), true, `${label} must pause while hovered`);
              const bounds = await toast.boundingBox();
              assert.ok(bounds);
              const dragX = bounds.x + 8;
              const dragY = bounds.y + bounds.height - 8;
              await page.mouse.move(dragX, dragY);
              await page.mouse.down();
              for (let step = 1; step <= 10; step++) {
                await page.mouse.move(dragX, dragY - step * 2);
                await page.clock.runFor(50);
              }
              await page.mouse.up();
              assert.equal(await toast.isVisible(), true, `${label} must retain a slow short drag`);
              await page.mouse.move(0, 500);
              if (motion === "no-preference") {
                // Keep the baseline's 200ms removal timer from skipping its
                // native CSS exit while the candidate's WAAPI exit runs in real time.
                await page.clock.runFor(1500);
                await page.waitForTimeout(220);
                await page.clock.runFor(700);
              } else {
                await page.clock.runFor(2000);
              }
              await toast.waitFor({ state: "hidden" });
              await page.evaluate(() => window.unmount());
              const duration = (await mainThread()) - start;
              if (round >= 0) noticeSamples[label].push(duration);
            }
          }
          result.results[
            `browser_notice_lifecycle_main_thread_${motion}_${isolated ? "isolated" : "shell"}`
          ] = Object.fromEntries(
            Object.entries(noticeSamples).map(([key, values]) => [key, stats(values)]),
          );
        }
      }
    }
    result.browser_checks =
      "theme persistence/system/storage/blocked storage and notice delay/pause/focus/Escape/unmount passed";
    result.browser_version = browser.version();
  }
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(`Benchmark failed during: ${stage}`);
  throw error;
} finally {
  await browser?.close();
  server?.stop(true);
  rmSync(temporary, { recursive: true, force: true });
}
