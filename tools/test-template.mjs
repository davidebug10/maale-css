// תבנית בדיקה סגורה: שרת סטטי (הריפו + CSS של Hyperzod + המוק) → Chrome ללא ראש → אסרטים במובייל ובדסקטופ → צילומים.
// העתיקו לתיקיית עבודה (למשל work/<name>/test.mjs), שימו לידה mock.html, ומלאו את האסרטים. הרצה: node --experimental-websocket test.mjs
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { openChrome, sleep } from '../../tools/cdp.mjs'; // התאימו את הנתיב

const HERE = path.dirname(new URL(import.meta.url).pathname);
const REPO = path.resolve(HERE, '..', '..');            // שורש maale-css (global-cdn.css, custom-footer.js)
const HZ = path.join(REPO, 'tools', 'hz');               // vendor.css + index.css של Hyperzod (ראו DESIGN_METHOD §5.3)
const OUT = path.join(HERE, 'shots'); fs.mkdirSync(OUT, { recursive: true });
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x'); let f;
  if (u.pathname.startsWith('/maale/')) f = path.join(REPO, u.pathname.slice(7));
  else if (u.pathname.startsWith('/hz/')) f = path.join(HZ, u.pathname.slice(4));
  else f = path.join(HERE, u.pathname === '/' ? 'mock.html' : u.pathname);
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end('nf ' + f); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(fs.readFileSync(f));
});
const PORT = 19000 + Math.floor(Math.random() * 800);
await new Promise((r) => server.listen(PORT, r));
const c = await openChrome(9600 + Math.floor(Math.random() * 300), 'test-' + path.basename(HERE));
let pass = 0, fail = 0; const failures = [];
const ok = (name, cond, extra = '') => { if (cond) { pass++; console.log('  ✓', name); } else { fail++; failures.push(name + ' ' + extra); console.log('  ✗', name, extra); } };
const shot = async (name) => { const r = await c.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(r.result.data, 'base64')); };

for (const [label, w, h] of [['mobile', 390, 844], ['desktop', 1280, 900]]) {
  console.log('\n== ' + label + ' ==');
  await c.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: w < 600 ? 2 : 1, mobile: w < 600 });
  await c.goto(`http://127.0.0.1:${PORT}/`, 2500);
  const s = await c.evalJs(`(function(){
    // כאן מודדים: getBoundingClientRect / getComputedStyle (כולל '::before' / '::after') / classList / innerText
    const el = document.querySelector('#TARGET'); if (!el) return JSON.stringify({ found: false });
    const cs = getComputedStyle(el);
    return JSON.stringify({ found: true, bg: cs.backgroundColor, radius: cs.borderTopLeftRadius, w: Math.round(el.getBoundingClientRect().width),
      overflow: document.documentElement.scrollWidth > innerWidth,
      control: (() => { const k = document.querySelector('#control-outside'); return k ? getComputedStyle(k).backgroundColor : null; })(),
      mhqRules: [...document.styleSheets].reduce((n, sh) => { try { for (const x of sh.cssRules) { if (x.styleSheet) { for (const y of x.styleSheet.cssRules) if (y.selectorText && y.selectorText.includes('mhq-')) n++; } } } catch (e) {} return n; }, 0) });
  })()`).then(JSON.parse);
  ok('target found', s.found);
  ok('no horizontal overflow', !s.overflow);
  ok('SCOPE: control outside untouched', s.control === null || s.control !== s.bg, JSON.stringify(s));
  ok('pizza-quarters (mhq) rules present', s.mhqRules >= 45, s.mhqRules);
  await shot(label);
}
console.log(`\n${pass} passed, ${fail} failed`); if (fail) console.log('FAILURES:\n - ' + failures.join('\n - '));
c.close(); server.close(); process.exit(fail ? 1 : 0);
