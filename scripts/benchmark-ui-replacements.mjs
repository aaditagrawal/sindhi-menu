// Run with the pinned runtime: bunx bun@1.4.2 scripts/benchmark-ui-replacements.mjs.
// Only benchmark fixtures/dependencies are installed in a temporary directory.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  symlinkSync,
  existsSync,
} from "node:fs";
import { tmpdir, loadavg, cpus } from "node:os";
import { join, resolve, dirname } from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const base = "ad071a0efd601f625ef5cfc28283614e36689cbe";
const samples = Number(process.env.BENCH_SAMPLES || 20);
const warmups = Number(process.env.BENCH_WARMUPS || 5);
const width = Number(process.env.BENCH_WIDTH || 1280);
const height = Number(process.env.BENCH_HEIGHT || 900);
const workloads = (process.env.BENCH_WORKLOADS || "buttons,theme,notice").split(",");
const noticeTheme = process.env.BENCH_NOTICE_THEME || "light";
const freshRealm = process.env.BENCH_FRESH_REALM !== "0";
const output = resolve(process.env.BENCH_OUTPUT || "/tmp/sindhi-menu-performance.json");
const project = process.cwd();
const temporary =
  process.env.BENCH_FIXTURES || mkdtempSync(join(tmpdir(), "sindhi-menu-ui-benchmark-"));
const baseline = join(temporary, "baseline");
const candidate = join(temporary, "candidate-ui");
const toolDir = join(temporary, "tools");
const show = (file) => execFileSync("git", ["show", `${base}:${file}`], { encoding: "utf8" });
const write = (directory, file, text) => {
  mkdirSync(dirname(join(directory, file)), { recursive: true });
  writeFileSync(join(directory, file), text);
};
const commonFiles = [
  "src/components/ui/button.tsx",
  "src/components/ThemeSwitcher.tsx",
  "src/components/MenuNotification.tsx",
  "src/app/weeks/page.tsx",
  "src/styles/site.stylex.js",
  "src/app/reset.css",
  "src/app/globals.css",
];
for (const file of commonFiles) {
  write(baseline, file, show(file));
  write(candidate, file, readFileSync(file, "utf8"));
}
write(baseline, "src/components/ui/sonner.tsx", show("src/components/ui/sonner.tsx"));
for (const file of [
  "src/lib/theme.ts",
  "src/lib/menuNotice.ts",
  "src/components/useTheme.ts",
  "src/components/ui/menu-notice.tsx",
])
  write(candidate, file, readFileSync(file, "utf8"));
for (const file of ["package.json", "bun.lock", "patches/braces@3.0.3.patch"])
  write(baseline, file, show(file));
write(toolDir, "package.json", JSON.stringify({ dependencies: { playwright: "1.64.1" } }));
execFileSync(process.execPath, ["install", "--frozen-lockfile", "--ignore-scripts"], {
  cwd: baseline,
  stdio: "inherit",
});
execFileSync(process.execPath, ["install", "--ignore-scripts"], {
  cwd: toolDir,
  stdio: "inherit",
});
// Both bundles resolve shared React/Next/StyleX from the exact baseline lock.
try {
  symlinkSync(join(baseline, "node_modules"), join(candidate, "node_modules"), "dir");
} catch (error) {
  if (error.code !== "EEXIST") throw error;
}
const baselineRequire = createRequire(join(baseline, "package.json"));
const babel = baselineRequire("@babel/core");
const stylexPlugin = baselineRequire("@stylexjs/babel-plugin");
const stylexOptions = baselineRequire(resolve("stylex.config.cjs"));
for (const directory of [baseline, candidate]) {
  console.log(`Compiling ${directory}`);
  const result = babel.transformSync(
    readFileSync(join(directory, "src/styles/site.stylex.js"), "utf8"),
    {
      filename: join(directory, "src/styles/site.stylex.js"),
      configFile: false,
      babelrc: false,
      plugins: [[stylexPlugin, { ...stylexOptions, dev: false, runtimeInjection: false }]],
    },
  );
  write(directory, "src/styles/site.stylex.js", result.code);
  const css = result.metadata.stylex
    .sort((a, b) => a[2] - b[2])
    .map((rule) => rule[1].ltr)
    .join("\n");
  write(
    directory,
    "style.css",
    readFileSync(join(directory, "src/app/reset.css"), "utf8") +
      "\n" +
      css +
      "\n" +
      readFileSync(join(directory, "src/app/globals.css"), "utf8").replace(
        /@import[^;]+;|@stylex;/g,
        "",
      ),
  );
  const isBaseline = directory === baseline;
  write(
    directory,
    "entry.tsx",
    `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { flushSync } from 'react-dom';
import WeeksPage from './src/app/weeks/page';
import { ThemeSwitcher } from './src/components/ThemeSwitcher';
import { MenuNotification } from './src/components/MenuNotification';
import * as stylex from '@stylexjs/stylex';
import { themeMarker, styles } from './src/styles/site.stylex';
${isBaseline ? `import { ThemeProvider } from 'next-themes'; import { Toaster } from './src/components/ui/sonner';` : `import { themeInitialization } from './src/lib/theme';`}
const shell = (children) => ${isBaseline ? `<ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>{children}</ThemeProvider>` : `children`};
document.documentElement.classList.add(stylex.props(themeMarker).className);
document.body.className=stylex.props(styles.body).className;
const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
const waitForThemeButton = async (host) => {
  const deadline=performance.now()+5000;
  while (host.querySelector('button')?.disabled!==false) {
    if (performance.now()>=deadline) throw Error('Theme switcher did not become ready within 5 seconds');
    await new Promise(resolve=>setTimeout(resolve,10));
  }
};
const mount = (content) => { const root = createRoot(document.getElementById('app')); flushSync(()=>root.render(content)); return root; };
window.fixture = {
  async hydration() {
    localStorage.setItem('theme','dark');
    const host=document.getElementById('app');
    host.innerHTML=renderToString(shell(<ThemeSwitcher/>));
    ${isBaseline ? "for(const script of host.querySelectorAll('script')) (0,eval)(script.textContent);" : "(0,eval)(themeInitialization);"}
    if (document.documentElement.style.colorScheme!=='dark') throw Error('Prepaint initializer lost the stored theme');
    if (!document.documentElement.classList.contains('stylex-marker')) throw Error('Prepaint initializer removed unrelated classes');
    if (!host.querySelector('button').disabled) throw Error('Server placeholder must remain disabled before hydration');
    const errors=[];
    const root=hydrateRoot(host,shell(<ThemeSwitcher/>),{onRecoverableError:error=>errors.push(error.message)});
    await waitForThemeButton(host);
    await settle();
    if (errors.length) throw Error(errors.join('; '));
    if (host.querySelector('button').disabled) throw Error('Hydration did not enable theme switching');
    if (!host.textContent.includes('Switch to system mode')) throw Error('Hydration did not resolve stored dark preference');
    flushSync(()=>root.unmount());
    localStorage.setItem('theme','light');
    return true;
  },
  async buttons() {
    const root = mount(null);
    let checksum = 0;
    for (let i=0;i<50;i++) {
      flushSync(()=>root.render(<WeeksPage key={i}/>));
      for (const link of document.querySelectorAll('a')) checksum += link.getBoundingClientRect().width;
    }
    const links = [...document.querySelectorAll('a')].map(link=>[link.getAttribute('href'), link.getAttribute('title'), link.className, Math.round(link.getBoundingClientRect().height)]);
    flushSync(()=>root.unmount());
    return {checksum, links};
  },
  async theme() {
    localStorage.setItem('theme','light');
    ${isBaseline ? "" : "(0,eval)(themeInitialization);"}
    const root = mount(shell(<ThemeSwitcher/>));
    await waitForThemeButton(document.getElementById('app'));
    await settle();
    const states=[];
    for (let i=0;i<9;i++) {
      document.querySelector('button').click();
      await settle();
      states.push([localStorage.getItem('theme'), document.documentElement.style.colorScheme, Math.round(document.body.getBoundingClientRect().width)]);
    }
    for (const value of ['system','dark','light',null]) {
      if (value===null) localStorage.removeItem('theme'); else localStorage.setItem('theme',value);
      dispatchEvent(new StorageEvent('storage',{key:'theme',newValue:value}));
      await settle();
      states.push([localStorage.getItem('theme'), document.documentElement.style.colorScheme, Math.round(document.body.getBoundingClientRect().width)]);
    }
    localStorage.setItem('theme','system');
    dispatchEvent(new StorageEvent('storage',{key:'theme',newValue:'system'}));
    await settle();
    window.themeRoot=root;
    return states;
  },
  finishTheme() { flushSync(()=>window.themeRoot.unmount()); },
  async notice() {
    localStorage.setItem('theme',${JSON.stringify(noticeTheme)});
    ${isBaseline ? "" : "(0,eval)(themeInitialization);"}
    const root = mount(shell(<> <MenuNotification/> ${isBaseline ? "<Toaster/>" : ""} </>));
    await new Promise(resolve=>setTimeout(resolve,1500));
    const element=document.querySelector(${isBaseline ? "'[data-sonner-toast]'" : "'.menu-notice'"});
    if (!element) throw Error('Notice did not appear');
    const box=element.getBoundingClientRect();
    const computed=getComputedStyle(element);
    const result={text:element.textContent, width:Math.round(box.width), x:Math.round(box.x), top:Math.round(box.top), colors:[computed.backgroundColor,computed.color,computed.borderColor]};
    window.noticeRoot=root;
    return result;
  },
  finishNotice() {
    const remaining=document.querySelector(${isBaseline ? "'[data-sonner-toast]'" : "'.menu-notice'"});
    flushSync(()=>window.noticeRoot.unmount());
    if (remaining) throw Error('Upward swipe did not dismiss notice');
  }
};
`,
  );
  console.log(`Bundling ${directory}`);
  const built = await Bun.build({
    entrypoints: [join(directory, "entry.tsx")],
    outdir: join(directory, "dist"),
    target: "browser",
    format: "iife",
    minify: true,
    define: { "process.env.NODE_ENV": '"production"' },
    plugins: [
      {
        name: "fixture-aliases",
        setup(builder) {
          builder.onResolve({ filter: /^@\// }, (args) => ({
            path: ["", ".ts", ".tsx", ".js"]
              .map((extension) => join(directory, "src", args.path.slice(2) + extension))
              .find((path) => existsSync(path)),
          }));
        },
      },
    ],
  });
  if (!built.success) throw new Error(built.logs.map(String).join("\n"));
  write(
    directory,
    "index.html",
    `<!doctype html><html class="stylex-marker"><head><link rel="stylesheet" href="style.css"></head><body><div id="app"></div><script>window.process={env:{}}</script><script src="dist/entry.js"></script></body></html>`,
  );
}
const { chromium } = createRequire(join(toolDir, "package.json"))("playwright");
console.log("Launching benchmark browser");
const browser = await chromium.launch({
  executablePath: process.env.BENCH_CHROME || "/usr/bin/google-chrome",
  headless: true,
});
const stopOnInterrupt = () => {
  void browser.close().finally(() => process.exit(130));
};
const stopOnTerminate = () => {
  void browser.close().finally(() => process.exit(143));
};
process.once("SIGINT", stopOnInterrupt);
process.once("SIGTERM", stopOnTerminate);
const rows = [];
const loadBefore = loadavg();
try {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: process.env.BENCH_MOTION || "reduce",
  });
  const pages = {};
  for (const [name, directory] of [
    ["baseline", baseline],
    ["candidate", candidate],
  ]) {
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => {
      errors.push(error.message);
    });
    await page.goto(pathToFileURL(join(directory, "index.html")).href);
    await page.bringToFront();
    assert.equal(await page.evaluate(() => window.fixture.hydration()), true);
    assert.deepEqual(errors, [], `${name}: browser errors during setup`);
    const session = await context.newCDPSession(page);
    await session.send("Performance.enable", { timeDomain: "threadTicks" });
    pages[name] = { page, session, errors };
  }
  const metrics = async (session) =>
    Object.fromEntries(
      (await session.send("Performance.getMetrics")).metrics.map((item) => [item.name, item.value]),
    );
  for (const workload of workloads) {
    const results = { baseline: [], candidate: [] };
    let reference;
    for (let run = -warmups; run < samples; run++) {
      for (const name of run % 2 === 0 ? ["baseline", "candidate"] : ["candidate", "baseline"]) {
        const { page, session, errors } = pages[name];
        if (freshRealm) await page.reload();
        await page.bringToFront();
        const before = await metrics(session);
        const wallStart = performance.now();
        const value = await page.evaluate(async (workload) => {
          const start = performance.now();
          const value = await window.fixture[workload]();
          return { value, wallMs: performance.now() - start };
        }, workload);
        if (workload === "theme") {
          for (const scheme of ["dark", "light"]) {
            await page.emulateMedia({ colorScheme: scheme });
            await page.evaluate(
              () =>
                new Promise((resolve) =>
                  requestAnimationFrame(() => requestAnimationFrame(resolve)),
                ),
            );
            assert.equal(
              await page.evaluate(() => document.documentElement.style.colorScheme),
              scheme,
              "system theme must follow media changes",
            );
            await page.evaluate(() => document.body.getBoundingClientRect());
          }
          assert.equal(
            await page.evaluate(() => document.documentElement.classList.contains("stylex-marker")),
            true,
          );
          await page.evaluate(() => window.fixture.finishTheme());
        }
        if (workload === "notice") {
          const notice = page.locator(name === "baseline" ? "[data-sonner-toast]" : ".menu-notice");
          await notice.hover();
          await page.keyboard.press("Alt+t");
          assert.equal(
            await page.evaluate(
              () => document.activeElement?.closest("[data-sonner-toaster],.menu-notice") !== null,
            ),
            true,
            "notification hotkey must focus the notice",
          );
          await page.waitForTimeout(1600);
          assert.equal(await notice.count(), 1, "focus/hover must pause expiry");
          await page.evaluate(() => {
            const before = document.createElement("button");
            before.id = "tab-before-notice";
            before.style.position = "fixed";
            document.body.prepend(before);
            before.focus();
          });
          await page.keyboard.press("Tab");
          assert.equal(
            await notice.evaluate((element) => document.activeElement === element),
            true,
            "Tab must reach the notice",
          );
          await page.evaluate(() => document.getElementById("tab-before-notice").remove());
          let box = await notice.boundingBox();
          assert.ok(box);
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 - 20, { steps: 3 });
          await page.waitForTimeout(300);
          await page.mouse.up();
          await page.waitForTimeout(400);
          assert.equal(await notice.count(), 1, "a slow20px upward gesture must not dismiss");
          box = await notice.boundingBox();
          assert.ok(box);
          await page.mouse.move(box.x + box.width / 2, box.y + box.height - 4);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2, Math.max(0, box.y - 45), { steps: 3 });
          const draggedBox = await notice.boundingBox();
          assert.ok(draggedBox);
          await page.mouse.up();
          const afterRelease = await page.evaluate(
            (selector) => {
              const element = document.querySelector(selector);
              if (!element) return null;
              const computed = getComputedStyle(element);
              return {
                y: element.getBoundingClientRect().y,
                opacity: Number(computed.opacity),
                animationName: computed.animationName,
              };
            },
            name === "baseline" ? "[data-sonner-toast]" : ".menu-notice",
          );
          if ((process.env.BENCH_MOTION || "reduce") === "no-preference") {
            assert.ok(
              !afterRelease || afterRelease.opacity === 0 || afterRelease.y <= draggedBox.y + 2,
              "accepted swipe must not snap back toward its resting position",
            );
          } else {
            assert.equal(
              afterRelease?.animationName,
              "none",
              "reduced-motion exit must suppress animation",
            );
          }
          await page.waitForTimeout(500);
          await page.evaluate(() => window.fixture.finishNotice());
        }
        const after = await metrics(session);
        assert.deepEqual(errors, [], `${name}: browser errors in ${workload}`);
        if (workload !== "notice") {
          reference ??= value.value;
          assert.deepEqual(value.value, reference, `${workload}: behavior/layout differs`);
        } else {
          reference ??= value.value;
          assert.deepEqual(value.value.colors, reference.colors, "notice theme colors differ");
          assert.equal(value.value.text, "Data as put on the Sindhi Mess banner.");
          assert.equal(value.value.width, width <= 600 ? width - 32 : 356);
          assert.equal(value.value.x, Math.round((width - (width <= 600 ? width - 32 : 356)) / 2));
          assert.equal(value.value.top, width <= 600 ? 16 : 24);
        }
        if (run >= 0)
          results[name].push({
            mainThreadMs: (after.TaskDuration - before.TaskDuration) * 1000,
            scriptMs: (after.ScriptDuration - before.ScriptDuration) * 1000,
            layoutMs: (after.LayoutDuration - before.LayoutDuration) * 1000,
            wallMs: performance.now() - wallStart,
          });
      }
    }
    const stats = (values, key) => {
      const sorted = values.map((value) => value[key]).sort((a, b) => a - b);
      return {
        min: sorted[0],
        median:
          sorted.length % 2 === 0
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)],
        p95: sorted[Math.ceil(sorted.length * 0.95) - 1],
        max: sorted.at(-1),
        spread: sorted.at(-1) - sorted[0],
      };
    };
    const summarize = (values) =>
      Object.fromEntries(
        ["mainThreadMs", "scriptMs", "layoutMs", "wallMs"].map((key) => [key, stats(values, key)]),
      );
    const row = {
      workload,
      samples,
      warmups,
      baseline: summarize(results.baseline),
      candidate: summarize(results.candidate),
      raw: results,
    };
    rows.push(row);
    console.log(JSON.stringify({ ...row, raw: undefined }));
  }
} finally {
  process.removeListener("SIGINT", stopOnInterrupt);
  process.removeListener("SIGTERM", stopOnTerminate);
  await browser.close();
}
const result = {
  baseline_ref: base,
  command: "bunx bun@1.4.2 scripts/benchmark-ui-replacements.mjs",
  environment: {
    bun: Bun.version,
    node: execFileSync("node", ["--version"], { encoding: "utf8" }).trim(),
    chrome: execFileSync(process.env.BENCH_CHROME || "/usr/bin/google-chrome", ["--version"], {
      encoding: "utf8",
    }).trim(),
    cpus: cpus().length,
    load_before: loadBefore,
    load_after: loadavg(),
    viewport: `${width}x${height}`,
    reducedMotion: process.env.BENCH_MOTION || "reduce",
    noticeTheme,
    freshRealm,
    concurrency: 1,
  },
  notes: [
    "Alternating same-browser pairs; compilation, dependency installation and navigation excluded.",
    freshRealm
      ? "Each measured workload starts in a fresh page realm after an untimed reload, without hydration pre-initialization. Initial hydration proof runs separately before measurements."
      : "Shared-realm stress mode retains library history and singleton state across samples; it is not one-root-per-page shipping evidence.",
    "CDP Performance metrics use threadTicks, measuring main-thread CPU including React, style and layout while excluding scheduler waits. Wall time includes automation, frames and timers.",
    "buttons: 50 mounts of the actual weeks route, including 8 styled navigation anchors and 4 week links, with forced geometry reads.",
    "theme: mount, 9 button-driven light/dark/system transitions, 4 cross-tab storage events and 2 system media changes; each followed by frames and geometry reads.",
    "notice: mount, real one-second delay, geometry read, hover and Alt+T/Tab focus, wait beyond expiry to prove pausing, retain a slow20px upward drag, dismiss a >=45px upward swipe, exit and unmount. Timer/automation wall time is not a speed claim.",
    "Temporary benchmark fixtures capture only necessary files via git show; original checkout and final dependency declarations are untouched.",
  ],
  rows,
  fixture_directory: temporary,
  project,
};
writeFileSync(output, JSON.stringify(result, null, 2) + "\n");
console.log(`Performance record: ${output}`);
