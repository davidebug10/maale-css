// אינדקס החיפוש (MH Search v2): כל החנויות + כל התפריט (שמות קטגוריות ומוצרים, עם מזהים) → search-index.json.
// לא רשימה ידנית: כל ריצה שואבת מחדש מה-API של Hyperzod — חנות/מוצר חדשים נכנסים לבד (דוד 9.10).
// הרצה: node tools/build-search-index.mjs [out.json]   (Node 20, בלי חבילות)
// ב-GitHub: .github/workflows/search-index.yml מריץ פעמיים ביום ומפרסם לענף search-index (בלי לבנות מחדש את Pages).
import fs from 'node:fs';

const API = 'https://api.hyperzod.app';
const H = { 'X-Tenant': 'www.maalehamishlohim.co.il', 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-client-device': 'web' };
const LOC = [31.7771751, 35.2978482];   // מיקום ברירת המחדל של החנות (מעלה אדומים)
const OUT = process.argv[2] || 'search-index.json';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(path, tries = 3) {      // ה-API מחזיר ריק כשמציפים אותו — לאט, עם ניסיון חוזר
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(API + path, { headers: H }).then((x) => x.json()); if (r && r.success !== false && r.data) return r.data; } catch {}
    await sleep(1500 * (i + 1));
  }
  return null;
}
async function post(path, body) {
  try { const r = await fetch(API + path, { method: 'POST', headers: H, body: JSON.stringify(body) }).then((x) => x.json()); return (r && r.data) || null; } catch { return null; }
}
const heName = (m) => ((m.language_translation || []).find((t) => t.key === 'name' && t.locale === 'he') || {}).value || m.name || '';

/* כל החנויות: "בסביבה" + דף הבית + חיפוש חנויות לפי אות (עברית ואנגלית) — כל מקור לבד מפספס חנויות */
async function allStores() {
  const map = new Map();
  const add = (m) => { const id = m && (m._id || m.merchant_id); if (id && !map.has(id)) map.set(id, m); };
  const near = await post('/store/v1/merchant/nearby', { user_location: LOC, locale: 'he' });
  (Array.isArray(near) ? near : (near && (near.data || near.merchants)) || []).forEach(add);
  const home = await post('/store/v1/home', { user_location: LOC, locale: 'he' });
  ((home && home.merchants) || []).forEach(add); ((home && home.featured_merchants) || []).forEach(add);
  const letters = 'אבגדהוזחטיכלמנסעפצקרשת'.split('').concat('abcdefghijklmnopqrstuvwxyz'.split(''));
  for (const q of letters) {
    const d = await get(`/store/v1/search?location%5B%5D=${LOC[0]}&location%5B%5D=${LOC[1]}&q=${encodeURIComponent(q)}&locale=he&search_type=merchant`, 1);
    (Array.isArray(d) ? d : []).forEach(add);
    await sleep(350);
  }
  return [...map.values()];
}

/* תפריט מלא: כל העמודים, וקטגוריה של יותר מ-20 מוצרים (is_paginated) — גם שאר העמודים שלה */
async function menu(id) {
  const secs = [];
  for (let page = 1; page <= 20; page++) {
    const d = await get(`/store/v1/merchant/menu?merchant_id=${id}&page=${page}`);
    const cats = (d && d.category_products) || [];
    if (!cats.length) break;
    for (const c of cats) {
      const items = (c.category_products || []).map((p) => [p._id, String(p.name || '').trim()]);
      if (c.is_paginated && c._id) {
        for (let cp = 2; cp <= 30; cp++) {
          const more = await get(`/store/v1/search/product-category/products?product_category_id=${c._id}&merchant_id=${id}&locale=he&page=${cp}`);
          const pg = (more && more.products) || {};                  /* { data: [...], current_page, next_page_url } */
          const arr = Array.isArray(pg.data) ? pg.data : [];
          arr.forEach((p) => items.push([p._id, String(p.name || '').trim()]));
          if (!arr.length || !pg.next_page_url) break;
          await sleep(500);
        }
      }
      const seen = new Set();
      secs.push([String(c.name || '').trim(), items.filter((x) => x[0] && x[1] && !seen.has(x[0]) && seen.add(x[0]))]);
    }
    await sleep(700);
  }
  return secs;
}

const stores = await allStores();
const out = { v: 1, built: new Date().toISOString(), stores: [] };
for (const m of stores) {
  const id = m._id || m.merchant_id;
  const secs = await menu(id);
  out.stores.push({ id, slug: m.slug, name: heName(m).trim(), cats: m.merchant_category_ids || [], secs });
  console.log(`${String(m.slug).padEnd(28)} ${String(secs.length).padStart(3)} sections ${String(secs.reduce((a, s) => a + s[1].length, 0)).padStart(5)} products`);
}
const nProducts = out.stores.reduce((a, s) => a + s.secs.reduce((b, x) => b + x[1].length, 0), 0);
// שמירה מפני אינדקס שבור (API שהחזיר ריק באמצע): עדיף להשאיר את הקודם
if (out.stores.length < 15 || nProducts < 500) { console.error(`ABORT: only ${out.stores.length} stores / ${nProducts} products`); process.exit(1); }
fs.writeFileSync(OUT, JSON.stringify(out));
console.log(`OK ${out.stores.length} stores, ${nProducts} products → ${OUT} (${Math.round(fs.statSync(OUT).size / 1024)}KB)`);
