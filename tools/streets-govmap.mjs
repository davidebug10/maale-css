// מרענן את טבלת הרחובות של MH Streets (custom-footer.js): מאגר הרחובות הממשלתי (data.gov.il) → GovMap (מפ"י) → [שם, lat, lng].
// שימוש: node tools/streets-govmap.mjs [סמל ישוב, ברירת מחדל 3616 = מעלה אדומים] > work/streets.js
// ואז מדביקים את הפלט במקום המערך STREETS בבלוק "MH Streets". Web Mercator → WGS84 (GovMap מחזיר EPSG:3857).
const CITY_CODE = process.argv[2] || '3616';
const CITY = 'מעלה אדומים';
const PREF = /^(סמטת|סמ|שכונת|שכ|שדרות|שד|מבוא|נתיב|משעול|רחוב|רח|דרך|ככר|כיכר)\s+/;
const norm = (s) => String(s || '').replace(/["'׳״]/g, '').replace(/[-–—]/g, ' ').replace(/\s+/g, ' ').trim();
const wgs = (shape) => { const [x, y] = shape.replace('POINT(', '').replace(')', '').split(' ').map(Number); return [Math.round((2 * Math.atan(Math.exp(y / 6378137)) - Math.PI / 2) * 180 / Math.PI * 1e6) / 1e6, Math.round(x / 111319.49079327357 * 1e6) / 1e6]; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const reg = await fetch(`https://data.gov.il/api/3/action/datastore_search?resource_id=9ad3862c-8391-4b2f-84a4-2d4c68625f4b&filters=${encodeURIComponent(JSON.stringify({ 'סמל_ישוב': CITY_CODE }))}&limit=2000`, { headers: { 'User-Agent': 'Mozilla/5.0' } }).then((r) => r.json());
const names = [...new Set(reg.result.records.map((r) => r['שם_רחוב'].trim()))].sort();
console.error(names.length, 'רחובות במאגר הממשלתי');

const rows = [], missing = [];
for (const n of names) {
  const body = JSON.stringify({ searchText: n + ' ' + CITY, language: 'he', isAccurate: false, maxResults: 10 });
  let res = [];
  try { res = (await fetch('https://www.govmap.gov.il/api/search-service/autocomplete', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' }, body }).then((r) => r.json())).results || []; } catch {}
  const full = norm(n), core = full.replace(PREF, '');
  const cand = (x) => { const t = norm(x.text); if (!t.includes(CITY)) return null; const b = t.replace(CITY, '').trim(); const bc = b.replace(PREF, ''); if (bc === core || b === full) return 'exact'; if (bc.replace(/\s*\d+[א-ת]?$/, '').trim() === core) return 'addr'; return null; };
  let pick = null;
  for (const typ of ['street', 'neighborhood', 'address']) { pick = res.find((x) => x.type === typ && cand(x)); if (pick) break; }
  if (!pick) { missing.push(n); continue; }
  const disp = norm(pick.text).replace(new RegExp('\\s*' + CITY + '\\s*$'), '').replace(/\s+\d+[א-ת]?$/, '').trim();
  const [lat, lng] = wgs(pick.shape);
  if (!rows.some((r) => norm(r[0]).replace(PREF, '') === disp.replace(PREF, ''))) rows.push([disp, lat, lng]);
  await sleep(200);
}
console.error(rows.length, 'עם מיקום |', missing.length, 'בלי מיקום ב-GovMap:', missing.join(', '));
console.log('var STREETS = [\n' + rows.map((r) => '  ' + JSON.stringify(r)).join(',\n') + '\n];');
