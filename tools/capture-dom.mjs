// לוכד מהאתר החי: outline של רכיב, ה-HTML שלו (מנוקה מ-URL/base64) וצילום מסך — הבסיס לכל עיצוב.
// שימוש: node --experimental-websocket tools/capture-dom.mjs "<url>" "<css selector>" [out-dir] [--mobile] [--push=<route name>:<q>]
//   --mobile   = 390x844 (ברירת מחדל 1280x900)
//   --spa=<js> = קוד JS להרצה אחרי הטעינה (למשל ניווט: document.querySelector('#app').__vue_app__.config.globalProperties.$router.push({name:'search',query:{q:'וופל'}}))
//   --scroll=<px> = גלילה בתוך .merchant-page (דף עסק) או window לפני הלכידה
import fs from 'node:fs'; import path from 'node:path';
import { openChrome, sleep } from './cdp.mjs';
const [url, selector, outDirArg] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!url || !selector) { console.error('usage: capture-dom.mjs <url> <selector> [out-dir] [--mobile] [--spa=<js>] [--scroll=<px>]'); process.exit(2); }
const mobile = process.argv.includes('--mobile');
const spa = (process.argv.find((a) => a.startsWith('--spa=')) || '').slice(6);
const scroll = Number((process.argv.find((a) => a.startsWith('--scroll=')) || '').slice(9)) || 0;
const out = outDirArg || path.join(process.cwd(), 'capture'); fs.mkdirSync(out, { recursive: true });
const c = await openChrome(9600 + Math.floor(Math.random() * 300), 'capture');
await c.send('Emulation.setDeviceMetricsOverride', mobile ? { width: 390, height: 844, deviceScaleFactor: 2, mobile: true } : { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await c.goto(url, 10000);
await c.evalJs(`document.querySelectorAll('.v-overlay--active').forEach(o=>o.remove())`); // פופאפ ההורדה של האפליקציה מסתיר הכול
if (spa) { await c.evalJs(spa); await sleep(6000); }
if (scroll) { await c.evalJs(`(document.querySelector('.merchant-page')||document.scrollingElement).scrollTop=${scroll}`); await sleep(1200); }
const info = await c.evalJs(`(function(){ const el=document.querySelector(${JSON.stringify(selector)}); if(!el) return JSON.stringify({found:false}); const lines=[]; function walk(e,d){ if(d>12||lines.length>500) return; if(/svg|path/i.test(e.tagName)) return; const cls=[...e.classList].slice(0,7).join('.'); const txt=(e.childElementCount===0? e.textContent.trim().slice(0,30):''); lines.push('  '.repeat(d)+e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(cls?'.'+cls:'')+(txt?' "'+txt+'"':'')); for(const ch of e.children) walk(ch,d+1);} walk(el,0); const chain=[]; let p=el.parentElement; for(let i=0;i<8&&p;i++){ const cs=getComputedStyle(p); chain.push((p.id?'#'+p.id:'')+'.'+[...p.classList].slice(0,5).join('.')+' | pos='+cs.position+' overflow='+cs.overflow+' pad='+cs.padding); p=p.parentElement; } const html=el.outerHTML.replace(/https?:\\/\\/[^"\\s]+/g,'<url>').replace(/data:image[^"]+/g,'<data>'); return JSON.stringify({found:true, outline:lines.join('\\n'), chain, html, rect: el.getBoundingClientRect().toJSON()}); })()`).then(JSON.parse);
if (!info.found) { console.error('selector not found:', selector); c.close(); process.exit(1); }
fs.writeFileSync(path.join(out, 'outline.txt'), info.outline); fs.writeFileSync(path.join(out, 'element.html'), info.html); fs.writeFileSync(path.join(out, 'parents.txt'), info.chain.join('\n'));
const shot = await c.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, 'screenshot.png'), Buffer.from(shot.result.data, 'base64'));
console.log('saved to', out, '| rect', JSON.stringify(info.rect), '\n--- parents ---\n' + info.chain.join('\n') + '\n--- outline (first 40) ---\n' + info.outline.split('\n').slice(0, 40).join('\n'));
c.close();
