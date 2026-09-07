// "מי מנצח": לכל אלמנט ומאפיין — אילו כללי CSS (מכל הגיליונות, כולל @import) תופסים אותו, לפי סדר. מריצים על דף מוק או על האתר החי.
// שימוש: node --experimental-websocket tools/which-rule.mjs "<url>" "<selector>" "<prop1,prop2>" [--mobile]
import { openChrome } from './cdp.mjs';
const [url, selector, props] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!url || !selector || !props) { console.error('usage: which-rule.mjs <url> <selector> <prop,prop> [--mobile]'); process.exit(2); }
const c = await openChrome(9600 + Math.floor(Math.random() * 300), 'which');
await c.send('Emulation.setDeviceMetricsOverride', process.argv.includes('--mobile') ? { width: 390, height: 844, deviceScaleFactor: 1, mobile: true } : { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await c.goto(url, 6000);
console.log(await c.evalJs(`(function(){ const el=document.querySelector(${JSON.stringify(selector)}); if(!el) return 'selector not found'; const props=${JSON.stringify(props.split(','))}; const out=[]; const walk=(list)=>{ for (const rule of list){ if (rule.styleSheet) { try{ walk([...rule.styleSheet.cssRules]); }catch(e){} continue; } if (rule.cssRules && rule.media) { walk([...rule.cssRules]); continue; } if (!rule.selectorText) continue; let m=false; try{ m=el.matches(rule.selectorText); }catch(e){} if(!m) continue; for (const p of props){ const v=rule.style.getPropertyValue(p); if(v) out.push(rule.selectorText.slice(0,120)+'  →  '+p+': '+v+(rule.style.getPropertyPriority(p)?' !important':'')); } } }; for (const sh of document.styleSheets){ try{ walk([...sh.cssRules]); }catch(e){} } out.push('--- computed ---'); for (const p of props) out.push(p+' = '+getComputedStyle(el).getPropertyValue(p)); return out.join('\\n'); })()`));
c.close();
