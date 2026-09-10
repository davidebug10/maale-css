# מתודולוגיית עיצוב — מעלה המשלוחים (Hyperzod) · הריפו maale-css

מסמך פתיחה לסשן חדש: כל מה שצריך כדי לקבל צילום מסך והסבר מדוד, ולהוציא עיצוב בדוק לאוויר — בלי לגלות מחדש את מה שכבר למדנו.
נכתב 7.9.2026 אחרי סבב עיצובים גדול (צ'ק-אאוט, פופאפ מוצר, רשימת אופציות, דף חיפוש, סרגל קטגוריות, SEO). עדכן אותו בכל פעם שלומדים משהו חדש.

---

## 0. התמצית (לקרוא גם אם ממהרים)

1. **האתר** הוא חנות Hyperzod (Vue 3 + Vuetify 3 + Tailwind עם תחילית `tw-`, SPA עם SSR של ה-head בלבד) בכתובת https://www.maalehamishlohim.co.il. אין לנו גישה לקוד שלו — רק **CSS ו-JS שמוזרקים מבחוץ**, מהריפו הזה.
2. **שני קבצים חיים**: `global-cdn.css` (כל העיצוב) ו-`custom-footer.js` (התנהגויות). שניהם נטענים מ-GitHub Pages: `https://davidebug10.github.io/maale-css/<file>`. push ל-`main` = דיפלוי אוטומטי תוך ~60–100 שניות.
3. **שלושת הכללים של דוד**: (א) לפני כל שינוי קוראים מה כבר כתוב בריפו על אותו רכיב ומחליפים, לא מוסיפים שכבה על שכבה; (ב) כל שינוי נבדק בקונסולה פנימית (Chrome ללא ראש + מוק מה-HTML האמיתי) לפני push; (ג) סקופ הדוק — שום כלל לא זולג לרכיבים אחרים.
4. **שפת העיצוב**: "Liquid Glass" (זכוכית לבנה שקופה עם blur) + אדום QLED (`#e31e24`, גרדיאנט `#ff3b41 → #c8151b`). פירוט בסעיף 8.
5. **הכלים** יושבים ב-`tools/` (סעיף 5). הרצה: `node --experimental-websocket tools/<script>.mjs` (Node 20, בלי חבילות).

---

## 1. מפת הריפו

| קובץ / תיקייה | מה זה | איך נטען |
|---|---|---|
| `global-cdn.css` (~6,500 שורות) | כל העיצוב, מחולק ל"חלקים" ממוספרים עם כותרת בעברית | Hyperzod Admin → Theme → Custom CSS מכיל `@import url("https://davidebug10.github.io/maale-css/global-cdn.css")` |
| `custom-footer.js` | בלוקי JS עצמאיים (IIFE), כל אחד עם שם, גרסה ותאריך | Hyperzod Admin → Theme → Custom HTML Footer: `<script src="https://davidebug10.github.io/maale-css/custom-footer.js">` (הכותרת בקובץ מזכירה jsDelivr — לא בשימוש) |
| **שלושת האזורים בבונה הערכות** | Global / Web / **App** — לכל אחד Custom HTML Head, Custom HTML Footer ו-Custom CSS משלו | **גם App חייב להכיל את שתי שורות ההפניה** (ה-`@import` ב-Custom CSS ותג ה-`<script>` ב-Custom HTML Footer). זו הגדרה חד-פעמית: השדות מצביעים לקבצים בגיטהאב, ולכן כל שינוי עיצוב/התנהגות נעשה בגיטהאב בלבד, בלי לגעת בבונה הערכות. נוגעים בשדות רק אם משנים את כתובת הקבצים עצמה — ואז בשני האזורים. ב-10.9.2026, אחרי בילד חדש של Hyperzod, האפליקציה באייפון עלתה בלי שום CSS/JS בזמן שהדפדפן עבד: הדף שהאפליקציה טוענת (מהדומיין `xcfqtqgd.hyperzod.me`) נבנה מהאזור App, שהיה ריק. מילוי App פתר מיד. ה-boot API לא מכיל את הקוד המותאם בכלל — ההזרקה היא רק ב-HTML שהשרת מרכיב |
| `*.mp4`, `<business>/` | סרטוני הירו ותמונות של עסקים (מוזרקים בבלוקי Custom HTML בדפי העסקים) | URL ישיר ל-GitHub Pages |
| `tools/` | כלי הלמידה והבדיקה (סעיף 5) | מקומי בלבד |
| `DESIGN_METHOD.md`, `CLAUDE.md` | המסמך הזה + הוראות לסשן | — |

### 1.1 אינדקס הבלוקים ב-`global-cdn.css` — מי הבעלים של מה (7.9.2026)

חפש לפי הכותרת (`grep -n 'חלק'`). בעלים = הבלוק היחיד שמותר לו לעצב את הרכיב.

| רכיב | הבעלים | הערות |
|---|---|---|
| הדר דף הבית + שורת חיפוש + התכווצות בגלילה | "חלק 2+3 חדש: HEADER LIQUID GLASS V3" (+ `mh-scrolled` על body מ-custom-footer.js) | לא נוגעים כשעובדים על דפי עסק |
| חלוניות תחתונות בצ'ק-אאוט (סיכום הזמנה) | הבלוק הגנרי `.v-bottom-sheet__content …` (~שורה 893) | **זולג** לכל v-card בתוך bottom-sheet — לנטרל לוקאלית (ראה 22י) |
| כפתורי "הוספה" בכרטיסי מוצר | `html body .v-btn.add-btn …` (~שורה 117) | גלובלי; הפופאפ דורס אותו; בכרטיסי הגריד/הקרוסלה/דף הבית חלק 40 דורס אותו (כפתור עגול אייקון בלבד) |
| כרטיסי מוצר (גריד בדף העסק, קרוסלה, קרוסלות דף הבית #ProductHighlights) | "חלק 40: MH Cards" | חלקים 18–20 הוסרו 10.9. **לא נוגעים בגודל .product-image** — Hyperzod ממלאת את .product-image-frame לבד |
| דף חיפוש גלובלי (תוצאות) | "חלק 26ב: MH Search" (בסוף הקובץ) | סקופ `main#MultiVendorSearch`; חלק 26 הישן = הדר החיפוש בלבד; חלק 30 הוסר |
| רשימת האופציות בפופאפ מוצר | "חלק 22ט: MH Options" | + JS `MH Options` |
| פופאפ המוצר (מעטפת, הדר, תמונה, זהות, פוטר) | "חלק 22י: MH Product" | 22א–22ח הוסרו |
| בורר רבעי פיצה | "בורר רבעי פיצה — Pizza Quarters" (`mhq-`) + JS "Pizza Quarters" | **לא נוגעים**; יש בדיקה שסופרת שהכללים נשארו |
| סרגל הקטגוריות בדף העסק | "חלק 33: MH CatNav" | + JS `MH CatNav` |
| מפת הקטגוריות (חנויות עם 8+ קטגוריות) | "חלק 38: MH CatMap" | + JS `MH CatMap`. תוספת לחלק 33, לא החלפה — הסרגל האופקי נשאר |
| טעינת כל דפי התפריט (15+ קטגוריות) | JS בלבד: `MH MenuLoad` | אין CSS. קורא ל-`loadMore()` של Hyperzod עד דף חלקי |
| "הצג עוד" בקטגוריה חתוכה (is_paginated) | "חלק 39: MH ShowMore" | + JS `MH ShowMore`. סקופ `#merchant-content button.mh-more` |
| אמצעי תשלום בצ'ק-אאוט | "Part 8h (v2): MH Pay" | + JS `MH Pay`, `MH Pay NoPreselect`, `MH PayIntent` |
| קופונים בצ'ק-אאוט | "mh-coupon-v2" | |
| סרגל ניווט תחתון | "חלק 31" | |

### 1.2 בלוקי ה-JS ב-`custom-footer.js`

כל בלוק: IIFE, `'use strict'`, שומר ריצה-אחת (`window.__MH_X__`), נכשל-פתוח (try/catch, בלי לזרוק), חושף `window.MH_X = { version, stats() }` לבדיקות. רשימה: בחירת ישראל בכתובת · MH-ZONE (אזור משלוח) · MH Preorder (הזמנה מראש) · MH SEO · Pizza Quarters (`__mhq`) · MH Pay (סימון אמצעי תשלום נבחר) · MH PayIntent (מילוי country בבקשת התשלום) · MH Pay NoPreselect (ביטול סימון אוטומטי של אמצעי התשלום האחרון) · MH Search (טקסטים בדף החיפוש) · MH Options (`mh-opt-on` על אופציה נבחרת) · MH CatNav (`swiper.update()`) · MH CatMap (מפת קטגוריות, v1.1.2 9.9) · MH MenuLoad (טעינת כל דפי התפריט, v1.0.0 10.9) · MH ShowMore ("הצג עוד" בקטגוריה חתוכה, v1.0.1 10.9) · MH Lang (תרגום מחרוזות שחסרות בחבילת השפה — "Customizable"→"ניתן להתאמה", v1.0.0 10.9) · MH AgeGate (`window.MH_AGEGATE`, שער 18+; v1.2.0 9.9). שתי דרכי חסימה מצומצמות: (א) `RESTRICTED` — 16 שמות קטגוריה **מדויקים** (התאמה מלאה, לא הכלה), עובד גם בדף החיפוש; (ב) `AGE_MERCHANTS` — חנויות שכל המלאי בהן 18+, לפי **מזהה החנות ב-URL** בלבד (כרגע גואה `6aa076d67a4248e3ff053582`). (ב) שורד שינוי שמות קטגוריות אצל המסעדן ולא יכול לדלוף לחנות אחרת.

**הרחבת השער 18+ לחנות חדשה (9.9):** לפני הוספת שם קטגוריה ל-`RESTRICTED` — לאסוף את שמות הקטגוריות של **כל** החנויות (`#ProductCategoriesSlider a`) ולוודא שהשם לא קיים באף חנות אחרת; ההתאמה היא מלאה, אז שם שמופיע פעמיים יחסום גם אוכל. חנות שכולה 18+ עדיף לסמן ב-`AGE_MERCHANTS` לפי מזהה, לא לפרט קטגוריות — זה שורד שינוי שמות. בדיקת אי-דליפה: מזריקים את **אותו** בלוק קטגוריה סינתטי עם `button.add-btn` גם בחנות המוגבלת וגם בחנות אוכל, ומוודאים GATED מול OPEN. חנות עם `is_accepting_orders:false` (למשל גואה עד הפתיחה) **לא מרנדרת** `button.add-btn` כלל — אי אפשר לבדוק עליה לחיצה אמיתית, רק בהזרקה.

**סרגל קטגוריות בחנות גדולה (9.9):** נמדד — גואה 15 קטגוריות = רוחב סרגל 1906px מול מסך 390px (פי 4.9, כ-7 החלקות אצבע); מחניודה פי 3.5; בנ'ס 6 קטגוריות = פי 1.5 (תקין). NN/g קובעים: <6 אקורדיון, 6–15 תפריט סקשן, **15+ שכבת קטגוריות ייעודית**; Smashing: עד 5 פריטים בסרגל דביק. Wolt מיישמת Priority+ ("עוד (16)") בדסקטופ בלבד ונופלת לגלילה אופקית במובייל; שופרסל משתמשת ב-drawer. **סרגל צד אנכי נפסל** — לא נמצאה אף אפליקציית משלוחים שמשתמשת בו, ובמסך 390 הוא עולה רבע מהרוחב. הפתרון שנבחר: MH CatMap (חלק 38).

**באג של Hyperzod (9.9, אומת בלי שום קוד שלנו):** אחרי גלילה עמוקה בחנות אחת וטעינה **מלאה** של חנות אחרת באותו טאב, לחיצה על גלולת קטגוריה **לא מזיזה את הדף בכלל** — vue-scrollactive לא מגיב, ובמצב הזה גם `scrollTo` עם `behavior:'smooth'` מבוטל (גלילה מיידית כן עובדת). ניווט SPA בין חנויות תקין. MH CatMap עוקף את זה בגיבוי: חצי שנייה אחרי הלחיצה, אם הגלילה לא זזה אפילו פיקסל — קפיצה מיידית לעוגן, ואז תיקון מיקום אחד אחרי 260ms (תמונות עצלות מזיזות את הפריסה אחרי קפיצה של ~25,000px).

**התפריט של Hyperzod נטען בדפים (10.9):** `GET /store/v1/merchant/menu?page=N` מחזיר עד 15 קטגוריות (`max_categories_per_page`). את הדף הבא מבקש רכיב `v3-infinite-loading` עם IntersectionObserver על זקיף בתחתית, ואחרי הצלחה Hyperzod **לא קוראת** `state.loaded()` — הזקיף צריך לצאת ולהיכנס מחדש. בכרום ללא ראש `scrollTo(scrollHeight)` לא מפעיל אותו בכלל (רק מחוות מגע), ודוד דיווח על טלפונים שבהם גם גלילה לסוף לא מביאה את דף 2. בגואה: 15 מתוך 28 קטגוריות. MH MenuLoad מוצא את רכיב `merchant-page` (הליכה מ-`#app._vnode` — ב-production אין `__vueParentComponent` ואין `app._instance`) וקורא בעצמו ל-`proxy.loadMore()` כל עוד `count === page × 15`. `updateCategoryProducts` של Hyperzod מסננת כפילויות לפי `_id`. חנות עם פחות מ-15 בדף 1 — אפס קריאות.

**מוצרים בקטגוריה חתוכים ל-20 (10.9, נפתר ב-MH ShowMore):** כל קטגוריה מגיעה עם עד 20 מוצרים; `is_paginated` הוא דגל **מדויק** (בסקר 11 חנויות: true בדיוק ב-14 הקטגוריות עם יותר מ-20, false בקטגוריות של בדיוק 20). הבאנדל לא קורא אותו, אין "הצג הכל", וגם דף הקטגוריה (`/category/:cateId`) מציג 20. סה"כ 230 מוצרים מוסתרים ב-4 חנויות (גואה 7 קטגוריות, מחניודה 3, רולדין 3, פטריקס 1). הפתרון: כפתור `button.mh-more` בתחתית `.special-listing-inner`; לחיצה → `Search.getProductsByCategory({product_category_id, merchant_id, locale, page})` → דחיפה ל-`category_products` של הקטגוריה ב-`store.state.Merchant.categoryProducts` (הפרוקסי הריאקטיבי) → Vue מצייר באותו רכיב, כרטיסים זהים (אומת: מחלקות, רוחב, רדיוס, רקע, צל, גופנים). מוצרי ה-API חסרים `product_options` (הכרטיס משתמש ב-`has_product_options`, שקיים) — משלימים `[]`. עצירה כש-`products.next_page_url` ריק. הקרוסלה (view_type=card) היא `.slider-inner-container` עם overflow-x טבעי, לא Swiper. השער 18+ תופס גם כרטיסים שנוספו (אומת חי במחניודה). Hyperzod מציירת בקטגוריה מסומנת גם `div.scheme-pb-view-all` ("צפה בהכל") שמוביל לדף הקטגוריה — דרך ללא מוצא (20 בלבד); MH ShowMore שם `mh-has-more` על הסקשן וה-CSS מסתיר את הקישור ואת שורת הגריד שלו רק שם.

**Hyperzod החליפה בילד ובנתה מחדש את כרטיס המוצר (10.9, index-C04UkX5H):** הכרטיס עכשיו שקוף, התמונה בתוך `.product-image-frame` ריבועית (aspect 1:1, רקע #f5f5f5, רדיוס 8), כפתור הוספה עגול אייקון-בלבד (`.grid-add-control`/`.carousel-add-control` → `.add-product-btn button.add-btn`, max-width 36 במובייל / 44 בדסקטופ), שורת `.product-description` ותג `.product-customizable-tag` שמגיע מ-`getLug().common.customizable||"Customizable"` — המפתח לא קיים בחבילה. הכללים הישנים שלנו (חלק 18: `.merchant-page .product-image{128px; absolute}`, חלק 19/20: זכוכית + תמונה 120/140px) חתכו את התמונה ל-128px בתוך מסגרת 173 והשאירו פס אפור. **הדרך לאבחן**: לטעון את הדף עם `Network.setBlockedURLs(['*global-cdn.css*'])` ולהשוות מדידות — בלי ה-CSS שלנו התמונה מילאה את המסגרת. **לקח**: כלל גנרי כמו `.merchant-page .product-image` (בלי עוגן של סוג הכרטיס) שורד כל build ומכה בכל מבנה חדש. הקרוסלה `.product-card-slider` יושבת ב-`.slider-inner-container` (גלילה טבעית). דף הבית: 11 קרוסלות `#ProductHighlights` עם אותו רכיב כרטיס בעטיפה 140×232, שם המסגרת אינה ריבועית (Hyperzod). המחרוזות עם fallback אנגלי בבילד: common.customizable (חסר), addToCart/MerchantTip/days/ValidFor/ViewPlanDetails (מתורגמים). לפני כל עבודה על כרטיסים: `curl -s .../he/home | grep -o 'index-[^"]*\.js'` ולהשוות ל-`tools/hz`.

**מלכודת (9.9):** כל בלוק הוא IIFE נפרד — פונקציה של בלוק אחד (למשל `pizzaRoot` של רבעי הפיצה) לא נגישה מבלוק אחר; קריאה כזו נכשלת רק בזמן הלחיצה (ReferenceError שקט), `node --check` לא תופס. השער 18+ היה שבור מ-1.9 עד 9.9 מהסיבה הזאת. לכן: בדיקה חיה של הוספה **מהכרטיס** (רשת + קרוסלה) **וגם מהפופאפ** אחרי כל שינוי בפוטר (`scratchpad/10bis/gate/live-test.mjs` כתבנית), ובכל בלוק `try/catch` סביב הלוגיקה של המאזין.

---

## 2. דיפלוי ואימות

```bash
cd ~/maale-css
git add global-cdn.css custom-footer.js
git -c user.name=davidebug10 -c user.email=davidpoho10@gmail.com commit -m "..."
git push origin main
# המתנה ל-GitHub Pages (60–100 שנ'): מחפשים סמן ייחודי שהוספנו בסוף הבלוק, למשל /* mh-catnav-v1 */
for i in $(seq 1 30); do curl -s -H 'Cache-Control: no-cache' https://davidebug10.github.io/maale-css/global-cdn.css | grep -c 'mh-catnav-v1' && break; sleep 10; done
```

- כל בלוק מסתיים בהערת סמן (`/* mh-<name>-v1 */`) — זה מה שבודקים ב-curl.
- `node --check custom-footer.js` לפני כל commit; שגיאת תחביר אחת מפילה את **כל** הבלוקים.
- הדפדפן של הלקוח שומר את הקבצים עד 10 דקות (Pages: `max-age=600`). כשמבקשים מדוד לבדוק: "לסגור ולפתוח את האפליקציה".
- **עלות**: כל push בונה artifact של כל הריפו (~150MB בגלל הסרטונים) ב-GitHub Actions. יש תקציב Actions מוגדר; לא לדחוף עשרות פעמים ביום לחינם. פתרון ארוך טווח: להעביר CSS/JS לריפו נפרד (ראה בהיסטוריה 7.9).
- אימות חי אחרי כל דיפלוי: סקריפט ללא ראש שפותח את הדף האמיתי ומודד (סעיף 5.4). לא מסתפקים במוק.

---

## 3. עקרונות קוד (לא מתפשרים)

1. **סקופ**: כל סלקטור מתחיל בעוגן ייחודי של הרכיב: `html body #payment-card …`, `html body .product-popup …`, `html body main#MultiVendorSearch …`, `html body #ProductCategoriesNav …`. `html body` מוסיף ספציפיות מעל הכללים של Hyperzod; `!important` על כל מאפיין (Hyperzod משתמשת ב-!important ב-Tailwind).
2. **בעלים אחד לכל רכיב**: לפני כתיבה — `grep -n '<class or id>' global-cdn.css`. אם יש כללים ישנים: מוחקים אותם ומשאירים במקומם הערה "הועבר ל-חלק X (תאריך)". לא מוסיפים בלוק שדורס בלוק. הבדיקה של "מי מנצח" (`tools/which-rule.mjs`) חושפת כללים נסתרים (למשל `[data-color-scheme]` או בלוקים גנריים).
3. **כותרת בלוק** אחידה:
   ```css
   /* =========================================================
      חלק NN: <שם הרכיב> — MH <Name> v1.0.0 | YYYY-MM-DD — <שפת העיצוב>
      מחליף: <מה הוסר>   סקופ: <העוגן>   מצבים: <קלאסים שמייצגים מצב>
      ========================================================= */
   ```
4. **אסור** להישען על hash של Vue (`data-v-4e145e4c` וכד') — משתנה בכל build של Hyperzod (כלל הפוטר הישן של הפופאפ מת ככה). משתמשים ב-id, בקלאסים סמנטיים (`scheme-*`, `product-*`) ובקלאסי Vuetify.
5. **אסור** `:has(input:checked)` למצב "נבחר" — ספארי ב-iOS לא מרענן (המסגרת נתקעה על אופציה אחרת). משתמשים בקלאס של Vuetify (`.v-selection-control--dirty`) ובקלאס שה-JS שלנו מוסיף.
6. `:is(.mh-class, :has(...))` — רשימה סלחנית: דפדפן ישן בלי `:has` לא מפיל את הכלל כולו.
7. **מגע**: אפקטי hover רק בתוך `@media (hover: hover)`; לכבות `.v-list-item__overlay/underlay`, `.v-btn__overlay/underlay` (נדבקים אחרי נגיעה).
8. **תמונות**: `.v-img__img` הוא `z-index:-1` — רקע צבעוני על ההורה מסתיר את התמונה בלי `isolation: isolate`. `v-img` נטענת בעצלות — לבדוק רק אחרי `scrollIntoView`.
9. **קבוצות רדיו של Vuetify** הן shrink-to-fit (הרוחב לפי הטקסט) — לתת `width:100%` לקבוצה ולכרטיסים.
10. **Swiper** (סרגל הקטגוריות) מודד רוחבים בעת האתחול — אחרי שינוי CSS קוראים `el.swiper.update()` (בלוק MH CatNav).
11. **RTL**: `padding-inline-*`, `margin-inline-*`, `text-align:start`; "‹" הוא החץ שמצביע "קדימה" בעברית.
12. **JS**: משנים DOM כמה שפחות (קלאסים, טקסט, ערכי בקשה); MutationObserver מתוזמן (setTimeout 30–120ms), בלי לולאות (לשנות קלאס רק אם הוא באמת שונה — toggle "ריק" מפעיל observer).
13. **מה שקשור לכסף** (צ'ק-אאוט, תשלום, מחירים) — דוד אמר "אפס טעויות": בדיקות כפולות, ולשאול לפני שינוי התנהגות (עיצוב — לא צריך לשאול; התנהגות — כן).

---

## 4. תהליך העבודה (מצילום מסך ועד "חי")

1. **קריאה** — מבינים מדוד: איזה מסך, מה מפריע, מה הוא רוצה. אם יש ספק אמיתי — שאלה אחת ממוקדת; אחרת מתחילים.
2. **לכידה מהאתר החי** — `tools/capture-dom.mjs` (סעיף 5.2): outline, HTML מנוקה, שרשרת ההורים (position/overflow/padding) וצילום. בשני המצבים אם יש (למשל לפני/אחרי גלילה, נבחר/לא נבחר). אם המסך דורש התחברות (צ'ק-אאוט) — ראה סעיף 6.9.
3. **קריאת הריפו** — `grep -n` על ה-id/הקלאסים ב-`global-cdn.css` ו-`custom-footer.js`; `tools/which-rule.mjs` על המאפיינים המרכזיים כדי לראות אילו כללים תופסים היום. מחליטים מה מסירים.
4. **תכנון** — 5 שורות: פלטה, טיפוגרפיה, פריסה, מצבים, מה נשאר בחוץ. שומרים על שפת העיצוב (סעיף 8).
5. **מוק** — דף HTML מקומי: ה-HTML שנלכד + ה-CSS של Hyperzod (vendor + index, סעיף 5.3) + `@import` של `global-cdn.css` **מהעותק המקומי** + `custom-footer.js` המקומי. מוסיפים "בקרה": אותם קלאסים מחוץ לסקופ — חייבים להישאר כמו שהם. מדמים ב-JS את ההתנהגות של Vue (למשל החלפת `v-selection-control--dirty`, `is-active`, הסרת `tw-border-b-2` בגלילה).
6. **בדיקות** — סקריפט `test-<name>.mjs` על תבנית `tools/test-template.mjs`: מובייל 390×844 ודסקטופ 1280; מדידות (`getBoundingClientRect`, `getComputedStyle` כולל `::before/::after`), כל מצב, בקרת סקופ, `mhq` נשאר, בלי גלילה אופקית, בלי שגיאות JS. שמים לב לטיימינג של transitions (למדוד אחרי 300–450ms).
7. **מבט אחד** על צילומי המוק (Read על ה-PNG). לא לולאת שיפוצים — אם יש דבר בולט, מתקנים פעם אחת.
8. **push** → המתנה ל-Pages → **אימות חי** בסקריפט ללא ראש (מדידות + צילומים) — כולל תרחיש אמיתי (לחיצה על input של Vue, גלילה בתוך `.merchant-page`).
9. **דיווח לדוד** בעברית עסקית: מה היה, מה השתנה, מה נבדק, מה נשאר לו לבדוק בטלפון (הוא הבודק הסופי, במיוחד ספארי), צילום "אחרי" מהאתר החי (SendUserFile).
10. **תיעוד**: לעדכן את סעיף 1.1 (בעלים), את סעיף 6 (אטלס DOM) ואת סעיף 7 (מלכודות) אם למדנו משהו.

---

## 5. הכלים (`tools/`)

### 5.1 `cdp.mjs` — Chrome ללא ראש
```js
import { openChrome, sleep } from './cdp.mjs';
const c = await openChrome(9450, 'my-profile');      // פרופיל נקי תחת tools/.profiles/ (מחקו לפני ריצה אם רוצים "מבקר חדש")
await c.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await c.goto('https://www.maalehamishlohim.co.il/he/home', 8000);     // ה-SPA איטי: 6–12 שנ'
await c.evalJs(`document.querySelectorAll('.v-overlay--active').forEach(o=>o.remove())`); // פופאפ "10% הנחה" מסתיר הכול
const r = await c.send('Page.captureScreenshot', { format: 'png' });   // Buffer.from(r.result.data,'base64')
c.close();
```
- הרצה: `node --experimental-websocket <file>.mjs` (Node 20 — אין `ws`). כרום תקוע מריצה קודמת: `pkill -f 'my-profile'`.
- `evalJs` מחזיר ערך פשוט/JSON; אובייקטים של Vue (proxy) — `JSON.parse(JSON.stringify(x))` בתוך הדף.
- ניווט בתוך ה-SPA (למשל לדף החיפוש, שטעינה ישירה שלו מפנה הביתה): `document.querySelector('#app').__vue_app__.config.globalProperties.$router.push({name:'search', query:{q:'וופל'}})` ואז `sleep(6000)`.
- ה-store: `document.querySelector('#app').__vue_app__.config.globalProperties.$store` (getters: `getCartItems`, `getSelectedLocation`, `getBootSettings`, `paymentModes` …). ה-mixin הגלובלי `apiRequest` נגיש דרך `__vue_app__._context.mixins`.

### 5.2 `capture-dom.mjs` — לכידת רכיב מהאתר החי
`node --experimental-websocket tools/capture-dom.mjs "<url>" "<selector>" [out-dir] [--mobile] [--spa=<js>] [--scroll=<px>]`
שומר `outline.txt` (עץ תגים/קלאסים), `element.html` (URL-ים ו-base64 מנוקים), `parents.txt` (position/overflow/padding של ההורים — כאן מוצאים דליפות וסטיקי) ו-`screenshot.png`.

### 5.3 CSS של Hyperzod למוקים
```bash
curl -s https://www.maalehamishlohim.co.il/he/home | grep -o 'href="[^"]*\.css[^"]*"'   # vendor-vuetify-*.css, index-*.css (שמות משתנים בכל build)
curl -s <vendor url> -o tools/hz/vendor.css; curl -s <index url> -o tools/hz/index.css
```
במוק: `<link rel=stylesheet href="/hz/vendor.css">`, `<link … href="/hz/index.css">`, `<style>@import url("/maale/global-cdn.css");</style>`, ובסוף `<script src="/maale/custom-footer.js">`. ב-`index.css` יש גם כללי `[data-color-scheme]` (ערכת צבעים של Hyperzod, לא פעילה אצלנו) — לא מטעה.

### 5.4 `test-template.mjs` — שלד בדיקה
שרת סטטי (`/maale/*` מהריפו, `/hz/*` מ-`tools/hz`, השאר מהתיקייה), פתיחת כרום, `ok(name, cond, extra)`, צילומים, מובייל+דסקטופ, `process.exit(fail?1:0)`. מעתיקים לתיקיית עבודה ומוסיפים אסרטים.

### 5.5 `which-rule.mjs` — מי מנצח
`node --experimental-websocket tools/which-rule.mjs "<url>" "<selector>" "background-color,border-radius" [--mobile]` — מדפיס את כל הכללים (מכל הגיליונות, כולל @import) שתופסים את האלמנט לפי סדר, עם `!important`, ואת הערך המחושב. זה הכלי לפני שמוחקים/מחליפים בלוק.

### 5.7 סרטון הירו — המרה לפני שמעלים לריפו
כלי הווידאו של דוד (Seedance וכד') מוציאים **HEVC** עם `moov` בסוף הקובץ ובגודל 30MB+. HEVC לא מתנגן בכרום/אנדרואיד, ו-`moov` בסוף מונע התחלת נגינה לפני הורדה מלאה. אין `ffmpeg` במכונה — משתמשים ב-`avconvert` המובנה של macOS (H.264 + fast-start כברירת מחדל):
```bash
avconvert --source in.mp4 --preset Preset1920x1080 --output <business>-hero.mp4 --replace
```
בדיקה שהיציאה תקינה: סדר התיבות חייב להיות `ftyp, moov, mdat` (moov לפני mdat), והקודק `avc1` ולא `hvc1`. 30MB HEVC → ~9.6MB H.264 (מחניודה, 9.9.2026).

### 5.6 מה **לא** עובד
- **Chrome MCP** (הדפדפן של דוד): לא פותח localhost; חותך פלט (~1500 תווים); חוסם פלט עם `?`, `=`, `&`, base64 ו-URL (להחליף ל-`＝` וכד' לפני return); כשחלון הכרום של דוד ברקע הטאב **קפוא**: קוד סינכרוני רץ, אבל promises, XHR, לחיצות אמיתיות וצילומי מסך לא. לכן: למידה ובדיקות ב-Chrome ללא ראש; הדפדפן של דוד רק כשהוא פתוח ומול העיניים (למשל Search Console, צ'ק-אאוט עם החשבון שלו).
- `pdftoppm` לא מותקן → PDF קוראים עם PyMuPDF ב-venv (`python3 -m venv .venv && .venv/bin/pip install pymupdf`), או פותחים ב-Chrome ללא ראש (`file://…pdf`) ומצלמים.
- `sleep` ארוך ב-Bash חסום — משתמשים ב-`sleep` בתוך הסקריפטים או ב-Monitor.

---

## 6. אטלס ה-DOM של החנות (מה שאומת בפועל)

### 6.1 כללי
- `#app` → `.v-application` → `#app-router-view`. RTL: `.v-locale--is-rtl`.
- פופאפים/דיאלוגים: `.v-overlay.v-overlay--active` → `.v-overlay__content` (bottom-sheet: `.v-bottom-sheet__content`). פופאפ הורדת האפליקציה ("10% הנחה") פתוח בכל טעינה — להסיר בבדיקות.
- כפתורים: `.v-btn` עם `.v-btn__overlay/underlay`; רדיו/צ'קבוקס: `.v-selection-control` (+`--dirty` כשמסומן) → `__wrapper` → `__input` (i.v-icon + input).

### 6.2 דף עסק (`/he/m/<slug>/<id>`)
- הגלילה **בתוך** `#<merchantId>.merchant-page` (overflow-y auto), לא ב-window.
- הדר עליון של העסק (חיפוש/סינון/שם/חזרה) 53px. מתחתיו `#mobileStickyHeader.tw-sticky` (top 53px) → `#ProductCategoriesNav` (מקבל `tw-border-b-2` רק לפני הגלילה) → `#ProductCategoriesSlider.swiper` → `.swiper-slide.product-category-item` → `a.scrollactive-item` (`is-active` = הקטגוריה הנוכחית, מנוהל ע"י vue-scrollactive; `swiper-slide-active` הוא רק הסלייד שבמרכז — לא "נבחר").
- קטגוריות מוצרים: `view_type` של הקטגוריה קובע רינדור: `grid` (`.product-cards.merchant-grid-view`, `.product-card-basic`), `card` = קרוסלה (`.product-card-slider`), `list` (`.product-horizontal-cards.merchant-list-view`). כותרת קטגוריה: `.prod-sec-title`. כרטיס מוצר בקרוסלה: `.v-card.product-card-slider` עם `.product-image` (v-img עצלה).
- הירו של העסק: בלוק Custom HTML של דוד (`#mh-hero-<slug>`), סרטון H.264 מהריפו.

### 6.3 פופאפ מוצר (`.product-popup`, בתוך bottom-sheet)
`.product-popup.v-card` → `.v-card-title` (כפתור חזרה + שם) → `.v-card-text.custom-scroll` (הגלילה) → `.product-image-slider.v-carousel` → `.v-carousel-item` → `.v-img.image` (הריבוע הלבן = v-card פנימי) · `#productInfo` (`.product-category-name`, `.product-name`, `.product-price`, `#ProductDescription`) · `hr.v-divider` · `form#ProductPopupForm` → קבוצות: `.addon-heading h2` (+ `.tw-text-xs` "נדרש") + `.scheme-product-options-card > .v-list > .v-list-item` (רדיו `.v-radio`, צ'קבוקס `.v-checkbox-btn`; מחיר תוספת ב-`.tw-w-full > .tw-mt-1.5`) · כפתור "להראות יותר" `button.text-primary.tw-ms-3` · פוטר `.v-card-actions#add_to_cart_hide_from_mobile_app` (`button.add-btn`, `.product-quantity-control`, `.increment-btn/.decrement-btn`, `input#quantity`).
- **דליפה**: הבלוק הגנרי `.v-bottom-sheet__content .v-card { padding: 24px 20px }` נכנס לפופאפ — מנוטרל ב-22י.
- קלאס ה-hash `PsoOWFvvHqrtk1n` על שורות האופציות = של Hyperzod, לא בשימוש אצלנו.
- אימות "הוספה" בלי בחירה: Vuetify מציג "יש לבחור אפשרות אחת" מתחת לקבוצה; הפופאפ נשאר פתוח.

### 6.4 צ'ק-אאוט (`/he/checkout?cart_id=<id>` — בלי cart_id מפנה הביתה; דרך "המשך לתשלום" בעגלה)
`#checkout` → `#payment-opt.v-form` → `#payment-card` (h3.heading, `.payment-methods`, `.payment-method[data-test-id$="-cod"|"-custompg"]`, רדיו `.custom-v-radio`) · אזור כתובת `#AddressCard` · סוג הזמנה · קופונים `nav.scheme-coupon-panel` · פוטר `.place-order` (`.payment-method-name`). אמצעי תשלום: 39 = Grow (custompg), 3 = מזומן, 38 = "not_required" (ארנק מטבעות כיסה הכול; מסומן offline!). Hyperzod זוכרת אמצעי אחרון (`Payment.recentlySelectedPaymentMethod` ב-vuex) — מבוטל ע"י MH Pay NoPreselect.

### 6.5 דף חיפוש (`main#MultiVendorSearch`, ניווט רק ב-SPA)
הדר `.scheme-global-search-mobile-header` (`.mobile-search-input`), טאבים `.scheme-global-search-tabs` (`#search-product-tab`, `#search-merchant-tab` — הטקסט "מוצרs/חנותs" הוא באג ריבוי של Hyperzod, מצויר מחדש ב-CSS), תוכן `.tab-item-product` (מונה "N תוצאות", קבוצות `.scheme-global-search-product-group` עם `#SearchedMerchantRating`/`#SearchedMerchantAverageTimeAndDistance` ו-`.slider-inner-container > .tw-py-2 > .product-horizontal-card`) ו-`.tab-item-merchant` (כרטיסי חנויות `.merchant-card-title`, `#merchantDistance`; ריק = "No merchants found." באנגלית).

### 6.6 דף הבית
הדר `#MultiVendorHeader` / `div[data-v-…].bg-header_bg.tw-sticky` (ה-hash כאן היה יציב עד כה, אבל עדיף עוגנים אחרים), שורת חיפוש `.home-mobile-search-input`, כרטיסי חנויות. הגלילה בתוך `#MultiVendorHome`.

### 6.7 עגלה
מגירת עגלה עם `.multi-cart-card` לכל חנות ("המשך לתשלום"/"צפה בחנות"). Vuex נשמר ב-`localStorage.vuex` (User, Address, Cart, Payment, …).

### 6.8 טקסטים ותרגומים
חבילת השפה: `getBootSettings().language_client`. חלק מהמחרוזות **לא** בחבילה ("mins", "No merchants found.", ריבוי "s") — מתקנים ב-JS/CSS בסקופ הדף. "קילומטר"/"דֵרוּג" כן בחבילה (שינוי שם = גלובלי, לשאול את דוד).

### 6.9 כשצריך חשבון מחובר (צ'ק-אאוט)
בדפדפן של דוד (Chrome MCP) הוא מחובר; מוסיפים מוצר לעגלה בשבילו רק אם הוא יודע, ולא מבצעים הזמנה. לחלופין: לוכדים את ה-HTML פעם אחת ועובדים על מוק.

---

## 7. מלכודות שנתקלנו בהן (כדי לא לחזור עליהן)

| מלכודת | תסמין | פתרון |
|---|---|---|
| `:has(input:checked)` | מסגרת "נבחר" נתקעת באייפון | קלאס `--dirty` + קלאס מה-JS |
| hash `data-v-*` בסלקטור | הכלל מת בשקט אחרי build של Hyperzod | id / קלאסים סמנטיים |
| בלוק גנרי של bottom-sheet | ההדר של פופאפ המוצר מכווץ/צף | נטרול לוקאלי תחת `.product-popup` |
| Swiper מודד לפני ה-CSS | פריטים אחרונים לא נגישים | `el.swiper.update()` (MH CatNav) |
| קבוצת רדיו shrink-to-fit | רוחב כרטיסים משתנה לפי טקסט | `width:100%` לקבוצה ולכרטיסים |
| `.v-img__img{z-index:-1}` | תמונה נעלמת כשנותנים רקע להורה | `isolation:isolate` על ההורה |
| v-img עצלה | בדיקה רואה `img` בלי src | `scrollIntoView` ואז לבדוק |
| hover נדבק במגע | כרטיס נשאר "מודגש" | `@media (hover:hover)` + כיבוי overlay/underlay |
| transition + מדידה מיידית | ערכי צבע באמצע מעבר | להמתין 300–450ms במדידה |
| טאב ברקע בכרום של דוד | כלום לא זז, צילומים נכשלים | Chrome ללא ראש; לבקש מדוד לפתוח את החלון |
| GitHub Pages cache | דוד רואה גרסה ישנה | לסגור ולפתוח את האפליקציה; לבדוק ב-curl עם הסמן |
| סרטון הירו כמו שהוא מהטלפון/AI | הירו שחור באנדרואיד, או נטען שניות ארוכות | להמיר ל-H.264 עם fast-start (ראה 5.7). כלי AI מייצרים HEVC עם `moov` בסוף הקובץ |
| רוחב `100vw` של קרוסלת התמונה | תמונה גולשת 16px מהקצה | `width:auto` על `.product-image-slider` |
| `line-clamp` של Hyperzod | שמות ארוכים נחתכים | `-webkit-line-clamp: unset` בסקופ |
| `[TRUNCATED]`/`{}` מה-MCP | פלט ארוך/אסינכרוני | לשמור ב-`window.__rep` ולקרוא בפרוסות |

---

## 8. שפת העיצוב — Liquid Glass + אדום QLED

| אסימון | ערך |
|---|---|
| אדום מותג | `#e31e24` |
| גרדיאנט QLED (כפתורים, פריט פעיל, מחיר) | `linear-gradient(135deg, #ff3b41 0%, #c8151b 100%)` |
| אדום כהה לטקסט | `#c8151b` |
| זוהר אדום | `box-shadow: 0 6px 16px rgba(227,30,36,.32)` (כפתור), `0 10px 26px rgba(227,30,36,.32)` (CTA) |
| זכוכית (מעטפת) | `rgba(255,255,255,.86)` + `backdrop-filter: blur(40px) saturate(180%)` |
| זכוכית (סרגל/הדר) | `rgba(255,255,255,.72–.92)` + `blur(16–24px)` + קו תחתון `rgba(227,30,36,.12–.14)` |
| כרטיס לבן | `#fff`, מסגרת `1–1.5px #e5e7eb/#e6e8ec`, רדיוס 14–18px, צל `0 2px 8px rgba(0,0,0,.03)` |
| גלולה | רדיוס `999px`, גובה 34–38px, ריפוד `0 14px` |
| נבחר (כרטיס) | מסגרת `#e31e24` + רקע `#fff5f5` + `inset 0 0 0 1px #e31e24` |
| תג "נדרש"/קטגוריה | `rgba(227,30,36,.10)` + `#c8151b` + 11px/800 + רדיוס 999 |
| טקסט | כותרת 17–24px/800–900 `#111`; גוף 14–15px/600; משני 13px/600 `#6b7280`; תיאור 14px/500 `#555` |
| ריווח | כרטיסים 10–12px ביניהם; שוליים 14–16px; רדיוס מעטפת 30px למעלה |

עקרונות: להשקיע את האדום במקום אחד בכל מסך (הפריט הפעיל / ה-CTA), השאר לבן וזכוכית; בלי אימוג'י כאלמנט עיצובי; בלי צללים על הכול — רק על מה שצף.

---

## 9. עבודה מול דוד

- הוא בעל העסק, לא מתכנת. עברית, קצר, בלי ז'רגון. מה היה → מה השתנה → מה נבדק → מה נשאר לו לבדוק.
- צילומי "אחרי" מהאתר החי (SendUserFile), לא רק מהמוק.
- לומר בכנות מה **לא** אומת (למשל: התקלה של ספארי אפשר לאשר רק באייפון שלו).
- שינוי עיצוב — עושים; שינוי **התנהגות** (מה נבחר אוטומטית, מה חובה, מה נגבה) — שואלים לפני, אלא אם הוא ביקש במפורש.
- אם הוא מבקש "תיקון על תיקון" — מזכירים את הכלל ומחליפים את הבלוק הישן.

---

## 10. צ'ק-ליסט לפני push

- [ ] `grep` בריפו: אין כללים ישנים על אותו רכיב שנשארו פעילים (אם יש — הוסרו עם הערת הפניה)
- [ ] סקופ: כל סלקטור תחת עוגן ייחודי; בדיקת בקרה מחוץ לסקופ עברה
- [ ] בדיקות מובייל + דסקטופ ירוקות; כל המצבים; `mhq` נשאר; בלי גלילה אופקית
- [ ] `node --check custom-footer.js`; סוגריים מאוזנים ב-CSS (הקובץ ההיסטורי מכיל `}` אחד עודף — זה ידוע)
- [ ] סמן `/* mh-<name>-v1 */` בסוף הבלוק; כותרת בלוק מלאה
- [ ] אחרי push: curl לסמן, אימות חי ללא ראש, צילום לדוד, עדכון המסמך הזה
