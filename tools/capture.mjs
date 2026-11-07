import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9300 + Math.floor(Math.random() * 300);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'abs-colour-chrome-'));
const width = 1600;
const height = 1100;

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const url = getArg('url');
const out = getArg('out');
const full = args.includes('--full');
if (!url || !out) {
  console.error('Usage: node tools/capture.mjs --url URL --out FILE [--full]');
  process.exit(1);
}

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    `--user-data-dir=${profile}`,
    `--remote-debugging-port=${port}`,
    `--window-size=${width},${height}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitForDebugger() {
  for (let i = 0; i < 80; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return;
    } catch {
      // still starting
    }
    await delay(100);
  }
  throw new Error('Chrome debugging endpoint did not start');
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let nextId = 1;
    const pending = new Map();
    const events = new Map();
    ws.addEventListener('open', () => {
      resolve({
        send(method, params = {}) {
          const id = nextId++;
          ws.send(JSON.stringify({ id, method, params }));
          return new Promise((res, rej) => pending.set(id, { res, rej }));
        },
        on(method, fn) {
          if (!events.has(method)) events.set(method, []);
          events.get(method).push(fn);
        },
        close() {
          ws.close();
        },
      });
    });
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) rej(new Error(msg.error.message));
        else res(msg.result);
      } else if (msg.method && events.has(msg.method)) {
        for (const fn of events.get(msg.method)) fn(msg.params);
      }
    });
    ws.addEventListener('error', reject);
  });
}

try {
  await waitForDebugger();
  const targetRes = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' });
  const target = await targetRes.json();
  const page = await connect(target.webSocketDebuggerUrl);
  await page.send('Page.enable');
  await page.send('Runtime.enable');
  await page.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  const loaded = new Promise((resolve) => page.on('Page.loadEventFired', resolve));
  await page.send('Page.navigate', { url });
  await Promise.race([loaded, delay(8000)]);
  await delay(900);
  let captureHeight = height;
  if (full) {
    const metrics = await page.send('Page.getLayoutMetrics');
    captureHeight = Math.min(9000, Math.ceil(metrics.cssContentSize.height));
    await page.send('Emulation.setDeviceMetricsOverride', {
      width,
      height: captureHeight,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await delay(250);
  }
  const shot = await page.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: full,
    ...(full ? { clip: { x: 0, y: 0, width, height: captureHeight, scale: 1 } } : {}),
  });
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(shot.data, 'base64'));
  console.log(`Wrote ${out} (${width}x${captureHeight})`);
  page.close();
  try {
    chrome.kill('SIGKILL');
  } catch {
    // ignore
  }
  process.exit(0);
} finally {
  try {
    chrome.kill('SIGKILL');
  } catch {
    // ignore
  }
}

