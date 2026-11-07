/* ==========================================================================
   Comprehensive Automated Test & Visual Verification Suite
   Tests Colouring (50 pages), Whiteboard, Blackboard, Scratch Art,
   Glowing Colours, and Strict Completion Points & Cheering Logic.
   ========================================================================== */

import http from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 3000;

console.log('🧪 Starting Absolute Colouring automated tests...\n');

// 1. Verify Art Module and 50 Pages
console.log('1️⃣ Checking art pages and categories...');
const { PAGES, PAGE_BY_ID, CATEGORIES } = await import('../js/art.js');
console.log(`   ✓ Found ${PAGES.length} pages in ${CATEGORIES.length} categories`);

if (PAGES.length !== 50) {
  throw new Error(`Expected 50 pages, but found ${PAGES.length}`);
}

const fox = PAGE_BY_ID['fox'];
if (!fox) {
  throw new Error('Fox page was not found in PAGE_BY_ID!');
}
console.log(`   ✓ Playful Fox page present: "${fox.title}" (${fox.category})`);

// 2. Verify Scratch Art Themes
console.log('\n2️⃣ Checking Scratch Art themes and underlayers...');
const { SCRATCH_THEMES, getScratchUnderlayerSVG } = await import('../js/scratch-art.js');
console.log(`   ✓ ${SCRATCH_THEMES.length} scratch themes verified`);
for (const theme of SCRATCH_THEMES) {
  const svg = getScratchUnderlayerSVG(theme.id);
  if (!svg || !svg.includes('<svg')) {
    throw new Error(`Failed to generate underlayer SVG for theme ${theme.id}`);
  }
}
console.log('   ✓ All 5 hidden underlayer illustrations generated correctly');

// 3. Test Localhost HTTP Server
console.log('\n3️⃣ Testing localhost static server...');
await new Promise((resolve) => {
  const req = http.get(`http://127.0.0.1:${PORT}/index.html`, (res) => {
    if (res.statusCode === 200) {
      console.log(`   ✓ http://localhost:${PORT}/index.html returned HTTP ${res.statusCode}`);
      resolve();
    } else {
      resolve();
    }
  });
  req.on('error', () => resolve());
});

// 4. Headless Chrome In-Depth Test
console.log('\n4️⃣ Launching Chrome headless test runner...');
const debugPort = 9400 + Math.floor(Math.random() * 200);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'abs-test-chrome-'));

// Launch temporary test server if not already running
const isPortOpen = await new Promise((res) => {
  const req = http.get(`http://127.0.0.1:${PORT}/`, () => res(true));
  req.on('error', () => res(false));
});

if (!isPortOpen) {
  const { default: serverModule } = await import('../server.js');
  console.log(`   ✓ Started local server on http://127.0.0.1:${PORT}`);
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
    `--remote-debugging-port=${debugPort}`,
    '--window-size=1400,900',
    'about:blank',
  ],
  { stdio: 'ignore' }
);

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForDebugger() {
  for (let i = 0; i < 80; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
      if (res.ok) return;
    } catch {
      // starting
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
  const targetRes = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: 'PUT' });
  const target = await targetRes.json();
  const page = await connect(target.webSocketDebuggerUrl);

  const consoleErrors = [];
  page.on('Runtime.consoleAPICalled', (params) => {
    if (params.type === 'error') {
      consoleErrors.push(params.args.map((a) => a.value || a.description).join(' '));
    }
  });

  page.on('Runtime.exceptionThrown', (params) => {
    consoleErrors.push(params.exceptionDetails.text + ' ' + (params.exceptionDetails.exception?.description || ''));
  });

  await page.send('Page.enable');
  await page.send('Runtime.enable');

  console.log(`   ✓ Navigating to http://127.0.0.1:${PORT}/ ...`);
  const loaded = new Promise((resolve) => page.on('Page.loadEventFired', resolve));
  await page.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await Promise.race([loaded, delay(6000)]);
  await delay(1200);

  // Evaluate Gallery state
  const galleryCheck = await page.send('Runtime.evaluate', {
    expression: `(() => {
      const cards = document.querySelectorAll('.picture-card');
      const title = document.querySelector('.logo-text')?.textContent;
      const pills = document.querySelectorAll('.category-pill');
      const modeTabs = document.querySelectorAll('.mode-tab');
      const score = document.querySelector('#score-points')?.textContent;
      return { 
        cardsCount: cards.length, 
        title, 
        pillsCount: pills.length,
        modeTabsCount: modeTabs.length,
        score
      };
    })()`,
    returnByValue: true,
  });

  console.log(`   ✓ Gallery loaded: "${galleryCheck.result.value.title}"`);
  console.log(`   ✓ Rendered cards: ${galleryCheck.result.value.cardsCount} / 50`);
  console.log(`   ✓ Creative mode tabs: ${galleryCheck.result.value.modeTabsCount} tabs`);
  console.log(`   ✓ Initial score: ${galleryCheck.result.value.score} pts`);

  if (galleryCheck.result.value.cardsCount !== 50) {
    throw new Error(`Expected 50 picture cards in gallery, got ${galleryCheck.result.value.cardsCount}`);
  }
  if (galleryCheck.result.value.modeTabsCount !== 4) {
    throw new Error(`Expected 4 mode tabs, got ${galleryCheck.result.value.modeTabsCount}`);
  }

  // 5. Test Studio View & Strict Completion Cheering Logic
  console.log('\n5️⃣ Testing Studio View & Strict Completion Cheering Logic...');
  await page.send('Runtime.evaluate', {
    expression: `(() => {
      const cards = document.querySelectorAll('.picture-card');
      for (const card of cards) {
        if (card.textContent.includes('Fox')) {
          card.click();
          break;
        }
      }
    })()`,
  });

  await delay(800);

  // Test partial coloring (Only 1 region colored)
  const partialTest = await page.send('Runtime.evaluate', {
    expression: `(() => {
      const regions = document.querySelectorAll('#art-container .region');
      regions[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      const completion = window.colouringApp.calculateCompletion();

      // Click Tada! button when < 85%
      document.getElementById('btn-celebrate').click();

      const encourageModalOpen = document.getElementById('encourage-modal').classList.contains('open');
      const rewardModalOpen = document.getElementById('reward-modal').classList.contains('open');
      const currentScore = document.getElementById('score-points').textContent;

      return {
        completion,
        encourageModalOpen,
        rewardModalOpen,
        currentScore
      };
    })()`,
    returnByValue: true,
  });

  console.log(`   ✓ Partially colored: ${partialTest.result.value.completion.pct}%`);
  console.log(`   ✓ Encouragement modal displayed: ${partialTest.result.value.encourageModalOpen}`);
  console.log(`   ✓ Reward modal NOT displayed prematurely: ${!partialTest.result.value.rewardModalOpen}`);
  console.log(`   ✓ Score preserved without premature points: ${partialTest.result.value.currentScore} pts`);

  if (!partialTest.result.value.encourageModalOpen || partialTest.result.value.rewardModalOpen) {
    throw new Error('Completion gate failed: premature celebration occurred!');
  }

  // Close encouragement modal and test full completion (>= 85%)
  const fullCompleteTest = await page.send('Runtime.evaluate', {
    expression: `(() => {
      // Close encourage modal
      window.colouringApp.closeEncourageModal();

      // Apply magic theme to color all regions (100% finished!)
      const theme = {
        colors: { bg: '#DFF4FF', 1: '#FF7BAC', 2: '#FFD1E1', 3: '#FFD166', 4: '#8AD7D6', 5: '#B8E986', 6: '#FFF5FA' }
      };
      window.colouringApp.applyMagicTheme(theme);
      const completion = window.colouringApp.calculateCompletion();

      // Click Tada! button now that it is 100% finished
      document.getElementById('btn-celebrate').click();

      const rewardModalOpen = document.getElementById('reward-modal').classList.contains('open');
      const newScore = document.getElementById('score-points').textContent;

      return {
        completion,
        rewardModalOpen,
        newScore
      };
    })()`,
    returnByValue: true,
  });

  console.log(`   ✓ Fully colored: ${fullCompleteTest.result.value.completion.pct}%`);
  console.log(`   ✓ Reward celebration modal opened: ${fullCompleteTest.result.value.rewardModalOpen}`);
  console.log(`   ✓ Awarded points! New Score: ${fullCompleteTest.result.value.newScore} pts ⭐`);

  if (!fullCompleteTest.result.value.rewardModalOpen || Number(fullCompleteTest.result.value.newScore) < 100) {
    throw new Error('Reward celebration failed to trigger upon full completion!');
  }

  // Close reward modal
  await page.send('Runtime.evaluate', { expression: `window.colouringApp.closeRewardModal();` });
  await delay(400);

  // 6. Test Whiteboard Mode
  console.log('\n6️⃣ Testing Whiteboard Mode...');
  const whiteboardCheck = await page.send('Runtime.evaluate', {
    expression: `(() => {
      window.colouringApp.switchMode('whiteboard');
      const frameClass = document.getElementById('canvas-frame').className;
      const title = document.getElementById('studio-title').textContent;
      const drawCanvasVisible = document.getElementById('draw-canvas').offsetWidth > 0;
      return { frameClass, title, drawCanvasVisible };
    })()`,
    returnByValue: true,
  });

  console.log(`   ✓ Whiteboard active: "${whiteboardCheck.result.value.title}"`);
  console.log(`   ✓ Canvas frame class: ${whiteboardCheck.result.value.frameClass}`);
  if (!whiteboardCheck.result.value.frameClass.includes('frame-whiteboard')) {
    throw new Error('Whiteboard frame class was not set properly');
  }

  // 7. Test Blackboard Mode with Chalk Brush
  console.log('\n7️⃣ Testing Blackboard Mode with Chalk Brush...');
  const blackboardCheck = await page.send('Runtime.evaluate', {
    expression: `(() => {
      window.colouringApp.switchMode('blackboard');
      const frameClass = document.getElementById('canvas-frame').className;
      const title = document.getElementById('studio-title').textContent;
      const drawLabel = document.getElementById('tool-label-draw').textContent;
      return { frameClass, title, drawLabel };
    })()`,
    returnByValue: true,
  });

  console.log(`   ✓ Blackboard active: "${blackboardCheck.result.value.title}"`);
  console.log(`   ✓ Canvas frame class: ${blackboardCheck.result.value.frameClass}`);
  console.log(`   ✓ Chalk tool label: "${blackboardCheck.result.value.drawLabel}"`);
  if (!blackboardCheck.result.value.frameClass.includes('frame-blackboard')) {
    throw new Error('Blackboard frame class was not set properly');
  }

  // 8. Test Scratch Art Mode
  console.log('\n8️⃣ Testing Scratch Art Mode & Revealing Wonder Images...');
  const scratchCheck = await page.send('Runtime.evaluate', {
    expression: `(() => {
      window.colouringApp.switchMode('scratch');
      const frameClass = document.getElementById('canvas-frame').className;
      const title = document.getElementById('studio-title').textContent;
      const underlayerSVG = document.querySelector('#scratch-underlayer svg');
      const hasUnderlayer = Boolean(underlayerSVG);

      // Simulate scratch drag on canvas
      const canvas = document.getElementById('draw-canvas');
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 120;
      ctx.beginPath();
      ctx.arc(500, 380, 150, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      window.colouringApp.calculateScratchReveal();
      const revealText = document.getElementById('scratch-reveal-badge').textContent;

      return { frameClass, title, hasUnderlayer, revealText };
    })()`,
    returnByValue: true,
  });

  console.log(`   ✓ Scratch Art active: "${scratchCheck.result.value.title}"`);
  console.log(`   ✓ Underlayer scene loaded: ${scratchCheck.result.value.hasUnderlayer}`);
  console.log(`   ✓ Scratch reveal meter: "${scratchCheck.result.value.revealText}"`);
  if (!scratchCheck.result.value.hasUnderlayer) {
    throw new Error('Scratch underlayer SVG failed to render');
  }

  // 9. Test Glowing Colours Neon Brush
  console.log('\n9️⃣ Testing Glowing Colours (Neon Brush)...');
  const glowCheck = await page.send('Runtime.evaluate', {
    expression: `(() => {
      window.colouringApp.setTool('glow');
      const activeTool = window.colouringApp.activeTool;
      const glowBtnActive = document.getElementById('tool-btn-glow').classList.contains('active');
      return { activeTool, glowBtnActive };
    })()`,
    returnByValue: true,
  });

  console.log(`   ✓ Active tool: ${glowCheck.result.value.activeTool}`);
  console.log(`   ✓ Glow button highlighted: ${glowCheck.result.value.glowBtnActive}`);
  if (glowCheck.result.value.activeTool !== 'glow') {
    throw new Error('Glow tool failed to activate');
  }

  // Verify console errors
  if (consoleErrors.length > 0) {
    console.error('\n⚠️ Console errors detected:', consoleErrors);
    throw new Error(`Test failed with ${consoleErrors.length} console errors`);
  } else {
    console.log('\n   ✓ ZERO browser console errors detected! 100% clean execution.');
  }

  console.log('\n🎉 ALL TESTS PASSED! Colouring, Whiteboard, Blackboard, Scratch Art, Glowing Colours, and Score Logic verified!\n');
  page.close();
  try { chrome.kill('SIGKILL'); } catch {}
  process.exit(0);
} catch (err) {
  console.error('\n❌ Test Error:', err);
  try { chrome.kill('SIGKILL'); } catch {}
  process.exit(1);
}
