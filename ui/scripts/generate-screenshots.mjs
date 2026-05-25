import { mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uiRoot = path.resolve(__dirname, '..');
const distDir = path.join(uiRoot, 'dist');
const outputDir = path.join(uiRoot, 'artifacts', 'screenshots');
const baseUrl = 'http://127.0.0.1:4173';

async function ensureDistBuilt() {
  await access(distDir);
}

function startPreviewServer() {
  const viteBin = path.join(uiRoot, 'node_modules', 'vite', 'bin', 'vite.js');
  return spawn(
    process.execPath,
    [viteBin, 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'],
    {
      cwd: uiRoot,
      stdio: 'pipe',
      env: process.env,
    }
  );
}

async function waitForServer(processRef, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (processRef.exitCode !== null) {
      throw new Error('Preview server exited before becoming ready.');
    }
    try {
      const response = await fetch(baseUrl, { method: 'GET' });
      if (response.ok) return;
    } catch {
      // Retry until timeout.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('Timed out waiting for preview server.');
}

async function captureScreenshots() {
  await mkdir(outputDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

  const pages = [
    { route: '/', file: 'home.png' },
    { route: '/play', file: 'play.png' },
    { route: '/settings', file: 'settings.png' },
  ];

  for (const entry of pages) {
    await page.goto(`${baseUrl}${entry.route}`, { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(outputDir, entry.file),
      fullPage: true,
    });
  }
  await browser.close();
}

async function main() {
  await ensureDistBuilt();
  const preview = startPreviewServer();
  try {
    await waitForServer(preview);
    await captureScreenshots();
  } finally {
    if (preview.exitCode === null) {
      preview.kill('SIGTERM');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (preview.exitCode === null) {
        preview.kill('SIGKILL');
      }
    }
  }
}

await main();
