// עוזר CDP: כרום ללא ראש דרך Chrome DevTools Protocol. הרצה: node --experimental-websocket <script>.mjs (Node 20, בלי ws).
// openChrome(port, profileName) → { send, evalJs, goto, close }. הפרופיל נוצר תחת tools/.profiles/ (ב-.gitignore).
import { spawn } from 'node:child_process';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '.profiles');
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export async function openChrome(port = 9337, profile = 'chrome-profile-roladin') {
  const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + OUT + '/' + profile, '--window-size=1280,900', '--lang=he-IL', 'about:blank'], { stdio: 'ignore' });
  let targets; for (let i = 0; i < 40; i++) { await sleep(250); try { targets = await fetch(`http://127.0.0.1:${port}/json`).then((r) => r.json()); if (targets.length) break; } catch {} }
  const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
  let id = 0; const pending = new Map(); ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const evalJs = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result.result.value; };
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36', acceptLanguage: 'he-IL,he;q=0.9,en;q=0.8' });
  const goto = async (url, wait = 5000) => { await send('Page.navigate', { url }); await sleep(wait); };
  const close = () => { ws.close(); chrome.kill(); };
  return { send, evalJs, goto, close };
}
