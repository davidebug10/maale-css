# maale-css — הוראות לסשן Claude Code

ריפו העיצוב של חנות מעלה המשלוחים (Hyperzod). שני קבצים חיים: `global-cdn.css` (עיצוב) ו-`custom-footer.js` (התנהגויות), נטענים לאתר מ-GitHub Pages. **לפני כל עבודה קרא את `DESIGN_METHOD.md`** — שם המפה של הקובץ (מי הבעלים של כל רכיב), הכלים, אטלס ה-DOM של החנות, המלכודות ושפת העיצוב.

## מה דוד מצפה ממך בכל משימה
דוד (בעל העסק, לא מתכנת) שולח צילום מסך + הסבר. הזרימה תמיד:
1. **לכוד את הרכיב מהאתר החי** (`tools/capture-dom.mjs`), בשני המצבים אם יש (למשל לפני/אחרי גלילה, נבחר/לא נבחר).
2. **בדוק מה כבר כתוב בריפו** על אותו רכיב (`grep -n` ב-`global-cdn.css` ו-`custom-footer.js`, ו-`tools/which-rule.mjs`) — **ומחליף**, לא מוסיף שכבה על שכבה. בלוקים ישנים נמחקים ובמקומם הערת הפניה.
3. **בנה מוק** מה-HTML שנלכד (עם ה-CSS של Hyperzod מ-`tools/hz/`) והרץ **בדיקות סגורות** במובייל (390×844) ובדסקטופ (1280), כולל בדיקת בקרה מחוץ לסקופ ובדיקה שרבעי הפיצה (`mhq-`) נשארו.
4. **רק אז push**, המתנה ל-GitHub Pages, **אימות חי** בסקריפט ללא ראש (מדידות + צילום), וצילום "אחרי" מהאתר החי לדוד.
5. עדכן את `DESIGN_METHOD.md` (אינדקס הבעלים, אטלס ה-DOM, המלכודות) אם למדת משהו.

## כללי ברזל
- **סקופ הדוק**: כל סלקטור תחת עוגן ייחודי (`html body #id …` / `html body .product-popup …`) עם `!important`. שום דבר גלובלי. בדיקת בקרה מוכיחה שלא זלג.
- **בעלים אחד לכל רכיב**: אין תיקון על תיקון. אם דוד מבקש "עוד תיקון" — מחליפים את הבלוק.
- **לא נוגעים** בבורר רבעי הפיצה (`mhq-` ב-CSS, "Pizza Quarters" ב-JS).
- **אסור** `data-v-*` בסלקטורים (משתנה בכל build של Hyperzod) ו-`:has(input:checked)` למצב נבחר (ספארי לא מרענן).
- **מגע**: hover רק ב-`@media (hover: hover)`.
- **JS**: כל בלוק IIFE, ריצה-אחת (`window.__MH_X__`), נכשל-פתוח, חושף `window.MH_X.stats()`.
- **כסף** (צ'ק-אאוט, תשלום, מחירים): אפס טעויות. שינוי **התנהגות** (מה נבחר אוטומטית, מה חובה, מה נגבה) דורש אישור של דוד; שינוי עיצוב — לא.
- `node --check custom-footer.js` לפני כל commit. שגיאת תחביר אחת מפילה את כל הבלוקים באתר.
- כל בלוק מסתיים בסמן `/* mh-<name>-v1 */` — זה מה שבודקים ב-curl אחרי הדיפלוי.
- לא לדחוף עשרות פעמים ביום: כל push בונה artifact של כל הריפו (סרטונים) ב-GitHub Actions.

## שפת העיצוב
Liquid Glass (זכוכית לבנה שקופה עם blur) + אדום QLED: `#e31e24`, גרדיאנט `linear-gradient(135deg, #ff3b41 0%, #c8151b 100%)`, טקסט אדום כהה `#c8151b`, גלולות ברדיוס 999, כרטיסים לבנים ברדיוס 14–18. האסימונים המלאים ב-`DESIGN_METHOD.md` §8. האדום מושקע במקום אחד בכל מסך (הפריט הפעיל / כפתור הפעולה).

## הכלים (Node 20, בלי חבילות)
```bash
sh tools/fetch-hz-css.sh                                                    # CSS עדכני של Hyperzod ל-tools/hz (למוקים)
node --experimental-websocket tools/capture-dom.mjs "<url>" "<selector>" work/<name> --mobile [--spa=<js>] [--scroll=<px>]
node --experimental-websocket tools/which-rule.mjs "<url>" "<selector>" "background-color,border-radius" [--mobile]
cp tools/test-template.mjs work/<name>/test.mjs   # ואז ממלאים אסרטים; הרצה: node --experimental-websocket work/<name>/test.mjs
```
- `tools/cdp.mjs` = Chrome ללא ראש דרך CDP (`openChrome(port, profile)` → `send / evalJs / goto / close`).
- דף החיפוש נפתח רק בניווט SPA: `--spa="document.querySelector('#app').__vue_app__.config.globalProperties.$router.push({name:'search',query:{q:'וופל'}})"`.
- דף עסק גולל בתוך `.merchant-page` (לא window) — `--scroll=1400` למצב הדביק.
- פופאפ "10% הנחה" פתוח בכל טעינה — הכלים מסירים אותו (`.v-overlay--active`).
- הדפדפן של דוד (Chrome MCP) לא מתאים ללמידה: חותך פלט, חוסם URL/base64, וכשהחלון ברקע הטאב קפוא. משתמשים בו רק למה שדורש את החשבון שלו.

## דחיפה ואימות
```bash
node --check custom-footer.js
git add global-cdn.css custom-footer.js
git -c user.name=davidebug10 -c user.email=davidpoho10@gmail.com commit -m "<רכיב>: <מה השתנה> (MH <Name> vX.Y.Z)"
git push origin main
for i in $(seq 1 30); do curl -s -H 'Cache-Control: no-cache' https://davidebug10.github.io/maale-css/global-cdn.css | grep -c 'mh-<name>-v1' && break; sleep 10; done
```
האתר מתעדכן תוך 60–100 שניות. הדפדפן/האפליקציה של הלקוח שומרים את הקבצים עד 10 דקות — לבקש מדוד "לסגור ולפתוח את האפליקציה" לפני שהוא בודק.

## דיווח לדוד
עברית עסקית, בלי ז'רגון: מה היה → מה השתנה → מה נבדק → מה נשאר לו לבדוק בטלפון (הוא הבודק הסופי, בעיקר לספארי באייפון). צילום "אחרי" מהאתר החי. לומר בכנות מה לא אומת.
