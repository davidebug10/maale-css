/* ============================================================
   custom-footer.js - מעלה המשלוחים
   Loaded via jsDelivr CDN into Hyperzod HTML Footer field.
   Source URL: https://cdn.jsdelivr.net/gh/davidebug10/maale-css@main/custom-footer.js

   Each script wrapped in IIFE to prevent variable conflicts.
   Edit this file directly - changes go live within 1-5 minutes via CDN.
   For instant updates: https://www.jsdelivr.com/tools/purge
   ============================================================ */

/* ============================================================
   Custom Global Scripts - מעלה המשלוחים
   ============================================================ */

/* ✅ סקריפט #1: בחירת ישראל אוטומטית בטופס הוספת כתובת (גרסה משודרגת 2026-04-27) */
(function () {
  const COUNTRY = 'Israel';
  let isProcessing = false;

  function selectIsrael() {
    const input = document.querySelector('#country');
    if (!input) return;
    if (input.value && input.value.toLowerCase() === COUNTRY.toLowerCase()) {
      return;
    }
    if (isProcessing) return;
    isProcessing = true;

    const field = input.closest('.v-field');
    if (!field) {
      isProcessing = false;
      return;
    }
    const arrow = field.querySelector('.v-autocomplete__menu-icon');
    if (!arrow) {
      isProcessing = false;
      return;
    }

    arrow.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    arrow.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    arrow.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    setTimeout(() => {
      input.focus();
      input.value = COUNTRY;
      input.dispatchEvent(new InputEvent('input', { bubbles: true }));
    }, 80);

    const interval = setInterval(() => {
      const items = document.querySelectorAll(
        '.v-overlay-container .v-list-item'
      );
      for (const item of items) {
        if (
          item.textContent &&
          item.textContent.trim().toLowerCase() === COUNTRY.toLowerCase()
        ) {
          item.click();
          clearInterval(interval);
          isProcessing = false;
          return;
        }
      }
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      isProcessing = false;
    }, 4000);
  }

  document.addEventListener('focusin', (e) => {
    if (e.target && e.target.id === 'country') {
      setTimeout(selectIsrael, 50);
    }
  });

  new MutationObserver(() => {
    const input = document.querySelector('#country');
    if (input && (!input.value || input.value.toLowerCase() !== COUNTRY.toLowerCase())) {
      setTimeout(selectIsrael, 100);
    }
  }).observe(document.body, {
    childList: true,
    subtree: true
  });
})();


/* ✅ סקריפט #2: כפתור "דברו איתנו" בתפריט החשבון */
(function() {
    function injectContactLink() {
        var navList = document.querySelector('#ProfileSideBar .navigation-list');
        if (!navList) return false;
        if (document.getElementById('mh-contact-link')) return true;

        var link = document.createElement('a');
        link.id = 'mh-contact-link';
        link.href = '/he/page/contact-us';
        link.className = 'v-list-item v-list-item--link rounded-lg navigation-item tw-my-4';
        link.setAttribute('role', 'link');
        link.style.cssText = 'display:flex;align-items:center;padding:14px 16px;text-decoration:none;color:inherit;border:1px solid rgba(227,30,36,0.2);border-radius:16px;background:rgba(255,255,255,0.5);backdrop-filter:blur(15px);-webkit-backdrop-filter:blur(15px);box-shadow:0 4px 15px rgba(227,30,36,0.08);margin-top:16px;margin-bottom:16px;transition:all 0.3s ease;position:relative;overflow:hidden;cursor:pointer;';

        link.innerHTML =
            '<div class="v-list-item__prepend">' +
                '<div class="tw-me-3" style="display:flex;align-items:center;justify-content:center;font-size:22px;width:24px;height:24px;">📬</div>' +
            '</div>' +
            '<div class="v-list-item__content">' +
                '<div class="v-list-item-title nav-text" style="font-weight:800;font-size:14px;color:#1a1a1a;">דברו איתנו</div>' +
            '</div>' +
            '<div style="margin-right:auto;font-size:20px;color:#e31e24;font-weight:900;">‹</div>';

        navList.insertBefore(link, navList.firstChild);
        return true;
    }

    function tryInject() {
        if (injectContactLink()) return;
        var attempts = 0;
        var iv = setInterval(function() {
            attempts++;
            if (injectContactLink() || attempts > 60) clearInterval(iv);
        }, 250);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInject);
    } else {
        tryInject();
    }

    new MutationObserver(function() {
        if (document.querySelector('#ProfileSideBar .navigation-list') &&
            !document.getElementById('mh-contact-link')) {
            injectContactLink();
        }
    }).observe(document.body, { childList: true, subtree: true });
})();

/* =========================================================
   Header Scroll State Manager
   תאריך: 2026-05-01
   מטרה: מוסיף/מסיר class "mh-scrolled" על body כשהמשתמש גולל
   חשוב: הגלילה ב-Hyperzod קורית על #MultiVendorHome (Vue SPA),
          לא על window - לכן ה-listener חייב להיות על האלמנט הזה
   ========================================================= */
(function() {
    'use strict';

    var SCROLL_THRESHOLD = 30;
    var ticking = false;
    var currentContainer = null;

    function updateScrollState() {
        if (!currentContainer) {
            ticking = false;
            return;
        }
        var scrolled = currentContainer.scrollTop > SCROLL_THRESHOLD;
        document.body.classList.toggle('mh-scrolled', scrolled);
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollState);
            ticking = true;
        }
    }

    function attachToContainer() {
        var container = document.getElementById('MultiVendorHome');

        // אם הcontainer לא השתנה - אל תעשה כלום
        if (container === currentContainer) return;

        // נתק listener ישן אם היה
        if (currentContainer) {
            currentContainer.removeEventListener('scroll', onScroll);
        }

        currentContainer = container;

        if (container) {
            container.addEventListener('scroll', onScroll, { passive: true });
            updateScrollState();
        } else {
            // לא בדף הבית - הסר את הclass
            document.body.classList.remove('mh-scrolled');
        }
    }

    // בדיקה ראשונית
    attachToContainer();

    // Vue SPA - האזנה לשינויי DOM כדי לתפוס מעבר בין דפים
    var observer = new MutationObserver(function() {
        attachToContainer();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

/* =========================================================
   SVG Gradient Defs Injector
   תאריך: 2026-05-01
   מטרה: מזריק SVG <defs> עם גרדיאנט "mh-grad-red-pink"
          כדי שאייקוני ההדר (מיקום, פילטר) יקבלו fill בגרדיאנט אדום->ורוד
   ========================================================= */
(function() {
    'use strict';

    function injectSvgGradients() {
        if (document.getElementById('mh-svg-grads')) return;

        var svgNS = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(svgNS, 'svg');
        svg.id = 'mh-svg-grads';
        svg.setAttribute('width', '0');
        svg.setAttribute('height', '0');
        svg.setAttribute('aria-hidden', 'true');
        svg.style.position = 'absolute';
        svg.style.width = '0';
        svg.style.height = '0';
        svg.style.overflow = 'hidden';

        var defs = document.createElementNS(svgNS, 'defs');

        var gradient = document.createElementNS(svgNS, 'linearGradient');
        gradient.setAttribute('id', 'mh-grad-red-pink');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');

        var stop1 = document.createElementNS(svgNS, 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#e31e24');

        var stop2 = document.createElementNS(svgNS, 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#e75480');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.appendChild(defs);

        if (document.body) {
            document.body.appendChild(svg);
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                document.body.appendChild(svg);
            });
        }
    }

    // ניסיון מיידי
    injectSvgGradients();

    // נסיון נוסף אחרי load (במקרה שה-body לא היה מוכן)
    if (document.readyState !== 'complete') {
        window.addEventListener('load', injectSvgGradients);
    }
})();

/* =========================================================
   Bottom Nav - Selective Anti-Vibrate
   תאריך: 2026-05-01
   מטרה: ביטול הרטט רק בלחיצה על הסרגל התחתון
   הגישה: שמירת הפונקציות המקוריות, החלפה ל-noop ל-200ms בלחיצה,
          ואז החזרה למקור - כך ששאר האפליקציה (עגלה, הזמנה) ימשיך לרטוט רגיל
   ========================================================= */
(function() {
  // פונקציה ריקה
  function noop() { return false; }

  // המתנה ב-DOMContentLoaded כדי שהפונקציות הנייטיב יהיו זמינות
  function init() {
    // שמירת הפונקציות המקוריות (Hyperzod native bridges)
    if (typeof window.nativeVibrateShort === 'function' && !window.__mhOriginalVibrateShort) {
      window.__mhOriginalVibrateShort = window.nativeVibrateShort;
    }
    if (typeof window.nativeVibrateLong === 'function' && !window.__mhOriginalVibrateLong) {
      window.__mhOriginalVibrateLong = window.nativeVibrateLong;
    }

    function suppressVibration() {
      // דריסה זמנית
      if (window.__mhOriginalVibrateShort) {
        window.nativeVibrateShort = noop;
      }
      if (window.__mhOriginalVibrateLong) {
        window.nativeVibrateLong = noop;
      }

      // החזרה למקור אחרי 200ms
      setTimeout(function() {
        if (window.__mhOriginalVibrateShort) {
          window.nativeVibrateShort = window.__mhOriginalVibrateShort;
        }
        if (window.__mhOriginalVibrateLong) {
          window.nativeVibrateLong = window.__mhOriginalVibrateLong;
        }
      }, 200);
    }

    function handler(e) {
      var btn = e.target.closest('#MultiVendorBottomNav .floating-frosted-btn');
      if (btn) {
        suppressVibration();
      }
    }

    // האזנה בשלב capture - לפני ש-Vuetify יקרא ל-vibrate
    document.addEventListener('pointerdown', handler, true);
    document.addEventListener('touchstart', handler, { capture: true, passive: true });
    document.addEventListener('mousedown', handler, true);
  }

  // הרצה כשה-DOM מוכן
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ניסיון נוסף אחרי שנייה - אם הפונקציות הנייטיב עוד לא היו זמינות
  setTimeout(init, 1000);
})();

/* Bottom Nav - Sliding Active Indicator + Material Ripple (1.5.2026) — הוחלפו ע"י הבלוק "MH NavGlass" בסוף הקובץ (28.9.2026). */

/* === Maale: merchant hero video autoplay fix (.mhh-video) | 2026-06-20 === */
(function () {
  // 1) hide the iOS native center play-button overlay on our hero video only
  var st = document.createElement('style');
  st.textContent = '.mhh-video::-webkit-media-controls-start-playback-button{display:none !important;-webkit-appearance:none !important}.mhh-video::-webkit-media-controls{display:none !important}';
  document.head.appendChild(st);

  // 2) force autoplay (iOS needs the muted PROPERTY + play() retried when data is ready)
  function play(v) {
    if (!v) return;
    v.muted = true; v.defaultMuted = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
  }
  function setup(v) {
    if (!v || v.dataset.mhhKick) return;
    v.dataset.mhhKick = '1';
    play(v);
    ['loadedmetadata', 'loadeddata', 'canplay'].forEach(function (e) {
      v.addEventListener(e, function () { play(v); });
    });
  }
  function scan() { var v = document.querySelector('.mhh-video'); if (v) setup(v); }
  scan();
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  ['touchstart', 'pointerdown', 'click'].forEach(function (ev) {
    document.addEventListener(ev, function () {
      var v = document.querySelector('.mhh-video'); if (v && v.paused) play(v);
    }, { passive: true });
  });
})();

/* =========================================================
   Platform Detection - תיוג פלטפורמה על תגית <html>
   תאריך: 2026-06-27
   מטרה: מוסיף class לתגית <html> לפי סביבת ההרצה:
         mh-android-app  = אפליקציית אנדרואיד (WebView)
         mh-ios-app      = אפליקציית אייפון (WKWebView)
         כך ניתן לכוון CSS לפלטפורמה אחת בלבד.
   הערה: nativeVibrateShort אינו אמין לזיהוי (מוזרק גם בדפדפן iOS).
   ========================================================= */
(function() {
  'use strict';
  var html = document.documentElement;
  var ua = navigator.userAgent || '';

  // אפליקציית אייפון - WKWebView חושף את window.webkit.messageHandlers
  var isIOSApp = !!(window.webkit && window.webkit.messageHandlers);

  // אפליקציית אנדרואיד - ה-User Agent של WebView מכיל "wv"
  var isAndroidApp = /wv/i.test(ua);

  if (isAndroidApp) { html.classList.add('mh-android-app'); }
  if (isIOSApp) { html.classList.add('mh-ios-app'); }
})();

/* =========================================================
   Welcome Page - Terms acceptance sentence + Terms popup
   Date: 2026-06-27
   מזריק משפט אישור תקנון מתחת לכפתורים בדף ההתחברות,
   ופותח את דף התקנון החי כפופאפ (iframe).
   מסתיר את .back-btn רק בתוך ה-iframe הזה (לא דולף החוצה).
   MutationObserver לתמיכת SPA. ה-CSS מוגדר ב-global-cdn.css.
   ========================================================= */
(function(){
  function injectTerms(){
    const form = document.getElementById('Phone');
    if(!form || document.getElementById('mh-terms-row')) return;
    const buttons = [...form.querySelectorAll('button')];
    const skipBtn = buttons.find(b=>b.textContent.trim()==='דלג');
    const anchor = skipBtn || buttons.find(b=>b.classList.contains('login-btn'));
    if(!anchor) return;

    const row = document.createElement('div');
    row.id = 'mh-terms-row';
    row.innerHTML = 'בלחיצה על "המשך" את/ה מאשר/ת שקראת והסכמת ל<span id="mh-terms-link">תקנון האתר</span>';
    anchor.parentElement.appendChild(row);

    row.querySelector('#mh-terms-link').addEventListener('click', function(){
      document.getElementById('mh-terms-modal')?.remove();
      const m = document.createElement('div');
      m.id = 'mh-terms-modal';
      m.innerHTML =
        '<div id="mh-terms-box">'+
          '<div id="mh-terms-head"><h3>תקנון השימוש</h3><button id="mh-terms-x" aria-label="close">&times;</button></div>'+
          '<div id="mh-terms-frame-wrap">'+
            '<iframe id="mh-terms-frame" src="https://www.maalehamishlohim.co.il/he/page/takanon"></iframe>'+
            '<div id="mh-terms-cover" aria-hidden="true"></div>'+
          '</div>'+
          '<button id="mh-terms-accept">סגור</button>'+
        '</div>';
      document.body.appendChild(m);
      requestAnimationFrame(()=>m.classList.add('show'));

      const close = ()=>{ m.classList.remove('show'); setTimeout(()=>m.remove(),300); };
      m.querySelector('#mh-terms-x').onclick = close;
      m.querySelector('#mh-terms-accept').onclick = close;
      m.onclick = e=>{ if(e.target===m) close(); };
    });
  }

  const mo = new MutationObserver(function(){
    requestAnimationFrame(injectTerms);
  });
  mo.observe(document.body, {childList:true, subtree:true});
  injectTerms();
})();


/* =========================================================
   Login OTP - Numeric keyboard + iOS autofill attributes
   Date: 2026-06-27
   מוסיף לשדה #loginOTP את התכונות:
   - inputmode="numeric"  -> מקלדת ספרות בלבד (iOS + Android)
   - autocomplete="one-time-code" -> הצעת מילוי אוטומטי באייפון
   - pattern="[0-9]*" -> חיזוק ל-iOS ישנים (הטופס novalidate, בטוח)
   MutationObserver כי שדה ה-OTP נוצר דינמית אחרי "המשך".
   ========================================================= */
(function(){
  function enhanceOTP(){
    const otp = document.getElementById('loginOTP');
    if(!otp) return;
    if(otp.getAttribute('inputmode') === 'numeric') return;
    otp.setAttribute('type','tel');
    otp.setAttribute('inputmode','numeric');
    otp.setAttribute('autocomplete','one-time-code');
    otp.setAttribute('pattern','[0-9]*');
  }
  const mo = new MutationObserver(function(){ requestAnimationFrame(enhanceOTP); });
  mo.observe(document.body, {childList:true, subtree:true});
  enhanceOTP();
})();

/* =========================================================
   Login OTP - Smart auto-fill detector + auto-submit
   Date: 2026-06-27  (מחליף את גרסת Web OTP הקודמת)
   מזהה מילוי אוטומטי של #loginOTP בכל סביבה:
   - iOS: נגיעה על ההצעה מעל המקלדת (QuickType)
   - Android-דפדפן: Web OTP API ממלא תכנותית
   - הדבקה / כל מילוי "בקפיצה"
   מבדיל ממילוי ידני (ספרה-ספרה) כדי לא לשלוח קוד חלקי.
   לוחץ "התחברות" אוטומטית אחרי 0.8 שנייה. בלי תנאי אורך.
   ========================================================= */
(function(){
  var prevLen = 0, attachedNode = null, submitScheduled = false, webOtpStarted = false;

  function autoSubmit(form){
    if(submitScheduled) return;
    submitScheduled = true;
    var btn = form ? Array.prototype.slice.call(form.querySelectorAll('button')).filter(function(b){ return b.classList.contains('login-btn'); })[0] : null;
    setTimeout(function(){
      if(btn && !btn.disabled && !btn.classList.contains('v-btn--disabled')){
        btn.classList.add('mh-auto-press');
        btn.click();
        setTimeout(function(){ btn.classList.remove('mh-auto-press'); }, 600);
      }
      setTimeout(function(){ submitScheduled = false; }, 2500);
    }, 800);
  }

  function onInput(e){
    var otp = e.target;
    var len = (otp.value || '').length, delta = len - prevLen;
    prevLen = len;
    if(delta >= 2){ autoSubmit(otp.closest('form')); }
  }

  function startWebOtp(otp){
    if(webOtpStarted || !('OTPCredential' in window)) return;
    webOtpStarted = true;
    var ac = new AbortController();
    var form = otp.closest('form');
    if(form){ form.addEventListener('submit', function(){ try{ ac.abort(); }catch(_){} }, { once:true }); }
    navigator.credentials.get({ otp:{ transport:['sms'] }, signal: ac.signal })
      .then(function(c){
        if(c && c.code){
          otp.value = c.code;
          otp.dispatchEvent(new Event('input', { bubbles:true }));
          otp.dispatchEvent(new Event('change', { bubbles:true }));
        }
        webOtpStarted = false;
      })
      .catch(function(){ webOtpStarted = false; });
  }

  function check(){
    var otp = document.getElementById('loginOTP');
    if(otp){
      if(attachedNode !== otp){
        attachedNode = otp;
        prevLen = (otp.value || '').length;
        otp.addEventListener('input', onInput);
      }
      startWebOtp(otp);
    } else {
      attachedNode = null; prevLen = 0; webOtpStarted = false; submitScheduled = false;
    }
  }

  var mo = new MutationObserver(function(){ requestAnimationFrame(check); });
  mo.observe(document.body, { childList:true, subtree:true });
  check();
})();

/* =========================================================
   ✅ סקריפט #3: קישורי עמודים משפטיים בתפריט החשבון
   תאריך: 2026-06-27 | Scope: #ProfileSideBar .navigation-list
   מטרה: הוספת תקנון / מדיניות פרטיות / הצהרת נגישות
          מעל "יציאה מהמערכת". מזוהה לפי טקסט (יציב),
          לא לפי קלאס-האש של Vue. כולל MutationObserver
          להזרקה מחדש אחרי ניווט SPA של Vue.
   ========================================================= */
(function() {
    var PAGES = [
        { id:'mh-link-takanon',  icon:'📜', text:'תקנון האתר',      href:'/he/page/takanon' },
        { id:'mh-link-privacy',  icon:'🔒', text:'מדיניות הפרטיות', href:'/he/page/privacy-policy' },
        { id:'mh-link-negishut', icon:'♿', text:'הצהרת נגישות',     href:'/he/page/negishut' }
    ];

    function buildLink(p) {
        var link = document.createElement('a');
        link.id = p.id;
        link.href = p.href;
        link.className = 'v-list-item v-list-item--link rounded-lg navigation-item tw-my-4';
        link.setAttribute('role', 'link');
        link.style.cssText = 'display:flex;align-items:center;padding:14px 16px;text-decoration:none;color:inherit;border:1px solid rgba(227,30,36,0.2);border-radius:16px;background:rgba(255,255,255,0.5);backdrop-filter:blur(15px);-webkit-backdrop-filter:blur(15px);box-shadow:0 4px 15px rgba(227,30,36,0.08);margin-top:16px;margin-bottom:16px;transition:all 0.3s ease;position:relative;overflow:hidden;cursor:pointer;';
        link.innerHTML =
            '<div class="v-list-item__prepend">' +
                '<div class="tw-me-3" style="display:flex;align-items:center;justify-content:center;font-size:22px;width:24px;height:24px;">' + p.icon + '</div>' +
            '</div>' +
            '<div class="v-list-item__content">' +
                '<div class="v-list-item-title nav-text" style="font-weight:800;font-size:14px;color:#1a1a1a;">' + p.text + '</div>' +
            '</div>' +
            '<div style="margin-right:auto;font-size:22px;color:#c4c4c4;font-weight:400;">‹</div>';
        return link;
    }

    function injectLegalLinks() {
        var navList = document.querySelector('#ProfileSideBar .navigation-list');
        if (!navList) return false;
        if (document.getElementById('mh-link-takanon')) return true;

        // מציאת "יציאה מהמערכת" לפי טקסט (לא לפי קלאס-האש שמשתנה)
        var logoutItem = null;
        var items = navList.children;
        for (var i = 0; i < items.length; i++) {
            if ((items[i].textContent || '').indexOf('יציאה מהמערכת') !== -1) {
                logoutItem = items[i];
                break;
            }
        }

        PAGES.forEach(function(p) {
            if (document.getElementById(p.id)) return;
            var link = buildLink(p);
            if (logoutItem) {
                navList.insertBefore(link, logoutItem);
            } else {
                navList.appendChild(link);
            }
        });
        return true;
    }

    function tryInject() {
        if (injectLegalLinks()) return;
        var attempts = 0;
        var iv = setInterval(function() {
            attempts++;
            if (injectLegalLinks() || attempts > 60) clearInterval(iv);
        }, 250);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInject);
    } else {
        tryInject();
    }

    new MutationObserver(function() {
        if (document.querySelector('#ProfileSideBar .navigation-list') &&
            !document.getElementById('mh-link-takanon')) {
            injectLegalLinks();
        }
    }).observe(document.body, { childList: true, subtree: true });
})();

/* =========================================================
   עברות ותיקוני טקסט לדף "ההזמנות שלי" | 2026-07-01
   - החזרת טקסט מלא לכפתור "להזמין מחדש" (הפלטפורמה מקצרת ל"מחד...")
   - המרת שעה מפורמט 12ש עברי ל-24 שעות (order-status)
   - תרגום "Delivery" ל-"משלוח לבית" (order-type)
   - תרגום "Rating:" ל-"הדירוג שלי:" (span.review)
   ========================================================= */
(function () {
    'use strict';

    var REORDER_FULL = 'להזמין מחדש';

    function to24(text) {
        return text.replace(
            /(\d{1,2}):(\d{2})[\s‎‏⁦-⁩]*(אחר הצהריים|אחה["״']?צ|צהריים|בוקר|ערב|לילה)/g,
            function (m, h, mm, p) {
                h = parseInt(h, 10);
                var isPM = /ערב|צהריים|אחה|אחר/.test(p);
                if (isPM) { if (h < 12) { h += 12; } }
                else { if (h === 12) { h = 0; } }
                return (h < 10 ? '0' : '') + h + ':' + mm;
            }
        );
    }

    function applyFixes() {
        document.querySelectorAll('button.track-btn.tw-bg-black').forEach(function (btn) {
            var label = btn.querySelector('.tw-truncate') ||
                        btn.querySelector('.v-btn__content > span:last-of-type');
            if (label && label.textContent.trim() !== REORDER_FULL) {
                label.textContent = REORDER_FULL;
            }
        });
        document.querySelectorAll('.order-status').forEach(function (el) {
            var t = el.textContent, n = to24(t);
            if (n !== t) { el.textContent = n; }
        });
        document.querySelectorAll('.order-type').forEach(function (el) {
            if (/Delivery/i.test(el.textContent)) {
                el.textContent = el.textContent.replace(/Delivery/gi, 'משלוח לבית');
            }
        });
        document.querySelectorAll('span.review').forEach(function (el) {
            el.childNodes.forEach(function (node) {
                if (node.nodeType === 3 && /Rating\s*:/i.test(node.textContent)) {
                    node.textContent = node.textContent.replace(/Rating\s*:/i, 'הדירוג שלי:');
                }
            });
        });
    }

    function init() {
        applyFixes();
        var raf;
        var obs = new MutationObserver(function () {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(applyFixes);
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

/* =========================================================
   אישור גיל 18+ בהוספה לעגלה — MH AgeGate v1.2.1 | 2026-07-25, עדכון 2026-09-09, 2026-10-07 (v1.2.1: "מארזים עם אלכוהול" של פרחי דליה)
   - תופס לחיצה על button.add-btn בשלב ה-capture (לפני Vue)
   - מזהה קטגוריה: .product-category-name בפופאפ מוצר; ברשימה — כותרת הסקשן
     (.special-listing-inner / .cat-item): ה-h3 הראשון שאינו בתוך כרטיס מוצר.
     (v1.1.0, דוד 9.9: Hyperzod הסירה את h3.category-name מכותרת הסקשן — נשאר רק בסרגל
     הקטגוריות — ולכן "הוספה" מהכרטיס ברשת/בקרוסלה עקפה את השער. אומת חי במחניודה.)
   - שתי דרכים לחסום, שתיהן מצומצמות בכוונה:
     (א) שם קטגוריה מדויק מתוך RESTRICTED (התאמה מלאה, לא הכלה) — עובד בכל דף,
         כולל דף החיפוש שבו אין מזהה חנות ב-URL.
     (ב) חנות שכל המלאי בה 18+ — לפי מזהה החנות ב-URL בלבד (AGE_MERCHANTS).
         זה שורד שינוי שמות קטגוריות אצל המסעדן, ואינו יכול לדלוף לחנות אחרת
         כי הוא נעול על מזהה מפורש.
   - v1.2.0 (9.9, אישור דוד): גואה נפתחה עם 15 קטגוריות עישון/אידוי ורק "סיגריות"
     נחסמה — 14 עקפו את השער. נוספו שמות הקטגוריות של גואה, ובנוסף גואה סומנה
     כחנות 18+ שלמה. נבדק שאף שם חדש אינו קיים באף אחת מ-11 החנויות האחרות.
   - אחרי אישור: נשמר ב-sessionStorage ומופעל click חוזר על הכפתור
   - בדיקה: window.MH_AGEGATE.categoryOf(button) / .stats()
   ========================================================= */
(function () {
    'use strict';

    if (window.__mhAgeGateInit) { return; }
    window.__mhAgeGateInit = true;

    /* שמות קטגוריה מדויקים (===, לא indexOf על הטקסט). נבדק 9.9.2026 מול כל 11 החנויות
       בפלטפורמה: אף אחד מהשמות האלה לא קיים בחנות אחרת, ולכן אין סיכון לחסימה מיותרת. */
    var RESTRICTED = [
        'אלכוהול', 'סיגריות',
        /* גואה (כיכר יהלום 5) — נוספו 9.9.2026 */
        'סיגריות חד פעמיות', 'מכשירי אידוי', 'נוזלים לאידוי', 'פודים וסלילים',
        'טבק לגלגול', 'נלווים לעישון', 'ניירות גלגול ופילטרים',
        'פאקטים - סיגריות', 'פאקטים - טבק',
        'תערובות לנרגילה', 'נרגילות', 'גחלים לנרגילה', 'אביזרים לנרגילה',
        'הפינה הירוקה',
        /* פרחי דליה — 7.10.2026 (ה"אלכוהול" שלהם כבר למעלה). נבדק מול 21 החנויות: קיים רק אצלם */
        'מארזים עם אלכוהול'
    ];
    /* חנויות שכל המלאי בהן 18+. חסימה לפי מזהה החנות ב-URL בלבד — סקופ נעול,
       לא נוגע בשום חנות אחרת גם אם שמות הקטגוריות ישתנו. */
    var AGE_MERCHANTS = ['6aa076d67a4248e3ff053582']; /* גואה */
    var KEY = 'mhAgeOK';
    var STYLE_ID = 'mh-age-style';
    var GATE_ID = 'mh-age-gate';

    function injectStyle() {
        if (document.getElementById(STYLE_ID)) { return; }
        var st = document.createElement('style');
        st.id = STYLE_ID;
        st.textContent = '#mh-age-gate{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.5);direction:rtl;opacity:0;transition:opacity .28s ease}#mh-age-gate.on{opacity:1}#mh-age-gate .card{width:100%;max-width:390px;background:#fff;border-radius:28px;box-shadow:0 25px 60px rgba(0,0,0,.3);padding:30px 22px 22px;text-align:center;font-family:"Heebo","Inter",-apple-system,sans-serif;transform:scale(.9);transition:transform .32s cubic-bezier(.34,1.56,.64,1)}#mh-age-gate.on .card{transform:scale(1)}#mh-age-gate .badge{width:62px;height:62px;margin:0 auto 16px;border-radius:50%;background:linear-gradient(135deg,#e31e24,#b3161b);color:#fff;font-weight:900;font-size:19px;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 24px rgba(227,30,36,.35)}#mh-age-gate h2{font-size:20px;font-weight:900;color:#1a1a1a;margin:0 0 10px;line-height:1.4}#mh-age-gate p{font-size:14.5px;font-weight:500;color:#4a5568;line-height:1.6;margin:0 0 22px}#mh-age-gate .ok{display:block;width:100%;height:52px;border:none;border-radius:16px;background:linear-gradient(135deg,#e31e24,#b3161b);color:#fff;font-family:inherit;font-size:16px;font-weight:900;cursor:pointer;box-shadow:0 8px 20px rgba(227,30,36,.3);transition:transform .2s ease}#mh-age-gate .ok:active{transform:scale(.97)}#mh-age-gate .no{display:block;margin:14px auto 0;background:none;border:none;font-family:inherit;font-size:14px;font-weight:700;color:#4a5568;cursor:pointer;text-decoration:underline}';
        document.head.appendChild(st);
    }

    var stats = { version: '1.2.1', checked: 0, gated: 0, byMerchant: 0, byCategory: 0 };
    /* /he/m/<slug>/<merchantId> — מחזיר true רק אם המזהה נמצא ברשימה המפורשת */
    function onAgeMerchant() {
        var m = String(location.pathname).match(/\/m\/[^/]+\/([0-9a-fA-F]{16,})/);
        return !!(m && AGE_MERCHANTS.indexOf(m[1]) !== -1);
    }
    // עמוד מוצר עצמאי (/product/ ב-URL, בלי .product-popup): השורש הוא #app — אותה לוגיקה כמו
    // pizzaRoot בבלוק רבעי הפיצה. v1.1.1 (9.9): הבלוק קרא ל-pizzaRoot שמוגדרת בסגור אחר → ReferenceError
    // בכל לחיצה מהכרטיס מאז 1.9 — זה מה ששבר את השער ברשימה (הפופאפ עבד כי ה-|| לא הגיע לקריאה).
    function productPageRoot() {
        if (!/\/product\//.test(location.pathname)) { return null; }
        return document.querySelector('#app') || document.querySelector('.v-application');
    }
    function categoryOf(target) {
        var popup = target.closest('.product-popup') || productPageRoot();
        if (popup) {
            var c = popup.querySelector('.product-category-name');
            return c ? c.textContent.trim() : null;
        }
        var section = target.closest('.special-listing-inner, .cat-item, [id^="cat_"]');
        if (!section) { return null; }
        var legacy = section.querySelector('h3.category-name');
        if (legacy) { return legacy.textContent.trim(); }
        // כותרת הסקשן = ה-h3/h2 הראשון שאינו שם מוצר בתוך כרטיס
        var hs = section.querySelectorAll('h3, h2');
        for (var i = 0; i < hs.length; i++) {
            var h = hs[i];
            if (h.closest('.v-card') || h.classList.contains('product-name')) { continue; }
            var t = h.textContent.trim();
            if (t) { return t; }
        }
        return null;
    }

    function showGate(btn) {
        if (document.getElementById(GATE_ID)) { return; }
        injectStyle();
        var ov = document.createElement('div');
        ov.id = GATE_ID;
        ov.innerHTML = '<div class="card"><div class="badge">18+</div>' +
            '<h2>מוצר לגילאי 18 ומעלה</h2>' +
            '<p>בלחיצה על ״אני מאשר/ת״ הנך מצהיר/ה כי מלאו לך 18 שנים, וכי ברשותך תעודה מזהה להציג לשליח בעת מסירת ההזמנה.</p>' +
            '<button type="button" class="ok">אני מאשר/ת שאני מעל גיל 18</button>' +
            '<button type="button" class="no">ביטול</button></div>';
        document.body.appendChild(ov);
        requestAnimationFrame(function () { ov.classList.add('on'); });

        ov.querySelector('.ok').addEventListener('click', function () {
            try { sessionStorage.setItem(KEY, '1'); } catch (err) {}
            ov.classList.remove('on');
            setTimeout(function () {
                ov.remove();
                if (document.contains(btn)) { btn.click(); }
            }, 260);
        });

        ov.querySelector('.no').addEventListener('click', function () {
            ov.classList.remove('on');
            setTimeout(function () { ov.remove(); }, 260);
        });
    }

    document.addEventListener('click', function (e) {
        var approved = false;
        try { approved = sessionStorage.getItem(KEY) === '1'; } catch (err) {}
        if (approved) { return; }
        if (!e.target || !e.target.closest) { return; }
        var btn = e.target.closest('button.add-btn');
        if (!btn) { return; }
        var cat = categoryOf(e.target);
        stats.checked++;
        var byMerchant = onAgeMerchant();
        var byCategory = !!cat && RESTRICTED.indexOf(cat) !== -1;
        if (!byMerchant && !byCategory) { return; }
        stats.gated++;
        if (byMerchant) { stats.byMerchant++; }
        if (byCategory) { stats.byCategory++; }
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        showGate(btn);
    }, true);
    window.MH_AGEGATE = {
        version: stats.version,
        categoryOf: categoryOf,
        onAgeMerchant: onAgeMerchant,
        restricted: RESTRICTED.slice(),
        ageMerchants: AGE_MERCHANTS.slice(),
        stats: function () { return { version: stats.version, checked: stats.checked, gated: stats.gated, byMerchant: stats.byMerchant, byCategory: stats.byCategory }; }
    };
    /* mh-agegate-v1.2.0 */
})();

/* ============================================================================
   MH Pizza Quarters — Production v1.4
   ----------------------------------------------------------------------------
   שינויים מ-v1.3 (22.9.2026, mhq-halves-v1):
     [NEW] מסעדה שמוכרת חצאים בלבד (שיבולת השרון: "(הכל)/(חצי ימין)/(חצי שמאל)",
           בלי רבע בודד בתפריט) — הגלגל מצייר שני חצאים ימין/שמאל במקום
           ארבעה רבעים שאי אפשר לקנות. התווית "₪4 לחצי" במקום "₪2 לרבע"
           המומצא, הכותרת "איזה חצי?", וצ'יפ אחד לחצי בתצוגת הפיצה.
           ההחלטה לכל תוספת בנפרד: יש אפשרות של רבע בודד -> ארבעה רבעים,
           בדיוק כמו קודם (בנ'ס לא זז — נבדק במוק מול הגרסה הקודמת).
           הנתיבים של החצאים קיימים תמיד ב-SVG אך מוסתרים ב-CSS, ונחשפים
           רק תחת .mhq-halves.
   ----------------------------------------------------------------------------
   שינויים מ-v1.1:
     [NEW] בורר הצירוף הקצר ביותר. הבון אצל המסעדן היה ארוך ומבלבל — שורה
           נפרדת לכל רבע. עכשיו הסקריפט בוחר את קבוצת האפשרויות שמכסה
           בדיוק את בחירת הלקוח עם הכי מעט שורות. 7 שורות -> 5 בהזמנה
           אמיתית שנמדדה.
     [NEW] שמות מיקום מילוליים: (חצי ימין) (חצי שמאל) (רבע שמאל עליון)...
           מודל מחשבה אחד לאורך כל הבון, בלי מפת רבעים שהטבח צריך לזכור.
     [CHG] מודל נתונים אחיד: כל אפשרות = קבוצת רבעים. במקום whole/half/
           quarter נפרדים. זה מה שמאפשר את הבורר.
     [OK]  תאימות לאחור מלאה — "רבע 1", "על הכל", "על חצי" ממשיכים לעבוד,
           כך שאפשר לעדכן שמות בתפריט בהדרגה בלי לשבור כלום באמצע.

   שינויים מ-v1.0:
     [FIX] ה-MutationObserver חובר רק בתוך scanInner(), אחרי הבדיקה "יש
           פופאפ?". בטעינת דף רגילה אין פופאפ, ולכן החיישן מעולם לא חובר.
           בקונסולה זה תמיד עבד כי הפופאפ היה פתוח בזמן ההדבקה.
   ----------------------------------------------------------------------------
   שינויים מ-v0.5:
     [FIX] הפתיחה האוטומטית לא עבדה. סיבת שורש: השוויתי לטקסט "הראה עוד",
           אבל הכפתור בפלטפורמה כתוב "להראות יותר". ההנחה הגיעה מקריאת
           צילום מסך ולא ממדידה. עכשיו ההתאמה מבוססת ביטוי רגולרי גמיש,
           מנקה תווי כיווניות נסתרים, ומוצאת גם כשהטקסט יושב ב-span פנימי.
     [CHG] תנאי העצירה מבוסס חתימת מצב (תיבות + כפתורים) במקום ספירת
           תיבות בלבד — כך קבוצה שנפתחת בלי להוסיף תיבות לא עוצרת אותנו
           לפני שהגענו לקבוצות הבאות.

   שינויים מ-v0.4:
     [FIX] רשימות מקופלות. HyperZod מכניס ל-DOM רק חלק מהאופציות ומסתיר את
           השאר מאחורי "הראה עוד" (נמדד: 16 תיבות לפני, 26 אחרי). הכרטיס
           הציג רבעים חסרים. פתרון: פתיחה אוטומטית לפני הרינדור, עם תקרה
           של 10 לחיצות ועצירה מיידית כשהמספר מפסיק לעלות.
     [FIX] מגן קבוצת החובה האזין לכל הוספה לעגלה בפלטפורמה כולה. עכשיו
           פעיל אך ורק בפופאפ שבו קיימים הכרטיסים שלנו — כלומר רק אצל
           מסעדן שהגדיר את קונבנציית הרבעים.

   שינויים מ-v0.3:
     [FIX] תמונות תוספות לא הופיעו בכרטיסים.
           סיבה: MutationObserver אינו צובר אירועים בזמן שהוא מנותק, וב-v0.2
           ניתקנו אותו בזמן הסריקה כדי למנוע לולאה. Vuetify מכניס את תגיות
           <img> בדיוק בחלון הזה, וההודעה אבדה — אז שום דבר לא העיר את
           הסקריפט לצייר אותן.
           פתרון: סריקות מעקב מתוזמנות (settle) ב-0.35/0.9/2/3.5 שניות אחרי
           כל סריקה ואחרי כל שינוי בחירה. מוגבל וצפוי בכוונה.
     [CHG] שיטת הסתרה בטוחה יותר לטעינה עצלה: השורה שומרת על מידותיה
           האמיתיות אבל יוצאת מהזרימה עם z-index שלילי.

   ארכיטקטורה (ללא שינוי):
     הכרטיס הוא בובה. לא זוכר ולא מחשב — קורא את מצב הצ'קבוקסים המקוריים
     ומצייר את עצמו. כל לחיצה מתורגמת ל-click() על ה-input המקורי,
     ו-HyperZod מחשב מחיר, עגלה ובון.

   קונבנציית שמות (החוזה עם המסעדן):
     "בצל ( על הכל )" / "בצל (רבע 1)".."בצל (רבע 4)" / "בצל ( על חצי )"
     4 רבעים נבחרים -> מסומנת "על הכל" בלבד, כדי שהבון יישאר שורה אחת.
     תמונה מספיק להעלות פעם אחת, על וריאנט כלשהו של התוספת.

   מפת הרבעים (כפי שהלקוח רואה, RTL):
     1 = ימין למעלה   2 = שמאל למעלה   3 = שמאל למטה   4 = ימין למטה

   Dependencies: אין. וניל JS.
   הפעלה מאפס: פתח פופאפ מוצר -> הדבק את כל הקובץ בקונסולה.
   בדיקה: __mhq.stats()   |   ביטול: __mhq.destroy()
   ============================================================================ */
(function () {
  'use strict';

  if (window.__mhq && window.__mhq.destroy) {
    try { window.__mhq.destroy(); } catch (e) { }
  }

  var BUSY = false, RAF = null, OBSERVER = null, LAST_LOG = '';
  var SETTLE = [];                       /* טיימרים של סריקות מעקב */
  var SETTLE_MS = [350, 900, 2000, 3500];
  var EXPAND_N = 0;                      /* [v0.5] כמה פעמים נלחץ "הראה עוד" */
  var MAX_EXPAND = 10;                   /* תקרה קשיחה נגד לולאה */
  var LAST_POPUP = null;                 /* לזיהוי מעבר בין מוצרים */
  var PENDING_EXPAND = false;

  /* סריקות מעקב — תופסות שינויים שקרו בזמן שה-Observer היה מנותק */
  function settle() {
    SETTLE.forEach(clearTimeout);
    SETTLE = SETTLE_MS.map(function (ms) { return setTimeout(scan, ms); });
  }

  /* ==========================================================================
     1. פענוח שמות
     ========================================================================== */
  function splitLabel(txt) {
    var m = String(txt).replace(/\s+/g, ' ').trim().match(/^(.+?)\s*[\(\[]\s*(.+?)\s*[\)\]]\s*$/);
    return m ? { name: m[1].trim(), inner: m[2].trim() } : null;
  }

  /* ------------------------------------------------------------------------
     כל אפשרות מתורגמת לקבוצת הרבעים שהיא מכסה.
     מפת הרבעים (RTL, כפי שהלקוח והטבח רואים את הקופסה פתוחה):
       1 = ימין עליון   2 = שמאל עליון   3 = שמאל תחתון   4 = ימין תחתון

     ההתאמה סלחנית בכוונה: אותה משמעות מזוהה בכמה ניסוחים, כדי שהמסעדן
     יוכל לקצר או להאריך שמות בלי שנצטרך לגעת בקוד. כל השמות הישנים
     ("רבע 1", "על הכל", "על חצי") ממשיכים לעבוד — אפס שבירה במעבר.
     ------------------------------------------------------------------------ */
  var VARIANTS = [
    /* פיצה שלמה */
    [/^(על\s*)?(כל\s*ה?(מגש|פיצה)|הכל|שלם|שלמה|מלא)$/, [1, 2, 3, 4]],
    /* חצאים */
    [/^(על\s*)?(חצי\s*)?ימין$|^(על\s*)?ימין\s*חצי$/, [1, 4]],
    [/^(על\s*)?(חצי\s*)?שמאל$|^(על\s*)?שמאל\s*חצי$/, [2, 3]],
    [/^(על\s*)?(חצי\s*)?עליון$/, [1, 2]],
    [/^(על\s*)?(חצי\s*)?תחתון$/, [3, 4]],
    /* רבעים מילוליים — שני סדרי מילים */
    [/^(רבע\s*)?ימין\s*עליון$|^(רבע\s*)?עליון\s*ימין$/, [1]],
    [/^(רבע\s*)?שמאל\s*עליון$|^(רבע\s*)?עליון\s*שמאל$/, [2]],
    [/^(רבע\s*)?שמאל\s*תחתון$|^(רבע\s*)?תחתון\s*שמאל$/, [3]],
    [/^(רבע\s*)?ימין\s*תחתון$|^(רבע\s*)?תחתון\s*ימין$/, [4]]
  ];

  /* "חצי" סתמי בלי כיוון — נשמר לתאימות לאחור בלבד. */
  var HALF_PLAIN = /^(על\s*)?חצי(\s*פיצה)?$/;

  function parseVariant(s) {
    var t = String(s)
      .replace(/["\'״׳]/g, '')
      .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '')
      .replace(/[-–—]/g, ' ')
      .replace(/\s+/g, ' ').trim();

    for (var i = 0; i < VARIANTS.length; i++) {
      if (VARIANTS[i][0].test(t)) return { quarters: VARIANTS[i][1].slice(), legacy: false };
    }
    var m = t.match(/^(?:על\s*)?רבע\s*([1-4])$/);          /* "רבע 1" הישן */
    if (m) return { quarters: [parseInt(m[1], 10)], legacy: false };
    if (HALF_PLAIN.test(t)) return { quarters: [1, 4], legacy: true };
    return null;
  }

  /* ==========================================================================
     2. סריקת DOM -> מודל נתונים
     ========================================================================== */
  function collect(popup) {
    var map = new Map();
    var inputs = popup.querySelectorAll('input[type="checkbox"]');

    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      var row = input.closest('.v-list-item');
      if (!row || row.closest('.mhq-card')) continue;

      var content = row.querySelector('.v-list-item__content') || row;
      var titleEl = content.querySelector('.v-list-item-title');
      if (!titleEl) continue;

      var label = titleEl.innerText.replace(/\s+/g, ' ').trim();
      var parts = splitLabel(label);
      if (!parts) continue;
      var variant = parseVariant(parts.inner);
      if (!variant) continue;

      /* מחיר = טקסט השורה פחות התווית. הסדר קריטי: בתווית יש ספרה ("רבע 1") */
      var allTxt = content.innerText.replace(/\s+/g, ' ').trim();
      var rest = allTxt.indexOf(label) === 0 ? allTxt.slice(label.length) : allTxt;
      var pm = rest.match(/\d+(?:[.,]\d+)?/);
      var price = pm ? parseFloat(pm[0].replace(',', '.')) : 0;

      var t = map.get(parts.name);
      if (!t) {
        t = { opts: [], rows: [], img: null, anchor: row, all: [] };
        map.set(parts.name, t);
      }

      /* כל אפשרות = קבוצת רבעים + מחיר. אין יותר "whole/half/quarter"
         נפרדים — הכל מיוצג אחיד, וזה מה שמאפשר את בורר הצירופים. */
      t.opts.push({
        input: input,
        price: price,
        quarters: variant.quarters,
        mask: variant.quarters.reduce(function (a, q) { return a | (1 << (q - 1)); }, 0),
        label: parts.inner,
        legacy: variant.legacy
      });

      t.rows.push(row);
      t.all.push(input);
      /* התמונה נאספת מכל וריאנט — מספיק שהמסעדן העלה אותה על אחד מהם */
      if (!t.img) {
        var im = row.querySelector('img');
        if (im && (im.currentSrc || im.getAttribute('src'))) t.img = im.currentSrc || im.src;
      }
    }

    map.forEach(function (t, name) {
      if (t.opts.length < 2) { map.delete(name); return; }
      /* המחיר המלא = האפשרות שמכסה את כל 4 הרבעים, אם קיימת */
      var whole = t.opts.filter(function (o) { return o.mask === 15; })[0];
      t.wholePrice = whole ? whole.price : null;
      /* המחיר לרבע = האפשרות שמכסה רבע בודד (mask של ביט אחד: 1/2/4/8).
         זה מה שהכרטיס מציג לפני שנבחרו רבעים — הצגת המחיר למגש שלם נקראה
         כאילו התוספת עצמה עולה ₪10 (דוד, 1.9). נפילה ל-¼ מהמלא אם אין רבע. */
      var quarter = t.opts.filter(function (o) {
        return o.mask === 1 || o.mask === 2 || o.mask === 4 || o.mask === 8;
      })[0];
      t.quarterPrice = quarter ? quarter.price
        : (t.wholePrice != null ? Math.round(t.wholePrice * 25) / 100 : null);
      t.coverage = t.opts.reduce(function (a, o) { return a | o.mask; }, 0);
      /* [v1.4] אין רבע בודד בתפריט אבל יש חצי ימין/שמאל -> גלגל של שני חצאים.
         ponytail: רק ימין/שמאל (mask 9/6); עליון/תחתון נשארים בגלגל הרבעים. */
      var half = t.opts.filter(function (o) { return o.mask === 9 || o.mask === 6; })[0];
      t.halfOnly = !quarter && !!half;
      t.halfPrice = half ? half.price : null;
    });

    return map;
  }

  function findHeroImg(popup) {
    var best = null, bestArea = 0;
    popup.querySelectorAll('img').forEach(function (im) {
      if (im.closest('.mhq-card') || im.closest('.mhq-preview')) return;
      if (im.closest('.v-list-item')) return;
      var a = im.offsetWidth * im.offsetHeight;
      if (a > bestArea) { bestArea = a; best = im; }
    });
    return bestArea > 4000 && best ? (best.currentSrc || best.src) : null;
  }

  /* ==========================================================================
     3. תרגום בחירה -> צ'קבוקסים
     ========================================================================== */
  /* ------------------------------------------------------------------------
     בורר הצירוף הקצר ביותר.
     בהינתן הרבעים שהלקוח סימן, מוצא את קבוצת האפשרויות שמכסה אותם
     בדיוק — בלי חפיפה (חפיפה = חיוב כפול על אותו רבע) — עם הכי מעט
     שורות. שוויון בשורות מוכרע לפי המחיר הנמוך לטובת הלקוח.

     למה כוח גס: עד 8 אפשרויות לתוספת = 256 צירופים, שנבדקים בפחות
     ממילישנייה. אלגוריתם חכם יותר יהיה קשה יותר לתחזוקה בלי שום רווח.

     זה מה שמקצר את הבון: 3 רבעים הופכים ל"חצי ימין" + "רבע שמאל עליון"
     במקום שלוש שורות רבע נפרדות.
     ------------------------------------------------------------------------ */
  function computePlan(t, sel) {
    var checks = new Map();
    t.opts.forEach(function (o) { checks.set(o.input, false); });

    var want = 0;
    sel.forEach(function (q) { want |= (1 << (q - 1)); });
    if (!want) return { ok: true, checks: checks, price: 0, lines: 0 };

    var opts = t.opts, n = Math.min(opts.length, 12), best = null;

    for (var combo = 1; combo < (1 << n); combo++) {
      var mask = 0, price = 0, lines = 0, clash = false;
      for (var i = 0; i < n; i++) {
        if (!(combo & (1 << i))) continue;
        if (mask & opts[i].mask) { clash = true; break; }   /* חפיפה — פסול */
        mask |= opts[i].mask;
        price += opts[i].price;
        lines++;
      }
      if (clash || mask !== want) continue;
      if (!best || lines < best.lines || (lines === best.lines && price < best.price)) {
        best = { combo: combo, lines: lines, price: price };
      }
    }

    if (!best) {
      return { ok: false, reason: 'הצירוף הזה לא מוגדר בתפריט של המסעדה' };
    }

    for (var k = 0; k < n; k++) {
      if (best.combo & (1 << k)) checks.set(opts[k].input, true);
    }
    return { ok: true, checks: checks, price: best.price, lines: best.lines };
  }

  /* מצב נוכחי = איחוד הרבעים של כל האפשרויות המסומנות.
     ה-DOM נשאר מקור האמת: המיקום מקודד בשם האפשרות עצמה,
     ולכן עריכה מהעגלה משחזרת את הבחירה במדויק. */
  function readSel(t) {
    var s = new Set();
    t.opts.forEach(function (o) {
      if (o.input.checked) o.quarters.forEach(function (q) { s.add(q); });
    });
    return s;
  }

  function applyPlan(plan) {
    BUSY = true;
    plan.checks.forEach(function (want, el) {
      if (el.checked !== want) el.click();   /* click ולא checked=true — אחרת Vue לא קולט */
    });
    setTimeout(function () { BUSY = false; scan(); }, 80);
  }

  /* ==========================================================================
     4. גיאומטריה
     ========================================================================== */
  var QPATH = {
    1: 'M50,50 L50,4 A46,46 0 0,1 96,50 Z',
    2: 'M50,50 L4,50 A46,46 0 0,1 50,4 Z',
    3: 'M50,50 L50,96 A46,46 0 0,1 4,50 Z',
    4: 'M50,50 L96,50 A46,46 0 0,1 50,96 Z'
  };
  var QNUM = { 1: [71, 36], 2: [29, 36], 3: [29, 70], 4: [71, 70] };
  /* [v1.4] חצי ימין = רבעים 1+4, חצי שמאל = 2+3 (כמו VARIANTS) */
  var HALF_Q = { R: [1, 4], L: [2, 3] };
  var HPATH = { R: 'M50,4 A46,46 0 0,1 50,96 Z', L: 'M50,96 A46,46 0 0,1 50,4 Z' };

  function circleSvg(big) {
    var s = '<svg class="mhq-circle" viewBox="0 0 100 100">';
    for (var i = 1; i <= 4; i++) {
      s += '<path class="mhq-q" data-q="' + i + '" d="' + QPATH[i] + '"></path>';
      if (big) s += '<text class="mhq-num" x="' + QNUM[i][0] + '" y="' + QNUM[i][1] + '">' + i + '</text>';
    }
    s += '<path class="mhq-h" data-h="R" d="' + HPATH.R + '"></path><path class="mhq-h" data-h="L" d="' + HPATH.L + '"></path>';
    return s + '</svg>';
  }

  /* ==========================================================================
     5. תצוגת הפיצה החיה
     ========================================================================== */
  function buildPreview() {
    var p = document.createElement('div');
    p.className = 'mhq-preview';
    var veil = '<svg class="mhq-veil" viewBox="0 0 100 100">';
    for (var i = 1; i <= 4; i++) {
      veil += '<path class="mhq-vq" data-q="' + i + '" d="' + QPATH[i] + '"></path>';
      veil += '<text class="mhq-vnum" x="' + QNUM[i][0] + '" y="' + QNUM[i][1] + '">' + i + '</text>';
    }
    veil += '<path class="mhq-vh" data-h="R" d="' + HPATH.R + '"></path><path class="mhq-vh" data-h="L" d="' + HPATH.L + '"></path>';
    veil += '</svg>';
    p.innerHTML =
      '<div class="mhq-pizza"><img class="mhq-pizza-img" alt="">' + veil +
      '<div class="mhq-chips" data-q="1"></div><div class="mhq-chips" data-q="2"></div>' +
      '<div class="mhq-chips" data-q="3"></div><div class="mhq-chips" data-q="4"></div></div>' +
      '<div class="mhq-cap">בחרו תוספת ואז את הרבעים שעליהם היא תופיע</div>';
    return p;
  }

  function paintPreview(prev, map, heroSrc) {
    var img = prev.querySelector('.mhq-pizza-img');
    if (heroSrc && img.getAttribute('src') !== heroSrc) img.src = heroSrc;
    prev.classList.toggle('mhq-noimg', !heroSrc);

    var perQ = { 1: [], 2: [], 3: [], 4: [] }, any = false;
    map.forEach(function (t, name) {
      readSel(t).forEach(function (i) { perQ[i].push({ name: name, img: t.img }); any = true; });
    });

    prev.classList.toggle('mhq-lit', any);
    prev.querySelectorAll('.mhq-vq').forEach(function (p) {
      p.classList.toggle('mhq-on', perQ[p.getAttribute('data-q')].length > 0);
    });
    /* [v1.4] כל התוספות חצאים-בלבד -> הצללה לפי חצי, בלי מספרים, צ'יפ אחד לחצי
       (ה-CSS מסתיר את תיבות 3/4 וממרכז את 1/2 — בחירת חצי מסמנת את שני רבעיו) */
    var halves = map.size > 0;
    map.forEach(function (t) { if (!t.halfOnly) halves = false; });
    prev.classList.toggle('mhq-halves', halves);
    prev.querySelectorAll('.mhq-vh').forEach(function (p) {
      var qs = HALF_Q[p.getAttribute('data-h')];
      p.classList.toggle('mhq-on', perQ[qs[0]].length > 0 || perQ[qs[1]].length > 0);
    });
    var cap = prev.querySelector('.mhq-cap');
    var capTxt = halves ? 'בחרו תוספת ואז את החצי שעליו היא תופיע' : 'בחרו תוספת ואז את הרבעים שעליהם היא תופיע';
    if (cap.textContent !== capTxt) cap.textContent = capTxt;

    /* בונים צ'יפים מחדש רק כשההרכב באמת השתנה — אחרת האנימציה תרוץ בלולאה.
       החתימה כוללת גם את התמונה, כדי שצ'יפ יתעדכן כשתמונה נטענת מאוחר. */
    prev.querySelectorAll('.mhq-chips').forEach(function (box) {
      var list = perQ[box.getAttribute('data-q')];
      var sig = list.map(function (x) { return x.name + ':' + (x.img || '-'); }).join('|');
      if (box.dataset.sig === sig) return;
      box.dataset.sig = sig;
      box.innerHTML = list.slice(0, 3).map(function (x) {
        return x.img
          ? '<img class="mhq-chip" src="' + x.img + '" alt="' + x.name + '">'
          : '<span class="mhq-chip mhq-chip-txt">' + x.name.charAt(0) + '</span>';
      }).join('') + (list.length > 3 ? '<span class="mhq-chip mhq-chip-txt">+' + (list.length - 3) + '</span>' : '');
    });
  }

  /* ==========================================================================
     6. כרטיס תוספת
     ========================================================================== */
  function buildCard(name) {
    var card = document.createElement('div');
    card.className = 'mhq-card';
    card.setAttribute('data-mhq', name);
    card.innerHTML =
      '<button type="button" class="mhq-tile">' +
      '<span class="mhq-thumbwrap"><span class="mhq-thumb mhq-thumb-txt">' + name.charAt(0) + '</span>' +
      '<span class="mhq-mini">' + circleSvg(false) + '</span></span>' +
      '<span class="mhq-name">' + name + '</span>' +
      '<span class="mhq-price"></span>' +
      '</button>' +
      '<div class="mhq-panel">' + circleSvg(true) +
      '<div class="mhq-side"><div class="mhq-hint">אילו רבעים?</div>' +
      '<div class="mhq-actions">' +
      '<button type="button" class="mhq-btn" data-act="all">כל הפיצה</button>' +
      '<button type="button" class="mhq-btn mhq-ghost" data-act="clear">הסרה</button>' +
      '</div><div class="mhq-msg"></div></div></div>';

    card.querySelector('.mhq-tile').addEventListener('click', function () {
      var open = card.classList.contains('mhq-open');
      var root = card.closest('.product-popup') || document;
      root.querySelectorAll('.mhq-card.mhq-open').forEach(function (c) { c.classList.remove('mhq-open'); });
      if (!open) card.classList.add('mhq-open');
    });

    card.querySelectorAll('.mhq-panel .mhq-q').forEach(function (p) {
      p.addEventListener('click', function (e) {
        e.stopPropagation();
        var t = card.__t; if (!t) return;
        var i = parseInt(p.getAttribute('data-q'), 10);
        var cur = readSel(t);
        cur.has(i) ? cur.delete(i) : cur.add(i);
        var pl = computePlan(t, cur);
        if (!pl.ok) { flash(card, pl.reason); return; }
        applyPlan(pl); settle();
      });
    });

    /* [v1.4] לחיצה על חצי = שני הרבעים שלו יחד (נבחר "(חצי ימין)" בשורה אחת) */
    card.querySelectorAll('.mhq-panel .mhq-h').forEach(function (p) {
      p.addEventListener('click', function (e) {
        e.stopPropagation();
        var t = card.__t; if (!t) return;
        var qs = HALF_Q[p.getAttribute('data-h')], cur = readSel(t);
        var on = cur.has(qs[0]) && cur.has(qs[1]);
        qs.forEach(function (q) { on ? cur.delete(q) : cur.add(q); });
        var pl = computePlan(t, cur);
        if (!pl.ok) { flash(card, pl.reason); return; }
        applyPlan(pl); settle();
      });
    });

    card.querySelectorAll('.mhq-btn').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var t = card.__t; if (!t) return;
        var pl = computePlan(t, b.getAttribute('data-act') === 'all' ? new Set([1, 2, 3, 4]) : new Set());
        if (!pl.ok) { flash(card, pl.reason); return; }
        applyPlan(pl); settle();
      });
    });

    return card;
  }

  function paint(card, t) {
    var sel = readSel(t), plan = computePlan(t, sel);

    card.querySelectorAll('.mhq-q').forEach(function (p) {
      p.classList.toggle('mhq-on', sel.has(parseInt(p.getAttribute('data-q'), 10)));
    });
    /* [v1.4] מצב חצאים: המחלקה חושפת את נתיבי החצאים ומסתירה את הרבעים */
    card.classList.toggle('mhq-halves', !!t.halfOnly);
    card.querySelectorAll('.mhq-h').forEach(function (p) {
      var qs = HALF_Q[p.getAttribute('data-h')];
      p.classList.toggle('mhq-on', sel.has(qs[0]) && sel.has(qs[1]));
    });
    var hint = card.querySelector('.mhq-hint'), hintTxt = t.halfOnly ? 'איזה חצי?' : 'אילו רבעים?';
    if (hint.textContent !== hintTxt) hint.textContent = hintTxt;

    /* לפני בחירה מציגים "₪2.5 לרבע" ולא את מחיר המגש השלם — אחרת הלקוח
       קורא ₪10 וחושב שזה מחיר התוספת. אחרי בחירה: המחיר בפועל. */
    var txt = sel.size ? '₪' + (plan.ok ? plan.price : 0)
      : (t.halfOnly ? '₪' + t.halfPrice + ' לחצי'
        : t.quarterPrice != null ? '₪' + t.quarterPrice + ' לרבע'
        : (t.wholePrice != null ? '₪' + t.wholePrice : ''));
    var pe = card.querySelector('.mhq-price');
    if (pe.textContent !== txt) pe.textContent = txt;

    card.classList.toggle('mhq-active', sel.size > 0);

    /* החלפת אות בתמונה — גם אם התמונה נטענה הרבה אחרי הסריקה הראשונה */
    var th = card.querySelector('.mhq-thumb');
    if (t.img && th.tagName !== 'IMG') {
      var img = document.createElement('img');
      img.className = 'mhq-thumb';
      img.src = t.img;
      img.alt = '';
      th.replaceWith(img);
    }
  }

  function flash(card, msg) {
    var el = card.querySelector('.mhq-msg');
    el.textContent = msg;
    el.classList.add('mhq-show');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('mhq-show'); }, 2800);
  }

  /* ==========================================================================
     7. מגן קבוצת חובה
     ========================================================================== */
  function requiredGroups(popup) {
    var out = [];
    popup.querySelectorAll('span,small,b,strong,em,div,p').forEach(function (n) {
      if (n.children.length) return;
      if ((n.textContent || '').trim() !== 'נדרש') return;
      var c = n;
      for (var k = 0; k < 8 && c.parentElement; k++) {
        c = c.parentElement;
        var boxes = c.querySelectorAll('input[type="checkbox"],input[type="radio"]');
        if (boxes.length) { out.push({ el: c, inputs: [].slice.call(boxes) }); return; }
      }
    });
    return out;
  }

  function warnGroup(g) {
    var a = g.el.querySelector(':scope > .mhq-alert');
    if (!a) {
      a = document.createElement('div');
      a.className = 'mhq-alert';
      g.el.insertBefore(a, g.el.firstChild);
    }
    a.textContent = 'בחרו לפחות אפשרות אחת כדי להמשיך';
    a.classList.add('mhq-show');
    try { a.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { }
    clearTimeout(a._t);
    a._t = setTimeout(function () { a.classList.remove('mhq-show'); }, 4000);
  }

  function onAddClick(e) {
    var popup = pizzaRoot();
    if (!popup || !e.target || !e.target.closest) return;
    /* [v0.5] המגן פעיל אך ורק בפופאפ שבו הכרטיסים שלנו קיימים.
       בלי זה היינו מאזינים לכל הוספה לעגלה בכל הפלטפורמה — ומסעדן
       אחר עם מבנה שונה היה עלול להיחסם בגלל זיהוי שגוי אצלנו. */
    if (!popup.querySelector('.mhq-card')) return;
    var btn = e.target.closest('.add-btn');
    if (!btn || !popup.contains(btn)) return;
    var bad = requiredGroups(popup).filter(function (g) {
      return !g.inputs.some(function (i) { return i.checked; });
    });
    if (!bad.length) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    warnGroup(bad[0]);
  }

  /* ==========================================================================
     7ב. פתיחת רשימות מקופלות  [v0.5]
     --------------------------------------------------------------------------
     HyperZod מכניס ל-DOM רק חלק מהאופציות ומסתיר את השאר מאחורי "הראה עוד".
     נמדד בפועל: 16 תיבות סימון לפני הלחיצה, 26 אחריה. בלי פתיחה אוטומטית
     הכרטיס יציג רבעים חסרים והלקוח לא יוכל לבחור אותם.

     שלוש הגנות מפני לולאה:
       1. פועל רק בפופאפ שבו נמצאה תבנית "(רבע N)" — כלומר פיצרייה בלבד.
       2. תקרה קשיחה של 10 לחיצות למוצר.
       3. אם מספר התיבות לא עלה אחרי לחיצה — עוצרים מיד.
     ========================================================================== */
  /* נמדד בפועל בפלטפורמה: "להראות יותר" (codes: 1500,1492,...,32,...).
     ההשוואה גמישה בכוונה — ניסוח שונה אצל מסעדן אחר ייתפס גם הוא.
     "פחות" לא נתפס, כדי שלא נקפל בחזרה את מה שפתחנו. */
  var SHOW_MORE_RX = /^(להראות|להציג|הראה|הראו|הצג|הצגת)\s+(יותר|עוד)$|^(show|view|see)\s+more$/i;

  function isShowMore(el) {
    /* ניקוי תווי כיווניות נסתרים של עברית לפני ההשוואה */
    var t = (el.innerText || el.textContent || '')
      .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '')
      .replace(/\s+/g, ' ').trim();
    return SHOW_MORE_RX.test(t);
  }

  var SHOW_LESS_RX = /^(להראות|להציג|הראה|הראו|הצג)\s+פחות$|^(show|view)\s+less$/i;
  function isShowLess(el) {
    var t = (el.innerText || el.textContent || '')
      .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '')
      .replace(/\s+/g, ' ').trim();
    return SHOW_LESS_RX.test(t);
  }

  function findShowMore(popup) {
    var out = null;
    popup.querySelectorAll('button,[role="button"],a,.v-btn').forEach(function (b) {
      if (out || b.closest('.mhq-card')) return;
      if (isShowMore(b)) out = b;
    });
    /* מוצא גם כשהטקסט יושב ב-span פנימי בלי כפתור עוטף מזוהה */
    if (!out) {
      popup.querySelectorAll('span,div').forEach(function (s) {
        if (out || s.children.length || s.closest('.mhq-card')) return;
        if (isShowMore(s)) out = s.closest('button,[role="button"],a,.v-btn') || s;
      });
    }
    return out;
  }

  /* חתימת מצב: אם היא לא משתנה אחרי לחיצה — אין יותר מה לפתוח */
  function expandSig(popup) {
    var boxes = popup.querySelectorAll('input[type="checkbox"]').length;
    var btns = 0;
    popup.querySelectorAll('button,[role="button"],a,.v-btn').forEach(function (b) {
      if (isShowMore(b)) btns++;
    });
    return boxes + '|' + btns;
  }

  function tryExpand(popup, hasPattern) {
    if (!hasPattern || EXPAND_N >= MAX_EXPAND) return false;
    var btn = findShowMore(popup);
    if (!btn) return false;

    /* חתימה ולא ספירת תיבות בלבד: קבוצה שנפתחת בלי להוסיף תיבות
       (למשל רשימת שתייה) עדיין נחשבת התקדמות, ולכן נמשיך לקבוצה הבאה */
    var before = expandSig(popup);
    EXPAND_N++;
    BUSY = true;                       /* חוסם סריקות בזמן שה-DOM משתנה */
    btn.click();

    setTimeout(function () {
      BUSY = false;
      var p2 = pizzaRoot();
      if (!p2) return;
      var after = expandSig(p2);
      if (after === before) {
        EXPAND_N = MAX_EXPAND;         /* שום דבר לא זז — עוצרים */
        console.log('%c[mhq] אין יותר מה לפתוח', 'color:#e31e24');
      } else {
        console.log('%c[mhq] נפתחה רשימה: ' + before + ' -> ' + after +
          ' (תיבות|כפתורים)', 'color:#e31e24');
      }
      scan();
    }, 280);

    return true;
  }

  /* ==========================================================================
     8. סריקה ראשית
     ========================================================================== */
  function scan() {
    try { scanInner(); }
    catch (err) { console.error('[mhq] שגיאה בסריקה — הממשק נשאר כפי שהוא:', err); }
  }

  /* [v1.3] שורש הווידג'ט: עד היום רק '.product-popup'. מאז שקישורים ישירים
     לעמוד המוצר (‎/m/<slug>/<id>/product/<pid>‎) נכנסו לשימוש, אותו מוצר נפתח
     גם כעמוד מלא — DOM אחר, בלי הפופאפ — ובורר הרבעים פשוט לא נטען והלקוח
     ראה רשימת תיבות. הפתרון: בעמוד מוצר (‏/product/ ב-URL) השורש הוא #app.
     מוגבל ל-URL של מוצר בכוונה, כדי שלא נסרוק את כל האפליקציה בדפים אחרים. */
  function pizzaRoot() {
    var popup = document.querySelector('.product-popup');
    if (popup) return popup;
    if (!/\/product\//.test(location.pathname)) return null;
    return document.querySelector('#app') || document.querySelector('.v-application');
  }

  function scanInner() {
    if (BUSY) return;
    var popup = pizzaRoot();
    if (!popup) return;

    /* מוצר חדש = מאפסים את מונה הפתיחות */
    if (popup !== LAST_POPUP) { LAST_POPUP = popup; EXPAND_N = 0; }

    if (OBSERVER) OBSERVER.disconnect();   /* מונע לולאה. חסרון: אירועים בחלון הזה אובדים */

    try {
      var map = collect(popup), seen = {}, firstGrid = null;

      map.forEach(function (t, name) {
        seen[name] = true;
        t.rows.forEach(function (r) {
          if (!r.classList.contains('mhq-hidden')) r.classList.add('mhq-hidden');
        });

        var parent = t.anchor.parentNode;
        /* כל כללי ה-CSS של הבורר ממוקדים ב-'.product-popup .mhq-*'. בעמוד
           המוצר העצמאי אין פופאפ, ולכן הכרטיסים רונדרו בלי שום עיצוב —
           הבדיקה cssLoaded() לא תפסה את זה כי כלל ה-probe אינו ממוקד.
           מסמנים את ההורה, וכל הכללים הקיימים חלים. */
        if (!parent.closest('.product-popup')) parent.classList.add('product-popup', 'mhq-scope');
        var grid = parent.querySelector(':scope > [data-mhq-grid]');
        if (!grid) {
          grid = document.createElement('div');
          grid.className = 'mhq-grid';
          grid.setAttribute('data-mhq-grid', '1');
          parent.insertBefore(grid, t.anchor);
        }
        if (!firstGrid) firstGrid = grid;

        var card = popup.querySelector('.mhq-card[data-mhq="' + CSS.escape(name) + '"]');
        if (!card) card = buildCard(name);
        if (card.parentNode !== grid) grid.appendChild(card);
        card.__t = t;
        paint(card, t);
      });

      var prev = popup.querySelector('.mhq-preview');
      if (firstGrid) {
        if (!prev) prev = buildPreview();
        if (prev.nextElementSibling !== firstGrid) firstGrid.parentNode.insertBefore(prev, firstGrid);
        paintPreview(prev, map, findHeroImg(popup));
      } else if (prev) { prev.remove(); }

      popup.querySelectorAll('.mhq-card').forEach(function (c) {
        if (!seen[c.getAttribute('data-mhq')]) c.remove();
      });
      popup.querySelectorAll('[data-mhq-grid]').forEach(function (g) {
        if (!g.children.length) g.remove();
      });

      var line = Array.from(map.keys()).join(', ');
      if (line !== LAST_LOG) {
        LAST_LOG = line;
        console.log('%c[mhq] תוספות שזוהו: ' + (line || '(אין)'), 'color:#e31e24;font-weight:bold');
      }

      /* [v0.7] הרשת שלנו מחליפה את הרשימה, ולכן "להראות יותר" מיותר.
         נמדד: לחיצה עליו לא מוחקת את הכרטיסים, אז זה קוסמטי בלבד. */
      if (map.size > 0) {
        popup.querySelectorAll('button,[role="button"],a,.v-btn').forEach(function (b) {
          if (b.closest('.mhq-card')) return;
          if (isShowMore(b) || isShowLess(b)) b.classList.add('mhq-hidden');
        });
      }

      /* [v0.5] אם זו פיצרייה ויש עוד אופציות מקופלות — לפתוח ולסרוק שוב */
      PENDING_EXPAND = map.size > 0;
    } finally {
      if (OBSERVER) OBSERVER.observe(document.body, { childList: true, subtree: true });
    }

    /* מחוץ ל-try: הפתיחה משנה DOM ולכן חייבת לרוץ אחרי שהחיישן חובר מחדש */
    if (PENDING_EXPAND) tryExpand(popup, true);
  }

  /* ==========================================================================
     9. CSS
     ========================================================================== */
  /* ה-CSS חי ב-global-cdn.css (חפש: "Pizza Quarters").
     כאן רק נבדק שהוא באמת נטען — אם לא, הסקריפט לא מרנדר כלום
     ומשאיר את רשימת הצ'קבוקסים המקורית עובדת. עדיף ממשק ישן
     מאשר ממשק שבור. */
  function cssLoaded() {
    var probe = document.createElement('div');
    probe.className = 'mhq-css-probe';
    probe.style.cssText = 'position:absolute;visibility:hidden';
    var host = pizzaRoot() || document.body;
    host.appendChild(probe);
    var ok = getComputedStyle(probe).getPropertyValue('--mhq') .trim() === 'on';
    probe.remove();
    return ok;
  }

  /* ==========================================================================
     10. הפעלה
     ========================================================================== */
  /* שער כניסה: בלי ה-CSS אין ממשק. יוצאים בשקט ומשאירים את המקור. */
  if (!cssLoaded()) {
    console.warn('[mhq] ה-CSS לא נטען מ-global-cdn.css — הממשק לא הופעל');
    return;
  }
  document.addEventListener('click', onAddClick, true);

  OBSERVER = new MutationObserver(function () {
    if (BUSY) return;
    cancelAnimationFrame(RAF);
    RAF = requestAnimationFrame(scan);
  });
  /* [v1.1] חיבור מיידי. בלי זה, אם אין פופאפ בטעינת הדף — החיישן לא מחובר
     לעולם, כי scanInner() יוצאת לפני ה-finally שמחבר אותו. */
  OBSERVER.observe(document.body, { childList: true, subtree: true });

  scan();
  settle();   /* תופס תמונות שנטענות אחרי הסריקה הראשונה */

  window.__mhq = {
    scan: scan,
    settle: settle,
    stats: function () {
      var p = pizzaRoot();
      if (!p) return 'אין פופאפ';
      var cards = [].slice.call(p.querySelectorAll('.mhq-card'));
      return {
        cards: cards.length,
        halves: cards.filter(function (c) { return c.classList.contains('mhq-halves'); }).length,   /* mhq-halves-v1 */
        withImage: cards.filter(function (c) { return c.querySelector('img.mhq-thumb'); }).length,
        grids: p.querySelectorAll('[data-mhq-grid]').length,
        hiddenRows: p.querySelectorAll('.mhq-hidden').length,
        expansions: EXPAND_N,
        requiredGroups: requiredGroups(p).length,
        heroImg: !!findHeroImg(p),
        checked: [].slice.call(p.querySelectorAll('input[type=checkbox]'))
          .filter(function (i) { return i.checked; })
          .map(function (i) { return i.closest('.v-list-item').innerText.replace(/\s+/g, ' ').trim(); })
      };
    },
    /* ------------------------------------------------------------------
       audit() — כלי בדיקת תפריט. מדפיס לכל תוספת:
         1. אילו אפשרויות זוהו ואילו רבעים כל אחת מכסה
         2. אפשרויות שלא זוהו (שגיאת כתיב בשם — לא יעבדו!)
         3. סימולציה של כל 15 הבחירות האפשריות וכמה שורות בון כל אחת
            תייצר — בלי להזמין ובלי להדפיס
       ------------------------------------------------------------------ */
    audit: function () {
      var p = document.querySelector('.product-popup');
      if (!p) { console.error('פתח פופאפ מוצר תחילה'); return; }
      var map = collect(p);

      /* אפשרויות עם סוגריים שלא זוהו — כאן מתגלות שגיאות כתיב */
      var unknown = [];
      p.querySelectorAll('input[type="checkbox"]').forEach(function (inp) {
        var row = inp.closest('.v-list-item');
        if (!row || row.closest('.mhq-card')) return;
        var ttl = row.querySelector('.v-list-item-title');
        if (!ttl) return;
        var lbl = ttl.innerText.replace(/\s+/g, ' ').trim();
        var parts = splitLabel(lbl);
        if (parts && !parseVariant(parts.inner)) unknown.push(lbl);
      });
      if (unknown.length) {
        console.log('%c⚠️ אפשרויות שלא זוהו — בדוק כתיב:', 'color:#b3161b;font-weight:bold');
        unknown.forEach(function (u) { console.log('   ' + u); });
      }

      var NAMES = { 1: 'ימין עליון', 2: 'שמאל עליון', 3: 'שמאל תחתון', 4: 'ימין תחתון' };
      var worst = 0, totalLines = 0, cases = 0;

      map.forEach(function (t, name) {
        console.log('%c▸ ' + name, 'color:#e31e24;font-weight:bold');
        console.log('   אפשרויות: ' + t.opts.map(function (o) {
          return o.label + ' [' + o.quarters.map(function (q) { return NAMES[q]; }).join(' + ') + ']';
        }).join('  |  '));

        var rows = [];
        for (var bits = 1; bits < 16; bits++) {
          var sel = new Set();
          for (var i = 0; i < 4; i++) if (bits & (1 << i)) sel.add(i + 1);
          var plan = computePlan(t, sel);
          var picked = plan.ok
            ? t.opts.filter(function (o) { return plan.checks.get(o.input); })
                .map(function (o) { return o.label; }).join(' + ')
            : '✗ ' + plan.reason;
          rows.push({
            'בחירת הלקוח': Array.from(sel).map(function (q) { return NAMES[q]; }).join(' + '),
            'שורות בבון': plan.ok ? plan.lines : '✗',
            'מחיר': plan.ok ? plan.price : '-',
            'מה יודפס': picked
          });
          if (plan.ok) { totalLines += plan.lines; cases++; if (plan.lines > worst) worst = plan.lines; }
        }
        console.table(rows);
      });

      console.log('%cסיכום: ממוצע ' + (totalLines / (cases || 1)).toFixed(2) +
        ' שורות לתוספת | הגרוע ביותר ' + worst + ' שורות',
        'color:#e31e24;font-weight:bold');
    },

    destroy: function () {
      SETTLE.forEach(clearTimeout); SETTLE = [];
      EXPAND_N = 0; LAST_POPUP = null; PENDING_EXPAND = false;
      if (OBSERVER) OBSERVER.disconnect();
      document.removeEventListener('click', onAddClick, true);
      document.querySelectorAll('.mhq-card,.mhq-preview,[data-mhq-grid],.mhq-alert').forEach(function (c) { c.remove(); });
      document.querySelectorAll('.mhq-hidden').forEach(function (r) { r.classList.remove('mhq-hidden'); });
      delete window.__mhq;
      console.log('[mhq] בוטל, הרשימה המקורית חזרה');
    }
  };

  console.log('%c[mhq] Pizza Quarters פעיל. בדיקה: __mhq.stats()  |  ביטול: __mhq.destroy()',
    'color:#e31e24;font-weight:bold');
})();

/* =========================================================================
   אכיפת סוג משלוח לפי מיקום — MH Zone Enforcement  |  v1.5.0 | 2026-10-05 (v1.4.0: 26.9)
   -------------------------------------------------------------------------
   מה זה עושה:
     מסווג את כתובת המסירה של הלקוח מול פוליגון מעלה אדומים (כולל מישור
     אדומים), וכופה את סוג ההזמנה הנכון:
       בתוך העיר  → delivery  (התעריף הזול)
       מחוץ לעיר  → custom_2  (התעריף היקר)

     v1.4.0 — עסק שנמצא מחוץ לעיר (למשל פלאפל בתחנה, כפר אדומים):
       כל ההזמנות ממנו → custom_2, לא משנה איפה הלקוח.
     v1.4.0 — רשת ביטחון: הסקריפט לעולם לא מחליף לסוג הזמנה שהעסק לא
       מציע (accepted_order_types). בלי זה השרת דוחה → מסך לבן בתשלום.
       עסק לא מזוהה / סוג לא נתמך → לא נוגעים (נכשל פתוח) + אזהרה + מונה.
       מידע העסק נשמר ב-localStorage (mh_zone_merchants) כי אחרי רענון
       עמוד התשלום merchantData ריק.

     v1.5.0 — כמה אזורים (ZONES): מעלה אדומים (כולל מישור אדומים) וכפר אדומים
       (כולל נופי פרת, אזור החילזון ותחנת הדלק בצומת). הכלל: לקוח ועסק באותו אזור →
       delivery ("משלוח בתוך העיר"); כל השאר → custom_2 ("משלוח מחוץ לעיר").
       עסק בלי מיקום בפאנל → custom_2 (נכשל סגור: בספק משלמים יותר, לא פחות).
       השמות של סוגי ההזמנה לא משנים כלום — הקוד עובד רק עם המזהים.

     "איסוף עצמי" (pickup) ו"הוצאה לרכב" (custom_1) — הסקריפט לא נוגע בהם
     לעולם. אם הלקוח בוחר באחד מהם, הסקריפט מזהה ומרפה.

   שתי שכבות:
     1. רשת   — מתקן את order_type בקריאות cart/validate ובשליחת ההזמנה.
                זו שכבת הכסף. נכשלת סגור: בכל ספק → התעריף היקר.
     2. תצוגה — מציג את האופציה הנכונה, מסתיר את השגויה, ומוסיף שורת הסבר.
                נכשלת פתוח: אם המבנה לא מזוהה — לא מסתיר כלום.

   למה ברמת הרשת ולא ב-DOM:
     מבנה ה-DOM של Hyperzod משתנה בעדכוני גרסה (data-v-XXXXX ומחלקות
     Tailwind). מבנה ה-API יציב הרבה יותר. שכבת הכסף לא תלויה ב-DOM כלל.

   Dependencies: אין. וניל JS.

   אבחון בייצור (לוגים כבויים כברירת מחדל):
     localStorage.setItem('mh_zone_debug','1')  → רענן → לוגים מלאים
     localStorage.removeItem('mh_zone_debug')   → כיבוי
     MH_ZONE.stats()      — מוני פעולות + הסיווג האחרון
     MH_ZONE.test()       — 7 נקודות ביקורת גיאוגרפיות
     MH_ZONE.check(lat,lng) — סיווג נקודה בודדת
     MH_ZONE.showAll()    — חילוץ חירום: מחזיר את כל האופציות לגלויות

   עדכון גבול העיר: לערוך את CFG.POLY בלבד. פורמט GeoJSON — [lng, lat].
   ========================================================================= */
(function () {
'use strict';

if (window.__MH_ZONE__) { return; }
window.__MH_ZONE__ = true;

var CFG = {
  VERSION:      '1.5.0',
  MLS:          'mh_zone_merchants',   /* מטמון מידע עסקים: מיקום + סוגי הזמנה */
  INSIDE_TYPE:  'delivery',
  OUTSIDE_TYPE: 'custom_2',
  MANAGED:      ['delivery', 'custom_2'],
  EDGE_WARN_M:  300,
  NOTE_ID:      'mh-zone-note',
  MAX_CLICKS:   8,
  DEBUG:        (function(){ try { return localStorage.getItem('mh_zone_debug') === '1'; }
                             catch(e){ return false; } })(),
  /* גבול מעלה אדומים + מישור אדומים. מכויל מול Google Geocoding, 10/10. */
  POLY: [
    [35.2780,31.7780],[35.2800,31.7900],[35.2920,31.7960],[35.3100,31.7990],
    [35.3300,31.8090],[35.3550,31.8120],[35.3750,31.8020],[35.3780,31.7860],
    [35.3450,31.7800],[35.3200,31.7760],[35.3150,31.7620],[35.2960,31.7510],
    [35.2820,31.7620]
  ],
  /* כפר אדומים — מכויל מול ה-reverse geocode של Hyperzod (רשת 374 נקודות, 5.10): כל נקודה שגוגל קורא לה
     "כפר אדומים" + נופי פרת + החילזון (וופל בוס, טוסטראק) + תחנת הדלק בצומת (פלאפל בתחנה). אלון בחוץ.
     לא חופף לפוליגון מעלה אדומים (הקצה הצפוני שלו ~31.811 באזור הצומת). */
  KA_POLY: [
    [35.3185,31.8290],[35.3335,31.8290],[35.3335,31.8315],[35.3455,31.8315],[35.3455,31.8215],
    [35.3515,31.8215],[35.3515,31.8140],[35.3440,31.8140],[35.3440,31.8160],[35.3065,31.8160],
    [35.3065,31.8212],[35.3125,31.8237],[35.3155,31.8262]
  ]
};
/* האזורים. סדר חשוב רק אם יחפפו (לא חופפים). */
CFG.ZONES = [ { id:'MA', poly:CFG.POLY }, { id:'KA', poly:CFG.KA_POLY } ];

/* קירוב שטוח — מדויק לחלוטין בסקאלה של עיר (קו רוחב ~31.79°) */
var MLAT = 111320, MLNG = 94640;
var S = { vSeen:0, vFixed:0, oSeen:0, oFixed:0,
          uiClicks:0, uiHides:0, uiShows:0, uiSkips:0, errors:0,
          mOut:0, mUnknown:0, guardSkips:0 };
var LAST = { zone:null, type:null, addr:null };
var appliedSig = null, busy = false;

function log(){ if(CFG.DEBUG) console.log.apply(console,
  ['%c[MH-ZONE]','color:#e31e24;font-weight:bold'].concat([].slice.call(arguments))); }
function warn(){ console.warn.apply(console,['[MH-ZONE]'].concat([].slice.call(arguments))); }

/* ---------- גיאומטריה ---------- */

/* Ray casting — point in polygon */
function inPoly(lng, lat, p) {
  var ins = false;
  for (var i=0, j=p.length-1; i<p.length; j=i++) {
    var xi=p[i][0], yi=p[i][1], xj=p[j][0], yj=p[j][1];
    if (((yi>lat)!==(yj>lat)) && (lng < (xj-xi)*(lat-yi)/(yj-yi) + xi)) ins = !ins;
  }
  return ins;
}

/* מרחק במטרים מהגבול — להתראה על מקרי קצה בלבד, לא משנה סיווג */
function edgeDist(lng, lat, p) {
  var px=lng*MLNG, py=lat*MLAT, best=Infinity;
  for (var i=0, j=p.length-1; i<p.length; j=i++) {
    var ax=p[j][0]*MLNG, ay=p[j][1]*MLAT, bx=p[i][0]*MLNG, by=p[i][1]*MLAT;
    var dx=bx-ax, dy=by-ay, L=dx*dx+dy*dy;
    var t = L ? Math.max(0, Math.min(1, ((px-ax)*dx+(py-ay)*dy)/L)) : 0;
    best = Math.min(best, Math.hypot(px-(ax+t*dx), py-(ay+t*dy)));
  }
  return best;
}

function okCoord(lat, lng){ return isFinite(lat) && isFinite(lng) && !(lat===0 && lng===0); }
/* באיזה אזור הנקודה: 'MA' / 'KA' / null (מחוץ לכל האזורים) */
function zoneOf(lat, lng){
  if (!okCoord(lat, lng)) return null;
  for (var i=0;i<CFG.ZONES.length;i++) if (inPoly(lng, lat, CFG.ZONES[i].poly)) return CFG.ZONES[i].id;
  return null;
}
/* סיווג כתובת לקוח. קואורדינטה חסרה או לא תקינה → UNKNOWN (Fail-Closed) */
function classify(lat, lng) {
  if (!okCoord(lat, lng)) return { zone:'UNKNOWN', cz:null, type:CFG.OUTSIDE_TYPE, edge:null };
  var cz = zoneOf(lat, lng), d = Infinity;
  CFG.ZONES.forEach(function(z){ d = Math.min(d, edgeDist(lng, lat, z.poly)); });
  d = Math.round(d);
  if (d < CFG.EDGE_WARN_M) warn('קרוב לגבול ('+d+' מ׳):', lat, lng, cz || 'מחוץ לאזורים');
  /* בלי עסק ידוע: התנהגות v1.4 — בתוך מעלה אדומים = delivery */
  return { zone: cz || 'OUTSIDE', cz: cz, type: cz==='MA' ? CFG.INSIDE_TYPE : CFG.OUTSIDE_TYPE, edge:d };
}

/* שליפת קואורדינטה לפי מזהה כתובת מתוך vuex */
function addrById(id) {
  if (!id) return null;
  try {
    var l = ((JSON.parse(localStorage.getItem('vuex')||'{}').Address)||{}).addresses||[];
    for (var i=0;i<l.length;i++) {
      if (l[i].id===id || l[i]._id===id) {
        var c = l[i].location_lat_lon||[];
        return { lat:+c[0], lng:+c[1], text:l[i].address };
      }
    }
  } catch(e){ S.errors++; warn('vuex', e); }
  return null;
}

/* ---------- מידע עסקים (v1.4.0) ---------- */

/* מטמון: { merchantId: { lat, lng, acc:[order types], out:bool, ts } } */
var MC = {};
try { MC = JSON.parse(localStorage.getItem(CFG.MLS) || '{}') || {}; } catch(e){ MC = {}; }

function store(){
  try { var a = document.querySelector('#app'), v = a && a.__vue_app__;
        return (v && v.config && v.config.globalProperties.$store) || null; }
  catch(e){ return null; }
}

/* אובייקט עסק של Hyperzod → רשומת מטמון. merchant_location = GeoJSON [lng,lat];
   merchant_address_location = [lat,lng]. מחזיר null אם אין מזהה. */
function merchInfo(d){
  if (!d || typeof d !== 'object') return null;
  var id = d.merchant_id || d._id; if (!id) return null;
  var r = { id: String(id) };
  var loc = d.merchant_location || d.merchant_address_location, lat, lng;
  if (loc && Array.isArray(loc.coordinates)) { lng = +loc.coordinates[0]; lat = +loc.coordinates[1]; }
  else if (Array.isArray(loc)) { lat = +loc[0]; lng = +loc[1]; }
  if (isFinite(lat) && isFinite(lng) && !(lat===0 && lng===0)) {
    r.lat = lat; r.lng = lng; r.out = zoneOf(lat, lng) !== 'MA';   /* out נשמר לתאימות; ההחלטה לפי zoneOf */
  }
  if (Array.isArray(d.accepted_order_types)) r.acc = d.accepted_order_types.slice();
  return r;
}

/* קורא את העסקים שהאפליקציה מחזיקה (דף עסק + עגלה) ומעדכן מטמון.
   מידע חדש דורס ישן — כך שינוי בפאנל נקלט בביקור הבא בדף העסק. */
function snapMerchants(){
  var st = store(); if (!st) return;
  var list = [];
  try {
    var M = st.state.Merchant || {}, C = st.state.Cart || {};
    list.push(M.merchantData);
    if (Array.isArray(C.cartMerchant)) list = list.concat(C.cartMerchant);
    if (st.getters) list.push(st.getters.getCartMerchant);
  } catch(e){ S.errors++; warn('snap', e); return; }
  var changed = false;
  list.forEach(function(d){
    var r = merchInfo(d); if (!r) return;
    var old = MC[r.id] || {}, nw = {
      lat: ('lat' in r) ? r.lat : old.lat, lng: ('lng' in r) ? r.lng : old.lng,
      out: ('out' in r) ? r.out : old.out, acc: r.acc || old.acc };
    if (JSON.stringify([old.lat,old.lng,old.out,old.acc]) !==
        JSON.stringify([nw.lat,nw.lng,nw.out,nw.acc])) {
      nw.ts = Date.now(); MC[r.id] = nw; changed = true;
      log('🏪 עסק נקלט:', r.id, nw.out ? 'מחוץ לעיר' : 'בתוך העיר', nw.acc);
    }
  });
  if (changed) { try { localStorage.setItem(CFG.MLS, JSON.stringify(MC)); } catch(e){} }
}

function merchById(id){
  if (!id) return null;
  try { snapMerchants(); } catch(e){ S.errors++; }
  return MC[String(id)] || null;
}

/* ההחלטה המרכזית. cur = הסוג שהאפליקציה ביקשה.
   מחזיר את הסיווג; skip=true → לא לשנות את הבקשה. */
function decide(lat, lng, mid, cur){
  var c = classify(lat, lng);                         /* לפי כתובת הלקוח */
  var m = merchById(mid);
  if (m) {
    var mz = okCoord(m.lat, m.lng) ? zoneOf(m.lat, m.lng) : undefined;
    if (mz === undefined) {                           /* עסק בלי מיקום → חוץ (נכשל סגור) */
      c = { zone:'MERCHANT_NO_LOCATION', cz:c.cz, type:CFG.OUTSIDE_TYPE, edge:c.edge }; S.mOut++;
    } else if (c.cz && c.cz === mz) {                 /* אותו אזור → בתוך העיר */
      c = { zone:'SAME_'+mz, cz:c.cz, type:CFG.INSIDE_TYPE, edge:c.edge };
    } else {                                          /* אזורים שונים / עסק מחוץ לאזורים → חוץ */
      c = { zone:(mz ? 'MERCHANT_'+mz : 'MERCHANT_OUTSIDE')+'_CUSTOMER_'+(c.cz||'OUT'), cz:c.cz, type:CFG.OUTSIDE_TYPE, edge:c.edge };
      if (mz !== 'MA') S.mOut++;
    }
  }
  if (!m || !Array.isArray(m.acc)) {                  /* לא יודעים מה העסק מציע */
    if (c.type === cur) return c;
    S.mUnknown++; warn('עסק לא מזוהה — לא משנים את', cur, '| merchant:', mid);
    c.skip = true; return c;
  }
  if (m.acc.indexOf(c.type) === -1) {                 /* העסק לא מציע את הסוג הרצוי */
    /* v1.5: משאירים את מה שהאפליקציה ביקשה אם העסק מציע אותו; אחרת "מחוץ לעיר" אם מוצע.
       (מקרה: לקוח בכפר אדומים בעסק שעוד אין לו delivery, והאפליקציה זוכרת delivery מעסק קודם) */
    var alt = m.acc.indexOf(cur) !== -1 ? cur : (m.acc.indexOf(CFG.OUTSIDE_TYPE) !== -1 ? CFG.OUTSIDE_TYPE : null);
    S.guardSkips++; warn('העסק לא מציע', c.type, '→', alt || cur, '| merchant:', mid);
    if (!alt || alt === cur) { c.skip = true; return c; }
    c = { zone:c.zone+'_FALLBACK', cz:c.cz, type:alt, edge:c.edge };
  }
  return c;
}

/* ---------- שכבה 1: רשת (שכבת הכסף) ---------- */

/* cart/validate נושאת גם את סוג ההזמנה וגם את הקואורדינטה, וממנה נגזר
   ה-checksum והמחיר. לכן זו נקודת האכיפה — ולא ה-POST הסופי. */
function fixValidate(url) {
  if (url.indexOf('/cart/validate') === -1) return url;
  var u; try { u = new URL(url, location.origin); } catch(e){ return url; }
  var ot = u.searchParams.get('order_type');
  if (CFG.MANAGED.indexOf(ot) === -1) return url;   /* pickup / custom_1 — לא נוגעים */
  S.vSeen++;

  var aid = u.searchParams.get('address_id');
  var loc = u.searchParams.getAll('delivery_location[]'), lat, lng;
  if (loc.length >= 2) { lat=parseFloat(loc[0]); lng=parseFloat(loc[1]); }
  else { var a0 = addrById(aid); if (a0){ lat=a0.lat; lng=a0.lng; } }
  if (!isFinite(lat) || !isFinite(lng)) return url;   /* אין כתובת עדיין */

  var c = decide(lat, lng, u.searchParams.get('merchant_id'), ot), rec = addrById(aid);
  LAST = { zone:c.zone, type:c.type, addr: rec ? rec.text : null };
  setTimeout(reconcileUI, 60);

  if (c.type === ot) { log('✓ validate תקין:', ot, '|', c.zone); return url; }
  if (c.skip) return url;                             /* רשת ביטחון — לא נוגעים */
  u.searchParams.set('order_type', c.type);
  S.vFixed++;
  log('🔧 validate:', ot, '→', c.type, '|', c.zone);
  return u.toString();
}

/* POST /store/v1/order — רשת ביטחון אחרונה. במצב תקין oFixed נשאר 0. */
function fixOrder(body) {
  if (typeof body !== 'string') return body;
  var o; try { o = JSON.parse(body); } catch(e){ return body; }
  if (!o || CFG.MANAGED.indexOf(o.order_type) === -1) return body;
  S.oSeen++;

  var a = addrById(o.delivery_address_id);
  if (!a) warn('POST: כתובת לא נמצאה — מסווג כחוץ (בכפוף לרשת הביטחון)');
  /* כתובת חסרה → classify מחזיר UNKNOWN=חוץ (Fail-Closed), אבל decide
     לא יחליף לסוג שהעסק לא מציע */
  var c = decide(a ? a.lat : NaN, a ? a.lng : NaN, o.merchant_id, o.order_type);
  if (c.type === o.order_type) { log('✅ POST תקין:', o.order_type, '|', c.zone); return body; }
  if (c.skip) return body;                            /* רשת ביטחון — לא נוגעים */
  log('🔧 POST:', o.order_type, '→', c.type, '|', c.zone);
  o.order_type = c.type; S.oFixed++;
  return JSON.stringify(o);
}

var IS_ORDER = /\/store\/v1\/order(\?|$)/;

/* Hyperzod משתמשת ב-axios שרץ על XHR. fetch עטוף ליתר ביטחון. */
var _o = XMLHttpRequest.prototype.open, _s = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.open = function(m, url) {
  var a = [].slice.call(arguments);
  try { a[1] = fixValidate(String(url)); } catch(e){ S.errors++; warn('open', e); }
  this.__mhU = String(a[1]);
  return _o.apply(this, a);
};
XMLHttpRequest.prototype.send = function(b) {
  try { if (this.__mhU && IS_ORDER.test(this.__mhU)) b = fixOrder(b); }
  catch(e){ S.errors++; warn('send', e); }
  return _s.call(this, b);
};
var _f = window.fetch;
window.fetch = function(input, init) {
  try {
    if (typeof input === 'string') {
      input = fixValidate(input);
      if (init && init.body && IS_ORDER.test(input))
        init = Object.assign({}, init, { body: fixOrder(init.body) });
    }
  } catch(e){ S.errors++; warn('fetch', e); }
  return _f.call(this, input, init);
};

/* ---------- שכבה 2: תצוגה (נכשלת פתוח) ---------- */

function currentChecked(){
  var el = document.querySelector('.custom-radio.checked[value]');
  return el ? el.getAttribute('value') : null;
}

function noteEl(container, create){
  var n = document.getElementById(CFG.NOTE_ID);
  if (n || !create) return n;
  n = document.createElement('div');
  n.id = CFG.NOTE_ID;
  n.setAttribute('style',
    'background:#fff5f5;border:1px solid rgba(227,30,36,.18);border-radius:12px;' +
    'padding:8px 12px;margin:8px 0 0;font-size:12.5px;line-height:1.5;' +
    'color:#4a5568;direction:rtl;text-align:right;');
  container.parentElement.insertBefore(n, container.nextSibling);
  return n;
}

function reconcileUI(){
  if (busy || !LAST.type) return;
  try {
    busy = true;

    /* עוגן: ל-.custom-radio יש value עם ה-slug. יציב וסמנטי.
       לא משתמשים ב-data-v-XXXXX — הוא משתנה בעדכוני גרסה. */
    var rIn  = document.querySelector('.custom-radio[value="'+CFG.INSIDE_TYPE+'"]');
    var rOut = document.querySelector('.custom-radio[value="'+CFG.OUTSIDE_TYPE+'"]');
    if (!rIn || !rOut) return;                        /* אין בורר → לא נוגעים */
    var iIn  = rIn.closest('.v-list-item');
    var iOut = rOut.closest('.v-list-item');
    if (!iIn || !iOut) return;                        /* מבנה השתנה → לא נוגעים */

    var outside   = (LAST.type === CFG.OUTSIDE_TYPE);
    var keepItem  = outside ? iOut : iIn;
    var keepRadio = outside ? rOut : rIn;
    var hideItem  = outside ? iIn  : iOut;

    /* קודם להחזיר את הנכון, ורק אז להסתיר את השגוי.
       בלי ההחזרה, החלפת כתובת משאירה את שניהם מוסתרים. */
    if (keepItem.style.display === 'none') {
      keepItem.style.display = ''; S.uiShows++;
      log('👁 הוחזר:', LAST.type);
    }
    if (hideItem.style.display !== 'none') {
      hideItem.style.display = 'none'; S.uiHides++;
      log('🙈 הוסתר:', outside ? CFG.INSIDE_TYPE : CFG.OUTSIDE_TYPE);
    }

    var cur = currentChecked();
    var isDelivery = !cur || CFG.MANAGED.indexOf(cur) !== -1;

    /* שורת ההסבר רלוונטית רק במשלוח. באיסוף עצמי היא מבלבלת. */
    var n = noteEl(keepItem.parentElement, isDelivery);
    if (n) n.style.display = isDelivery ? '' : 'none';
    if (n && isDelivery) {
      var txt = '📍 סוג המשלוח נקבע לפי הכתובת' + (LAST.addr ? ': ' + LAST.addr : '');
      if (n.textContent !== txt) n.textContent = txt;
    }

    /* הלקוח בחר איסוף עצמי / הוצאה לרכב — בחירה לגיטימית. מרפים. */
    if (!isDelivery) { S.uiSkips++; return; }

    /* בחירה אוטומטית — פעם אחת לכל צירוף כתובת/סיווג.
       appliedSig + MAX_CLICKS מונעים לולאת קליקים מול MutationObserver. */
    var sig = LAST.type + '|' + (LAST.addr||'');
    if (!keepRadio.classList.contains('checked') && appliedSig !== sig
        && S.uiClicks < CFG.MAX_CLICKS) {
      appliedSig = sig; S.uiClicks++;
      keepItem.click();
      log('🖱 נבחר אוטומטית:', LAST.type);
    }

  } catch(e){ S.errors++; warn('reconcileUI', e); }
  finally { busy = false; }
}

/* SPA — הבורר נוצר ונהרס בניווט. debounce 200ms. */
var t = null;
new MutationObserver(function(){
  clearTimeout(t); t = setTimeout(function(){
    try { snapMerchants(); } catch(e){ S.errors++; }   /* v1.4.0: קליטת עסקים למטמון */
    reconcileUI();
  }, 200);
}).observe(document.body, { childList:true, subtree:true });

/* ---------- אבחון ---------- */
window.MH_ZONE = {
  version: CFG.VERSION,
  stats: function(){ console.table(S); console.log('סיווג:', LAST, '| applied:', appliedSig); return S; },
  check: function(lat,lng){ return classify(lat,lng); },
  zone: function(lat,lng){ return zoneOf(lat,lng); },
  decide: function(lat,lng,mid,cur){ return decide(lat,lng,mid,cur); },
  merchants: function(){ snapMerchants(); console.table(MC); return MC; },
  reset: function(){ S.uiClicks = 0; appliedSig = null; },
  showAll: function(){
    [].forEach.call(document.querySelectorAll('.custom-radio[value]'), function(r){
      var it = r.closest('.v-list-item'); if (it) it.style.display = '';
    });
    var n = document.getElementById(CFG.NOTE_ID); if (n) n.remove();
    console.log('[MH-ZONE] כל האופציות הוחזרו');
  },
  test: function(){
    [['מרכז מעלה אדומים',31.7715,35.2986,'MA'],
     ['מצפה נבו',31.7927,35.3029,'MA'],
     ['מישור אדומים',31.7936,35.3337,'MA'],
     ['כפר אדומים — המייסדים',31.8272,35.3372,'KA'],
     ['נופי פרת',31.8200,35.3110,'KA'],
     ['כפר אדומים — החילזון',31.8201,35.3491,'KA'],
     ['כפר אדומים — תחנת הדלק בצומת',31.8153,35.3496,'KA'],
     ['אלון',31.8334,35.3536,null],
     ['הר הצופים',31.7931,35.2449,null]]
    .forEach(function(x){
      var z = zoneOf(x[1],x[2]);
      console.log((z===x[3]?'✅':'❌ שגוי!'), x[0], '→', z);
    });
  }
};

log('פעיל | גרסה', CFG.VERSION);
})();

/* =========================================================================
   הזמנה מראש בלבד — MH Preorder Scheduling Guard  |  v1.0.1 | 2026-09-05 (v1.0.1 7.10: הסתרת "מיידי" עם !important)
   -------------------------------------------------------------------------
   מה זה עושה:
     מוצר שבתיאורו כתוב "להזמנה 24 שעות מראש" (או "יום מראש" / "הזמנה מראש")
     אפשר להזמין רק ב"משלוח מתוזמן". כשיש מוצר כזה בעגלה:
       1. רשת   — POST /store/v1/order בלי scheduling_slot.is_scheduled=true
                  נחסם לפני השליחה + טוסט אדום. זו שכבת הכסף.
       2. תצוגה — שורת "משלוח מיידי" (#deliveryTime) מוסתרת, נוספת שורת הסבר,
                  ובורר המועדים נפתח אוטומטית פעם אחת. נכשלת פתוח: מבנה לא
                  מזוהה → לא מסתירים כלום.
     עגלה בלי מוצרי "מראש" → הסקריפט לא נוגע בכלום (מיידי + מתוזמן נשארים).
     פעיל רק כשלמרצ'נט של העגלה scheduling_setting.enable=true (רולדין) —
     אחרת Hyperzod לא מציעה תזמון בכלל ואין מה לאכוף.

   זיהוי מוצרים: מאובייקטי המוצר של Hyperzod עצמה (עגלה / דף המרצ'נט) לפי
   התיאור — אין רשימת מזהים קבועה, כל מוצר שדוד יכתוב לו "להזמנה 24 שעות
   מראש" נכנס אוטומטית. המזהים שנלמדו נשמרים ב-localStorage (mh_pre_ids)
   למקרה שהעגלה שוחזרה מהשרת בלי אובייקטי המוצר.

   אבחון בייצור (לוגים כבויים כברירת מחדל):
     localStorage.setItem('mh_pre_debug','1') → רענן → לוגים
     MH_PRE.stats()  — מונים + המצב האחרון      MH_PRE.check() — בדיקת העגלה עכשיו
     MH_PRE.known()  — מזהי מוצרי "מראש" שנלמדו  MH_PRE.reset() — מאפשר פתיחה אוטומטית שוב
   ========================================================================= */
(function () {
'use strict';

if (window.__MH_PRE__) { return; }
window.__MH_PRE__ = true;

var CFG = {
  VERSION: '1.0.1',
  RX:      /\d+\s*שעות\s*מראש|יום\s*מראש|ימים\s*מראש|הזמנה\s*מראש/,
  NOTE_ID: 'mh-pre-note',
  LS:      'mh_pre_ids',
  MSG:     'המוצרים בעגלה הם להזמנה מראש בלבד — יש לבחור מועד למשלוח (משלוח מתוזמן)',
  DEBUG:   (function(){ try { return localStorage.getItem('mh_pre_debug') === '1'; }
                        catch(e){ return false; } })()
};
var S = { oSeen:0, oBlocked:0, uiHides:0, uiShows:0, autoOpen:0, errors:0 };
var LAST = { active:false, enabled:null, names:[], items:0 };
var known = {}, autoOpened = false, busy = false;
try { known = JSON.parse(localStorage.getItem(CFG.LS) || '{}') || {}; } catch(e){ known = {}; }

function log(){ if (CFG.DEBUG) console.log.apply(console,
  ['%c[MH-PRE]','color:#c9a227;font-weight:bold'].concat([].slice.call(arguments))); }
function warn(){ console.warn.apply(console, ['[MH-PRE]'].concat([].slice.call(arguments))); }

/* ה-store של Hyperzod (Vue 3 + Vuex). אין → הסקריפט שקוף לחלוטין. */
function store(){
  try {
    var a = document.querySelector('#app'), v = a && a.__vue_app__;
    return (v && v.config && v.config.globalProperties.$store) || null;
  } catch(e){ return null; }
}
function descOf(p){
  var d = typeof p.description === 'string' ? p.description : '';
  var lt = p.language_translation;
  if (Array.isArray(lt)) for (var i=0;i<lt.length;i++)
    if (lt[i] && lt[i].key === 'description' && lt[i].value) d += '\n' + lt[i].value;
  return d;
}
/* לומד מזהי "מראש" מכל אובייקט מוצר שהאפליקציה מחזיקה כרגע (עגלה + דף מרצ'נט) */
function learn(st){
  var changed = false;
  function see(p){
    var id = p.product_id || p.id || p._id;
    if (!id) return;
    id = String(id);
    var pre = CFG.RX.test(descOf(p));
    if (pre && !known[id]) { known[id] = 1; changed = true; }
    else if (!pre && known[id]) { delete known[id]; changed = true; }
  }
  function walk(x, d){
    if (!x || d > 3) return;
    if (Array.isArray(x)) { for (var i=0;i<x.length;i++) walk(x[i], d+1); return; }
    if (typeof x !== 'object') return;
    if (Array.isArray(x.language_translation)) { see(x); return; }
    for (var k in x) if (Object.prototype.hasOwnProperty.call(x, k)) walk(x[k], d+1);
  }
  try {
    walk(st.getters.getCartProducts, 0);
    var M = st.state.Merchant || {};
    walk(M.categoryProducts, 0); walk(M.categoryPageProducts, 0); walk(M.searchedProducts, 0);
  } catch(e){ S.errors++; warn('learn', e); }
  if (changed) { try { localStorage.setItem(CFG.LS, JSON.stringify(known)); } catch(e){} }
}
/* מצב העגלה של מרצ'נט נתון (ברירת מחדל: המרצ'נט של העגלה). null = לא ידוע. */
function evaluate(mid){
  var st = store(); if (!st) return null;
  try {
    var C = st.state.Cart || {}, g = st.getters;
    var m = null, list = Array.isArray(C.cartMerchant) ? C.cartMerchant : [];
    if (mid) for (var j=0;j<list.length;j++)
      if (list[j] && (list[j].merchant_id === mid || list[j]._id === mid)) { m = list[j]; break; }
    if (!m) m = g.getCartMerchant || null;
    if (!mid && m) mid = m.merchant_id || m._id;
    /* תזמון זמין? לפי אובייקט המרצ'נט או לפי תשובת getSchedulingSlots (הצ'ק-אאוט טוען אותה) */
    var sch = g.getScheduling;
    var enabled = !!((m && m.scheduling_setting && m.scheduling_setting.enable) || (sch && sch.scheduling_enabled));
    var items = (Array.isArray(C.cartItems) ? C.cartItems : []).filter(function(it){
      return it && (!mid || it.merchant_id === mid); });
    learn(st);
    var names = [];
    for (var i=0;i<items.length;i++)
      if (known[String(items[i].product_id)]) names.push(items[i].product_name || String(items[i].product_id));
    LAST = { active: enabled && names.length > 0, enabled: enabled, names: names, items: items.length };
    return LAST;
  } catch(e){ S.errors++; warn('evaluate', e); return null; }
}
function toast(msg){
  var st = store();
  try { if (st) st.commit('setToast', { message: msg, color: 'red', show: true }); } catch(e){}
}

/* ---------- שכבה 1: רשת ---------- */

var IS_ORDER = /\/store\/v1\/order(\?|$)/;

/* true = מותר לשלוח. חוסם רק הזמנה של Hyperzod (יש scheduling_slot) עם מוצרי
   "מראש" ובלי מועד. כל ספק על המבנה → מותר (הסקריפט לא חוסם הזמנות רגילות). */
function guardOrder(body){
  if (typeof body !== 'string') return true;
  var o; try { o = JSON.parse(body); } catch(e){ return true; }
  if (!o || !o.merchant_id || !Object.prototype.hasOwnProperty.call(o, 'scheduling_slot')) return true;
  S.oSeen++;
  var ev = evaluate(o.merchant_id);
  if (!ev || !ev.active) return true;
  var s = o.scheduling_slot || {};
  if (s.is_scheduled === true && s.date && s.date !== '0000-00-00') {
    log('✅ הזמנה מתוזמנת:', s.date, s.time); return true;
  }
  S.oBlocked++;
  warn('🛑 הזמנה נחסמה — מוצרי הזמנה מראש בלי מועד:', ev.names.join(', '));
  setTimeout(function(){ toast(CFG.MSG); }, 400);
  setTimeout(reconcile, 50);
  return false;
}

/* Hyperzod = axios על XHR. עוטף מעל העטיפה של MH-ZONE (השרשור תקין). fetch ליתר ביטחון. */
var _o = XMLHttpRequest.prototype.open, _s = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.open = function(m, url){
  try { this.__mhPre = String(m).toUpperCase() === 'POST' && IS_ORDER.test(String(url)); }
  catch(e){ this.__mhPre = false; }
  return _o.apply(this, arguments);
};
XMLHttpRequest.prototype.send = function(b){
  if (this.__mhPre) {
    var ok = true;
    try { ok = guardOrder(b); } catch(e){ S.errors++; warn('send', e); ok = true; }
    if (!ok) throw new Error(CFG.MSG);
  }
  return _s.apply(this, arguments);
};
var _f = window.fetch;
window.fetch = function(input, init){
  try {
    var u = typeof input === 'string' ? input : ((input && input.url) || '');
    var m = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    if (m === 'POST' && IS_ORDER.test(u) && init && typeof init.body === 'string' && !guardOrder(init.body))
      return Promise.reject(new Error(CFG.MSG));
  } catch(e){ S.errors++; warn('fetch', e); }
  return _f.apply(this, arguments);
};

/* ---------- שכבה 2: תצוגה (נכשלת פתוח) ---------- */

function noteEl(after, create){
  var n = document.getElementById(CFG.NOTE_ID);
  if (n || !create) return n;
  n = document.createElement('div');
  n.id = CFG.NOTE_ID;
  n.setAttribute('style',
    'background:#fffbea;border:1px solid rgba(201,162,39,.45);border-radius:12px;' +
    'padding:8px 12px;margin:0 0 12px;font-size:12.5px;line-height:1.5;' +
    'color:#4a5568;direction:rtl;text-align:right;');
  after.parentElement.insertBefore(n, after.nextSibling);
  return n;
}

function reconcile(){
  if (busy) return;
  try {
    busy = true;
    /* עוגן: #deliveryTime = שורת "משלוח מיידי" (בנייד ובדסקטופ), לצידה .custom-radio */
    var asap = document.getElementById('deliveryTime'); if (!asap) return;
    var row = asap.parentElement;
    if (!row || !row.querySelector('.custom-radio')) return;      /* מבנה השתנה → לא נוגעים */
    var ev = evaluate(); if (!ev) return;
    var n = noteEl(row, ev.active);
    if (ev.active) {
      /* important: כלל !important בגיליון (display:flex על השורה) גבר על display:none רגיל — השורה "אקספרס" נשארה (7.10) */
      if (row.style.getPropertyValue('display') !== 'none') { row.style.setProperty('display', 'none', 'important'); S.uiHides++; log('🙈 משלוח מיידי הוסתר:', ev.names.join(', ')); }
      var txt = '🕒 ' + ev.names.join(', ') + ' — להזמנה מראש בלבד. בחרו מועד למשלוח.';
      if (n && n.textContent !== txt) n.textContent = txt;
      var st = store(), sch = st && st.getters.getOrderSchedule;
      if (!autoOpened && !(sch && sch.is_scheduled)) {
        var box = row.closest('#OrderScheduling') || (row.parentElement && row.parentElement.parentElement);
        var item = box && box.querySelector('.navigation-item');
        if (item) { autoOpened = true; S.autoOpen++; setTimeout(function(){ item.click(); }, 500); log('📅 בורר המועדים נפתח'); }
      }
    } else {
      if (row.style.getPropertyValue('display') === 'none') { row.style.removeProperty('display'); S.uiShows++; log('👁 משלוח מיידי הוחזר'); }
      if (n) n.remove();
    }
  } catch(e){ S.errors++; warn('reconcile', e); }
  finally { busy = false; }
}

/* SPA — הבורר נוצר ונהרס בניווט, והעגלה משתנה בצ'ק-אאוט. debounce 200ms. */
var t = null;
new MutationObserver(function(){
  clearTimeout(t); t = setTimeout(reconcile, 200);
}).observe(document.body || document.documentElement, { childList:true, subtree:true });

window.MH_PRE = {
  version: CFG.VERSION,
  stats: function(){ console.table(S); console.log('מצב:', LAST, '| ידועים:', Object.keys(known).length); return S; },
  check: function(mid){ return evaluate(mid); },
  known: function(){ return Object.keys(known); },
  reset: function(){ autoOpened = false; }
};
log('פעיל | גרסה', CFG.VERSION);
})();

/* =========================================================================
   SEO לדפי האתר — MH SEO  |  v1.0.1 | 2026-09-06
   -------------------------------------------------------------------------
   מה זה עושה (רק head/meta, לא נוגע בעגלה, בתשלום או בהזמנה):
     1. כותרת (<title>) ותיאור (meta description) לכל דף לפי הנתיב:
        דף הבית, דף עסק (טבלת SEO לפי slug + נתוני העסק החיים), עמוד תוכן, מוצר.
     2. lang=he על <html>, canonical לכתובת הקנונית (/he/...), og:title/og:description.
     3. JSON-LD: Organization + WebSite בדף הבית; Restaurant/LocalBusiness בדף עסק
        (מהאובייקט החי של Hyperzod: שם, כתובת, לוגו, קטגוריות, טלפון).
     נכשל פתוח: אין store / מבנה לא מזוהה → לא נוגעים. מריץ מחדש בכל ניווט (SPA).

   טבלת SEO (SEO_MERCHANTS): מפתח = slug של העסק. שדות: he (שם בעברית לכותרת),
   d (meta description), c (servesCuisine). עסק שלא בטבלה מקבל ברירת מחדל
   מהשם והקטגוריות שלו. עדכון הטבלה = חלק מרוטינת "הוספת עסק חדש".

   אבחון: localStorage.setItem('mh_seo_debug','1') → רענן. MH_SEO.apply(), MH_SEO.last()
   ========================================================================= */
(function () {
'use strict';
if (window.__MH_SEO__) { return; }
window.__MH_SEO__ = true;

var SITE = 'מעלה המשלוחים';
var CITY = 'מעלה אדומים';
var ORIGIN = 'https://www.maalehamishlohim.co.il';
var HOME = {
  title: 'משלוחי אוכל במעלה אדומים | ' + SITE,
  desc: 'מזמינים אוכל במעלה אדומים מהמסעדות, הפיצריות, המאפיות והחנויות של העיר, עם שליחים מקומיים ומשלוח מהיר עד הבית. הזמנה אונליין בקליק.'
};
/* ponytail: טבלה קבועה בקוד — 14 עסקים; לעדכן בכל עסק חדש. */
var SEO_MERCHANTS = {
  /* slug: { he: שם בעברית לכותרות, t: כותרת מאושרת, d: תיאור מאושר, c: servesCuisine, type: סוג Schema } — אושר ע"י דוד 6.9.2026 */
  'patricks':               { he: 'פטריקס', t: 'פטריקס מעלה אדומים | משלוחים והזמנה אונליין', c: 'בשרים, המבורגרים, בר',
    d: 'פטריקס מעלה אדומים — בר-מסעדה בשרי, כשר למהדרין. בשר על האש, בירה מהחבית ואווירה של פאב — ועכשיו גם משלוחים עד הבית. מרימים? מזמינים אונליין.' },
  'bens-pizza-shop':        { he: "בנ'ס פיצה שופ", t: "בנ'ס פיצה שופ מעלה אדומים | משלוחים והזמנה אונליין", c: 'פיצה, איטלקי',
    d: "בנ'ס פיצה שופ מעלה אדומים — פיצה מקומית כשרה למהדרין מכיכר יהלום: בצק טרי, תוספות לפי רבעים, פסטות ולחם שום. משלוחים עד הבית — אז מה בא לכם? הזמינו." },
  'burger-market':          { he: 'בורגר מרקט', t: 'בורגר מרקט מעלה אדומים | משלוחים והזמנה אונליין', c: 'המבורגרים, אמריקאי',
    d: 'בורגר מרקט מעלה אדומים — המבורגר ובירה בסגנון השוק, במרכז קרסו. בשר שנטחן במקום, לחמנייה מהמאפייה ורטבים ביתיים. יאללה, משלוחים עד הבית — מזמינים אונליין.' },
  'milk':                   { he: 'מילק', t: 'מילק מעלה אדומים | משלוחים והזמנה אונליין', c: 'חנות נוחות, מזון ומשקאות', type: 'ConvenienceStore',
    d: 'מילק מעלה אדומים — חנות נוחות ומזון: שתייה, חטיפים, מוצרי יסוד ומה שנגמר בבית. משלוחים עד הבית במעלה אדומים — הזמינו אונליין.' },
  'stage-food':             { he: "סטייג' Stage & Food", t: "סטייג' Stage & Food מעלה אדומים | משלוחים והזמנה אונליין", c: 'איטלקי, חלבי, דגים',
    d: 'Stage & Food מעלה אדומים — מסעדה חלבית-איטלקית בהיכל התרבות: פסטות, פוקאצ\'ות מהטאבון, דגים וקינוחים. עכשיו גם משלוחים עד הבית — הזמינו ארוחה אונליין.' },
  'falafel':                { he: 'פלאפל בתחנה כפר אדומים', t: 'פלאפל בתחנה כפר אדומים | משלוחים למעלה אדומים והזמנה אונליין', c: 'פלאפל, ים-תיכוני, ישראלי',
    d: 'פלאפל בתחנה כפר אדומים — הפלאפל של כביש 1, בתחנת סונול: מעורב ירושלמי, סביח, שניצל בבאגט. כשר. משלוחים לכפר אדומים ומעלה אדומים — בואו רעבים, הזמינו.' },
  'waffle-bus':             { he: 'וופל בס כפר אדומים', t: 'וופל בס כפר אדומים | משלוחים למעלה אדומים והזמנה אונליין', c: 'וופלים, קינוחים, בית קפה',
    d: 'וופל בס כפר אדומים — עגלת הקפה הכשרה בדרך לים המלח: וופל בלגי עמוס תוספות, קרפ, גלידה, שייקים וארוחות בוקר. משלוחים לכפר אדומים ומעלה אדומים — הזמינו מתוק.' },
  'roladin':                { he: 'רולדין מעלה אדומים', t: 'רולדין מעלה אדומים | משלוחים והזמנה אונליין', c: 'מאפייה, קונדיטוריה, בית קפה', type: 'Bakery',
    d: 'רולדין מעלה אדומים במשלוחים עד הבית: קרואסוני חמאה, לחמי מחמצת, עוגות ופטיסרי. כשר חלבי, מגשי אירוח יום מראש. הזמינו עכשיו דרך מעלה המשלוחים.' },
  'mifgash-hasheikh':       { he: 'מפגש השייח', t: 'מפגש השייח מעלה אדומים | משלוחים והזמנה אונליין', c: 'מאפייה, מאפים ירושלמיים, טאבון', type: 'Bakery',
    d: 'מפגש השייח מעלה אדומים: סמבוסק, בייגל טוסט ובייגלה ירושלמי מהטאבון, כשר למהדרין חלבי. פתוח 24 שעות ראשון–חמישי, משלוחים עד הבית. הזמינו במעלה המשלוחים.' },
  'birkat-hashabbat':       { he: 'ברכת השבת', t: 'ברכת השבת מעלה אדומים | משלוחים והזמנה אונליין', c: 'מאפייה, מאפים', type: 'Bakery',
    d: 'מאפיית ברכת השבת מעלה אדומים: בורקסים, קרואסונים, פיתות ומאפים טריים מהיום, כשר מהדרין רבנות מעלה אדומים. משלוחים עד הבית. הזמינו במעלה המשלוחים.' },
  'pasta-basta-maale-adumim': { he: 'פסטה בסטה', t: 'פסטה בסטה מעלה אדומים | משלוחים והזמנה אונליין', c: 'איטלקי, פסטה',
    d: 'פסטה בסטה מעלה אדומים: פסטה טרייה מוקפצת עם הרוטב שאתם בוחרים, כשר חלבי, קניון עופר. משלוחים עד הבית בכל מעלה אדומים. הזמינו עכשיו דרך מעלה המשלוחים.' },
  'cafe-agam-adumim':       { he: 'קפית אגם אדומים', t: 'קפית אגם אדומים | משלוחים והזמנה אונליין במעלה אדומים', c: 'בית קפה, חלבי, ישראלי, פיצה, פסטה', type: 'CafeOrCoffeeShop',
    d: 'קפית אגם אדומים: ארוחת בוקר, פיצות, פסטות, סלטים ודגים מהמסעדה החלבית הכשרה על שפת האגם, במשלוחים עד הבית בכל מעלה אדומים. הזמינו עכשיו במעלה המשלוחים.' },
  'hummus-adumim':          { he: 'חומוס אדומים', t: 'חומוס אדומים מעלה אדומים | משלוחים והזמנה אונליין', c: 'חומוסייה, ישראלי, מזרח תיכוני',
    d: 'חומוס אדומים, החומוסייה הוותיקה של מישור אדומים: מסבחה, פול, סביח ושקשוקה על חומוס, כשר רבנות. משלוחים עד הבית בכל מעלה אדומים. הזמינו במעלה המשלוחים.' },
  'toastrack':              { he: 'טוסטראק', t: 'טוסטראק כפר אדומים | משלוחים למעלה אדומים והזמנה אונליין', c: 'טוסטים, כריכים בשריים, מזון מהיר',
    d: 'טוסטראק: טוסטים בשריים בהרכבה אישית על באגט פריך, נקניקיות וצ\'יפס, מכפר אדומים במשלוחים עד הבית למעלה אדומים. תרכיבו את הביס והזמינו במעלה המשלוחים.' }
};
/* עמודי תוכן (Custom Pages): תיאור מאושר לפי slug */
var SEO_PAGES = {
  'mishlohim-maale-adumim': 'מזמינים משלוחי אוכל במעלה אדומים בקליק: פיצה, המבורגר, פלאפל, פסטה, מאפים ועוד ממסעדות העיר, עם שליחים מקומיים עד הדלת. בלי שיחות ובלי המתנה.',
  'pizza-maale-adumim': "משלוחי פיצה במעלה אדומים עם שליחים מקומיים: בנ'ס פיצה שופ הכשרה למהדרין, פיצות מקפית אגם אדומים, פיצות אישיות מברכת השבת ועוד. מזמינים בקליק.",
  'hamburger-maale-adumim': 'משלוחי המבורגר במעלה אדומים: בורגר מרקט עם בשר שנטחן במקום, פטריקס הבשרית הכשרה למהדרין, טוסטים בשריים מטוסטראק. מזמינים בקליק ושליח מקומי מביא.',
  'bakery-maale-adumim': 'מאפייה וקונדיטוריה במעלה אדומים במשלוח: לחמי מחמצת ועוגות מרולדין, בורקסים ורוגלך מברכת השבת, סמבוסק ובייגלה ממפגש השייח. מזמינים בקליק עד הדלת.',
  'kosher-restaurants-maale-adumim': 'מסעדות כשרות במעלה אדומים עם משלוחים: פלאפל וסביח, מעורב ירושלמי, פסטה, סלטים, פיצה ומאפים, עם סוג הכשרות של כל עסק. מזמינים בקליק ושליח מקומי מביא.',
  'join-business': 'בעלי עסקים במעלה אדומים: הצטרפו למעלה המשלוחים, אפליקציית המשלוחים המקומית. שליחים מהעיר, תפריט דיגיטלי, תשלום באתר או במזומן, מודל עמלה על הזמנות. דברו איתנו.',
  'contact-us': 'דברו איתנו: שירות הלקוחות של מעלה המשלוחים, אפליקציית המשלוחים של מעלה אדומים. שאלות על הזמנה, בעלי עסקים שרוצים להצטרף, הערות ומחמאות.'
};
var DEBUG = (function(){ try { return localStorage.getItem('mh_seo_debug') === '1'; } catch(e){ return false; } })();
var LAST = null, timer = null, lastKey = null, PN = {};

function log(){ if (DEBUG) console.log.apply(console, ['%c[MH-SEO]','color:#1f4e79;font-weight:bold'].concat([].slice.call(arguments))); }
function store(){ try { var a = document.querySelector('#app'), v = a && a.__vue_app__; return (v && v.config && v.config.globalProperties.$store) || null; } catch(e){ return null; } }
function cut(s, n){ s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s; }

function meta(sel, attrs, content){
  var el = document.head.querySelector(sel);
  if (!el) { el = document.createElement('meta'); Object.keys(attrs).forEach(function(k){ el.setAttribute(k, attrs[k]); }); document.head.appendChild(el); }
  if (el.getAttribute('content') !== content) el.setAttribute('content', content);
}
function link(rel, href){
  var el = document.head.querySelector('link[rel="' + rel + '"][data-mh]');
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); el.setAttribute('data-mh', '1'); document.head.appendChild(el); }
  if (el.getAttribute('href') !== href) el.setAttribute('href', href);
}
function jsonld(id, obj){
  var el = document.getElementById(id);
  if (!obj) { if (el) el.remove(); return; }
  var txt = JSON.stringify(obj);
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = id; document.head.appendChild(el); }
  if (el.textContent !== txt) el.textContent = txt;
}

/* העסק המוצג עכשיו (דף עסק / מוצר) */
function merchantOnPage(st){
  var m = location.pathname.match(/\/m\/([^\/]+)\/([0-9a-f]{24})/);
  if (!m) return null;
  var md = st && st.state.Merchant && st.state.Merchant.merchantData;
  if (md && (md.merchant_id === m[2] || md._id === m[2])) return { slug: m[1], id: m[2], data: md };
  return { slug: m[1], id: m[2], data: null };
}
function heName(slug, data){
  var t = SEO_MERCHANTS[slug];
  return (t && t.he) || (data && data.name) || '';
}
/* מוצר לפי מזהה מתוך רשימות המוצרים שהאפליקציה מחזיקה */
function productById(st, pid){
  var found = null;
  function walk(x, d){ if (found || !x || d > 4) return; if (Array.isArray(x)) { for (var i=0;i<x.length && !found;i++) walk(x[i], d+1); return; }
    if (typeof x !== 'object') return; if ((x.product_id === pid || x._id === pid) && x.name) { found = x; return; }
    for (var k in x) if (Object.prototype.hasOwnProperty.call(x, k)) walk(x[k], d+1); }
  try { var M = st && st.state.Merchant || {}; walk(M.categoryProducts, 0); walk(M.categoryPageProducts, 0); walk(M.searchedProducts, 0);
        if (!found) { var P = st && st.state.Product || {}; walk([P.addItem, P.holdItem, P.cartItem], 0); } } catch(e){}
  return found;
}
function catNames(data){
  var cs = (data && data.merchant_categories) || [];
  return cs.map(function(c){ return c && c.name; }).filter(Boolean);
}
function merchantJsonLd(m){
  var d = m.data; if (!d) return null;
  var t = SEO_MERCHANTS[m.slug] || {};
  /* Hyperzod: merchant_location = GeoJSON Point [lng,lat]; merchant_address_location = [lat,lng] */
  var loc = d.merchant_location || d.merchant_address_location || {}, lat, lng;
  if (loc && Array.isArray(loc.coordinates)) { lng = loc.coordinates[0]; lat = loc.coordinates[1]; }
  else if (Array.isArray(loc)) { lat = loc[0]; lng = loc[1]; }
  else { lat = loc.lat || loc.latitude; lng = loc.lng || loc.longitude; }
  var img = d.images && (d.images.logo || d.images.banner);
  if (img && typeof img === 'object') img = img.image_url || img.url || img.file_url;
  var street = typeof d.address === 'string' ? d.address : (d.address && (d.address.address || d.address.street || d.address.formatted_address));
  var obj = {
    '@context': 'https://schema.org', '@type': t.type || 'Restaurant',
    name: heName(m.slug, d), url: ORIGIN + '/he/m/' + m.slug + '/' + m.id,
    image: (typeof img === 'string' && img) || undefined,
    telephone: (typeof d.phone === 'string' && d.phone) || undefined,
    address: { '@type': 'PostalAddress', streetAddress: street || undefined, addressLocality: (typeof d.city === 'string' && d.city) || CITY, addressCountry: 'IL' },
    servesCuisine: t.c || catNames(d).join(', ') || undefined,
    areaServed: CITY,
    potentialAction: { '@type': 'OrderAction', target: ORIGIN + '/he/m/' + m.slug + '/' + m.id, deliveryMethod: 'http://purl.org/goodrelations/v1#DeliveryModeOwnFleet' }
  };
  if (lat && lng) obj.geo = { '@type': 'GeoCoordinates', latitude: lat, longitude: lng };
  return obj;
}
function homeJsonLd(){
  return [{ '@context': 'https://schema.org', '@type': 'Organization', name: SITE, url: ORIGIN + '/he', areaServed: CITY,
            sameAs: ['https://www.facebook.com/share/1AR58c5rMD/'] },
          { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE, url: ORIGIN + '/he', inLanguage: 'he' }];
}

function compute(){
  var st = store();
  var p = location.pathname.replace(/\/+$/, '') || '/';
  var canon = ORIGIN + (p === '/' || p === '/he' || p === '/he/home' ? '/he' : p);
  var m = merchantOnPage(st);
  if (m) {
    var d = m.data, name = heName(m.slug, d), t = SEO_MERCHANTS[m.slug] || {};
    if (!name) return null;                                   /* העסק עוד לא נטען — ננסה שוב */
    var pm = p.match(/\/product\/([0-9a-f]{24})/);
    var prod = pm ? productById(st, pm[1]) : null;
    if (pm && !prod) return null;                              /* המוצר עוד לא נטען — ננסה שוב */
    var nameCity = name.indexOf(CITY) === -1 ? name + ' ' + CITY : name;
    var cats = catNames(d);
    var desc = t.d || ('משלוחים מ' + name + ' ב' + CITY + (cats.length ? ' — ' + cats.join(', ') : '') + '. מזמינים אונליין ב' + SITE + ' והשליחים המקומיים מביאים עד הבית.');
    if (prod) {
      var pd = (typeof prod.description === 'string' && prod.description.trim()) || '';
      return { key: 'm:' + m.id + ':' + pm[1], title: prod.name + ' | ' + nameCity + ' | ' + SITE,
               desc: cut(pd ? prod.name + ' — ' + pd : prod.name + ' במשלוח מ' + nameCity + '. ' + desc, 155),
               canon: canon, ld: null, ldId: 'mh-ld-merchant' };
    }
    return {
      key: 'm:' + m.id,
      title: (t.t || (nameCity + ' | משלוחים והזמנה אונליין')) + ' | ' + SITE,
      desc: cut(desc, 155), canon: ORIGIN + '/he/m/' + m.slug + '/' + m.id, ld: merchantJsonLd(m), ldId: 'mh-ld-merchant'
    };
  }
  if (p === '/' || p === '/he' || p === '/he/home') return { key: 'home', title: HOME.title, desc: HOME.desc, canon: ORIGIN + '/he', ld: homeJsonLd(), ldId: 'mh-ld-home' };
  if (/\/page\//.test(p)) {
    var h = document.querySelector('h1'); var pt = (h && h.textContent.trim()) || document.title;
    var slug = (p.match(/\/page\/([^\/]+)/) || [])[1] || '';
    /* תיאור: מהטבלה, ואם אין — הפסקה הראשונה אחרי ה-H1 (לא כל טקסט הדף עם התפריט) */
    var firstP = h && h.parentElement && h.parentElement.querySelector('p');
    var pd = SEO_PAGES[slug] || (firstP ? firstP.textContent : '') || pt;
    return { key: 'p:' + p, title: pt + ' | ' + SITE, desc: cut(pd, 155), canon: canon, ld: null, ldId: 'mh-ld-page' };
  }
  return { key: 'x:' + p, title: null, desc: null, canon: canon, ld: null, ldId: null };
}

function apply(){
  try {
    var r = compute(); if (!r) { return; }
    document.documentElement.setAttribute('lang', 'he');
    if (r.title && document.title !== r.title) document.title = r.title;
    if (r.title) meta('meta[property="og:title"]', { property: 'og:title' }, r.title);
    if (r.desc) { meta('meta[name="description"]', { name: 'description' }, r.desc); meta('meta[property="og:description"]', { property: 'og:description' }, r.desc); }
    link('canonical', r.canon);
    ['mh-ld-home', 'mh-ld-merchant', 'mh-ld-page'].forEach(function(id){ if (id !== r.ldId) jsonld(id, null); });
    if (r.ldId) jsonld(r.ldId, r.ld);
    if (r.key !== lastKey) { lastKey = r.key; log('✓', r.key, '|', r.title); }
    LAST = r;
  } catch(e){ console.warn('[MH-SEO]', e); }
}
/* Hyperzod מציבה document.title בעצמה בניווט — עוקבים אחרי שינויי ה-head וה-URL */
new MutationObserver(function(){ clearTimeout(timer); timer = setTimeout(apply, 250); }).observe(document.head, { childList: true, subtree: true, characterData: true });
new MutationObserver(function(){ clearTimeout(timer); timer = setTimeout(apply, 400); }).observe(document.body || document.documentElement, { childList: true, subtree: true });
window.addEventListener('popstate', function(){ setTimeout(apply, 300); });
setTimeout(apply, 800); setTimeout(apply, 2500);
window.MH_SEO = { version: '1.0.1', apply: apply, last: function(){ return LAST; }, table: SEO_MERCHANTS };
log('פעיל');
})();

/* ============================================================
   אמצעי תשלום — MH Pay  |  v1.0.0 | 2026-09-06
   מסמן את כרטיס אמצעי התשלום הנבחר במחלקה mh-pay-on (ואת המזומן ב-mh-pay-cash).
   העיצוב עצמו ב-global-cdn.css (Part 8h v2) — שם הזיהוי הוא :has(); הבלוק הזה הוא
   גיבוי לדפדפנים ישנים בלי :has(). נכשל-פתוח: אם משהו כאן נשבר, ה-CSS הטהור ממשיך לעבוד.
   בדיקה: window.MH_PAY.sync() מחזיר את מספר הכרטיסים שסונכרנו.
   ============================================================ */
(function () {
  'use strict';
  var VERSION = '1.0.0';
  var pending = false;
  function sync() {
    pending = false;
    var cards = document.querySelectorAll('#payment-card .payment-method');
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      var on = !!c.querySelector('.v-selection-control--dirty, input:checked');
      var cash = /-cod$/.test(c.getAttribute('data-test-id') || '');
      /* משנים רק כשצריך — toggle "ריק" גם מפעיל MutationObserver וזה היה לולאה */
      if (c.classList.contains('mh-pay-on') !== on) c.classList.toggle('mh-pay-on', on);
      if (c.classList.contains('mh-pay-cash') !== cash) c.classList.toggle('mh-pay-cash', cash);
    }
    return cards.length;
  }
  function schedule() { if (pending) return; pending = true; requestAnimationFrame(sync); }
  var mo = new MutationObserver(schedule);
  function start() {
    mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'checked'] });
    sync();
  }
  try {
    if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
  } catch (e) { console.warn('[MH Pay] disabled:', e); }
  window.MH_PAY = { version: VERSION, sync: sync, off: function () { mo.disconnect(); } };
})();

/* ============================================================
   תשלום אונליין בלי כתובת — MH PayIntent Country Guard  |  v1.0.1 | 2026-09-06
   הבעיה: בסוגי הזמנה בלי כתובת (למשל קפית: "משלוח עד הבית" = custom_1, "משלוח עד הבית מורחב" = pickup)
   החנות שולחת ב-POST /store/v1/pg/paymentIntent/... את address.country מתוך המיקום שנבחר בסרגל,
   והגיאוקודר של Hyperzod מחזיר country=null למעלה אדומים → השרת עונה
   "The address.country field is required." והלקוח לא מגיע לדף התשלום.
   הפתרון: רק בבקשה הזאת, אם address.country / country_code ריקים — ממלאים "IL". לא נוגעים בשום בקשה אחרת.
   נכשל-פתוח: כל שגיאה כאן → הבקשה יוצאת כמו שהיא. בדיקה: window.MH_PAYINTENT.fixes (מונה תיקונים).
   ============================================================ */
(function () {
  'use strict';
  if (window.__MH_PAYINTENT__) { return; }
  window.__MH_PAYINTENT__ = true;
  var VERSION = '1.0.1';
  var RE = /\/pg\/paymentIntent\//; // כל בסיס: בפועל הנתיב הוא /store/v1/payment/pg/paymentIntent/<alias>
  var stats = { version: VERSION, fixes: 0, seen: 0 };

  // פונקציה טהורה: מקבלת גוף (אובייקט) ומחזירה {body, changed}
  function fix(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) return { body: body, changed: false };
    var changed = false;
    var addr = body.address;
    if (addr && typeof addr === 'object' && !Array.isArray(addr)) {
      if (addr.country === null || addr.country === undefined || String(addr.country).trim() === '') { addr.country = 'IL'; changed = true; }
    }
    if (body.country_code === null || body.country_code === undefined || String(body.country_code).trim() === '') { body.country_code = 'IL'; changed = true; }
    return { body: body, changed: changed };
  }

  // מחרוזת JSON → מחרוזת JSON מתוקנת (או המקור אם אין מה לתקן / לא JSON)
  function fixJsonText(text) {
    try {
      if (typeof text !== 'string' || text.charAt(0) !== '{') return text;
      var r = fix(JSON.parse(text));
      if (!r.changed) return text;
      stats.fixes++;
      return JSON.stringify(r.body);
    } catch (e) { return text; }
  }

  function isIntent(method, url) {
    return String(method || 'GET').toUpperCase() === 'POST' && RE.test(String(url || ''));
  }

  try {
    // XHR (axios בדפדפן)
    var xo = XMLHttpRequest.prototype.open, xs = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url) {
      try { this.__mhPI = isIntent(method, url); } catch (e) { this.__mhPI = false; }
      return xo.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (body) {
      try {
        if (this.__mhPI) { stats.seen++; if (typeof body === 'string') body = fixJsonText(body); }
      } catch (e) { /* נכשל-פתוח */ }
      return xs.call(this, body);
    };
    // fetch
    if (window.fetch) {
      var of = window.fetch;
      window.fetch = function (input, init) {
        try {
          var url = (typeof input === 'string') ? input : (input && input.url);
          var method = (init && init.method) || (input && input.method) || 'GET';
          if (isIntent(method, url) && init && typeof init.body === 'string') {
            stats.seen++;
            var nb = fixJsonText(init.body);
            if (nb !== init.body) init = Object.assign({}, init, { body: nb });
          }
        } catch (e) { /* נכשל-פתוח */ }
        return of.call(this, input, init);
      };
    }
  } catch (e) { console.warn('[MH PayIntent] disabled:', e); }

  window.MH_PAYINTENT = { version: VERSION, fix: fix, fixJsonText: fixJsonText, stats: function () { return Object.assign({}, stats); } };
})();

/* ============================================================
   אמצעי תשלום — MH Pay NoPreselect  |  v1.1.0 | 2026-09-06
   Hyperzod זוכר את אמצעי התשלום האחרון של הלקוח (Payment.recentlySelectedPaymentMethod ב-vuex)
   ומסמן אותו אוטומטית בכניסה לצ'ק-אאוט. לקוח ששילם פעם במזומן קיבל "מזומן" מסומן מראש בכל
   הזמנה — הסיבה האמיתית ל"בחרתי מזומן בטעות". כאן, פעם אחת בכל טעינת דף, מנקים את הזיכרון הזה
   (ואת paymentModeId) כך שכל לקוח בוחר אמצעי תשלום באופן פעיל. בחירה ידנית אחרי זה עובדת רגיל.
   נכשל-פתוח: אם ה-store לא נמצא תוך 12 שניות — לא עושים כלום.
   ============================================================ */
(function () {
  'use strict';
  if (window.__MH_PAY_NOSEL__) { return; }
  window.__MH_PAY_NOSEL__ = true;
  var VERSION = '1.1.2';
  var stats = { version: VERSION, cleared: false, hadRecent: null, tries: 0 };
  function store() {
    try { var app = document.querySelector('#app'); return app && app.__vue_app__ && app.__vue_app__.config.globalProperties.$store; } catch (e) { return null; }
  }
  function clearOnce(st) {
    var recent = null;
    try { recent = st.state && st.state.Payment ? st.state.Payment.recentlySelectedPaymentMethod : (st.getters.getRecentlySelectedPaymentMethod || null); } catch (e) { recent = null; }
    stats.hadRecent = !!recent;
    if (!recent) return;            /* אין זיכרון → אין מה לנקות (לקוח חדש) */
    st.commit('setRecentlySelectedPaymentMethod', null);
    st.commit('setPaymentModeId', null); /* אם הצ'ק-אאוט כבר מוצג — ה-watcher של Hyperzod מנקה גם את הסימון */
    stats.cleared = true;
  }
  function tick() {
    stats.tries++;
    var st = store();
    if (st) { try { clearOnce(st); } catch (e) { console.warn('[MH Pay NoPreselect] skipped:', e); } return; }
    if (stats.tries < 40) setTimeout(tick, 300);
  }
  tick();
  window.MH_PAY_NOSEL = { version: VERSION, stats: function () { return Object.assign({}, stats); } };
})();

/* =========================================================================
   דף תוצאות החיפוש — MH Search  |  v2.0.1 | 2026-10-09  (v1.0.0 6.9: טקסטים בלבד; v2.0.1: זמני משלוח מוסתרים)
   -------------------------------------------------------------------------
   דוד 9.10: "רטרופיט לדף תוצאות החיפוש" — חנויות קודם, ורלוונטיות חכמה (פלאפל → חנויות פלאפל, הקרובה קודם;
   חביתה → מקומות של ארוחת בוקר; איטלקי → פיצה/פסטה גם בלי המילה בשם), וגם לחנויות ומוצרים עתידיים.
   איך Hyperzod מחפשת (נבדק 9.10, בילד index-jfOdlzWH): getSearch שולח יחד שתי בקשות
     GET /store/v1/search?location[]&q&locale&search_type=merchant|product. חנויות = fuzzy על שם החנות בלבד;
     מוצרים = עד 5 לחנות, 10 חנויות לעמוד, fuzzy מאוד ("פלאפל" → "פלפל מרוקאי", "חביתה" → "חבילת ניוקי הביתה"),
     והסדר לא מתחשב במרחק. אחר כך: products.length>0 ? tab=0 (מוצרים) : tab=1.
   מה הבלוק עושה:
     1. תופס את שתי התשובות ב-XHR (לפני ש-Hyperzod קוראת אותן) ומחזיר במקומן תוצאות משלו:
        - מועמדים: התשובות של Hyperzod + שאר העמודים + חיפושי מושג ("איטלקי" → גם "פיצה", "פסטה") +
          האינדקס — כל התפריטים של כל החנויות (שמות קטגוריות ומוצרים), נבנה פעמיים ביום אוטומטית
          (tools/build-search-index.mjs + .github/workflows/search-index.yml → ענף search-index). מחיר/מלאי —
          תמיד חיים: מוצר שנמצא רק באינדקס נמשך לפי מזהה (catalog/products/listByIds).
        - התאמה בעברית (הליבה, CORE למטה): ניקוד, סופיות, ׳/״, ו/ה/ב/ל/מ/ש/כ (רק ממילה שאינה מילה בפני
          עצמה — לחמניות ≠ ל+חמניות), ים/ות/יים/ית, סמיכות (פרחי), כתיב מלא/חסר, תעתיק (pizza), מקלדת אנגלית
          (phmv → פיצה). אף פעם לא fuzzy: פלפל ≠ פלאפל, פיצה ≠ פיתה. "כריך חביתה" = חביתה, "ביסלי פלאפל" = טעם.
        - ציון חנות: שם (100) + קטגוריית החנות במערכת (60) + קטגוריה בתפריט (36) + מוצרים (עד 5) + כמה מהתפריט
          מתאים (30). פחות 4 לק"מ, 25 לסגור, 35 ל"לא מקבל הזמנות". טאב חנויות = חנות עם ראיה (שם / קטגוריה /
          מנה שהיא באמת המנה / 3 מנות של מושג קשור) וציון ≥ 30; אם אין אף אחת — גם חנויות עם מוצר מתאים.
          סדר: קודם מה שאפשר להזמין עכשיו (Wolt: סגורים למטה, לא מוסתרים), ואז הציון.
        - אין שום התאמה → התשובה של Hyperzod כמו שהיא (גיבוי לשגיאות כתיב).
     2. "חנויות" נפתח קודם: watch סינכרוני על tab מיד אחרי חיפוש (בלי הבהוב); לחיצה של הלקוח — מכובדת.
     3. מונה בטאבים (data-mh-n) ושורת "למה" בכל כרטיס חנות ("פלאפל בפיתה · פלאפל בבגט · ועוד 3"). עיצוב: חלק 26ב.
   מיון/סינון שהלקוח בחר בצ'יפים (sort_by/filters) → Hyperzod כמו שהיא. נכשל-פתוח: שגיאה / 4 שניות → המקור.
   בדיקה: MH_SEARCH.stats() · MH_SEARCH.last() · MH_SEARCH.explain('פלאפל') · capture/search-retrofit/eval.mjs
   ========================================================================= */
(function () {
  'use strict';
  if (window.__MH_SEARCH__) { return; }
  window.__MH_SEARCH__ = true;
  var VERSION = '2.0.1';
  /* MH-SEARCH-CORE-START — הליבה של מנוע החיפוש: טהורה (בלי DOM ובלי רשת), כדי שאפשר לבדוק אותה גם ב-node.
     מילון כללי לעברית של אוכל — לא רשימה לפי חנות: חנויות ומוצרים חדשים נכנסים לבד (דוד 9.10). */
  var CORE = (function () {
    'use strict';
    var FIN = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
    /* ניקוד, אותיות סופיות, גרש/גרשיים (צ'יפס = ציפס), סימנים → רווח */
    function norm(s) {
      return String(s == null ? '' : s).toLowerCase()
        .replace(/[֑-ׇ]/g, '')
        .replace(/[ךםןףץ]/g, function (c) { return FIN[c]; })
        .replace(/['"`׳״’‘“”]/g, '')
        .replace(/[^a-z0-9א-ת]+/g, ' ')
        .replace(/\s+/g, ' ').trim();
    }
    /* מפתח השוואה של מילה: רבים/נקבה/ה' בסוף, ואז כתיב מלא↔חסר (וו→ו, יי→י) */
    function key(t) {
      var s = t;
      /* אחרי norm ה-ם הסופית היא מ: "ים" = "ימ" */
      if (s.length >= 5 && /יימ$/.test(s)) { s = s.slice(0, -2); }          /* טבעוניים → טבעוני */
      else if (s.length >= 5 && /ית$/.test(s)) { s = s.slice(0, -1); }      /* איטלקית → איטלקי · פרגית → פרגי */
      else if (s.length >= 4 && /(ימ|ות)$/.test(s)) { s = s.slice(0, -2); } /* פיצות → פיצ · סלטים → סלט */
      else if (s.length >= 3 && /ה$/.test(s)) { s = s.slice(0, -1); }       /* פיצה → פיצ · חלה → חל */
      return s.replace(/וו/g, 'ו').replace(/יי/g, 'י');
    }
    /* כתיב/תעתיק → צורה אחת (אחרי norm, לפני key) */
    var VAR = {
      'pizza': 'פיצה', 'pizzas': 'פיצה', 'pizzeria': 'פיצה', 'burger': 'המבורגר', 'burgers': 'המבורגר', 'hamburger': 'המבורגר',
      'בורגר': 'המבורגר', 'בורגרים': 'המבורגר', 'pasta': 'פסטה', 'falafel': 'פלאפל', 'shawarma': 'שווארמה', 'sushi': 'סושי',
      'coffee': 'קפה', 'cafe': 'קפה', 'caffe': 'קפה', 'waffle': 'וופל', 'toast': 'טוסט', 'grill': 'גריל', 'bakery': 'מאפייה',
      'hummus': 'חומוס', 'humus': 'חומוס', 'schnitzel': 'שניצל', 'shnitzel': 'שניצל', 'flowers': 'פרחים', 'pita': 'פיתה',
      'chips': 'ציפס', 'fries': 'ציפס', 'beer': 'בירה', 'wine': 'יין', 'vodka': 'וודקה', 'whisky': 'ויסקי', 'whiskey': 'ויסקי',
      'שאורמה': 'שווארמה', 'שאוורמה': 'שווארמה', 'שוארמה': 'שווארמה', 'שוורמה': 'שווארמה', 'שווארמות': 'שווארמה',
      'סנדביץ': 'סנדוויץ', 'סנדויץ': 'סנדוויץ', 'קוראסון': 'קרואסון', 'קרוסון': 'קרואסון', 'קרואסונים': 'קרואסון',
      'פוקאצה': 'פוקצה', 'פוקאציה': 'פוקצה', 'פוקציה': 'פוקצה', 'פוקצות': 'פוקצה', 'מלאווח': 'מלוואח', 'מלאוח': 'מלוואח',
      'נקנקיה': 'נקניקיה', 'נקניקייה': 'נקניקיה', 'נקנקייה': 'נקניקיה', 'הוטדוג': 'נקניקיה',
      'ארוחת': 'ארוחה', 'עוגת': 'עוגה', 'מנת': 'מנה', 'שתיה': 'שתייה', 'גלידריה': 'גלידה', 'פיצריה': 'פיצה',
      'ציפסים': 'ציפס', 'פלאפלים': 'פלאפל', 'ויפ': 'וייפ', 'vape': 'וייפ', 'nargila': 'נרגילה', 'hookah': 'נרגילה'
    };
    var PHRASE = [['הוט דוג', 'נקניקיה'], ['hot dog', 'נקניקיה'], ['ארוחת ערב', 'ערב']];   /* בלי \b: ב-JS הוא לא מכיר אותיות עבריות */
    /* מושגים: מילת חיפוש → מונחים קשורים ומשקל. "איטלקי" → פיצה, פסטה... גם לחיפושים נוספים מול Hyperzod */
    var CON = {
      'איטלקי': 'פיצה .8|פסטה .8|ניוקי .7|רביולי .7|לזניה .7|ריזוטו .7|פוקצה .6|מרגריטה .5',
      'ארוחת בוקר': 'חביתה .8|שקשוקה .8|ארוחות בוקר 1|טוסט .6|כריך .6|סנדוויץ .6|קרואסון .5|בייגל .5',
      'בוקר': 'ארוחת בוקר 1|חביתה .8|שקשוקה .8|טוסט .6|כריך .6',
      'בראנץ': 'ארוחת בוקר 1|חביתה .8|שקשוקה .8',
      'חביתה': 'שקשוקה .35|ארוחת בוקר .35',
      'שקשוקה': 'חביתה .35|ארוחת בוקר .35',
      'מתוק': 'קינוח .8|עוגה .7|גלידה .7|עוגיות .6|וופל .6|קרפ .6|שוקולד .6|מלבי .5|סופגניה .5|מילקשייק .5|מאפים מתוקים .6',
      'קינוח': 'עוגה .7|גלידה .7|וופל .6|קרפ .6|מלבי .6|שוקולד .5|סופגניה .5|עוגיות .5|פחזניות .5|טארט .5|מילקשייק .5',
      'בשרי': 'בשר .8|שיפוד .7|אנטריקוט .7|קבב .7|המבורגר .6|פרגית .6|שווארמה .6|מעורב .6|סטייק .7',
      'בשר': 'בשרי .8|שיפוד .7|אנטריקוט .7|קבב .7|המבורגר .6|פרגית .6|סטייק .7',
      'על האש': 'שיפוד .8|גחלים .7|אנטריקוט .7|קבב .7|פרגית .7|מעורב .6|גריל .7',
      'גריל': 'על האש .8|שיפוד .7|אנטריקוט .7|קבב .7|פרגית .7',
      'שיפוד': 'על האש .7|גחלים .6|קבב .6|פרגית .6|אנטריקוט .6',
      'דג': 'דגים 1|סלמון .8|דניס .8|פיש אנד ציפס .7|סשימי .6|טונה .4',
      'עוף': 'חזה עוף .9|פרגית .8|שניצל .6|כנפיים .7|נאגטס .7',
      'מאפה': 'מאפים 1|בורקס .8|קרואסון .8|רוגלך .7|גביניות .6|מאפייה .7',
      'מאפייה': 'מאפים .9|לחם .8|חלה .8|לחמניות .7|בורקס .6|פיתות .6',
      'לחם': 'לחמניות .8|חלה .7|בגט .6|פיתה .6|בייגל .5|מחמצת .6',
      'אלכוהול': 'יין .9|בירה .9|וודקה .9|ויסקי .9|ערק .8|ליקר .8',
      'משקאות חריפים': 'אלכוהול 1|וודקה .9|ויסקי .9|ערק .8|ליקר .8',
      'עישון': 'סיגריות 1|טבק .9|נרגילה .9|גחלים .6',
      'סיגריה': 'סיגריות 1|טבק .5',
      'נרגילה': 'טבק .8|גחלים .7',
      'וייפ': 'סיגריות חד פעמיות .9|סיגריה אלקטרונית .9|סיגריות רב פעמיות .8',
      'מתנה': 'זר .8|פרחים .8|שוקולד .6|בלון .6|מארז .5|דובי .6|עציץ .6|סחלב .6|כרטיס ברכה .5',
      'פרח': 'זר .9|ורדים .8|סחלב .7|עציץ .6',
      'זר': 'פרחים .9|ורדים .8',
      'ילדים': 'ארוחת ילדים 1',
      'טבעוני': 'צמחוני .6',
      'צמחוני': 'טבעוני .6',
      'ללא גלוטן': 'ללא קמח .8',
      'קפה': 'אספרסו .8|קפוצינו .8|אמריקנו .8|הפוך .8|אייס קפה .8|קפה קר .8',
      'גלידה': 'ארטיק .5|פרוזן יוגורט .8|מילקשייק .5|גביע .3',
      'יין': 'מרלו .7|קברנה .7|קברנה סוביניון .7|שרדונה .7|סוביניון .7|גוורצטרמינר .7|מוסקט .6|למברוסקו .6|אלכוהול .6',
      'בירה': 'בירות 1|אלכוהול .4',
      'המבורגר': 'בורגר 1|אנגוס .7',
      'פיצה': 'מרגריטה .5|פיצות 1',
      'כריך': 'סנדוויץ 1|טוסט .5|בגט .5',
      'סנדוויץ': 'כריך 1|טוסט .5|בגט .5',
      'נקניקיה': 'נקניק .7',
      'מילקשייק': 'שייק .8',
      'שייק': 'מילקשייק .8',
      'סושי': 'סשימי .7'
    };
    function prep(s) { var t = ' ' + norm(s) + ' '; for (var i = 0; i < PHRASE.length; i++) { t = t.split(' ' + PHRASE[i][0] + ' ').join(' ' + PHRASE[i][1] + ' '); } return t.trim(); }
    function canon(tok) { var v = VAR[tok]; return v ? norm(v) : tok; }
    var ALT = {};                                    /* מפתח קנוני → המפתחות של הכתיבים האחרים (להתאמת תחילת מילה בשם חנות) */
    Object.keys(VAR).forEach(function (v) { var c = key(norm(VAR[v])), a = key(v); if (a !== c && a.length >= 4) { (ALT[c] = ALT[c] || []).push(a); } });
    /* מילים של "צורה" (כריך, עסקית, כדורי...): "כריך חביתה" = חביתה, אבל "ביסלי פלאפל" = טעם, לא פלאפל */
    var FORMAT = {};
    'כריך כריכי סנדוויץ טוסט בגט באגט פיתה לאפה צלחת מגש מנה ארוחה עסקית קערה מארז כדורי ביס בייגל טורטיה מיני חצי זוג שלישיית שישיית זר זרי'
      .split(' ').forEach(function (w) { FORMAT[key(canon(norm(w)))] = 1; });
    /* מילה בטקסט → מפתחות אפשריים: המילה עצמה, ובלי 1–2 אותיות שימוש (ו/ה/ב/ל/מ/ש/כ) אם נשארות 3+ אותיות */
    /* מילים "עצמאיות": מילה ראשונה בשם מוצר/קטגוריה/חנות. ממילה כזו לא מורידים אות שימוש — לחמניות ≠ ל+חמניות
       (חמניות = פרחים). setVocab נקרא עם האינדקס */
    var HEADS = {}, VOCAB = {}, VKEYS = {};
    function setVocab(names) {
      HEADS = {}; VOCAB = {}; VKEYS = {}; CACHE = {};
      for (var i = 0; i < names.length; i++) {
        var ts = prep(names[i]).split(' ');
        if (ts[0] && !/^\d+$/.test(ts[0])) { HEADS[key(canon(ts[0]))] = 1; }
        for (var j = 0; j < ts.length; j++) { var t = ts[j]; if (t.length >= 3 && !/\d/.test(t)) { VOCAB[t] = (VOCAB[t] || 0) + 1; VKEYS[key(canon(t))] = 1; } }
      }
    }
    /* שגיאת כתיב — רק כשאין שום תוצאה: מרחק 1 (החלפה/הוספה/מחיקה/היפוך), רק למילים של 5+ אותיות
       (פיצה↔פיתה במרחק 1!), ורק מילה מהתפריטים עצמם — והמועמד היחיד הנפוץ ביותר */
    function dl1(a, b) {
      if (a === b) { return true; }
      var la = a.length, lb = b.length;
      if (Math.abs(la - lb) > 1) { return false; }
      var i = 0; while (i < la && i < lb && a[i] === b[i]) { i++; }
      if (la === lb) { return a.slice(i + 1) === b.slice(i + 1) || (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2)); }
      return la > lb ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
    }
    function correct(q) {
      var ts = prep(q).split(' '), changed = false;
      var out = ts.map(function (t) {
        if (t.length < 5 || VKEYS[key(canon(t))]) { return t; }
        var best = null, bc = 0;
        Object.keys(VOCAB).forEach(function (u) { if (u.length >= 5 && dl1(t, u) && VOCAB[u] > bc) { best = u; bc = VOCAB[u]; } });
        if (best) { changed = true; return best; }
        return t;
      });
      return changed ? out.join(' ') : null;
    }
    function tokKeys(tok) {
      var c = canon(tok), k0 = key(c), out = [[k0, 1]];
      if (c.length >= 4 && /י$/.test(c)) { out.push([key(c.slice(0, -1)), 0.9]); }   /* סמיכות רבים: פרחי = פרחים, לחמי = לחמים */
      if (HEADS[k0]) { return out; }
      if (/^[והבלמשכ]/.test(tok) && tok.length - 1 >= 3) { out.push([key(canon(tok.slice(1))), 0.95]); }
      if (/^[והבלמשכ][והבלמשכ]/.test(tok) && tok.length - 2 >= 3) { out.push([key(canon(tok.slice(2))), 0.9]); }
      return out;
    }
    var CACHE = {};
    /* טקסט → רשימת מילים מוכנות להשוואה (נשמר במטמון — שמות המוצרים חוזרים בכל חיפוש) */
    function prepText(s) {
      var k = String(s == null ? '' : s);
      var hit = CACHE[k]; if (hit) { return hit; }
      var toks = prep(k).split(' ').filter(Boolean);
      var r = { n: toks.join(' '), toks: toks.map(function (t) { return { t: t, keys: tokKeys(t) }; }) };
      if (Object.keys(CACHE).length > 20000) { CACHE = {}; }
      CACHE[k] = r;
      return r;
    }
    /* מילת שאילתה מול מילה בטקסט: 1 = אותה מילה · 0.8 = הטקסט מתחיל בה (4+ אותיות: בורגר→בורגראנץ') ·
       0.45 = בתוך מילה מורכבת (סביח→תסביח). אף פעם לא fuzzy: פלפל ≠ פלאפל */
    function tokScore(qk, tt) {
      var best = 0, alts = ALT[qk] || [];
      for (var i = 0; i < tt.keys.length; i++) {
        var k = tt.keys[i][0], w = tt.keys[i][1];
        if (k === qk) { best = Math.max(best, w); continue; }
        if (qk.length >= 4 && k.length > qk.length && k.indexOf(qk) === 0) { best = Math.max(best, 0.8 * w); continue; }
        for (var a = 0; a < alts.length; a++) { if (k.length > alts[a].length && k.indexOf(alts[a]) === 0) { best = Math.max(best, 0.8 * w); } }
        if (qk.length >= 4 && k.length > qk.length + 1 && k.indexOf(qk) > 0) { best = Math.max(best, 0.45 * w); }
      }
      return best;
    }
    /* צורה (מילה/צירוף) מול טקסט: כל המילים חייבות להימצא. 1 = זהה · 0.95 = מתחיל בה · 0.8 = במקום אחר */
    function formScore(form, text) {
      var tx = typeof text === 'string' ? prepText(text) : text;
      if (!tx.toks.length || !form.keys.length) { return 0; }
      var level = 1, first = false;
      for (var i = 0; i < form.keys.length; i++) {
        var b = 0, at = -1;
        for (var j = 0; j < tx.toks.length; j++) { var s = tokScore(form.keys[i], tx.toks[j]); if (s > b) { b = s; at = j; } }
        if (!b) { return 0; }
        level = Math.min(level, b);
        if (i === 0) { first = at === 0 || !!form.mod || lead(tx, at); }
      }
      if (tx.toks.length === form.keys.length && level === 1) { return 1; }
      return (first ? 0.95 : 0.8) * level;
    }
    /* כל המילים לפני המקום הזה הן מילות צורה או מספרים ("10 כדורי פלאפל", "כריך חביתה") */
    var MOD = {};
    'טבעוני צמחוני חריף ללא גלוטן סוכר ילדים דיאט זירו ביתי טרי קר חם מתוק מלוח'.split(' ').forEach(function (w) { MOD[key(canon(norm(w)))] = 1; });
    function lead(tx, at) {
      for (var i = 0; i < at; i++) { var t = tx.toks[i].t; if (!/^\d+$/.test(t) && !FORMAT[key(canon(t))]) { return false; } }
      return at > 0;
    }
    function mkForm(s, w, src) {
      var toks = prep(s).split(' ').filter(Boolean).map(function (t) { return key(canon(t)); });
      return { s: s, w: w, src: src, keys: toks, mod: toks.length > 0 && toks.every(function (k) { return MOD[k]; }) };
    }
    /* מקלדת באנגלית כשהתכוונו לעברית: "phmv" → "פיצה" (SI-1452). משתמשים רק כשאין שום תוצאה */
    var KB = { q: '/', w: "'", e: 'ק', r: 'ר', t: 'א', y: 'ט', u: 'ו', i: 'ן', o: 'ם', p: 'פ', a: 'ש', s: 'ד', d: 'ג', f: 'כ', g: 'ע', h: 'י', j: 'ח', k: 'ל', l: 'ך', ';': 'ף', z: 'ז', x: 'ס', c: 'ב', v: 'ה', b: 'נ', n: 'מ', m: 'צ', ',': 'ת', '.': 'ץ' };
    function fromLatinKeyboard(q) {
      var s = String(q || '').toLowerCase();
      if (!/^[a-z;,.'\/ ]+$/.test(s) || !/[a-z]/.test(s)) { return null; }
      return s.split('').map(function (c) { return KB[c] || c; }).join('');
    }
    /* הבנת השאילתה: הצורה המקורית (1) + מושגים קשורים (המשקל שלהם) */
    function understand(q) {
      var n = prep(q), forms = [mkForm(q, 1, 'q')], seen = {};
      seen[forms[0].keys.join(' ')] = 1;
      var canonQ = n.split(' ').map(canon).join(' ');
      var keysQ = n.split(' ').map(function (t) { return key(canon(t)); }).join(' ');
      Object.keys(CON).forEach(function (c) {
        var ck = prep(c).split(' ').map(function (t) { return key(canon(t)); }).join(' ');
        if (ck !== keysQ && prep(c) !== canonQ) { return; }
        CON[c].split('|').forEach(function (pair) {
          var m = /^(.*\S)\s+([\d.]+)$/.exec(pair); if (!m) { return; }
          var f = mkForm(m[1], +m[2], 'concept'), fk = f.keys.join(' ');
          if (!seen[fk]) { seen[fk] = 1; forms.push(f); }
        });
      });
      return forms;
    }
    /* הציון של שם מוצר מול השאילתה (כל הצורות, כל אחת במשקל שלה) */
    function itemScore(forms, name) {
      var best = 0, by = null;
      for (var i = 0; i < forms.length; i++) { var s = formScore(forms[i], name) * forms[i].w; if (s > best) { best = s; by = forms[i]; } }
      return { s: best, lit: !!by && by.src === 'q', by: by };
    }

    /* דירוג חנות. st = { name, cats:[שמות קטגוריות], secs:[[שם קטגוריה בתפריט, [[id, שם מוצר]...]]], live:[מוצרים חיים {_id,name}] }
       ctx = { km, open, accepting }. מחזיר { rel, final, items:[{id,name,s}], why } */
    var W = { name: 100, cat: 60, sec: 36, first: 30, more: 8, itemN: 5, share: 30, km: 4, closed: 25, paused: 35, storesMin: 30 };
    function scoreStore(forms, st, ctx) {
      var nameS = 0, catS = 0, secS = 0, items = [], seen = {};
      for (var f = 0; f < forms.length; f++) {
        var fw = forms[f].w;
        var ns = formScore(forms[f], st.name || ''); if (ns >= 0.75) { nameS = Math.max(nameS, ns * fw); }
        (st.cats || []).forEach(function (c) { var cs = formScore(forms[f], c); if (cs >= 0.75) { catS = Math.max(catS, cs * fw); } });
      }
      var menuN = 0, secLit = false, secCon = false;
      (st.secs || []).forEach(function (sec) {
        var list = sec[1] || [];
        menuN += list.length;
        var sh = itemScore(forms, sec[0]), head = sh.s >= 0.9 * (sh.by ? sh.by.w : 1);   /* "פיצות אדומות" — כן; "כריכים בלחם מלא" — לא */
        if (sh.s >= 0.5) { secS = Math.max(secS, (head ? 1 : 0.5) * sh.s * Math.min(1, 0.3 + list.length * 0.1)); }
        if (head && sh.s >= 0.5) { if (sh.lit) { secLit = true; } else { secCon = true; } }
        list.forEach(function (p) {
          var r = itemScore(forms, p[1]), s = r.s, lit = r.lit;
          if (head && sh.s >= 0.5 && s < 0.7 * sh.s) { s = 0.7 * sh.s; lit = sh.lit; }   /* מרגריטה בתוך "פיצות אדומות" = פיצה */
          if (s >= 0.3 && !seen[p[0]]) { seen[p[0]] = 1; items.push({ id: p[0], name: p[1], s: s, lit: lit }); }
        });
      });
      (st.live || []).forEach(function (p) {                                   /* מוצר חדש שעוד לא באינדקס */
        if (seen[p._id]) { return; }
        var r = itemScore(forms, p.name);
        if (r.s >= 0.3) { seen[p._id] = 1; items.push({ id: p._id, name: p.name, s: r.s, lit: r.lit, live: true }); menuN++; }
      });
      items.sort(function (a, b) { return b.s - a.s; });
      var itemPts = 0;
      items.slice(0, W.itemN).forEach(function (it, i) { itemPts += (i === 0 ? W.first : W.more) * it.s; });
      var strong = items.filter(function (it) { return it.s >= 0.9; }).length;
      var share = menuN ? Math.min(1, (strong / menuN) * 5) : 0;               /* חלק מהתפריט = התמחות */
      var rel = W.name * nameS + W.cat * catS + W.sec * secS + itemPts + W.share * share;
      /* "חנות" (לא רק מוצר): שם/קטגוריה/קטגוריה בתפריט, מנה שהיא באמת המנה (≥0.9), או 3+ מנות של מושג קשור */
      var litStrong = items.filter(function (it) { return it.lit && it.s >= 0.9; }).length;
      var conStrong = items.filter(function (it) { return !it.lit && it.s >= 0.5; }).length;
      var evidence = nameS >= 0.75 || catS >= 0.75 || secLit || litStrong >= 1 || secCon || conStrong >= 3;
      var weak = items.some(function (it) { return it.lit && it.s >= 0.75; });   /* למקרה שאין אף חנות "חזקה" (rank מרפה) */
      var c = ctx || {};
      var final = rel - (c.km || 0) * W.km - (c.open === false ? W.closed : 0) - (c.accepting === false ? W.paused : 0);
      return { rel: Math.round(rel * 10) / 10, final: Math.round(final * 10) / 10, avail: c.open !== false && c.accepting !== false, store: evidence && rel >= W.storesMin, weak: weak, items: items, nameS: nameS, catS: catS, secS: secS, share: share };
    }
    /* כל החנויות יחד: אם אין אף חנות "חזקה" — חנויות עם מוצר מתאים (גם אם המילה לא ראשונה) נכנסות לטאב החנויות */
    function pickStores(rows) {
      var strong = rows.filter(function (r) { return r.store; });
      if (strong.length) { return strong; }
      return rows.filter(function (r) { return r.weak && r.rel >= 15; });
    }
    /* סדר: קודם מה שאפשר להזמין עכשיו (פתוח ומקבל הזמנות), ובתוך כל קבוצה לפי הציון (Wolt: סגורים למטה, לא מוסתרים) */
    function order(rows) {
      return rows.slice().sort(function (a, b) { return (b.avail ? 1 : 0) - (a.avail ? 1 : 0) || b.final - a.final; });
    }
    return { norm: norm, key: key, prepText: prepText, formScore: formScore, understand: understand, itemScore: itemScore, scoreStore: scoreStore,
      pickStores: pickStores, order: order, setVocab: setVocab, fromLatinKeyboard: fromLatinKeyboard, correct: correct, W: W, CON: CON };
  })();
  /* MH-SEARCH-CORE-END */

  var stats = { version: VERSION, fixes: 0, runs: 0, searches: 0, rewritten: 0, chips: 0, swipes: 0, fallback: 0, timeouts: 0, timesHidden: 0,
                index: 'none', indexStores: 0, extraCalls: 0, idFetches: 0, tabAuto: 0, why: 0, errors: 0 };
  var INDEX_URL = 'https://raw.githubusercontent.com/davidebug10/maale-css/search-index/search-index.json';
  var T_JOB = 4000, T_CALL = 2500;      /* תקרת זמן: אחרי זה — התשובה המקורית של Hyperzod */
  var last = null;                       /* התוצאה האחרונה (לשורת "למה" ולבדיקות) */

  function app() { try { return document.getElementById('app').__vue_app__.config.globalProperties; } catch (e) { return null; } }
  function store() { var a = app(); return a && a.$store; }
  function timeout(p, ms) { return Promise.race([p, new Promise(function (r) { setTimeout(function () { r(null); }, ms); })]); }
  function heName(m) {
    var t = (m && m.language_translation) || [];
    for (var i = 0; i < t.length; i++) { if (t[i].key === 'name' && t[i].locale === 'he') { return t[i].value; } }
    return (m && m.name) || '';
  }
  function idOf(m) { return m && (m._id || m.merchant_id || m.id); }

  /* ---------- 1. האינדקס: כל התפריטים (נבנה פעמיים ביום ב-GitHub Actions, ענף search-index) ---------- */
  var IDX = null, idxP = null;
  function useIndex(j) {
    if (!j || !Array.isArray(j.stores) || !j.stores.length) { return null; }
    var names = [];
    j.stores.forEach(function (s) { names.push(s.name); (s.secs || []).forEach(function (x) { names.push(x[0]); (x[1] || []).forEach(function (p) { names.push(p[1]); }); }); });
    CORE.setVocab(names);
    IDX = j; stats.index = j.built || 'ok'; stats.indexStores = j.stores.length;
    return IDX;
  }
  function loadIndex() {
    if (idxP) { return idxP; }
    var o = window.__MH_SEARCH_INDEX__;                       /* בדיקות: אובייקט או כתובת */
    if (o && typeof o === 'object') { idxP = Promise.resolve(useIndex(o)); return idxP; }
    idxP = fetch(typeof o === 'string' ? o : INDEX_URL).then(function (r) { return r.ok ? r.json() : null; })
      .then(useIndex, function () { stats.index = 'failed'; return null; });
    return idxP;
  }

  /* ---------- 2. נתונים חיים ---------- */
  function homeMerchants() {
    var st = store(), h = st && st.state && st.state.homeData;
    return (h && [].concat(h.merchants || [], h.featured_merchants || [])) || [];
  }
  function catNames() {
    var st = store(), list = (st && st.getters && st.getters.getMerchantCategories) || [], map = {};
    (Array.isArray(list) ? list : []).forEach(function (c) { map[idOf(c)] = heName(c); });
    return map;
  }
  /* קריאה נוספת ל-API, עם אותן כותרות שהאפליקציה שלחה (X-Tenant וכו') */
  function call(base, params, headers) {
    stats.extraCalls++;
    var qs = Object.keys(params).map(function (k) {
      var v = params[k];
      return Array.isArray(v) ? v.map(function (x) { return encodeURIComponent(k + '[]') + '=' + encodeURIComponent(x); }).join('&') : encodeURIComponent(k) + '=' + encodeURIComponent(v);
    }).join('&');
    /* בלי Authorization: החיפוש ציבורי, ו-401 על טוקן ישן לא צריך לגעת בכלום */
    var h = {}; Object.keys(headers || {}).forEach(function (k) { if (!/apm|content-type|authorization/i.test(k)) { h[k] = headers[k]; } });
    return timeout(fetch(base + '?' + qs, { headers: h, credentials: 'omit' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }), T_CALL);
  }

  /* ---------- 3. המנוע ---------- */
  function compute(s, mRaw, pRaw, headers, depth) {
    var api = s.origin + '/store/v1';
    function retryKeyboard(res) {
      var kb = !depth && !res && (CORE.fromLatinKeyboard(s.q) || CORE.correct(s.q));   /* מקלדת באנגלית, ואז שגיאת כתיב */
      if (!kb) { return res; }
      var s2 = Object.assign({}, s, { q: kb }), b2 = { location: [s.lat, s.lng], locale: s.locale || 'he', q: kb };
      return Promise.all([call(api + '/search', Object.assign({ search_type: 'merchant' }, b2), headers), call(api + '/search', Object.assign({ search_type: 'product' }, b2), headers)])
        .then(function (r) { return compute(s2, r[0], r[1], headers, 1); })
        .then(function (r2) { if (r2 && last) { last.q = s.q; last.kb = kb; } return r2; });
    }
    var forms = CORE.understand(s.q);
    var objs = {}, live = {}, prodById = {};
    function take(list, withProducts) {
      (Array.isArray(list) ? list : []).forEach(function (g) {
        var id = idOf(g); if (!id) { return; }
        if (!objs[id] || (withProducts && !objs[id].products)) { objs[id] = g; }
        if (withProducts) {
          var arr = live[id] || (live[id] = []);
          (g.products || []).forEach(function (p) { if (p && p._id && !prodById[p._id]) { prodById[p._id] = p; arr.push(p); } });
        }
      });
    }
    take(pRaw && pRaw.data, true);
    take(mRaw && mRaw.data, false);
    take(homeMerchants(), false);
    var base = { location: [s.lat, s.lng], locale: s.locale || 'he', search_type: 'product' };
    var more = [];
    if (pRaw && Array.isArray(pRaw.data) && pRaw.data.length >= 10) {     /* שאר העמודים של Hyperzod */
      [2, 3].forEach(function (pg) { more.push(call(api + '/search', Object.assign({}, base, { q: s.q, page: pg }), headers)); });
    }
    forms.filter(function (f) { return f.src === 'concept' && f.w >= 0.6; }).slice(0, 3).forEach(function (f) {   /* "איטלקי" → גם "פיצה", "פסטה" */
      more.push(call(api + '/search', Object.assign({}, base, { q: f.s }), headers));
    });
    return Promise.all(more).then(function (rs) {
      rs.forEach(function (r) { if (r && r.success) { take(r.data, true); } });
      var cats = catNames(), rows = [], inIdx = {};
      function row(id, st) {
        var o = objs[id];
        var r = CORE.scoreStore(forms, st, o ? { km: (+o.user_to_merchant_distance_meters || 0) / 1000, open: o.is_open !== false, accepting: o.is_accepting_orders !== false } : {});
        r.id = id; r.obj = o || null; r.name = st.name;
        return r;
      }
      ((IDX && IDX.stores) || []).forEach(function (st) {
        inIdx[st.id] = 1;
        rows.push(row(st.id, { name: st.name, cats: (st.cats || []).map(function (c) { return cats[c]; }).filter(Boolean), secs: st.secs, live: live[st.id] || [] }));
      });
      Object.keys(objs).forEach(function (id) {                            /* חנות חדשה שעוד לא באינדקס */
        if (inIdx[id]) { return; }
        var o = objs[id];
        rows.push(row(id, { name: heName(o), cats: (o.merchant_category_ids || []).map(function (c) { return cats[c]; }).filter(Boolean), secs: [], live: live[id] || [] }));
      });
      rows = rows.filter(function (r) { return r.rel > 0 && r.obj; });      /* בלי אובייקט חי = לא מגיעה ללקוח הזה */
      var stores = CORE.order(CORE.pickStores(rows));
      /* מוצרים: חזק (המילה היא המנה) קודם, ואז מה שאפשר להזמין עכשיו, ואז הציון */
      var groups = rows.map(function (r) {
        var items = r.items.filter(function (it) { return it.lit ? it.s >= 0.6 : it.s >= 0.5; });   /* 0.665 = מנה מתוך "פיצות אדומות" */
        return { r: r, items: items, strong: items.some(function (it) { return it.s >= 0.9; }) };
      }).filter(function (g) { return g.items.length; });
      groups.sort(function (a, b) { return (b.strong ? 1 : 0) - (a.strong ? 1 : 0) || (b.r.avail ? 1 : 0) - (a.r.avail ? 1 : 0) || b.r.final - a.r.final; });
      if (!stores.length && !groups.length) { return retryKeyboard(null); }  /* כלום — מקלדת באנגלית? ואם לא: Hyperzod (fuzzy) כגיבוי */
      /* מוצרים מהאינדקס שלא הגיעו בחיפוש של Hyperzod: מושכים אותם חיים לפי מזהה (מחיר ומלאי עדכניים) */
      var need = [];
      groups.slice(0, 12).forEach(function (g) {
        var miss = g.items.slice(0, 6).filter(function (it) { return !prodById[it.id]; }).map(function (it) { return it.id; });
        if (miss.length) { need.push({ id: g.r.id, ids: miss }); }
      });
      return Promise.all(need.slice(0, 6).map(function (n) {
        stats.idFetches++;
        return call(api + '/catalog/products/listByIds', { merchant_id: n.id, ids: n.ids }, headers).then(function (r) {
          var list = (r && (Array.isArray(r.data) ? r.data : r.data && r.data.data)) || [];
          list.forEach(function (p) { if (p && p._id && p.status !== false) { prodById[p._id] = p; } });
        });
      })).then(function () {
        var outGroups = [];
        groups.forEach(function (g) {
          var prods = [];
          g.items.forEach(function (it) { var p = prodById[it.id]; if (p && prods.length < 6 && prods.indexOf(p) < 0) { prods.push(p); } });
          if (!prods.length) { return; }
          var o = Object.assign({}, g.r.obj); o.products = prods; o.is_paginated = false;
          outGroups.push(o);
        });
        var outStores = stores.map(function (r) { var o = Object.assign({}, r.obj); delete o.products; return o; });
        last = { q: s.q, at: Date.now(), forms: forms.map(function (f) { return f.s + (f.w < 1 ? '·' + f.w : ''); }),
          stores: stores.map(function (r) { return { id: r.id, slug: r.obj.slug, name: r.name, rel: r.rel, final: r.final, avail: r.avail,
            items: r.items.filter(function (it) { return it.lit ? it.s >= 0.6 : it.s >= 0.5; }).slice(0, 12).map(function (it) { return it.name; }) }; }),
          groups: outGroups.map(function (o) { return { slug: o.slug, n: o.products.length }; }) };
        return {
          merchants: Object.assign({}, mRaw || { success: true }, { success: true, data: outStores }),
          products: Object.assign({}, pRaw || { success: true }, { success: true, data: outGroups })
        };
      });
    });
  }

  /* שתי הבקשות (חנויות + מוצרים) יוצאות יחד — עבודה אחת לשתיהן */
  var jobs = {};
  function job(s, headers) {
    var k = s.q + '|' + s.lat + '|' + s.lng, j = jobs[k];
    if (j && Date.now() - j.t < 15000) { return j; }
    var rm, rp, pm = new Promise(function (r) { rm = r; }), pp = new Promise(function (r) { rp = r; });
    j = jobs[k] = { t: Date.now(), m: rm, p: rp, done: false };
    stats.searches++;
    j.result = Promise.all([timeout(pm, 2500), timeout(pp, 2500), timeout(loadIndex(), 2500)])
      .then(function (a) { return compute(s, a[0], a[1], headers); })
      .then(function (r) { j.done = !!r; j.settled = true; if (!r) { stats.fallback++; } return r; },
            function (e) { j.settled = true; stats.errors++; console.warn('[MH Search]', e); return null; });
    return j;
  }

  /* ---------- 4. XHR: לפני ש-Hyperzod קוראת את התשובה ---------- */
  function parseSearch(url) {
    var u; try { u = new URL(url, location.href); } catch (e) { return null; }
    if (!/\/store\/v1\/search\/?$/.test(u.pathname)) { return null; }
    var p = u.searchParams, type = p.get('search_type'), q = (p.get('q') || '').trim();
    if ((type !== 'merchant' && type !== 'product') || q.length < 2) { return null; }
    /* מיון/סינון מהצ'יפים: sort_by[0][key]=average_rating&sort_by[0][value]=desc&filters[1][key]=accepted_order_types&filters[1][value][0]=delivery */
    var sort = [], filters = [];
    p.forEach(function (v, k) {
      var m = /^sort_by\[(\d+)\]\[(key|value)\]$/.exec(k);
      if (m) { (sort[m[1]] = sort[m[1]] || {})[m[2]] = v; return; }
      m = /^filters\[(\d+)\]\[(key|value)\](\[\d+\])?$/.exec(k);
      if (m) { var f = filters[m[1]] = filters[m[1]] || { values: [] }; if (m[2] === 'key') { f.key = v; } else { f.values.push(v); } }
    });
    sort = sort.filter(Boolean); filters = filters.filter(Boolean);
    var loc = p.getAll('location[]');
    return { type: type, q: q, lat: loc[0], lng: loc[1], locale: p.get('locale'), page: +(p.get('page') || 1), origin: u.origin,
      filtered: !!(sort.length || filters.length), sort: sort, filters: filters };
  }
  try {
    var XP = XMLHttpRequest.prototype, _open = XP.open, _send = XP.send, _set = XP.setRequestHeader;
    var RT = Object.getOwnPropertyDescriptor(XP, 'responseText');
    XP.open = function (m, url) {
      try { this.__mhs = String(m).toUpperCase() === 'GET' ? parseSearch(url) : null; if (this.__mhs) { this.__mhsH = {}; } } catch (e) { this.__mhs = null; }
      return _open.apply(this, arguments);
    };
    XP.setRequestHeader = function (k, v) { try { if (this.__mhsH) { this.__mhsH[k] = v; } } catch (e) {} return _set.apply(this, arguments); };
    XP.send = function () {
      var x = this, s = x.__mhs;
      if (s) { try { hook(x, s); } catch (e) { stats.errors++; } }
      return _send.apply(this, arguments);
    };
  } catch (e) { console.warn('[MH Search] XHR hook disabled:', e); }
  /* הלקוח בחר מיון/סינון: אותה רלוונטיות שלנו, ועליה הסינון והמיון שלו (Hyperzod לבד מחפשת רק בשם החנות) */
  function applyChips(s, out) {
    var list = (out && out.merchants && out.merchants.data) || [];
    s.filters.forEach(function (f) {
      if (f.key === 'minimum_rating') { list = list.filter(function (m) { return (+m.average_rating || 0) >= (+f.values[0] || 0); }); }
      else if (f.key === 'accepted_order_types') { list = list.filter(function (m) { return (m.accepted_order_types || []).some(function (t) { return f.values.indexOf(t) >= 0; }); }); }
      else if (f.key === 'merchant_category_ids') { list = list.filter(function (m) { return (m.merchant_category_ids || []).some(function (c) { return f.values.indexOf(c) >= 0; }); }); }
    });
    s.sort.forEach(function (o) {
      if (o.key === 'average_rating') { list = list.slice().sort(function (a, b) { return (+b.average_rating || 0) - (+a.average_rating || 0); }); }
      else if (o.key === 'distance_haversine') { list = list.slice().sort(function (a, b) { return (+a.user_to_merchant_distance_meters || 0) - (+b.user_to_merchant_distance_meters || 0); }); }
    });
    return Object.assign({}, out.merchants, { data: list });
  }
  function hook(x, s) {
    var end = x.onloadend;                                   /* axios מגדיר onloadend לפני send */
    if (typeof end !== 'function') { return; }
    x.onloadend = function () {
      var self = this, args = arguments, called = false;
      function finish(out) {
        if (called) { return; } called = true;
        if (out) {
          var txt = JSON.stringify(out);
          try {
            Object.defineProperty(x, 'responseText', { configurable: true, get: function () { return txt; } });
            Object.defineProperty(x, 'response', { configurable: true, get: function () { return x.responseType === 'json' ? out : txt; } });
            stats.rewritten++;
          } catch (e) { stats.errors++; }
        }
        end.apply(self, args);
      }
      try {
        var raw = RT.get.call(x), j = null;
        if (x.status !== 200 || !raw) { return finish(null); }
        try { j = JSON.parse(raw); } catch (e) { return finish(null); }
        if (s.type === 'product' && s.page > 1) {           /* עמוד 1 שלנו כבר מכיל הכל */
          var k = s.q + '|' + s.lat + '|' + s.lng;
          return finish(jobs[k] && jobs[k].done ? Object.assign({}, j, { data: [] }) : null);
        }
        if (s.filtered) {                                    /* רק בקשת חנויות (searchMerchantsWithFilters) — בלי זוג */
          if (s.type !== 'merchant') { return finish(null); }
          stats.chips++;
          return timeout(loadIndex(), 2500).then(function () { return timeout(compute(s, j, null, x.__mhsH), T_JOB); })
            .then(function (r) { finish(r ? applyChips(s, r) : null); }, function () { finish(null); });
        }
        var jb = job(s, x.__mhsH);
        if (s.type === 'merchant') { jb.m(j); } else { jb.p(j); }
        timeout(jb.result, T_JOB).then(function (r) {
          if (!jb.settled) { stats.timeouts++; }
          finish(r ? (s.type === 'merchant' ? r.merchants : r.products) : null);
        }, function () { finish(null); });
      } catch (e) { stats.errors++; finish(null); }
    };
  }

  /* ---------- 5. "חנויות" נפתח קודם (Hyperzod: products.length>0 ? tab=0) ---------- */
  function searchComp() {
    var el = document.getElementById('app'), found = null;
    if (!el || !el._vnode) { return null; }
    (function node(v, d) {
      if (!v || found || d > 300) { return; }
      if (v.component) {
        try { var p = v.component.proxy; if (p && typeof p.getSearch === 'function' && 'tab' in p && 'merchants' in p) { found = p; return; } } catch (e) {}
        node(v.component.subTree, d + 1);
      }
      if (v.suspense && v.suspense.activeBranch) { node(v.suspense.activeBranch, d + 1); }
      if (Array.isArray(v.children)) { for (var i = 0; i < v.children.length && !found; i++) { node(v.children[i], d + 1); } }
    })(el._vnode, 0);
    return found;
  }
  var watched = null;
  function watchTabs() {
    if (!document.getElementById('MultiVendorSearch')) { return; }
    var p = searchComp();
    if (!p || p === watched || typeof p.$watch !== 'function') { return; }
    watched = p;
    var auto = false;
    function storesFirst() { if (auto && p.tab !== 1 && Array.isArray(p.merchants) && p.merchants.length) { p.tab = 1; stats.tabAuto++; } }
    p.$watch('searchedText', function () { auto = true; }, { flush: 'sync' });
    p.$watch('merchants', storesFirst, { flush: 'sync' });
    p.$watch('tab', storesFirst, { flush: 'sync' });
    p.$watch('loading', function (v) { if (!v) { auto = false; } }, { flush: 'sync' });
  }

  /* ---------- 6. מונה בטאבים + שורת "למה" בכרטיסי החנויות + טקסטים (v1) ---------- */
  var MAP = [
    [/(\d+)\s*mins?\b/g, '$1 דק׳'],
    [/\bmins?\b/g, 'דק׳'],
    [/קילומטר/g, 'ק״מ'],
    [/No merchants found\.?/g, 'לא נמצאו חנויות'],
    [/No products found\.?/g, 'לא נמצאו מוצרים'],
    [/No results found\.?/g, 'לא נמצאו תוצאות']
  ];
  function fixText(node) {
    var t = node.nodeValue; if (!t) { return; }
    var n = t;
    for (var i = 0; i < MAP.length; i++) { n = n.replace(MAP[i][0], MAP[i][1]); }
    if (n !== t) { node.nodeValue = n; stats.fixes++; }
  }
  function walk(root) { var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); var n; while ((n = w.nextNode())) { fixText(n); } }
  function why(it) {
    var n = it.items.length;
    if (!n) { return ''; }
    return it.items.slice(0, 2).join(' · ') + (n > 2 ? ' · ועוד ' + (n - 2) : '');
  }
  /* החלקה בין הטאבים (דוד: "שיהיה אפשר להחליק"). RTL: "חנויות" מימין — החלקה ימינה → מוצרים, שמאלה → חנויות.
     לא מתחילים מתוך שורה שגוללת לרוחב (הצ'יפים) או מקצה המסך (חזרה של האייפון) */
  function bindSwipe(main) {
    if (main.__mhSwipe) { return; }
    main.__mhSwipe = true;
    var sx = 0, sy = 0, st = 0, on = false;
    main.addEventListener('touchstart', function (e) {
      on = false;
      var t = e.touches && e.touches[0];
      if (!t || e.touches.length > 1 || !e.target.closest || !e.target.closest('.scheme-global-search-tabs-window')) { return; }
      if (t.clientX < 24 || t.clientX > window.innerWidth - 24) { return; }
      for (var el = e.target; el && el !== main; el = el.parentElement) {
        if (el.scrollWidth > el.clientWidth + 2 && /(auto|scroll)/.test(getComputedStyle(el).overflowX)) { return; }
      }
      sx = t.clientX; sy = t.clientY; st = Date.now(); on = true;
    }, { passive: true });
    main.addEventListener('touchend', function (e) {
      if (!on) { return; }
      on = false;
      var t = e.changedTouches && e.changedTouches[0], p = watched;
      if (!t || !p) { return; }
      var dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.6 || Date.now() - st > 800) { return; }
      var want = dx > 0 ? 0 : 1;
      if (p.tab !== want) { p.tab = want; stats.swipes++; }
    }, { passive: true });
  }
  function sync() {
    var main = document.getElementById('MultiVendorSearch');
    if (!main) { return; }
    stats.runs++;
    watchTabs();
    bindSwipe(main);
    var texts = main.querySelectorAll('#SearchedMerchantAverageTimeAndDistance, #merchantDistance, .tab-item-merchant h6, .tab-item-product h6, .tab-item-merchant .text-h6, .tab-item-product .text-h6');
    for (var i = 0; i < texts.length; i++) { walk(texts[i]); }
    /* זמני משלוח מוסתרים (דוד 9.10): בכותרת קבוצת המוצרים הזמן הוא צומת הטקסט הראשון לפני הנקודה — מרוקנים
       (השעון והנקודה מוסתרים ב-CSS, חלק 26ב סעיף 13; המרחק נשאר) */
    var heads = main.querySelectorAll('#SearchedMerchantAverageTimeAndDistance > span');
    for (var h = 0; h < heads.length; h++) {
      var f0 = heads[h].firstChild;
      if (f0 && f0.nodeType === 3 && f0.nodeValue.trim()) { f0.nodeValue = ''; stats.timesHidden++; }
    }
    var ratings = main.querySelectorAll('#SearchedMerchantRating');
    for (var j = 0; j < ratings.length; j++) {
      var un = /לא מדורג|not rated/i.test(ratings[j].textContent);
      if (ratings[j].classList.contains('mh-unrated') !== un) { ratings[j].classList.toggle('mh-unrated', un); }
    }
    var p = watched;
    if (p) {                                                /* מונים: "חנויות 4" / "מוצרים 12" */
      var nm = Array.isArray(p.merchants) ? p.merchants.length : 0;
      var np = Array.isArray(p.products) ? p.products.reduce(function (a, g) { return a + ((g && g.products) || []).length; }, 0) : 0;
      /* על ה-span הפנימי: ה-::after של הכפתור תפוס (שכבת הזכוכית) — ה-::before של ה-span הוא התווית (חלק 26ב) */
      var tm = document.querySelector('#search-merchant-tab .v-btn__content'), tp = document.querySelector('#search-product-tab .v-btn__content');
      if (tm && tm.getAttribute('data-mh-n') !== String(nm)) { tm.setAttribute('data-mh-n', nm); }
      if (tp && tp.getAttribute('data-mh-n') !== String(np)) { tp.setAttribute('data-mh-n', np); }
    }
    /* שורת "למה" — הכרטיסים מצוירים בסדר של הרשימה ששלחנו */
    var L = last, cards = main.querySelectorAll('.tab-item-merchant .merchant-card-title');
    if (L && p && p.searchedText === L.q && cards.length === L.stores.length) {
      for (var c = 0; c < cards.length; c++) {
        var host = cards[c].parentElement, line = host && host.querySelector('.mh-why'), text = why(L.stores[c]);
        if (!host) { continue; }
        if (!text) { if (line) { line.remove(); } continue; }
        if (!line) { line = document.createElement('div'); line.className = 'mh-why'; cards[c].insertAdjacentElement('afterend', line); }
        if (line.textContent !== text) { line.textContent = text; stats.why++; }
      }
    }
    /* הוקלד במקלדת באנגלית: "הצגנו תוצאות עבור: פיצה" */
    var note = main.querySelector('#mh-search-note'), kbq = L && p && p.searchedText === L.q && L.kb;
    var tabs = main.querySelector('.scheme-global-search-tabs');
    if (kbq && tabs) {
      if (!note) { note = document.createElement('div'); note.id = 'mh-search-note'; tabs.insertAdjacentElement('afterend', note); }
      var nt = 'הצגנו תוצאות עבור: ' + kbq;
      if (note.textContent !== nt) { note.textContent = nt; }
    } else if (note) { note.remove(); }
    /* מצב ריק במוצרים: "0 תוצאות" (מ-v1) */
    var counter = main.querySelector('.tab-item-product > .tw-flex > span');
    var empty = main.querySelector('#mh-search-empty');
    var isZero = !!counter && /^0\s/.test(counter.textContent.trim());
    if (isZero && !empty) {
      var d = document.createElement('div'); d.id = 'mh-search-empty';
      d.textContent = 'לא מצאנו מנות שמתאימות לחיפוש. נסו מילה אחרת, או עברו לטאב "חנויות".';
      counter.parentNode.insertAdjacentElement('afterend', d);
    } else if (!isZero && empty) { empty.remove(); }
  }
  var pending = false;
  function schedule() {
    if (pending) { return; } pending = true;
    setTimeout(function () { pending = false; try { sync(); } catch (e) { stats.errors++; } }, 60);
  }
  try {
    new MutationObserver(schedule).observe(document.documentElement, { subtree: true, childList: true, characterData: true });
    schedule();
    /* האינדקס (~25KB) נטען בזמן מת, כדי שהחיפוש הראשון לא יחכה לו */
    setTimeout(function () { (window.requestIdleCallback || function (f) { setTimeout(f, 1); })(function () { loadIndex(); }); }, 2500);
  } catch (e) { console.warn('[MH Search] disabled:', e); }

  window.MH_SEARCH = {
    version: VERSION, sync: sync, core: CORE,
    index: loadIndex,                                        /* האינדקס (Promise, הורדה אחת לכל הדף) — גם להירו של דף הבית (מספר העסקים והמנות) */
    last: function () { return last; },
    stats: function () { return Object.assign({}, stats); },
    /* MH_SEARCH.explain('פלאפל') — הדירוג מהאינדקס בלבד (בלי מרחק/פתוח), לבדיקה */
    explain: function (q) {
      return loadIndex().then(function () {
        var forms = CORE.understand(q);
        return ((IDX && IDX.stores) || []).map(function (st) { var r = CORE.scoreStore(forms, { name: st.name, secs: st.secs }, {}); return { slug: st.slug, rel: r.rel, store: r.store, items: r.items.slice(0, 3).map(function (i) { return i.name; }) }; })
          .filter(function (r) { return r.rel > 0; }).sort(function (a, b) { return b.rel - a.rel; });
      });
    }
  };
  /* mh-search-v2 */
})();

/* ============================================================
   אופציות בפופאפ המוצר — MH Options  |  v1.0.0 | 2026-09-07
   מסמן mh-opt-on על שורת אופציה (.v-list-item) שהרדיו/צ'קבוקס שלה מסומן. הסיבה: Safari ב-iOS לא
   מרענן :has(input:checked) כש-Vue מחליף את הבחירה — המסגרת האדומה נשארה על אופציה אחת והנקודה
   על אחרת. ה-CSS (חלק 22ט ב-global-cdn.css) נשען על המחלקה הזאת ועל .v-selection-control--dirty.
   נכשל-פתוח: בלי הבלוק הזה ה-CSS עדיין עובד לפי המחלקה של Vuetify. בדיקה: window.MH_OPTIONS.stats()
   ============================================================ */
(function () {
  'use strict';
  if (window.__MH_OPTIONS__) { return; }
  window.__MH_OPTIONS__ = true;
  var VERSION = '1.0.0';
  var stats = { version: VERSION, syncs: 0, marked: 0 };
  function sync() {
    var rows = document.querySelectorAll('.product-popup .scheme-product-options-card .v-list-item');
    var n = 0;
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var on = !!r.querySelector('.v-selection-control--dirty, input:checked');
      if (r.classList.contains('mh-opt-on') !== on) r.classList.toggle('mh-opt-on', on);
      if (on) n++;
    }
    stats.syncs++; stats.marked = n;
    return rows.length;
  }
  var pending = false;
  function schedule() {
    if (pending) return; pending = true;
    setTimeout(function () { pending = false; try { sync(); } catch (e) { /* נכשל-פתוח */ } }, 30);
  }
  try {
    new MutationObserver(schedule).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'checked'] });
    document.addEventListener('change', schedule, true);
    document.addEventListener('click', schedule, true);
    schedule();
  } catch (e) { console.warn('[MH Options] disabled:', e); }
  window.MH_OPTIONS = { version: VERSION, sync: sync, stats: function () { return Object.assign({}, stats); } };
})();

/* ============================================================
   מגבלת בחירה בקבוצת תוספות — MH OptLimit  |  v1.1.0 | 2026-10-05 (v1.0.0: 23.9)
   הבעיה: המסעדן מגדיר בקבוצה "מינימום-מקסימום" (enable_range + max_quantity, למשל "עד 3 טעמים"),
   אבל הפופאפ של Hyperzod לא מציג את המגבלה ולא אוכף אותה — אפשר היה להוסיף לעגלה 5 טעמים (אומת 23.9).
   v1.1.0 (דוד, 5.10): **בכל החנויות, אוטומטית** — בלי רשימת חנויות. כל קבוצה שהמסעדן הגדיר לה "אפשר טווח"
   (selection_type=multiple + enable_range + max_quantity קטן ממספר האופציות) נאכפת. נבדק 5.10: 139 קבוצות
   ב-8 חנויות (קצפת, שניצל 20 טעמים, השיפודיה, Pasta Basta, טוסטראק, שיבולת השרון, מפגש השייח, רולדין).
   הנתונים מותאמים לחנות שבכתובת (/m/<slug>/<id>) כדי ששם מוצר זהה בחנות אחרת לא יבלבל.
   + תיקון: לחיצה ישירה על עיגול ה-checkbox עקפה את המגבלה (input:checked מסומן לפני הלחיצה) — עכשיו לפי מחלקת Vuetify.
   מה הבלוק עושה:
   1. קורא את נתוני המוצר מהתשובה של getById (עוטף XHR/fetch — קריאה בלבד, לא משנה בקשה או תשובה).
   2. בכל קבוצה מוגבלת מוסיף לכותרת תג .mh-lim ("עד 3" → "2 מתוך 3"), ובמלאה מסמן .mh-lim-full
      על הקבוצה ו-.mh-lim-off על האופציות שלא נבחרו (העיצוב בחלק 22ט).
   3. חוסם לחיצה שמוסיפה בחירה מעבר למקסימום (click ב-capture על window, לפני Vue) ומציג הודעה.
      קבוצה של "עד 1": לחיצה על אופציה אחרת מחליפה את הבחירה.
   4. חוסם "הוספה" אם בכל זאת יש קבוצה מעבר למקסימום.
   הספירה לא נשענת רק על ה-DOM: "הראה פחות" מסיר מה-DOM אופציות מסומנות, ולכן נשמר מצב לכל אופציה
   לפי שמה, מתאפס בכל פתיחת פופאפ. לא נוגע בקבוצות של רבעי הפיצה (mhq). נכשל-פתוח.
   בדיקה: window.MH_OPTLIMIT.stats()
   ============================================================ */
(function () {
  'use strict';
  if (window.__MH_OPTLIMIT__) { return; }
  window.__MH_OPTLIMIT__ = true;
  var VERSION = '1.1.0';
  var stats = { version: VERSION, products: 0, groups: 0, blocked: 0, swapped: 0, addBlocked: 0, lastProduct: '' };
  var PRODUCTS = {};          // שם מוצר → { merchant, groups: [...] }
  var session = { key: '', sel: {} };  // מצב הבחירות של הפופאפ הפתוח: sel[groupIndex][label] = true/false

  function norm(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }

  function remember(url, text) {
    try {
      if (!/\/catalog\/products\/getById/.test(url)) return;
      var d = (JSON.parse(text) || {}).data;
      if (!d || !d.name || !d.product_options) return;
      var m = /[?&]merchant_id=([0-9a-f]+)/.exec(url);
      PRODUCTS[norm(d.name)] = { merchant: d.merchant_id || (m && m[1]) || '', groups: d.product_options };
      stats.products = Object.keys(PRODUCTS).length;
      schedule();
    } catch (e) { /* נכשל-פתוח */ }
  }
  try {
    var xo = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
      try {
        var u = String(url || '');
        if (/getById/.test(u)) {
          var x = this;
          x.addEventListener('load', function () { try { if (x.responseType === '' || x.responseType === 'text') remember(u, x.responseText); else if (x.responseType === 'json') remember(u, JSON.stringify(x.response)); } catch (e) {} });
        }
      } catch (e) {}
      return xo.apply(this, arguments);
    };
    if (window.fetch) {
      var fo = window.fetch;
      window.fetch = function (input) {
        var p = fo.apply(this, arguments);
        try {
          var u = String((input && input.url) || input || '');
          if (/getById/.test(u)) p.then(function (r) { try { r.clone().text().then(function (t) { remember(u, t); }); } catch (e) {} });
        } catch (e) {}
        return p;
      };
    }
  } catch (e) { console.warn('[MH OptLimit] no capture:', e); }

  function headingTitle(h) {
    var h2 = h.querySelector('h2'); if (!h2) return '';
    var t = '';
    for (var i = 0; i < h2.childNodes.length; i++) { if (h2.childNodes[i].nodeType === 3) t += h2.childNodes[i].textContent; }
    return norm(t);
  }
  function rowLabel(r) { var t = r.querySelector('.v-list-item-title'); return norm(t ? t.textContent : ''); }
  /* מצב "נבחר" רק לפי המחלקה של Vuetify: בלחיצה ישירה על ה-checkbox הדפדפן מסמן input:checked *לפני* שהלחיצה
     מגיעה אלינו, ואז הבחירה ה-(max+1) נראתה כ"ביטול" ועברה (באג של v1.0.0). המחלקה מתעדכנת רק אחרי Vue. */
  function rowOn(r) { return !!r.querySelector('.v-selection-control--dirty'); }

  // מחזיר את הקבוצות המוגבלות בפופאפ הפתוח: [{grp, max, min, sel}]
  function scan() {
    var popup = document.querySelector('.product-popup');
    var form = popup && popup.querySelector('#ProductPopupForm');
    if (!form) { session.key = ''; return []; }
    var nameEl = popup.querySelector('.product-name');
    var name = norm(nameEl ? nameEl.textContent : '');
    var prod = PRODUCTS[name];
    var cur = (/\/m\/[^/]+\/([0-9a-f]{24})/.exec(location.pathname) || [])[1];
    if (!prod || (cur && prod.merchant && prod.merchant !== cur)) return [];
    if (session.key !== name) { session = { key: name, sel: {} }; stats.lastProduct = name; }
    var heads = form.querySelectorAll('.addon-heading');
    var used = {}, out = [];
    for (var i = 0; i < heads.length; i++) {
      var h = heads[i], grp = h.parentElement;
      if (!grp) continue;
      if (grp.querySelector('[class*="mhq"]')) { if (grp.classList.contains('mh-lim-grp')) clear(grp); continue; }   /* רבעי פיצה — לא נוגעים, ומנקים סימון ישן */
      var title = headingTitle(h), rule = null, skip = used[title] || 0;
      for (var j = 0; j < prod.groups.length; j++) {
        if (norm(prod.groups[j].option_name) === title) { if (skip-- === 0) { rule = prod.groups[j]; break; } }
      }
      used[title] = (used[title] || 0) + 1;
      var max = rule ? +rule.max_quantity || 0 : 0;
      var total = rule && rule.options ? rule.options.length : 0;
      if (!rule || rule.selection_type !== 'multiple' || !rule.enable_range || max < 1 || max >= total) {
        if (grp.classList.contains('mh-lim-grp')) clear(grp);
        continue;
      }
      var sel = session.sel[i] || (session.sel[i] = {});
      var rows = grp.querySelectorAll('.v-list-item');
      for (var k = 0; k < rows.length; k++) { var l = rowLabel(rows[k]); if (l) sel[l] = rowOn(rows[k]); }
      out.push({ grp: grp, head: h, idx: i, max: max, min: +rule.min_quantity || 0, sel: sel, rows: rows });
    }
    return out;
  }
  function count(g) { var n = 0; for (var k in g.sel) if (g.sel[k]) n++; return n; }
  function clear(grp) {
    grp.classList.remove('mh-lim-grp', 'mh-lim-full');
    var c = grp.querySelector('.mh-lim'); if (c) c.remove();
    var off = grp.querySelectorAll('.mh-lim-off'); for (var i = 0; i < off.length; i++) off[i].classList.remove('mh-lim-off');
  }
  function chipText(n, g) {
    if (g.max === 1) return n ? 'נבחר' : 'בחירה אחת';
    if (!n) return (g.min === g.max ? 'בחרו ' : 'עד ') + g.max;
    return n + ' מתוך ' + g.max;
  }
  function paint(g) {
    var n = count(g), full = n >= g.max;
    if (!g.grp.classList.contains('mh-lim-grp')) g.grp.classList.add('mh-lim-grp');
    if (g.grp.classList.contains('mh-lim-full') !== full) g.grp.classList.toggle('mh-lim-full', full);
    var chip = g.head.querySelector('.mh-lim');
    if (!chip) { chip = document.createElement('span'); chip.className = 'mh-lim'; g.head.appendChild(chip); }
    var t = chipText(n, g); if (chip.textContent !== t) chip.textContent = t;
    for (var k = 0; k < g.rows.length; k++) {
      var off = full && g.max > 1 && !rowOn(g.rows[k]);
      if (g.rows[k].classList.contains('mh-lim-off') !== off) g.rows[k].classList.toggle('mh-lim-off', off);
    }
  }
  function sync() { var gs = scan(); for (var i = 0; i < gs.length; i++) paint(gs[i]); stats.groups = gs.length; return gs; }

  var noteTimer = null;
  function note(g, msg) {
    try {
      var el = g.head.querySelector('.mh-lim-note');
      if (!el) { el = document.createElement('div'); el.className = 'mh-lim-note'; el.setAttribute('role', 'alert'); g.head.appendChild(el); }
      el.textContent = msg;
      el.classList.remove('mh-lim-note--on'); void el.offsetWidth; el.classList.add('mh-lim-note--on');
      clearTimeout(noteTimer);
      noteTimer = setTimeout(function () { try { el.remove(); } catch (e) {} }, 3200);
    } catch (e) {}
  }
  function stop(e) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); }

  var swapping = false;
  function onClick(e) {
    try {
      if (swapping) return;
      var t = e.target; if (!t || !t.closest) return;
      // "הוספה" עם קבוצה מעבר למקסימום
      var add = t.closest('.product-popup button.add-btn');
      if (add) {
        var gs0 = sync();
        for (var a = 0; a < gs0.length; a++) {
          if (count(gs0[a]) > gs0[a].max) {
            stop(e); stats.addBlocked++;
            note(gs0[a], 'בחרתם יותר מ-' + gs0[a].max + '. בטלו ' + (count(gs0[a]) - gs0[a].max) + ' כדי להמשיך.');
            try { gs0[a].head.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (x) {}
            return;
          }
        }
        return;
      }
      var row = t.closest('.product-popup .v-list-item');
      if (!row) return;
      var grp = row.closest('.mh-lim-grp'); if (!grp) return;
      var gs = sync(), g = null;
      for (var i = 0; i < gs.length; i++) if (gs[i].grp === grp) g = gs[i];
      if (!g || rowOn(row) || count(g) < g.max) return;
      if (g.max === 1) {
        // עד 1: מחליפים — מבטלים את הבחירה הקודמת (אם היא על המסך) ונותנים ללחיצה להמשיך
        var prev = null;
        for (var k = 0; k < g.rows.length; k++) if (g.rows[k] !== row && rowOn(g.rows[k])) prev = g.rows[k];
        var inp = prev && prev.querySelector('input');
        if (inp) { swapping = true; try { inp.click(); } finally { swapping = false; } stats.swapped++; schedule(); return; }
      }
      stop(e); stats.blocked++;
      note(g, g.max === 1 ? 'אפשר לבחור רק אחד. בטלו את הבחירה כדי להחליף.' : 'אפשר לבחור עד ' + g.max + '. כדי להחליף, בטלו קודם בחירה אחרת.');
    } catch (err) { /* נכשל-פתוח */ }
  }

  var pending = false;
  function schedule() {
    if (pending) return; pending = true;
    setTimeout(function () { pending = false; try { sync(); } catch (e) { /* נכשל-פתוח */ } }, 40);
  }
  try {
    window.addEventListener('click', onClick, true);
    document.addEventListener('change', schedule, true);
    new MutationObserver(schedule).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
    schedule();
  } catch (e) { console.warn('[MH OptLimit] disabled:', e); }
  window.MH_OPTLIMIT = { version: VERSION, sync: sync, stats: function () { return Object.assign({}, stats); } };
})();
/* mh-optlimit-v1 */

/* ============================================================
   סרגל הקטגוריות בדף העסק — MH CatNav  |  v1.0.0 | 2026-09-07
   ה-CSS (חלק 33 ב-global-cdn.css) מרחיב את הגלולות; Swiper מדד את רוחב הפריטים לפני שה-CSS מה-CDN
   נטען, ולכן בלי update() הפריטים האחרונים עלולים להיות לא נגישים בגלילה. הבלוק קורא
   swiper.update() כשהסרגל מופיע וכשהגופנים נטענים. נכשל-פתוח: בלי Swiper — לא עושים כלום.
   בדיקה: window.MH_CATNAV.stats()
   ============================================================ */
(function () {
  'use strict';
  if (window.__MH_CATNAV__) { return; }
  window.__MH_CATNAV__ = true;
  var VERSION = '1.0.0';
  var stats = { version: VERSION, updates: 0, seen: 0 };
  var last = null;
  function update() {
    var el = document.getElementById('ProductCategoriesSlider');
    if (!el) { last = null; return false; }
    if (el !== last) { stats.seen++; last = el; }
    var sw = el.swiper;
    if (sw && typeof sw.update === 'function') { try { sw.update(); stats.updates++; return true; } catch (e) { /* נכשל-פתוח */ } }
    return false;
  }
  var pending = false;
  function schedule() {
    if (pending) return; pending = true;
    setTimeout(function () { pending = false; try { update(); } catch (e) { /* נכשל-פתוח */ } }, 120);
  }
  try {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) { if (muts[i].addedNodes && muts[i].addedNodes.length) { schedule(); return; } }
    }).observe(document.documentElement, { subtree: true, childList: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
    window.addEventListener('load', schedule);
    window.addEventListener('resize', schedule);
    schedule();
  } catch (e) { console.warn('[MH CatNav] disabled:', e); }
  window.MH_CATNAV = { version: VERSION, update: update, stats: function () { return Object.assign({}, stats); } };
})();

/* ============================================================
   מפת הקטגוריות בדף העסק — MH CatMap  |  v1.1.2 | 2026-09-09
   הבעיה: בחנות עם הרבה קטגוריות (גואה 15, מחניודה 14) סרגל הגלולות האופקי
   ארוך פי 4.9 מרוחב המסך — כ-7 החלקות אצבע כדי להגיע לקטגוריה האחרונה.
   הפתרון: כפתור צמוד לקצה הסרגל שפותח רשימה אנכית של כל הקטגוריות.
   הניווט עצמו מואצל ללינק המקורי (a.scrollactive-item.click()) — אנחנו לא
   גוללים בעצמנו, כדי לא להתנגש ב-vue-scrollactive.
   למה אין "גרירה על הסרגל כדי לגלול": הרשימה עצמה נגללת (15 שורות > גובה המסך),
   ואותה תנועת אצבע לא יכולה גם לגלול את הרשימה וגם לגרור את הדף. לחיצה = קפיצה.
   מופיע רק מ-8 קטגוריות ומעלה; בחנויות קטנות (בנ'ס 6) שום דבר לא משתנה.
   נכשל-פתוח: כל שגיאה → הסרגל נשאר כפי שהוא.
   בדיקה: window.MH_CATMAP.stats() / .open() / .close()
   ============================================================ */
(function () {
  'use strict';
  if (window.__MH_CATMAP__) { return; }
  window.__MH_CATMAP__ = true;

  var VERSION = '1.1.2';
  var MIN_CATS = 8;                 /* מתחת לזה הסרגל האופקי נוח ממילא */
  var BTN_ID = 'mh-catmap-btn';
  var SHEET_ID = 'mh-catmap';
  var stats = { version: VERSION, built: 0, opens: 0, jumps: 0, fallbacks: 0, cats: 0 };

  function links() {
    return [].slice.call(document.querySelectorAll('#ProductCategoriesSlider a.scrollactive-item'));
  }
  /* vue-scrollactive לא מסמן שום קטגוריה כשהדף בראשו — במצב הזה הקטגוריה
     הנוכחית היא הראשונה, ולכן נופלים אליה במקום להשאיר את הרשימה בלי הדגשה. */
  function activeIndex(ls) {
    for (var i = 0; i < ls.length; i++) { if (ls[i].classList.contains('is-active')) { return i; } }
    return ls.length ? 0 : -1;
  }

  /* ---------- הגיליון ---------- */
  var sheet = null, rowsEl = null, rows = [];

  function buildSheet(ls) {
    var ov = document.createElement('div');
    ov.id = SHEET_ID;
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', 'מפת הקטגוריות');
    var html = '<div class="mh-cm-scrim"></div><div class="mh-cm-panel">' +
      '<div class="mh-cm-grip"></div>' +
      '<div class="mh-cm-head"><span class="mh-cm-title">לאן קופצים?</span>' +
      '<span class="mh-cm-count">' + ls.length + ' קטגוריות</span>' +
      '<button type="button" class="mh-cm-x" aria-label="סגירה">✕</button></div>' +
      '<div class="mh-cm-rows" role="list">';
    for (var i = 0; i < ls.length; i++) {
      html += '<button type="button" class="mh-cm-row" role="listitem" data-i="' + i + '">' +
        '<span class="mh-cm-n">' + (i + 1) + '</span>' +
        '<span class="mh-cm-t"></span></button>';
    }
    html += '</div></div>';
    ov.innerHTML = html;
    document.body.appendChild(ov);
    rowsEl = ov.querySelector('.mh-cm-rows');
    rows = [].slice.call(ov.querySelectorAll('.mh-cm-row'));
    for (var j = 0; j < rows.length; j++) { rows[j].querySelector('.mh-cm-t').textContent = ls[j].textContent.trim(); }

    ov.querySelector('.mh-cm-scrim').addEventListener('click', close);
    ov.querySelector('.mh-cm-x').addEventListener('click', close);

    /* לחיצה = קפיצה. הניווט עצמו של Hyperzod. */
    rowsEl.addEventListener('click', function (e) {
      var row = e.target.closest ? e.target.closest('.mh-cm-row') : null;
      if (!row) { return; }
      jump(parseInt(row.getAttribute('data-i'), 10));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet && sheet.classList.contains('on')) { close(); }
    });
    stats.built++;
    return ov;
  }

  /* מדגיש שורה אחת בלבד */
  function mark(idx) {
    for (var i = 0; i < rows.length; i++) {
      var on = (i === idx);
      if (rows[i].classList.contains('on') !== on) {
        rows[i].classList.toggle('on', on);
        /* הדגשה ויזואלית לבדה לא נקראת בקורא מסך (WebAIM) */
        if (on) { rows[i].setAttribute('aria-current', 'true'); } else { rows[i].removeAttribute('aria-current'); }
      }
    }
  }

  /* מכולת הגלילה של דף העסק היא .merchant-page (לא החלון) */
  function scroller() {
    var p = document.querySelector('.merchant-page');
    if (p && p.scrollHeight > p.clientHeight + 10) { return p; }
    return document.scrollingElement || document.documentElement;
  }
  /* גובה הכותרת הדביקה — כדי שהקטגוריה לא תיקבר מתחתיה */
  function stickyBottom() {
    var h = document.getElementById('mobileStickyHeader');
    var r = h && h.getBoundingClientRect ? h.getBoundingClientRect() : null;
    return r && r.bottom > 0 ? Math.round(r.bottom) : 110;
  }
  function jump(idx) {
    var ls = links();
    var a = ls[idx];
    if (!a) { return; }
    var href = a.getAttribute('href') || '';
    stats.jumps++;
    mark(idx);
    close();
    setTimeout(function () {
      var sc = scroller();
      var startY = sc.scrollTop;
      try { a.click(); } catch (e) {}
      /* גיבוי: לפעמים הניווט של vue-scrollactive לא מגיב בכלל (נצפה חי במחניודה)
         והלחיצה פשוט לא עושה כלום. חצי שנייה אחרי הלחיצה: אם הגלילה לא זזה
         *אפילו פיקסל אחד* — גוללים בעצמנו לעוגן. אם היא כן זזה, לא נוגעים,
         כדי לא להילחם באנימציה שכבר רצה. */
      setTimeout(function () {
        try {
          if (sc.scrollTop !== startY) { return; }
          if (!href || href.charAt(0) !== '#') { return; }
          var el = document.getElementById(href.slice(1));
          if (!el) { return; }
          var delta = el.getBoundingClientRect().top - stickyBottom();
          if (Math.abs(delta) < 40) { return; }
          stats.fallbacks++;
          /* קפיצה מיידית ולא חלקה: כשהניווט של Hyperzod נכשל הוא לפעמים משאיר
             לולאת אנימציה שמבטלת כל scrollTo חלק (נמדד חי — גלילה חלקה נשארה על 0,
             גלילה מיידית עבדה). חוץ מזה, אנימציה על 25,000px היא ממילא מעצבנת. */
          sc.scrollTop = sc.scrollTop + delta;
          /* אחרי קפיצה של עשרות אלפי פיקסלים תמונות עצלות נטענות ומזיזות את הפריסה,
             והיעד "בורח". תיקון אחד, פעם אחת — לא לולאה. */
          setTimeout(function () {
            try {
              var d2 = el.getBoundingClientRect().top - stickyBottom();
              if (Math.abs(d2) > 40) { sc.scrollTop = sc.scrollTop + d2; }
            } catch (e2) {}
          }, 260);
        } catch (e) {}
      }, 500);
    }, 210);
  }

  function open() {
    var ls = links();
    if (ls.length < MIN_CATS) { return; }
    if (!sheet || !document.body.contains(sheet)) { sheet = buildSheet(ls); }
    else if (rows.length !== ls.length) { sheet.remove(); sheet = buildSheet(ls); }
    for (var i = 0; i < rows.length; i++) { rows[i].querySelector('.mh-cm-t').textContent = ls[i].textContent.trim(); }
    mark(activeIndex(ls));
    stats.opens++;
    sheet.classList.add('on');
    document.documentElement.classList.add('mh-cm-lock');
    var b = document.getElementById(BTN_ID);
    if (b) { b.setAttribute('aria-expanded', 'true'); }
    var cur = sheet.querySelector('.mh-cm-row.on');
    if (cur && cur.scrollIntoView) { try { cur.scrollIntoView({ block: 'nearest' }); } catch (e) {} }
  }
  function close() {
    if (!sheet) { return; }
    sheet.classList.remove('on');
    document.documentElement.classList.remove('mh-cm-lock');
    var b = document.getElementById(BTN_ID);
    if (b) { b.setAttribute('aria-expanded', 'false'); }
  }

  /* ---------- הכפתור ---------- */
  function syncButton() {
    var nav = document.getElementById('ProductCategoriesNav');
    var ls = links();
    stats.cats = ls.length;
    var btn = document.getElementById(BTN_ID);
    if (!nav || ls.length < MIN_CATS) {
      if (btn) { btn.remove(); }
      if (nav) { nav.classList.remove('mh-cm-has'); }
      return false;
    }
    if (!btn) {
      btn = document.createElement('button');
      btn.id = BTN_ID;
      btn.type = 'button';
      btn.setAttribute('aria-label', 'כל הקטגוריות');
      btn.setAttribute('aria-haspopup', 'dialog');
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = '<span class="mh-cm-bars"><i></i><i></i><i></i></span><span class="mh-cm-num"></span>';
      btn.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); open(); });
      nav.appendChild(btn);
    }
    var num = btn.querySelector('.mh-cm-num');
    if (num && num.textContent !== String(ls.length)) { num.textContent = String(ls.length); }
    nav.classList.add('mh-cm-has');
    return true;
  }

  var pending = false;
  function schedule() {
    if (pending) { return; }
    pending = true;
    setTimeout(function () {
      pending = false;
      try {
        var had = !!document.getElementById(BTN_ID);
        syncButton();
        /* ה-CSS מוסיף ריפוד לפריט האחרון — Swiper צריך למדוד מחדש */
        if (!had && document.getElementById(BTN_ID) && window.MH_CATNAV) { window.MH_CATNAV.update(); }
      } catch (e) {}
    }, 140);
  }

  try {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        if (muts[i].addedNodes && muts[i].addedNodes.length) { schedule(); return; }
        if (muts[i].removedNodes && muts[i].removedNodes.length) { schedule(); return; }
      }
    }).observe(document.documentElement, { subtree: true, childList: true });
    window.addEventListener('load', schedule);
    window.addEventListener('resize', schedule);
    schedule();
  } catch (e) { console.warn('[MH CatMap] disabled:', e); }

  window.MH_CATMAP = {
    version: VERSION, open: open, close: close, sync: syncButton,
    stats: function () { return Object.assign({}, stats); }
  };
  /* mh-catmap-v1 */
})();

/* ============================================================
   טעינת כל קטגוריות התפריט בדף העסק — MH MenuLoad  |  v1.0.0 | 2026-09-10
   הבעיה (נמדדה בגואה, 28 קטגוריות): Hyperzod מביאה את התפריט בדפים של 15
   קטגוריות (max_categories_per_page) ומבקשת את הדף הבא רק כשאלמנט-זקיף
   בתחתית הדף נכנס למסך. בכרום ללא ראש קפיצה לתחתית לא מפעילה אותו בכלל,
   ודוד מדווח שבטלפונים מסוימים גם גלילה לסוף לא מביאה את דף 2 —
   הלקוח רואה 15 קטגוריות ולא יודע שיש 28.
   הפתרון: אחרי שדף 1 נטען, קוראים בעצמנו ל-loadMore() של רכיב דף העסק
   (אותה פונקציה שהזקיף מפעיל) עד שדף מחזיר פחות מ-15 קטגוריות.
   - לא נוגעים ב-DOM ולא ב-API: הרכיב של Hyperzod עושה את העבודה, ומסנן
     כפילויות לפי _id (updateCategoryProducts).
   - חנות שדף 1 שלה החזיר פחות מ-15 קטגוריות (בנ'ס 6, מחניודה 14) — אין דף 2,
     לא נשלחת אף קריאה.
   - loadMoreInFlight של הרכיב מונע התנגשות עם הזקיף של Hyperzod אם הוא כן עובד.
   - נכשל-פתוח: אם המבנה של Vue ישתנה ולא נמצא הרכיב — לא עושים כלום.
   בדיקה: window.MH_MENULOAD.stats()
   ============================================================ */
(function () {
  'use strict';
  if (window.__MH_MENULOAD__) { return; }
  window.__MH_MENULOAD__ = true;

  var VERSION = '1.0.0';
  var PAGE_SIZE = 15;   /* max_categories_per_page של Hyperzod, נמדד 10.9.2026 */
  var MAX_PAGES = 10;   /* תקרה בטיחותית: עד 150 קטגוריות */
  var stats = { version: VERSION, runs: 0, calls: 0, added: 0, skipped: 0, lastMerchant: null };
  var busy = false;

  /* רכיב דף העסק של Hyperzod: היחיד שיש לו loadMore + page + merchantId.
     ב-production אין __vueParentComponent, לכן הולכים מ-#app._vnode. */
  function findComp() {
    var el = document.getElementById('app');
    if (!el || !el._vnode) { return null; }
    var found = null;
    function walkInst(inst, d) {
      if (!inst || found || d > 60) { return; }
      var p = inst.proxy;
      try {
        if (p && typeof p.loadMore === 'function' && ('page' in p) && ('merchantId' in p)) { found = p; return; }
      } catch (e) {}
      walkV(inst.subTree, d + 1);
    }
    function walkV(v, d) {
      if (!v || found || d > 200) { return; }
      if (v.component) { walkInst(v.component, d + 1); }
      if (v.suspense && v.suspense.activeBranch) { walkV(v.suspense.activeBranch, d + 1); }
      if (Array.isArray(v.children)) { for (var i = 0; i < v.children.length && !found; i++) { walkV(v.children[i], d + 1); } }
    }
    walkV(el._vnode, 0);
    return found;
  }

  function catCount() {
    try {
      var st = document.getElementById('app').__vue_app__.config.globalProperties.$store;
      var a = st.state.Merchant.categoryProducts;
      if (Array.isArray(a)) { return a.length; }
    } catch (e) {}
    return document.querySelectorAll('#ProductCategoriesSlider a.scrollactive-item').length;
  }

  function finish() { busy = false; }

  function step(p, mid, i) {
    if (i >= MAX_PAGES || p.merchantId !== mid) { finish(); return; }
    if (p.loadMoreInFlight) { setTimeout(function () { step(p, mid, i); }, 400); return; }
    var before = catCount();
    var r;
    try { r = p.loadMore(); } catch (e) { finish(); return; }
    stats.calls++;
    Promise.resolve(r).then(function () {
      setTimeout(function () {
        var after = catCount();
        var got = Math.max(0, after - before);
        stats.added += got;
        /* דף מלא (15) → אולי יש עוד; פחות מזה → זה היה הדף האחרון */
        if (got >= PAGE_SIZE) { step(p, mid, i + 1); } else { finish(); }
      }, 250);
    }).catch(function () { finish(); });
  }

  /* מתי לרוץ: כל הדפים שנטענו עד עכשיו היו מלאים (count === page × 15) — כלומר ייתכן
     דף נוסף. אחרי דף חלקי המשוואה נשברת ולא רצים שוב. כשהלקוח חוזר לחנות (SPA)
     Hyperzod מאפסת page=1 וטוענת מחדש — והמשוואה שוב מתקיימת, ולכן רצים מחדש.
     חנות שדף 1 שלה קטן מ-15 (בנ'ס, מחניודה) לעולם לא מקיימת אותה — אפס קריאות. */
  function run() {
    if (busy) { return; }
    var p = findComp();
    if (!p) { return; }
    var mid = p.merchantId;
    if (!mid) { return; }
    if (p.loading || p.loadMoreInFlight) { return; }      /* דף בדרך — ננסה שוב במוטציה הבאה */
    var page = p.page;
    if (!(page >= 1)) { return; }
    var n = catCount();
    if (n === 0) { return; }                                  /* עוד לא רונדר */
    stats.lastMerchant = mid;
    if (n !== page * PAGE_SIZE) { if (page === 1) { stats.skipped++; } return; }
    busy = true;
    stats.runs++;
    step(p, mid, 0);
  }

  var pending = false;
  function schedule() {
    if (pending) { return; }
    pending = true;
    setTimeout(function () { pending = false; try { run(); } catch (e) { busy = false; } }, 200);
  }

  try {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        if (muts[i].addedNodes && muts[i].addedNodes.length) { schedule(); return; }
      }
    }).observe(document.documentElement, { subtree: true, childList: true });
    window.addEventListener('load', schedule);
    schedule();
  } catch (e) { console.warn('[MH MenuLoad] disabled:', e); }

  window.MH_MENULOAD = { version: VERSION, run: run, findComp: findComp, stats: function () { return JSON.parse(JSON.stringify(stats)); } };
  /* mh-menuload-v1 */
})();

/* ============================================================
   "הצג עוד" בקטגוריה חתוכה בדף העסק — MH ShowMore  |  v1.0.1 | 2026-09-10
   הבעיה (סקר 11 חנויות, 10.9): Hyperzod מביאה עד 20 מוצרים לקטגוריה ומסמנת
   is_paginated, אבל החנות לא קוראת את הדגל ואין שום דרך לראות את השאר —
   14 קטגוריות ב-4 חנויות, 230 מוצרים מוסתרים (בגואה "סיגריות" 20 מתוך 65).
   הפתרון: כפתור "הצג עוד" בתחתית כל קטגוריה מסומנת. לחיצה מביאה את הדף הבא
   מ-Search.getProductsByCategory ודוחפת את המוצרים ל-category_products של
   הקטגוריה ב-store — Vue מצייר אותם באותו רכיב כרטיס, ולכן הם זהים לחלוטין
   ל-20 הראשונים (אומת: אותן מחלקות, רוחב, רדיוס, גופנים). כשאין דף הבא —
   הכפתור נעלם. קרוסלה (view_type=card) היא גלילה טבעית (.slider-inner-container,
   לא Swiper) — הסליידים החדשים נגישים מיד; אם יימצא Swiper, קוראים update().
   נכשל-פתוח: בלי הרכיב/ה-store — אין כפתורים, הדף כפי שהיה.
   בדיקה: window.MH_SHOWMORE.stats()
   ============================================================ */
(function () {
  'use strict';
  if (window.__MH_SHOWMORE__) { return; }
  window.__MH_SHOWMORE__ = true;

  var VERSION = '1.0.1';
  var PAGE = 20;
  var CLS = 'mh-more';
  var stats = { version: VERSION, buttons: 0, clicks: 0, loaded: 0, finished: 0, errors: 0 };
  var pages = {};      /* catId → הדף האחרון שנטען */
  var inflight = {};
  var done = {};       /* catId → אין עוד דפים; לא בונים כפתור מחדש */

  function app() { var el = document.getElementById('app'); return el && el.__vue_app__ ? el : null; }
  function store() { try { return app().__vue_app__.config.globalProperties.$store; } catch (e) { return null; } }
  function cats() { try { var a = store().state.Merchant.categoryProducts; return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function comp() {
    var el = app(); if (!el || !el._vnode) { return null; }
    var found = null;
    function walkInst(inst, d) { if (!inst || found || d > 60) { return; } var p = inst.proxy;
      try { if (p && typeof p.apiRequest === 'function' && ('merchantId' in p)) { found = p; return; } } catch (e) {}
      walkV(inst.subTree, d + 1); }
    function walkV(v, d) { if (!v || found || d > 200) { return; } if (v.component) { walkInst(v.component, d + 1); }
      if (v.suspense && v.suspense.activeBranch) { walkV(v.suspense.activeBranch, d + 1); }
      if (Array.isArray(v.children)) { for (var i = 0; i < v.children.length && !found; i++) { walkV(v.children[i], d + 1); } } }
    walkV(el._vnode, 0); return found;
  }
  /* is_paginated הוא דגל מדויק של Hyperzod: בסקר 11 החנויות הוא true בדיוק ב-14 הקטגוריות
     שיש בהן יותר מ-20, ו-false בקטגוריות של בדיוק 20 (נוזלים לאידוי, פיצוחים). */
  function needsMore(cat) { return !!cat.is_paginated; }
  function label(cat) {
    var n = (cat.category_products || []).length;
    return '<span class="' + CLS + '-t">הצג עוד מוצרים</span><span class="' + CLS + '-n">מציג ' + n + '</span>';
  }

  function loadNext(cat, btn) {
    var id = cat._id;
    if (inflight[id]) { return; }
    var p = comp(); if (!p) { return; }
    inflight[id] = true; stats.clicks++;
    btn.classList.add('is-loading'); btn.disabled = true;
    var next = (pages[id] || 1) + 1;
    var req;
    try { req = p.apiRequest('Search', 'getProductsByCategory', { product_category_id: id, merchant_id: p.merchantId, locale: (p.getActiveLocale ? p.getActiveLocale().locale : 'he'), page: next }); }
    catch (e) { req = Promise.reject(e); }
    Promise.resolve(req).then(function (r) {
      var pr = r && r.data && r.data.data && r.data.data.products;
      var list = pr && Array.isArray(pr.data) ? pr.data : [];
      pages[id] = next;
      /* דחיפה ל-store: אותו אובייקט ריאקטיבי שממנו Vue מצייר את הכרטיסים */
      var live = cats().filter(function (c) { return c._id === id; })[0] || cat;
      var have = {}; (live.category_products || []).forEach(function (x) { if (x && x._id) { have[x._id] = 1; } });
      var added = 0;
      list.forEach(function (x) {
        if (!x || (x._id && have[x._id])) { return; }
        if (!('product_options' in x)) { x.product_options = []; }   /* שדה שקיים בתפריט ולא ב-API; הכרטיס משתמש ב-has_product_options */
        live.category_products.push(x); added++;
      });
      stats.loaded += added;
      var more = !!(pr && pr.next_page_url) && list.length > 0;
      setTimeout(function () {
        try { var sec = document.getElementById('cat_' + id); var sw = sec && sec.querySelector('.swiper'); if (sw && sw.swiper && sw.swiper.update) { sw.swiper.update(); } } catch (e) {}
        try { if (typeof p.scrollSpy === 'function') { p.scrollSpy(); } } catch (e) {}
        btn.classList.remove('is-loading'); btn.disabled = false;
        if (more) { btn.innerHTML = label(live); }
        else { stats.finished++; done[id] = true; btn.classList.add('is-done'); btn.innerHTML = '<span class="' + CLS + '-t">זה הכל · ' + (live.category_products || []).length + ' מוצרים</span>'; btn.disabled = true; setTimeout(function () { if (btn.parentNode) { btn.parentNode.removeChild(btn); } }, 1800); }
        inflight[id] = false;
      }, 120);
    }).catch(function (e) {
      stats.errors++; inflight[id] = false;
      btn.classList.remove('is-loading'); btn.disabled = false;
      try { console.warn('[MH ShowMore]', e); } catch (e2) {}
    });
  }

  function sync() {
    var list = cats(); if (!list.length) { return; }
    var host = document.getElementById('merchant-content'); if (!host) { return; }
    list.forEach(function (cat) {
      var id = cat._id; if (!id) { return; }
      var sec = document.getElementById('cat_' + id); if (!sec) { return; }
      var inner = sec.querySelector('.special-listing-inner') || sec;
      var btn = inner.querySelector('button.' + CLS);
      if (done[id] || !needsMore(cat)) { return; }
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button'; btn.className = CLS;
        btn.setAttribute('aria-label', 'הצג עוד מוצרים בקטגוריה ' + (cat.name || ''));
        btn.innerHTML = label(cat);
        btn.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); loadNext(cat, btn); });
        inner.appendChild(btn); stats.buttons++;
        sec.classList.add('mh-has-more');   /* ה-CSS מסתיר את "צפה בהכל" של Hyperzod — הוא מוביל לדף שמציג 20 בלבד */
      }
    });
  }

  var pending = false;
  function schedule() { if (pending) { return; } pending = true; setTimeout(function () { pending = false; try { sync(); } catch (e) {} }, 220); }
  try {
    new MutationObserver(function (muts) { for (var i = 0; i < muts.length; i++) { if (muts[i].addedNodes && muts[i].addedNodes.length) { schedule(); return; } } })
      .observe(document.documentElement, { subtree: true, childList: true });
    window.addEventListener('load', schedule); schedule();
  } catch (e) { console.warn('[MH ShowMore] disabled:', e); }

  window.MH_SHOWMORE = { version: VERSION, sync: sync, stats: function () { return JSON.parse(JSON.stringify(stats)); } };
  /* mh-showmore-v1 */
})();

/* ============================================================
   מחרוזות שאין להן תרגום בחבילת השפה — MH Lang  |  v1.5.0 | 2026-10-06 (v1.4.0: 29.9, v1.3.0: 23.9, v1.2.0: 22.9, v1.1.0: 10.9)
   Hyperzod מציירת טקסטים עם ברירת מחדל באנגלית כשמפתח חסר בחבילה:
   getLug().common.customizable || "Customizable". המפתח common.customizable לא קיים
   בחבילה של האתר (88 מפתחות ב-common, נבדק 10.9), ולכן התג בכרטיס המוצר באנגלית.
   הבלוק מחליף טקסט בלבד, רק באלמנטים ברשימה, רק כשהטקסט שווה בדיוק למחרוזת האנגלית.
   v1.4.0: שדה "Save as" (סוג כתובת "אחרים") — label קשיח באנגלית ב-chunk confirm_location. ההחלפה נוגעת
     רק בצומת הטקסט: בתוך ה-label של Vuetify יש הערת-עוגן של Vue (<!---->), ו-textContent= היה מוחק אותה.
   נכשל-פתוח. בדיקה: window.MH_LANG.stats()
   ============================================================ */
(function () {
  'use strict';
  if (window.__MH_LANG__) { return; }
  window.__MH_LANG__ = true;
  var VERSION = '1.5.0';
  /* סלקטור → { אנגלית: עברית } */
  var MAP = [
    { sel: '.product-customizable-tag', text: { 'Customizable': 'ניתן להתאמה' } },
    /* מסך הוספת כתובת (22.9): כותרת רשימת התוצאות ותווית סוג הכתובת */
    { sel: '.scheme-location-results-heading', text: { 'Search Results': 'תוצאות חיפוש' } },
    /* (6.10) מסך "אישור מקום" אחרי בחירת תוצאה במודאל המיקום: כפתור החזרה לחיפוש (מחרוזת קשיחה באנגלית) */
    { sel: '#SearchLocationBackBtn + span', text: { 'Search Location': 'חזרה לחיפוש' } },
    { sel: '#AddressSelectType label', text: { 'Save address as': 'לשמור את הכתובת בתור', 'SAVE ADDRESS AS': 'לשמור את הכתובת בתור' } },
    /* (29.9) השדה שנפתח ב"אחרים": שתי התוויות של Vuetify — במנוחה (#OtherType-label) והצפה (בתוך .v-field__outline) */
    /* \n = שבירת שורה בתווית במנוחה (white-space: pre-line בחלק 44); בתווית הצפה היא נהיית רווח */
    { sel: '[data-ref="OtherType"] .v-field-label', text: { 'Save as': 'אחר - מה הכתובת הזאת בשבילך?\n(לדוגמא - הבית של משה)' } },
    /* מסך "ניהול כתובות" (23.9): תג הכתובת הפעילה, טעינה, וחלונית "אפשרויות כתובת" (מחרוזות קשיחות באנגלית בקוד של Hyperzod) */
    { sel: '#addresses .scheme-status-badge', text: { 'Active': 'פעילה' } },
    { sel: '#addresses p.tw-mt-4', text: { 'Loading Addresses...': 'טוען כתובות...' } },
    { sel: '.v-bottom-sheet__content .v-card-title span.tw-text-base', text: { 'Address options': 'אפשרויות כתובת' } },
    { sel: '.v-bottom-sheet__content .tw-h-\\[44px\\].tw-cursor-pointer span.tw-font-medium', text: { 'Edit': 'עריכה', 'Delete': 'מחיקה' } }
  ];
  /* החלפת תחילית בתוך טקסט קיים (לא שוויון מלא), לאלמנטים שהטקסט שלהם מורכב מתווית + ערך */
  var PREFIX = [
    { sel: '#SelectAddress .v-card-text > div[data-test-id^="test-id-"] div', from: 'Phone:', to: 'טלפון:' },
    { sel: '.scheme-location-master .search-results p', from: 'No results found for', to: 'לא נמצאו תוצאות עבור' },
    { sel: '#addresses div.tw-font-inter.tw-text-xs', from: 'Phone:', to: 'טלפון:' }
  ];
  var stats = { version: VERSION, replaced: 0, scans: 0 };
  /* מחליף את צומת הטקסט היחיד (ולא את כל התוכן) — הערות-עוגן של Vue בתוך האלמנט נשארות במקומן */
  function setText(el, he) {
    var t = null, n = 0;
    for (var c = el.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 3 && c.nodeValue.trim()) { t = c; n++; }
      else if (c.nodeType === 1) { n = 2; break; }
    }
    if (n === 1) { t.nodeValue = he; } else { el.textContent = he; }
  }
  function sync() {
    stats.scans++;
    for (var i = 0; i < MAP.length; i++) {
      var els = document.querySelectorAll(MAP[i].sel);
      for (var j = 0; j < els.length; j++) {
        var t = (els[j].textContent || '').trim();
        var he = MAP[i].text[t];
        if (he && els[j].textContent !== he) { setText(els[j], he); stats.replaced++; }
      }
    }
    for (var k = 0; k < PREFIX.length; k++) {
      var ps = document.querySelectorAll(PREFIX[k].sel);
      for (var n = 0; n < ps.length; n++) {
        var el = ps[n];
        if (el.children.length) { continue; }                  /* רק אלמנט עלה, לא מכל */
        var txt = el.textContent || '';
        if (txt.indexOf(PREFIX[k].from) === -1) { continue; }
        el.textContent = txt.replace(PREFIX[k].from, PREFIX[k].to);
        stats.replaced++;
      }
    }
  }
  var pending = false;
  function schedule() { if (pending) { return; } pending = true; setTimeout(function () { pending = false; try { sync(); } catch (e) {} }, 150); }
  try {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) { if (muts[i].addedNodes && muts[i].addedNodes.length) { schedule(); return; } }
    }).observe(document.documentElement, { subtree: true, childList: true });
    window.addEventListener('load', schedule); schedule();
  } catch (e) { console.warn('[MH Lang] disabled:', e); }
  window.MH_LANG = { version: VERSION, sync: sync, stats: function () { return JSON.parse(JSON.stringify(stats)); } };
  /* mh-lang-v1 */
})();

/* ============================================================
   הדגשת שדה "הזנת כתובת ידנית" בצ'ק-אאוט של קפית — MH KafitAddr  |  v1.0.0 | 2026-09-10
   הבעיה: לקפית אין כרטיס כתובת (שני סוגי המשלוח שלה מוגדרים אצל Hyperzod
   כ-requires_address:false), ולכן הכתובת נכתבת בשדה טקסט חופשי שלקוחות מפספסים.
   הבלוק מאתר את הכרטיס לפי **הטקסט** ("הזנת כתובת ידנית") ולא לפי מחלקה של Hyperzod,
   כי השדה מוגדר בצד המסעדן ואין לו id יציב. מוסיף מחלקות בלבד — ה-CSS בחלק 42.
   סקופ כפול ונעול:
     1. רק בדף הצ'ק-אאוט (#checkout קיים)
     2. רק כשעסק העגלה הוא קפית (MERCHANT), לפי getCartMerchant
   לא נוגע בהתנהגות: לא חוסם הזמנה, לא משנה ערכים, לא מוסיף required. עיצוב בלבד.
   נכשל-פתוח: לא נמצא כרטיס → לא קורה כלום.
   בדיקה: window.MH_KAFITADDR.stats()
   ============================================================ */
(function () {
  'use strict';
  if (window.__MH_KAFITADDR__) { return; }
  window.__MH_KAFITADDR__ = true;

  var VERSION = '1.0.0';
  var MERCHANT = '6a95042205b27b504d058bc5';        /* קפית אגם אדומים */
  var NEEDLE = 'הזנת כתובת ידנית';                   /* התחלה של הכותרת; סובלני לניקוד/סימני פיסוק */
  var CARD = 'mh-kafit-addr';
  var stats = { version: VERSION, tagged: 0, filled: 0, scans: 0, merchant: null };

  function onCheckout() { return !!document.getElementById('checkout'); }
  function isKafit() {
    try {
      var st = document.getElementById('app').__vue_app__.config.globalProperties.$store;
      var m = st.getters.getCartMerchant;
      var id = m && (m.merchant_id || m._id || m.id);
      stats.merchant = id || null;
      return id === MERCHANT;
    } catch (e) { return false; }
  }

  /* הכרטיס = האב הראשון של הכותרת שמכיל גם שדה קלט */
  function cardOf(el) {
    var n = el;
    for (var i = 0; i < 8 && n && n !== document.body; i++) {
      if (n.querySelector && n.querySelector('input, textarea')) { return n; }
      n = n.parentElement;
    }
    return null;
  }

  function sync() {
    stats.scans++;
    if (!onCheckout() || !isKafit()) {
      var old = document.querySelector('.' + CARD);
      if (old) { old.classList.remove(CARD, CARD + '-filled'); }
      return;
    }
    var co = document.getElementById('checkout');
    var heads = co.querySelectorAll('h1, h2, h3, h4, h5, p, span, div, label');
    var head = null;
    for (var i = 0; i < heads.length; i++) {
      var e = heads[i];
      if (e.children.length) { continue; }                       /* אלמנט עלה בלבד */
      if ((e.textContent || '').indexOf(NEEDLE) === -1) { continue; }
      head = e; break;
    }
    if (!head) { return; }
    var card = cardOf(head);
    if (!card) { return; }
    if (!card.classList.contains(CARD)) { card.classList.add(CARD); stats.tagged++; }
    /* מצב "מולא" — כדי שההדגשה תירגע אחרי שהלקוח כתב */
    var input = card.querySelector('input, textarea');
    var filled = !!(input && String(input.value || '').trim().length > 1);
    if (card.classList.contains(CARD + '-filled') !== filled) {
      card.classList.toggle(CARD + '-filled', filled);
      if (filled) { stats.filled++; }
    }
    if (input && !input.__mhKafitBound) {
      input.__mhKafitBound = true;
      input.addEventListener('input', schedule);
      input.addEventListener('blur', schedule);
    }
  }

  var pending = false;
  function schedule() { if (pending) { return; } pending = true; setTimeout(function () { pending = false; try { sync(); } catch (e) {} }, 180); }
  try {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) { if (muts[i].addedNodes && muts[i].addedNodes.length) { schedule(); return; } }
    }).observe(document.documentElement, { subtree: true, childList: true });
    window.addEventListener('load', schedule); schedule();
  } catch (e) { console.warn('[MH KafitAddr] disabled:', e); }

  window.MH_KAFITADDR = { version: VERSION, sync: sync, merchant: MERCHANT, stats: function () { return JSON.parse(JSON.stringify(stats)); } };
  /* mh-kafitaddr-v1 */
})();

/* =========================================================
   MH FullName v1.0.0 | 2026-09-10 — חובה שם פרטי + שם משפחה בהרשמה
   למה: Grow דוחה שם של מילה אחת ביצירת קישור תשלום ("שדה לא תקין: pageFieldSettings[fullName]") —
   לקוחות שנרשמו עם שם פרטי בלבד לא הצליחו לשלם באשראי (כ-40 ניסיונות של 7 לקוחות, 8–10.9.2026).
   שרת הסליקה (render-starter/grow.js) כבר מוסיף אות לשם של מילה אחת, וכאן סוגרים את המקור:
   בטופס ההרשמה של Hyperzod יש שדה שם אחד בלבד (#firstName; last_name נשלח null, אין שדה משפחה).
   דורשים לפחות שתי מילים של 2+ אותיות: רמז קבוע מתחת לשדה, ובלחיצה על "הרשמה"/Enter עם פחות
   מזה — חסימה (capture, לפני ה-handler של Vue) + הודעה אדומה + פוקוס לשדה. ההודעה נעלמת כשהשם תקין.
   נכשל-פתוח: אין #firstName → כלום. סקופ: הטופס שמכיל את #firstName בלבד. CSS: חלק 43 ב-global-cdn.css.
   ========================================================= */
(function () {
  'use strict';
  if (window.__MH_FULLNAME__) { return; }
  window.__MH_FULLNAME__ = true;
  var VERSION = '1.0.0', MIN_WORDS = 2, MIN_LEN = 2;
  var HINT = 'שם פרטי ושם משפחה (למשל: לינוי ארונציק)';
  var ERR = 'חובה שם פרטי וגם שם משפחה — בלי שם משפחה התשלום באשראי לא עובר';
  var stats = { hints: 0, blocked: 0, passed: 0 };

  function words(v) {
    return String(v || '').trim().split(/\s+/).filter(function (w) { return w.replace(/[^\p{L}]/gu, '').length >= MIN_LEN; }).length;
  }
  function ok(input) { return words(input.value) >= MIN_WORDS; }
  function wrap(input) { return input.closest('.v-input') || input.parentElement; }
  function hintOf(w) { var n = w && w.nextElementSibling; return n && n.classList && n.classList.contains('mh-fullname-hint') ? n : null; }
  function setState(input, error) {
    var w = wrap(input), h = hintOf(w);
    if (!w || !h) { return; }
    w.classList.toggle('mh-fullname-error', !!error);
    h.textContent = error ? ERR : HINT;
  }
  function block(e, input) {
    e.preventDefault(); e.stopImmediatePropagation();
    stats.blocked++; setState(input, true);
    try { input.focus(); } catch (x) {}
  }
  function attach(input) {
    if (input.__mhFullName) { return; }
    input.__mhFullName = true;
    var w = wrap(input); if (!w) { return; }
    var h = document.createElement('div'); h.className = 'mh-fullname-hint'; h.textContent = HINT;
    w.insertAdjacentElement('afterend', h); stats.hints++;
    try { input.setAttribute('autocomplete', 'name'); input.setAttribute('placeholder', 'שם פרטי ושם משפחה'); } catch (e) {}
    input.addEventListener('input', function () { if (ok(input)) { setState(input, false); } });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !ok(input)) { block(e, input); } }, true);
    var form = input.closest('form'); if (!form) { return; }
    form.addEventListener('submit', function (e) { if (!ok(input)) { block(e, input); } else { stats.passed++; } }, true);
    form.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('button[type="submit"], .login-btn') : null;
      if (btn && !ok(input)) { block(e, input); }
    }, true);
  }
  function scan() { var input = document.getElementById('firstName'); if (input && input.tagName === 'INPUT') { attach(input); } }
  var pending = false;
  function schedule() { if (pending) { return; } pending = true; setTimeout(function () { pending = false; try { scan(); } catch (e) {} }, 150); }
  try {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) { if (muts[i].addedNodes && muts[i].addedNodes.length) { schedule(); return; } }
    }).observe(document.documentElement, { subtree: true, childList: true });
    window.addEventListener('load', schedule); schedule();
  } catch (e) { console.warn('[MH FullName] disabled:', e); }

  window.MH_FULLNAME = { version: VERSION, words: words, stats: function () { return JSON.parse(JSON.stringify(stats)); } };
  /* mh-fullname-v1 */
})();

/* ============================================================
   רחובות של מעלה אדומים שגוגל לא מכיר — MH Streets  |  v1.0.2 | 2026-09-22 (v1.0.2: ניסוחים לבקשת דוד — placeholder 'כתובת בגוש אדומים', תג 'רחוב חדש · אשרו את המיקום במפה')
   הבעיה (לקוח אמיתי, 22.9): "הפסנתר" ו"הר הלבונה" לא נמצאו בחיפוש הכתובת. חיפוש
   הכתובות של Hyperzod עובר דרך Google Places (השרת שלהם, /store/v1/places/search),
   ול-Google פשוט אין את הרחובות החדשים של מעלה אדומים (נבדק גם Mapbox ו-OSM: אין).
   ביקורת של 167 הרחובות הרשמיים (מאגר הרחובות הממשלתי): ~20 רחובות לא נמצאים ב-Google.
   הפתרון: טבלה מקומית של רחובות העיר עם נקודת אמצע הרחוב מהמפה הממשלתית (GovMap,
   מפ"י). כשלקוח מקליד רחוב מהטבלה ו-Google לא מחזירה שורת רחוב מתאימה — מוסיפים
   תוצאה משלנו בראש הרשימה. הבחירה עוברת בנתיב ה-Mapbox הקיים של Hyperzod (אובייקט
   mapbox_data עם center) — בלי קריאת רשת, בלי שינוי בקוד שלהם — והלקוח מדייק את
   הסיכה במפה (המסך ממילא מבקש "הזז את הסיכה למיקום המסירה המדויק").
   שני נתיבים ברכיב (location-master): (1) גוגל הצליחה → הרשימה מגיעה מ-Vuex (getSearchedLocations);
   (2) גוגל החזירה "No results"/נכשלה/עברה 2 שניות → הרכיב נופל בשקט ל-Mapbox ומציב את התשובה
   ישירות (this.locations), בלי Vuex. לכן: בנתיב 1 מוסיפים ל-store (ומחזירים הצלחה כשיש לנו
   התאמה, כדי שהרכיב לא יברח ל-Mapbox); בנתיב 2 עוטפים את fetch של Mapbox ומקדימים את
   הרחובות שלנו כ-features (נמדד חי 22.9: "הר הלבונה" → גוגל "No results" → Mapbox החזירה
   "הלבונה, בנימינה" ודרסה את ההזרקה — v1.0.1).
   סקופ: פעולת ה-Vuex "searchLocation" + בקשות fetch ל-api.mapbox.com/geocoding בלבד.
   לא נוגע בשמירה, בתשלום או באזורי המשלוח.
   נכשל-פתוח: אין store → כלום; שגיאה → התוצאות של Google כרגיל.
   רענון הטבלה: node tools/streets-govmap.mjs (ראו DESIGN_METHOD).
   בדיקה: window.MH_STREETS.stats() / window.MH_STREETS.find('הפסנתר 8')
   ============================================================ */
(function () {
  'use strict';
  if (window.__MH_STREETS__) { return; }
  window.__MH_STREETS__ = true;
  var VERSION = '1.0.2', CITY = 'מעלה אדומים', MAX = 3;
  /* [שם רחוב לתצוגה, lat, lng] — מקור: GovMap 22.9.2026 (146 רחובות; 4 שאין להם מיקום בשום מפה: הזוגן, החורן, החלמונית, השרון) */
  var STREETS = [
  ["אבני החושן",31.775122,35.301897],
  ["אגן הסהר",31.769039,35.291484],
  ["אוגדה",31.793437,35.328289],
  ["אופירה",31.79589,35.337204],
  ["איבי הנחל",31.774834,35.291149],
  ["בית בלתין",31.769042,35.299457],
  ["בת נדיב",31.773235,35.291128],
  ["גבעת המיסדים",31.801259,35.329444],
  ["דקלה",31.786025,35.332016],
  ["הגיא",31.77817,35.301473],
  ["הר הצופים",31.774435,35.293464],
  ["ימית",31.797129,35.336268],
  ["מדבר יהודה",31.774428,35.295765],
  ["מצפה נבו",31.794209,35.302088],
  ["קדם",31.775905,35.304293],
  ["האבן",31.779344,35.312294],
  ["האורן",31.766675,35.300192],
  ["האזוב",31.768908,35.306884],
  ["האלה",31.765987,35.300497],
  ["האלמוג",31.790038,35.3095],
  ["הארד",31.786332,35.309126],
  ["האשל",31.767128,35.296287],
  ["הבזלת",31.781034,35.315499],
  ["הגביש",31.781304,35.311528],
  ["הגומא",31.769573,35.304062],
  ["הגזית",31.780252,35.313313],
  ["הגילגל",31.796219,35.30375],
  ["הגיר",31.779829,35.30928],
  ["הגעש",31.782487,35.311735],
  ["הגרניט",31.779468,35.310218],
  ["הגתית",31.783333,35.299727],
  ["הדקל",31.764724,35.2999],
  ["הזיתים",31.770178,35.300137],
  ["החומה",31.787716,35.310006],
  ["החליל",31.780315,35.295168],
  ["החלמיש",31.781328,35.309937],
  ["החצוצרה",31.785296,35.299101],
  ["החרסית",31.776608,35.312904],
  ["הכורכר",31.78963,35.309306],
  ["הכינור",31.782479,35.29707],
  ["הכרכום",31.770543,35.307233],
  ["המצדים",31.780756,35.302808],
  ["המצוק",31.778599,35.306374],
  ["המצילתים",31.786472,35.298003],
  ["המרווה",31.767528,35.298846],
  ["הנבל",31.783901,35.299328],
  ["הנחושת",31.79196,35.310367],
  ["הנחלים",31.777646,35.297999],
  ["הנטיף",31.788267,35.309782],
  ["הניקרה",31.77785,35.310543],
  ["העוגב",31.781551,35.298961],
  ["העירית",31.769192,35.307504],
  ["הענבל",31.785895,35.29965],
  ["הענבר",31.778182,35.315532],
  ["הערבה",31.768046,35.304831],
  ["העשור",31.781197,35.297101],
  ["הפסנתר",31.781583,35.30037],
  ["הפעמון",31.784854,35.299495],
  ["הפרג",31.76957,35.308013],
  ["הצוק",31.789356,35.312344],
  ["הצור",31.782152,35.313962],
  ["הצורן",31.777805,35.3123],
  ["הציפחה",31.777891,35.313206],
  ["הצלף",31.771157,35.311283],
  ["הצלצל",31.783048,35.298532],
  ["הצפצפה",31.767797,35.300869],
  ["הקירטון",31.777975,35.30699],
  ["הקנה",31.768617,35.304908],
  ["הקרן",31.780144,35.295905],
  ["הקתרוס",31.787052,35.297256],
  ["הר גדור",31.770846,35.300069],
  ["הר הלבונה",31.773484,35.301669],
  ["הר מיכוור",31.771483,35.300486],
  ["הר סרטבה",31.769966,35.299806],
  ["הרותם",31.766454,35.302202],
  ["הרכס",31.781768,35.311366],
  ["השונית",31.779346,35.31419],
  ["השופר",31.777429,35.295528],
  ["השחם",31.783505,35.312559],
  ["השיזף",31.766198,35.295486],
  ["השיטה",31.76668,35.294966],
  ["השיש",31.783897,35.311164],
  ["השמינית",31.777881,35.294393],
  ["השקמה",31.767174,35.297295],
  ["השרך",31.76986,35.305407],
  ["התוף",31.778296,35.294559],
  ["התלתן",31.767243,35.302737],
  ["חגוי הסלע",31.769183,35.293162],
  ["חוט השני",31.771249,35.292941],
  ["חולית",31.794464,35.337742],
  ["חלוקי הנחל",31.789078,35.309029],
  ["חרובית",31.788885,35.338732],
  ["יהלום",31.77351,35.298898],
  ["כוכב הירדן",31.769523,35.299365],
  ["מבוא האורים",31.777163,35.302083],
  ["מבוא האלון",31.767479,35.301996],
  ["מבוא האשלג",31.783879,35.315275],
  ["הגבים",31.778834,35.298571],
  ["הורקניה",31.779753,35.302049],
  ["מבוא המלוח",31.765767,35.303211],
  ["מבוא המשרוקית",31.780158,35.29812],
  ["מבוא הר הזיתים",31.773191,35.294971],
  ["הרודיון",31.780797,35.303505],
  ["מבוא השליש",31.779801,35.299347],
  ["מבוא יפה נוף",31.784647,35.312107],
  ["מבוא נחל ערוגות",31.773552,35.297395],
  ["מדליקי המשואות",31.770039,35.299252],
  ["נאות סיני",31.788169,35.344271],
  ["נביעות",31.788151,35.330358],
  ["נופי הסלע",31.782891,35.310066],
  ["אפיקים",31.777312,35.299782],
  ["האפוד",31.775056,35.302466],
  ["העשרה",31.797685,35.328816],
  ["הקרונית",31.777158,35.297006],
  ["סופה",31.794001,35.330799],
  ["אודם",31.775239,35.302183],
  ["ברקת",31.775543,35.301368],
  ["לשם",31.77547,35.301792],
  ["נופך",31.776019,35.301426],
  ["נחל אוג",31.778851,35.301406],
  ["נחל בוקק",31.777942,35.300731],
  ["נחל גורפן",31.777858,35.300085],
  ["נחל דרגות",31.777776,35.299998],
  ["נחל הרדוף",31.777569,35.299267],
  ["נחל ורדית",31.777492,35.298704],
  ["נחל זוהר",31.777663,35.298627],
  ["נחל חבר",31.776906,35.29811],
  ["נחל טור",31.77672,35.298147],
  ["נחל יעלים",31.775965,35.297889],
  ["ספיר",31.775824,35.300813],
  ["פטדה",31.775711,35.302368],
  ["שוהם",31.775611,35.301818],
  ["תרשיש",31.775867,35.301551],
  ["עצמונה",31.789807,35.343648],
  ["עת הזמיר",31.775303,35.290096],
  ["פרי גן",31.794537,35.329668],
  ["פרי מגדים",31.771467,35.29387],
  ["פריאל",31.794407,35.334675],
  ["צמח השדה",31.767053,35.301627],
  ["קדש ברנע",31.789204,35.328246],
  ["קול התור",31.771219,35.291951],
  ["החברה הכלכלית",31.787582,35.335798],
  ["שדות",31.791376,35.340807],
  ["כלי שיר",31.779524,35.296279],
  ["שלהבת",31.787469,35.329969],
  ["תלמי יוסף",31.790594,35.332429]
];
  var PREF = /^(סמטת|סמ|שכונת|שכ|שדרות|שד|מבוא|נתיב|משעול|רחוב|רח|דרך|ככר|כיכר)\s+/;
  var CITY_WORDS = ['מעלה', 'אדומים', 'ישראל'];
  function norm(s) {
    return String(s || '').replace(/["'׳״]/g, '').replace(/[‎‏‪-‮]/g, '')
      .replace(/[-–—,]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  var INDEX = STREETS.map(function (r) {
    var full = norm(r[0]);
    return { name: r[0], full: full, core: full.replace(PREF, ''), lat: r[1], lng: r[2] };
  });
  /* "הפסנתר 8 מעלה אדומים" → { key:'הפסנתר', num:'8' }. מילות העיר (גם חלקיות, בזמן הקלדה) נזרקות. */
  function parse(q) {
    var toks = norm(q).split(' ').filter(Boolean), words = [], num = '';
    for (var i = 0; i < toks.length; i++) {
      if (!num && /^\d{1,4}[א-ת]?$/.test(toks[i])) { num = toks[i]; break; }   /* אחרי המספר מגיעה רק העיר */
      words.push(toks[i]);
    }
    if (!num) {
      while (words.length > 1) {                                        /* "הפסנתר מעל" → "הפסנתר" */
        var last = words[words.length - 1], cityish = false;
        for (var c = 0; c < CITY_WORDS.length; c++) { if (last.length >= 2 && CITY_WORDS[c].indexOf(last) === 0) { cityish = true; } }
        if (!cityish) { break; }
        words.pop();
      }
    }
    return { key: norm(words.join(' ')).replace(PREF, ''), num: num };
  }
  function find(q) {
    var p = parse(q);
    if (p.key.length < 2) { return []; }
    var exact = [], starts = [];
    for (var i = 0; i < INDEX.length; i++) {
      var s = INDEX[i];
      if (s.core === p.key || s.full === p.key) { exact.push(s); }
      else if (s.core.indexOf(p.key) === 0 || s.full.indexOf(p.key) === 0) { starts.push(s); }
    }
    return exact.concat(starts).slice(0, MAX).map(function (s) { return { street: s, num: p.num }; });
  }
  /* Google כבר החזירה שורת רחוב (לא עסק) לרחוב הזה בעיר? אז אין מה להוסיף. */
  function googleHas(list, s) {
    for (var i = 0; i < list.length; i++) {
      var a = norm(list[i] && list[i].address);
      if (a.indexOf(CITY) === -1) { continue; }
      var head = a.split(' ' + CITY)[0].replace(PREF, '').replace(/\s+\d{1,4}[א-ת]?$/, '').trim();
      if (head === s.core || head === s.full) { return true; }
    }
    return false;
  }
  function makeResult(m) {
    var s = m.street, label = s.name + (m.num ? ' ' + m.num : '');
    var placeName = label + ', ' + CITY + ', ישראל';
    return {
      address: label + ', ' + CITY + ' <span class="mh-st-tag">רחוב חדש · אשרו את המיקום במפה</span>',
      place_id: 'mh-street:' + label,
      mapbox_data: {
        id: 'mh.' + label, type: 'Feature', place_type: ['address'], text: label, place_name: placeName,
        center: [s.lng, s.lat], geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
        context: [{ id: 'place.mh', text: CITY }, { id: 'region.mh', text: 'מחוז ירושלים' }, { id: 'country.mh', text: 'ישראל', short_code: 'il' }]
      }
    };
  }
  var stats = { version: VERSION, hooked: false, fetchHooked: false, searches: 0, injected: 0, rescued: 0, mapboxInjected: 0, last: null, streets: STREETS.length };
  function augment(store, q) {
    var matches = find(q);
    if (!matches.length) { return; }
    var list = (store.getters.getSearchedLocations || []).slice();
    var add = [];
    for (var i = 0; i < matches.length; i++) {
      if (!googleHas(list, matches[i].street)) { add.push(makeResult(matches[i])); }
    }
    if (!add.length) { return false; }
    stats.injected += add.length;
    stats.last = { q: q, added: add.map(function (r) { return r.mapbox_data.place_name; }) };
    store.commit('setSearchedLocations', add.concat(list));
    return true;
  }
  function hook(store) {
    var orig = store.dispatch;
    store.dispatch = function (type, payload) {
      var p = orig.apply(this, arguments);
      try {
        if (type === 'searchLocation' && payload && payload.q) {
          stats.searches++;
          var q = payload.q;
          p = p.then(function (r) {
            var added = false;
            try { added = augment(store, q); } catch (e) { console.warn('[MH Streets]', e); }
            /* גוגל "No results" (r = מחרוזת) + יש לנו רחוב → מדווחים הצלחה, אחרת הרכיב בורח ל-Mapbox ודורס */
            return (added && r !== 1) ? (stats.rescued++, 1) : r;
          }, function (e) { try { augment(store, q); } catch (e2) {} throw e; });
        }
      } catch (e) { console.warn('[MH Streets]', e); }
      return p;
    };
    stats.hooked = true;
  }
  /* נתיב Mapbox: הרכיב קורא fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/<q>.json?…') ומציב
     u.features ישירות. מקדימים features בפורמט Mapbox (place_name נקי — הוא נשמר ככתובת). */
  function mapboxFeature(m) {
    var s = m.street, label = s.name + (m.num ? ' ' + m.num : '');
    return { id: 'mh.' + label, type: 'Feature', place_type: ['address'], relevance: 1, text: label,
      place_name: label + ', ' + CITY + ', ישראל', center: [s.lng, s.lat], geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
      context: [{ id: 'place.mh', text: CITY }, { id: 'region.mh', text: 'מחוז ירושלים' }, { id: 'country.mh', text: 'ישראל', short_code: 'il' }] };
  }
  function hookFetch() {
    if (typeof window.fetch !== 'function') { return; }
    var orig = window.fetch;
    window.fetch = function (input) {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      var mm = /api\.mapbox\.com\/geocoding\/v5\/mapbox\.places\/([^?]+)\.json/.exec(url);
      if (!mm) { return orig.apply(this, arguments); }
      var q = ''; try { q = decodeURIComponent(mm[1]); } catch (e) { return orig.apply(this, arguments); }
      var matches = find(q);
      var p = orig.apply(this, arguments);
      if (!matches.length) { return p; }
      return p.then(function (res) {
        return res.clone().json().then(function (json) {
          var feats = (json && json.features) || [];
          var have = feats.map(function (f) { return { address: f.place_name }; });
          var add = [];
          for (var i = 0; i < matches.length; i++) { if (!googleHas(have, matches[i].street)) { add.push(mapboxFeature(matches[i])); } }
          if (!add.length) { return res; }
          stats.mapboxInjected += add.length;
          stats.last = { q: q, added: add.map(function (f) { return f.place_name; }), via: 'mapbox' };
          json.features = add.concat(feats);
          return new Response(JSON.stringify(json), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }, function () { return res; });
      });
    };
    stats.fetchHooked = true;
  }
  try { hookFetch(); } catch (e) { console.warn('[MH Streets] fetch hook', e); }
  /* תרגום placeholder חסר בחבילת השפה ("Search for area or address") — טקסט בלבד */
  function placeholder() {
    var els = document.querySelectorAll('.scheme-location-master input#search');
    for (var i = 0; i < els.length; i++) {
      if (/^Search for area/i.test(els[i].placeholder || '')) { els[i].placeholder = 'כתובת בגוש אדומים'; }
    }
  }
  var tries = 0;
  function boot() {
    try {
      var app = document.getElementById('app');
      var store = app && app.__vue_app__ && app.__vue_app__.config.globalProperties.$store;
      if (store && typeof store.dispatch === 'function') { hook(store); return; }
    } catch (e) {}
    if (++tries < 40) { setTimeout(boot, 250); }
  }
  boot();
  try {
    var pend = false;
    new MutationObserver(function () { if (pend) { return; } pend = true; setTimeout(function () { pend = false; placeholder(); }, 200); })
      .observe(document.documentElement, { subtree: true, childList: true });
  } catch (e) {}
  window.MH_STREETS = { version: VERSION, find: find, parse: parse, mapboxFeature: mapboxFeature, stats: function () { return JSON.parse(JSON.stringify(stats)); } };
  /* mh-streets-v1 */
})();

/* ============================================================
   בועת וואטסאפ צפה — MH WhatsApp  |  v1.0.2 | 2026-09-28
   בקשת דוד: בועה קטנה עם סמל וואטסאפ בדף הבית ובדפי העסקים, שלא מתנגשת בכלום.
   מה הבלוק עושה: יוצר <a id="mh-wa"> אחד (העיצוב בחלק 45), ומדליק/מכבה .mh-wa-on לפי:
     - מסלול: דף הבית (/, /he, /he/home) — אחרי 1.2 שניות; דף עסק (/he/m/<slug>/<id>) —
       רק אחרי שהלקוח גלל ~160px בתוך .merchant-page (לא מכסה את ההירו). כל דף אחר
       (צ'ק-אאוט, חיפוש, עמוד מוצר, כתובות, דפי מידע) — מוסתר.
     - שכבות: כל חלונית (.v-overlay--active: פופאפ מוצר, עגלה, כתובת) או מגירה פעילה
       (.v-navigation-drawer--active) — מוסתר, וחוזר כשנסגרו.
     - גובה: מעל סרגל הניווט התחתון (#MultiVendorBottomNav) כשהוא מוצג, אחרת 20px —
       נמדד מה-DOM ומוזרם ל-CSS דרך --mh-wa-bottom. כפתור "המשך לתשלום" של Hyperzod
       בדף עסק יושב במרכז (x 109–280 ב-390px) — הבועה בשמאל לא נוגעת בו.
   המספר: קבוע בקוד (NUMBER) — לא נקרא מה-boot של Hyperzod (v1.0.1, ראו הערה ליד phone()).
   באפליקציה (v1.0.2): כל קישור וואטסאפ (הבועה, "דברו איתנו") נפתח דרך openNativeExternalWebview
   של Hyperzod — ראו הערה ליד המאזין בסוף הבלוק.
   נכשל-פתוח: כל שגיאה = אין בועה. בדיקה: window.MH_WA.stats()
   ============================================================ */
(function () {
  'use strict';
  if (window.__MH_WA__) { return; }
  window.__MH_WA__ = true;
  var VERSION = '1.0.2', NUMBER = '972555190064';
  var TEXT = 'שלום, אשמח לעזרה עם הזמנה במעלה המשלוחים';
  var HOME = /^\/(he\/?(home\/?)?)?$/, MERCHANT = /^\/he\/m\/[^\/]+\/[0-9a-f]{20,}\/?$/;
  var SCROLL_MIN = 160, NAV_GAP = 12, BASE_BOTTOM = 20;
  var SVG = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C8.8 3 3 8.7 3 15.7c0 2.5.7 4.9 2.1 7L3 29l6.5-2c2 1.1 4.2 1.6 6.5 1.6 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.3c-2 0-4-.5-5.7-1.6l-.4-.2-3.9 1.2 1.2-3.7-.3-.4a10.3 10.3 0 0 1-1.7-5.9C5.2 10 10 5.2 16 5.2S26.8 10 26.8 15.7 22 26.3 16 26.3zm5.9-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5c.1-.2.1-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.3 1.4 3.5c.2.2 2.4 3.6 5.8 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5l-.6-.4z"/></svg>';
  var stats = { version: VERSION, route: null, shown: false, reason: '', coverBy: null, scrolled: false, bottom: BASE_BOTTOM, phone: null, toggles: 0, nativeOpens: 0 };
  var el = null, scrolledEnough = false, homeTimer = null, homeReady = false, scrollHost = null;

  /* v1.0.1 (24.9): המספר קבוע בקוד. קודם נקרא business_phone מה-boot של Hyperzod — ומכשיר עם boot ישן
     (האפליקציה שומרת אותו) שלח לקוחה למספר הישן. שינוי מספר = עריכת NUMBER כאן. */
  function phone() { return NUMBER; }
  function ensure() {
    if (el && el.isConnected) { return el; }
    el = document.getElementById('mh-wa');
    if (!el) {
      el = document.createElement('a');
      el.id = 'mh-wa';
      el.setAttribute('aria-label', 'דברו איתנו בוואטסאפ');
      el.setAttribute('title', 'דברו איתנו בוואטסאפ');
      el.setAttribute('rel', 'noopener');
      el.setAttribute('target', '_blank');   /* v1.0.2: גם באפליקציה — Hyperzod מעבירה _blank לדפדפן החיצוני */
      el.innerHTML = SVG;
      document.body.appendChild(el);
    }
    var num = phone();
    if (stats.phone !== num) { stats.phone = num; el.href = 'https://wa.me/' + num + '?text=' + encodeURIComponent(TEXT); }
    return el;
  }
  function route() {
    var p = location.pathname.replace(/\/+$/, '') || '/';
    if (HOME.test(p) || p === '/he') { return 'home'; }
    if (MERCHANT.test(p)) { return 'merchant'; }
    return null;
  }
  /* חלונית/מגירה שבאמת על המסך (Vuetify משאירה מגירות "פעילות" מחוץ למסך ובכיתה --active) */
  function visibleOnScreen(node) {
    if (!node) { return false; }
    var cs = getComputedStyle(node);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) { return false; }
    var r = node.getBoundingClientRect();
    return r.width > 20 && r.height > 20 && r.right > 0 && r.left < window.innerWidth && r.bottom > 0 && r.top < window.innerHeight;
  }
  function covered() {
    var list = document.querySelectorAll('.v-overlay--active .v-overlay__content, .v-navigation-drawer--active');
    for (var i = 0; i < list.length; i++) {
      if (visibleOnScreen(list[i])) { stats.coverBy = (list[i].className || '').toString().slice(0, 60); return true; }
    }
    stats.coverBy = null;
    return false;
  }
  function navBottom() {
    var nav = document.getElementById('MultiVendorBottomNav');
    if (!nav) { return BASE_BOTTOM; }
    var r = nav.getBoundingClientRect(), cs = getComputedStyle(nav);
    if (cs.display === 'none' || cs.visibility === 'hidden' || r.height < 10 || r.top >= window.innerHeight) { return BASE_BOTTOM; }
    return Math.round(window.innerHeight - r.top) + NAV_GAP;
  }
  /* דף עסק גולל בתוך .merchant-page במובייל ובחלון בדסקטופ — מאזינים לשניהם */
  function bindScroll(r) {
    var host = r === 'merchant' ? document.querySelector('.merchant-page') : null;
    if (host === scrollHost) { return; }
    if (scrollHost) { scrollHost.removeEventListener('scroll', onScroll); }
    scrollHost = host;
    scrolledEnough = false;
    if (host) { host.addEventListener('scroll', onScroll, { passive: true }); onScroll(); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  function onScroll() {
    if (scrolledEnough || route() !== 'merchant') { return; }
    var y = Math.max(scrollHost ? scrollHost.scrollTop : 0, window.scrollY || document.documentElement.scrollTop || 0);
    if (y >= SCROLL_MIN) { scrolledEnough = true; stats.scrolled = true; apply(); }
  }
  function apply() {
    try {
      var r = route(); stats.route = r;
      if (r === 'home' && !homeReady && !homeTimer) { homeTimer = setTimeout(function () { homeReady = true; homeTimer = null; apply(); }, 1200); }
      if (r !== 'home') { homeReady = false; if (homeTimer) { clearTimeout(homeTimer); homeTimer = null; } }
      bindScroll(r);
      var show = false, why = 'route';
      if (r === 'home') { show = homeReady; why = homeReady ? 'home' : 'home-delay'; }
      else if (r === 'merchant') { show = scrolledEnough; why = scrolledEnough ? 'merchant-scrolled' : 'merchant-top'; }
      if (show && covered()) { show = false; why = 'covered'; }
      var node = ensure();
      var b = navBottom(); if (b !== stats.bottom) { stats.bottom = b; node.style.setProperty('--mh-wa-bottom', b + 'px'); }
      if (node.classList.contains('mh-wa-on') !== show) { node.classList.toggle('mh-wa-on', show); stats.toggles++; }
      stats.shown = show; stats.reason = why;
    } catch (e) { console.warn('[MH WhatsApp]', e); }
  }
  var pend = false;
  function schedule() { if (pend) { return; } pend = true; setTimeout(function () { pend = false; apply(); }, 200); }
  var lastPath = location.pathname;
  /* מסלול: בדיקה כל 400ms (SPA); מצב כללי: כל 1.5 שניות כרשת ביטחון (apply זול — כמה מדידות) */
  setInterval(function () { if (location.pathname !== lastPath) { lastPath = location.pathname; scrolledEnough = false; apply(); } }, 400);
  setInterval(apply, 1500);
  window.addEventListener('popstate', schedule);
  window.addEventListener('resize', schedule);
  /* חלוניות של Vuetify נוספות בתוך .v-overlay-container (לא ישירות ל-body) ומגירות משנות class —
     לכן subtree + class, עם דחיסה ל-200ms */
  try { new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] }); } catch (e) {}
  apply();
  /* v1.0.2 (28.9): באפליקציה (Android/iOS) קישור וואטסאפ שנפתח בתוך ה-WebView → wa.me מפנה ל-whatsapp://
     → "Something Went Wrong" (net::ERR_UNKNOWN_URL_SCHEME, דווח מ-OnePlus). v1.0.0 הסיר בכוונה target=_blank
     באפליקציה, וזו הייתה הטעות. עכשיו, רק באפליקציה, כל קישור http(s) לוואטסאפ — גם בדף "דברו איתנו" שאין
     בו target — נשלח ל-window.openNativeExternalWebview(url, true, {isExternalBrowser:true}): בדיוק מה ש-Hyperzod
     עושה בעצמה לכל קישור _blank באפליקציה (attachExternalLinkHandlers), ומה שדף ה-Maintenance עושה מאז 22.8
     (ריפו maale-maint-html, platform-detection.md §9.5). הלקחים משם: target=_blank לבד לא עושה כלום באנדרואיד;
     wa.me בתוך ה-WebView תמיד נכשל; ואסור לשלוח ל-ReactNativeWebView.postMessage שום הודעה משלנו — ה-onMessage
     של האפליקציה מריץ JSON.parse בלי הגנה והודעה לא מוכרת מקריסה אותה. לכן קוראים רק לפונקציה של Hyperzod.
     המאזין על window ב-capture — רץ לפני המאזין של Hyperzod על document, כך שנשלחת הודעה אחת בלבד.
     אין הפונקציה → לא נוגעים (target=_blank והמאזין של Hyperzod). */
  var WA_LINK = /^https?:\/\/(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)\//i;
  window.addEventListener('click', function (e) {
    try {
      if (!window.ReactNativeWebView || typeof window.openNativeExternalWebview !== 'function') { return; }
      var a = e.target && e.target.closest && e.target.closest('a[href]');
      if (!a || !WA_LINK.test(a.href || '')) { return; }
      e.preventDefault(); e.stopImmediatePropagation();
      window.openNativeExternalWebview(a.href, true, { isExternalBrowser: true });
      stats.nativeOpens++;
    } catch (err) { /* נכשל-פתוח: הדפדפן ימשיך כרגיל */ }
  }, true);
  window.MH_WA = { version: VERSION, apply: apply, stats: function () { return JSON.parse(JSON.stringify(stats)); } };
  /* mh-whatsapp-v1 */
})();

/* ============================================================
   טלפון בטופס הכתובת: ישראל תמיד — MH ILPhone  |  v1.0.0 | 2026-09-23
   בקשת דוד: בשדה הטלפון של הוספת/עריכת כתובת, ישראל (+972) היא ברירת המחדל ותפריט המדינות
   לא נפתח בכלל. Hyperzod פותחת את הבורר על המדינה הראשונה ברשימה (אנדורה, +376) לאורחים.
   איך: מאתרים ברשימת המדינות של הבורר (.country-select-dropdown li) את "Israel" ולוחצים עליה
   דרך המאזין של Vue (li.click()) — כך הקידומת האמיתית של הטופס משתנה, לא רק התצוגה. רץ רק
   כשהדגל הנוכחי אינו ישראל, ורק בתוך #AddressInputContactPhoneNumber. הנעילה של התפריט (בלי
   חץ, בלי לחיצה, הרשימה מוסתרת) היא ב-CSS בחלק 44.
   נכשל-פתוח: אין רשימה/אין ישראל → כלום. בדיקה: window.MH_ILPHONE.stats()
   ============================================================ */
(function () {
  'use strict';
  if (window.__MH_ILPHONE__) { return; }
  window.__MH_ILPHONE__ = true;
  var VERSION = '1.0.0', ROOT = '#AddressInputContactPhoneNumber', WANT = 'israel';
  var stats = { version: VERSION, scans: 0, selected: 0, alreadyIL: 0, noList: 0, last: null };
  function currentIsIsrael(cs) {
    var img = cs.querySelector('.country-select-toggle img');
    var alt = (img && (img.getAttribute('alt') || '')).toLowerCase();
    if (alt) { return alt === WANT; }
    var dial = cs.parentNode && cs.parentNode.parentNode && cs.parentNode.parentNode.querySelector('.v-field__prepend-inner');
    return !!(dial && /\+972/.test(dial.textContent));
  }
  function sync() {
    stats.scans++;
    var pickers = document.querySelectorAll(ROOT + ' .country-select');
    for (var i = 0; i < pickers.length; i++) {
      var cs = pickers[i];
      if (currentIsIsrael(cs)) { if (!cs.__mhIL) { cs.__mhIL = true; stats.alreadyIL++; } continue; }
      var items = cs.querySelectorAll('.country-select-dropdown li');
      if (!items.length) { stats.noList++; continue; }
      var hit = null;
      for (var j = 0; j < items.length; j++) {
        var name = items[j].querySelector('strong'); var code = items[j].querySelector('span');
        if ((name && name.textContent.trim().toLowerCase() === WANT) || (code && code.textContent.trim() === '+972' && name && /israel/i.test(name.textContent))) { hit = items[j]; break; }
      }
      if (!hit) { continue; }
      try { hit.click(); stats.selected++; stats.last = new Date().toISOString(); } catch (e) { console.warn('[MH ILPhone]', e); }
    }
  }
  var pend = false;
  function schedule() { if (pend) { return; } pend = true; setTimeout(function () { pend = false; try { sync(); } catch (e) {} }, 200); }
  try { new MutationObserver(schedule).observe(document.documentElement, { subtree: true, childList: true }); } catch (e) {}
  schedule();
  window.MH_ILPHONE = { version: VERSION, sync: sync, stats: function () { return JSON.parse(JSON.stringify(stats)); } };
  /* mh-ilphone-v1 */
})();

/* ============================================================
   חלונית "עוד אחד עם אותן תוספות?" — MH Repeat  |  v1.0.0 | 2026-09-24
   הרכיב cart-item-addon-confirm של Hyperzod (#AddonsConfirmation) נפתח כשלוחצים + על מוצר עם תוספות
   שכבר בעגלה. חבילת השפה תרגמה "Repeat" ל"חזור" ו-"I'll choose" ל"בחירה" — הלקוח לא מבין מה קורה.
   הבלוק מחליף את הטקסטים (רק בתוך #AddonsConfirmation) ומוריד את הפסיק שאחרי כל תוספת
   (Hyperzod מרנדרים "שם, " לכל אופציה — העיצוב בחלק 49 הופך כל אחת לגלולה).
   נכשל-פתוח. בדיקה: window.MH_REPEAT.stats()
   ============================================================ */
(function () {
  'use strict';
  if (window.__MH_REPEAT__) { return; }
  window.__MH_REPEAT__ = true;
  var VERSION = '1.0.0', ROOT = '#AddonsConfirmation';
  var TEXT = [
    { sel: '.v-card-text > .text-subtitle-2', from: ['הבחירות הקודמות שלך', 'Your previous choices'], to: 'להוסיף עוד אחד עם אותן תוספות?' },
    { sel: '.repeat-ntn .v-btn__content', from: ['חזור', 'Repeat'], to: 'כן, אותו דבר' },
    { sel: '.chose-btn .v-btn__content', from: ['בחירה', "I'll choose", 'Choose'], to: 'לבחור מחדש' },
    { sel: '.product-addons > p', from: ['No customizations added'], to: 'בלי תוספות' }
  ];
  var stats = { version: VERSION, applied: 0, trimmed: 0, seen: 0 };
  function apply() {
    try {
      var root = document.querySelector(ROOT);
      if (!root) { return; }
      stats.seen++;
      for (var i = 0; i < TEXT.length; i++) {
        var els = root.querySelectorAll(TEXT[i].sel);
        for (var j = 0; j < els.length; j++) {
          var t = (els[j].textContent || '').trim();
          if (TEXT[i].from.indexOf(t) >= 0) { els[j].textContent = TEXT[i].to; stats.applied++; }
        }
      }
      var opts = root.querySelectorAll('.product-addons > span > span');
      for (var k = 0; k < opts.length; k++) {
        var s = opts[k].textContent || '';
        var c = s.replace(/[\s,،]+$/, '').trim();
        if (c !== s) { opts[k].textContent = c; stats.trimmed++; }
      }
    } catch (e) { /* נכשל-פתוח */ }
  }
  var pend = false;
  function schedule() { if (pend) { return; } pend = true; setTimeout(function () { pend = false; apply(); }, 60); }
  try { new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true, characterData: true }); } catch (e) {}
  apply();
  window.MH_REPEAT = { version: VERSION, apply: apply, stats: function () { return JSON.parse(JSON.stringify(stats)); } };
  /* mh-repeat-v1 */
})();

/* ============================================================
   התוספות שנבחרו לכל מוצר בצ'ק-אאוט — MH CartOpts  |  v1.0.0 | 2026-09-27
   בקשת דוד: בצ'ק-אאוט מופיע רק "פיצה משפחתית" + "שינוי תוספות", בלי לראות מה נבחר. הבלוק מוסיף
   מתחת לשם המוצר את התוספות מתוך העגלה של Hyperzod (cart_items[].product_options[].options[].name):
   גלולות בשתי שורות לכל היותר (נמדד בפועל, מתאים לרוחב), ומעבר לזה "עוד N" שפותח את השאר
   (העיצוב בחלק 50). בפיצה: "(הכל)" מושמט, "(חצי ימין)" → "½ ימין", "(רבע …)" → "¼ …"; ×N לכמות.
   שיוך שורה ↔ פריט: לפי הסדר, עם בדיקת שם המוצר בכל שורה (לרכיבים של Hyperzod אין מזהה ב-DOM).
   אי-התאמה → מוחקים את מה שהוספנו ולא מציגים כלום (נכשל-פתוח). רק ב-#checkout #cartItems. תצוגה בלבד.
   בדיקה: window.MH_CARTOPTS.stats()
   ============================================================ */
(function () {
  'use strict';
  if (window.__MH_CARTOPTS__) { return; }
  window.__MH_CARTOPTS__ = true;
  var VERSION = '1.0.0', MAX_LINES = 2, FALLBACK = 3, BOX = 'mh-ci-opts';
  var stats = { version: VERSION, syncs: 0, rows: 0, painted: 0, mismatch: 0, errors: 0 };
  var open = {};                                     /* "אינדקס|חתימה" → פתוח */

  function store() { try { return document.getElementById('app').__vue_app__.config.globalProperties.$store; } catch (e) { return null; } }
  function items() { try { var c = store().getters.getCart; return (c && c.cart_items) || null; } catch (e) { return null; } }
  function norm(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function label(o) {
    var n = norm(o && o.name).replace(/\s*\(הכל\)$/, '').replace(/\s*\(חצי ([^)]+)\)$/, ' ½ $1').replace(/\s*\(רבע ([^)]+)\)$/, ' ¼ $1');
    var q = +(o && (o.quantity || o.option_quantity)) || 1;
    return q > 1 ? n + ' ×' + q : n;
  }
  function clean(root) { var l = root.querySelectorAll('.' + BOX); for (var i = 0; i < l.length; i++) { l[i].remove(); } }

  function paint(box, labels, key) {
    box.textContent = '';
    for (var i = 0; i < labels.length; i++) {
      var s = document.createElement('span');
      s.className = 'mh-ci-opt'; s.textContent = labels[i]; s.title = labels[i];
      box.appendChild(s);
    }
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'mh-ci-more mh-ci-off';
    b.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      open[key] = !open[key]; fit(box);
    });
    box.appendChild(b);
    box.setAttribute('data-key', key);
    fit(box);
    stats.painted++;
  }
  /* כמה שורות תופסים הילדים הגלויים (לפי offsetTop, סובלנות 3px) */
  function lines(box) {
    var tops = [], ch = box.children;
    for (var i = 0; i < ch.length; i++) {
      if (!ch[i].offsetParent) { continue; }
      var y = ch[i].offsetTop, seen = false;
      for (var k = 0; k < tops.length; k++) { if (Math.abs(tops[k] - y) <= 3) { seen = true; break; } }
      if (!seen) { tops.push(y); }
    }
    return tops.length;
  }
  /* מקפל לשתי שורות: מסתיר גלולות מהסוף עד שהכול (כולל "עוד N") נכנס */
  function fit(box) {
    var key = box.getAttribute('data-key'), chips = box.querySelectorAll('.mh-ci-opt'), btn = box.querySelector('.mh-ci-more');
    if (!btn) { return; }
    for (var i = 0; i < chips.length; i++) { chips[i].classList.remove('mh-ci-extra'); }
    btn.classList.add('mh-ci-off'); box.classList.remove('mh-ci-open');
    if (open[key]) {
      box.classList.add('mh-ci-open');
      if (box.offsetParent && lines(box) <= MAX_LINES) { open[key] = false; return; }   /* אין מה לפתוח */
      btn.textContent = 'פחות'; btn.setAttribute('aria-expanded', 'true'); btn.classList.remove('mh-ci-off');
      return;
    }
    btn.setAttribute('aria-expanded', 'false');
    var hidden = 0;
    if (!box.offsetParent) {                          /* לא מוצג כרגע — לא אפשר למדוד */
      for (var f = FALLBACK; f < chips.length; f++) { chips[f].classList.add('mh-ci-extra'); hidden++; }
    } else if (lines(box) > MAX_LINES) {
      btn.textContent = 'עוד ' + chips.length; btn.classList.remove('mh-ci-off');
      for (var k = chips.length - 1; k >= 1 && lines(box) > MAX_LINES; k--) { chips[k].classList.add('mh-ci-extra'); hidden++; btn.textContent = 'עוד ' + hidden; }
    }
    if (hidden) { btn.textContent = 'עוד ' + hidden; btn.classList.remove('mh-ci-off'); }
  }
  function refitAll() { var l = document.querySelectorAll('#checkout #cartItems .' + BOX); for (var i = 0; i < l.length; i++) { try { fit(l[i]); } catch (e) {} } }

  function sync() {
    try {
      var wrap = document.querySelector('#checkout #cartItems'); if (!wrap) { return; }
      stats.syncs++;
      var rows = wrap.querySelectorAll('.cart-row'), list = items();
      stats.rows = rows.length;
      if (!list || rows.length !== list.length) { if (list) { stats.mismatch++; } clean(wrap); return; }
      for (var i = 0; i < rows.length; i++) {
        var nameEl = rows[i].querySelector('.product-name');
        if (!nameEl || norm(nameEl.textContent) !== norm(list[i].product_name)) { stats.mismatch++; clean(wrap); return; }
      }
      for (var j = 0; j < rows.length; j++) {
        var nm = rows[j].querySelector('.product-name'), host = nm.parentElement;
        var labels = [];
        (list[j].product_options || []).forEach(function (g) { (g && g.options || []).forEach(function (o) { var t = label(o); if (t) { labels.push(t); } }); });
        var box = null;
        for (var k = 0; k < host.children.length; k++) { if (host.children[k].classList.contains(BOX)) { box = host.children[k]; break; } }
        if (!labels.length) { if (box) { box.remove(); } continue; }
        var sig = labels.join('|'), key = j + '|' + sig;
        if (box && box.getAttribute('data-sig') === sig) { if (box.getAttribute('data-w') !== String(host.clientWidth)) { box.setAttribute('data-w', host.clientWidth); fit(box); } continue; }
        if (!box) { box = document.createElement('div'); box.className = BOX; nm.insertAdjacentElement('afterend', box); }
        box.setAttribute('data-sig', sig); box.setAttribute('data-w', host.clientWidth);
        paint(box, labels, key);
      }
    } catch (e) { stats.errors++; }
  }

  var t = null;
  function schedule() { clearTimeout(t); t = setTimeout(sync, 120); }
  try {
    new MutationObserver(function (muts) {
      if (!document.getElementById('checkout')) { return; }
      for (var i = 0; i < muts.length; i++) {
        var n = muts[i].target;
        if (n && n.classList && (n.classList.contains(BOX) || (n.closest && n.closest('.' + BOX)))) { continue; }  /* השינויים שלנו */
        schedule(); return;
      }
    }).observe(document.body || document.documentElement, { childList: true, subtree: true });
  } catch (e) {}
  (function sub(n) {                                  /* שינוי עגלה (כמות/תוספות) → סנכרון */
    var st = store();
    if (st && typeof st.subscribe === 'function') { try { st.subscribe(function (m) { if (m && /cart/i.test(m.type)) { schedule(); } }); } catch (e) {} return; }
    if (n < 40) { setTimeout(function () { sub(n + 1); }, 500); }
  })(0);
  window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { sync(); refitAll(); }, 150); });
  schedule();

  window.MH_CARTOPTS = { version: VERSION, sync: sync, stats: function () { return JSON.parse(JSON.stringify(stats)); } };
  /* mh-cartopts-v1 */
})();

/* הירו סוכות בדף הבית — MH Sukkot (28.9) — הוסר אחרי החג (4.10.2026); העיצוב הקבוע בחלק 54 (CSS). ההיסטוריה ב-git. */

/* ============================================================
   סרגל הניווט התחתון, Liquid Glass — MH NavGlass  |  v1.2.0 | 2026-09-29 (v1.1.0: 29.9, v1.0.0: 28.9)
   מחליף את "Bottom Nav - Sliding Active Indicator" ו-"Bottom Nav - Material Ripple" (1.5.2026).
   יוצר בתוך .floating-nav-pill עדשה אחת (.mh-lens) מתחת לטאב הפעיל (.floating-tab-active של Hyperzod).
   v1.1.0 — התנועה נכתבה מחדש אחרי ההקלטה של דוד (קרטוע + עיכוב):
     - קפיץ פיזי (mass/stiffness/damping) שמחושב ל-keyframes של transform בלבד ומורץ ב-element.animate
       → רץ על ה-compositor גם כשה-main thread עסוק בטעינת הדף הבא. המתיחה "הנוזלית" נגזרת מהמהירות
       (scaleX גדל, scaleY קטן) ולא מ-keyframes קבועים. לחיצה באמצע תנועה = קפיץ חדש מהמקום הנוכחי.
     - רוחב העדשה קבוע (כל הטאבים ברוחב שווה) — אין אנימציית width (layout בכל פריים).
     - הצופה מאזין רק לסרגל (class) ולגוף הדף רק להחלפת הסרגל (childList, 300ms) — לא מודד layout
       בכל שינוי בדף.
     - לחיצה: העדשה זזה מיד ב-pointerdown; אם 300ms אחרי השחרור Hyperzod לא סימנה טאב אחר (אורח
       ב"הזמן שוב" = חלונית התחברות) — חוזרת בקפיץ לטאב הפעיל האמיתי.
     - prefers-reduced-motion: מעבר ליניארי קצר בלי מתיחה.
   v1.2.0 — אייקונים: מוריד פעם אחת את ה-SVG של כל <object> (CORS *), הופך ל-data: URL ומציב ב---mh-ico
     + .mh-ico; ה-CSS מצייר אותו כ-mask בצבע מדויק (ה-filter יצא כתום ב-iOS, ו-mask עם כתובת ה-CDN לא
     מצויר בכלל — לא בספארי ולא בכרום). עד שההורדה מסתיימת / אם נכשלה — נשאר ה-<object>. מתעדכן כש-Hyperzod
     מחליפה אייקון (data), ובזמן ההורדה של גרסה חדשה נשאר ה-mask הקודם (בלי הבהוב). Vue מוחק את .mh-ico
     כשהוא כותב מחדש את ה-class של כפתור — לכן נבדק בכל sync.
     + סוף ללולאה: ב-v1.1.0 כל sync כתב class לעדשה גם בלי שינוי → mutation → sync, 24 פעמים בשנייה בלי מגע
     (כל אחת עם מדידת layout). עכשיו setCls כותב רק כשיש שינוי, והצופה מתעלם מהעדשה שלנו.
   העיצוב בחלק 52. לא נוגע בניווט ולא ברטט. נכשל-פתוח. בדיקה: window.MH_NAVGLASS.stats()
   ============================================================ */
(function () {
  'use strict';
  if (window.__MH_NAVGLASS__) { return; }
  window.__MH_NAVGLASS__ = true;
  var VERSION = '1.2.0', BTN = '#MultiVendorBottomNav .v-btn.footer-btn';
  var SPRING = { stiffness: 340, damping: 22, mass: 1, dur: 0.72, fps: 120, stretch: 0.34, squash: 0.15 };
  var stats = { version: VERSION, syncs: 0, moves: 0, presses: 0, settles: 0, icons: 0, icoFetch: 0, icoFail: 0, errors: 0, anim: 'waapi' };
  var ICO = {};   /* כתובת SVG → 'url("data:…")' | 'wait' | false */
  var pill = null, lens = null, curX = null, curW = null, anim = null, settleT = null, pressed = null;
  var reduced = false;
  try { reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var canAnimate = typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';
  if (!canAnimate) { stats.anim = 'css'; }

  function ensure() {
    var p = document.querySelector('#MultiVendorBottomNav .floating-nav-pill');
    if (!p) { pill = null; return false; }
    if (p !== pill) { pill = p; curX = curW = null; anim = null; }
    lens = null;
    for (var i = 0; i < pill.children.length; i++) {
      var ch = pill.children[i];
      if (ch.classList.contains('mh-lens')) { lens = ch; }
      else if (ch.classList.contains('mh-active-pill')) { ch.remove(); i--; }
    }
    if (!lens) {
      lens = document.createElement('span'); lens.className = 'mh-lens mh-lens-off'; lens.setAttribute('aria-hidden', 'true');
      pill.insertBefore(lens, pill.firstChild); curX = curW = null;
    }
    return true;
  }
  function active() { return pill && pill.querySelector('.v-btn.footer-btn.floating-tab-active'); }
  /* כותב class רק כשבאמת משתנה: classList.add/remove כותבים את התכונה גם בלי שינוי → רשומת mutation →
     הצופה → sync → שוב... (v1.1.0 רץ כך 24 פעמים בשנייה בלי הפסקה, כל פעם עם מדידת layout) */
  function setCls(el, c, on) { if (el.classList.contains(c) !== on) { el.classList.toggle(c, on); } }
  /* ה-SVG → data: URL (encodeURIComponent מקודד גם " ו-\ — לא יכול לצאת מ-url("")). נכשל → false */
  function fetchIco(u) {
    if (typeof fetch !== 'function') { ICO[u] = false; return; }
    ICO[u] = 'wait'; stats.icoFetch++;
    /* no-store חובה: בלי Origin ה-CDN (Cloudflare) מחזיר תשובה בלי Access-Control-Allow-Origin ובלי Vary,
       ה-<object> טוען כך את אותו SVG, והמטמון של הדפדפן מגיש את העותק הזה גם לבקשת CORS → "Failed to fetch".
       (מאותה סיבה mask עם כתובת ה-CDN לא מצויר.) */
    fetch(u, { mode: 'cors', credentials: 'omit', cache: 'no-store' }).then(function (r) {
      if (!r.ok || !/svg/i.test(r.headers.get('content-type') || '')) { throw new Error('bad svg ' + r.status); }
      return r.text();
    }).then(function (t) {
      t = String(t).trim();
      if (t.length > 40000 || !/^(<\?xml[^>]*>\s*)?<svg[\s>]/i.test(t)) { throw new Error('not svg'); }
      ICO[u] = 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(t) + '")';
      icoSafe();
    }).catch(function (e) { ICO[u] = false; stats.icoFail++; stats.icoErr = String((e && e.message) || e).slice(0, 80); icoSafe(); });
  }
  function icoSafe() { try { icons(); } catch (e) { stats.errors++; } }
  /* אייקון כ-mask: רק כתובת https נקייה, ורק אחרי שה-data: URL מוכן — אחרת נשאר ה-<object> */
  function icons() {
    if (!pill) { return; }
    var bs = pill.querySelectorAll('.v-btn.footer-btn');
    for (var i = 0; i < bs.length; i++) {
      var b = bs[i], o = b.querySelector('object'), u = o && o.getAttribute('data');
      var ok = !!u && /^https:\/\/[^\s"'()\\]+$/.test(u);
      if (ok && ICO[u] === undefined) { fetchIco(u); }
      var d = ok ? ICO[u] : false;
      if (d === 'wait') { continue; }   /* ה-mask הקודם (אם יש) נשאר עד שהחדש מוכן */
      if (!d) { if (b.__mhIco) { setCls(b, 'mh-ico', false); b.style.removeProperty('--mh-ico'); b.__mhIco = null; } continue; }
      /* Vue כותב מחדש את כל ה-class של כפתור כשהמצב שלו משתנה (פעיל/לחוץ) ומוחק את .mh-ico — לכן בודקים גם אותו */
      if (b.__mhIco === u && b.classList.contains('mh-ico') && b.style.getPropertyValue('--mh-ico')) { continue; }
      if (b.__mhIco !== u || !b.style.getPropertyValue('--mh-ico')) { b.style.setProperty('--mh-ico', d); stats.icons++; }
      setCls(b, 'mh-ico', true); b.__mhIco = u;
    }
  }
  function target(btn) {
    var pr = pill.getBoundingClientRect(), br = btn.getBoundingClientRect();
    if (!pr.width || !br.width) { return null; }
    return { x: Math.round((br.left - pr.left) * 10) / 10, w: Math.round(br.width * 10) / 10 };
  }
  /* המיקום בפועל כרגע (גם באמצע אנימציה) */
  function liveX() {
    try { var m = getComputedStyle(lens).transform; if (m && m !== 'none') { var M = new DOMMatrix(m); return M.m41 - (lens.offsetWidth / 2) * (1 - M.a); } } catch (e) {}   /* מנטרל את המתיחה סביב המרכז */
    return curX || 0;
  }
  /* קפיץ → keyframes של transform בלבד. המתיחה לפי המהירות הרגעית. */
  function springFrames(from, to) {
    var s = SPRING, w0 = Math.sqrt(s.stiffness / s.mass), z = s.damping / (2 * Math.sqrt(s.stiffness * s.mass));
    var wd = w0 * Math.sqrt(1 - z * z), n = Math.round(s.dur * s.fps), d = to - from, frames = [], prev = 0;
    var vmax = Math.abs(d) * w0 * 0.55 || 1;
    for (var i = 0; i <= n; i++) {
      var t = i / s.fps, e = Math.exp(-z * w0 * t);
      var p = 1 - e * (Math.cos(wd * t) + (z * w0 / wd) * Math.sin(wd * t));
      var v = i ? (p - prev) * s.fps * d : 0; prev = p;
      var k = Math.min(1, Math.abs(v) / vmax);
      var sx = 1 + s.stretch * k, sy = 1 - s.squash * k;
      frames.push({ transform: 'translateX(' + (from + d * p).toFixed(2) + 'px) scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')', offset: i / n });
    }
    frames[n].transform = 'translateX(' + to.toFixed(2) + 'px) scale(1,1)';
    return frames;
  }
  function settle(x) { lens.style.transform = 'translateX(' + x.toFixed(2) + 'px)'; }
  function moveTo(x, w, animate) {
    /* אותו יעד כמו התנועה הנוכחית → לא נוגעים (אחרת כל שינוי class בסרגל היה מאתחל את הקפיץ מאמצע הדרך) */
    if (curX !== null && Math.abs(curX - x) < 0.5 && w === curW) { setCls(lens, 'mh-lens-off', false); return; }
    if (w !== curW) { lens.style.setProperty('width', w + 'px', 'important'); curW = w; }   /* inline !important מנצח את ה-!important של הגיליון */
    setCls(lens, 'mh-lens-off', false);
    var from = curX === null ? x : liveX();
    if (anim) { try { anim.cancel(); } catch (e) {} anim = null; }
    if (!animate || curX === null || Math.abs(from - x) < 0.5 || !canAnimate) { settle(x); curX = x; return; }
    stats.moves++;
    var fx = x;
    if (reduced) {
      anim = lens.animate([{ transform: 'translateX(' + from.toFixed(2) + 'px)' }, { transform: 'translateX(' + x.toFixed(2) + 'px)' }], { duration: 160, easing: 'ease-out', fill: 'forwards' });
    } else {
      anim = lens.animate(springFrames(from, x), { duration: SPRING.dur * 1000, easing: 'linear', fill: 'forwards' });
    }
    var a = anim;
    a.onfinish = function () { if (anim === a) { settle(fx); anim = null; } try { a.cancel(); } catch (e) {} };
    curX = x;
  }
  function sync(animate) {
    try {
      if (!ensure()) { return; }
      stats.syncs++; icons();
      var b = active(); if (!b) { setCls(lens, 'mh-lens-off', true); return; }
      var t = target(b); if (!t) { return; }
      if (pressed && pressed !== b && Date.now() - pressed.__mhT < 600) { return; }   /* הלחיצה עדיין קובעת עד ההתייצבות */
      moveTo(t.x, t.w, animate !== false);
    } catch (e) { stats.errors++; }
  }

  /* לחיצה */
  function down(e) {
    try {
      var b = e.target && e.target.closest && e.target.closest(BTN);
      if (!b || !ensure()) { return; }
      stats.presses++; pressed = b; b.__mhT = Date.now();
      setCls(b, 'mh-press', true);
      var t = target(b); if (t) { moveTo(t.x, t.w, true); }
      clearTimeout(settleT);
    } catch (err) { stats.errors++; }
  }
  function up() {
    var l = document.querySelectorAll('#MultiVendorBottomNav .mh-press'); for (var i = 0; i < l.length; i++) { l[i].classList.remove('mh-press'); }
    clearTimeout(settleT);
    settleT = setTimeout(function () { pressed = null; stats.settles++; sync(true); }, 300);
  }
  document.addEventListener('pointerdown', down, true);
  document.addEventListener('pointerup', up, true);
  document.addEventListener('pointercancel', up, true);
  window.addEventListener('blur', up);

  /* צופים: הסרגל בלבד (class), ורק החלפה של הסרגל בגוף הדף */
  var navObs = null, t = null;
  function watchNav() {
    var nav = document.getElementById('MultiVendorBottomNav');
    if (!nav || nav.__mhNavObs) { return; }
    nav.__mhNavObs = true;
    try { navObs = new MutationObserver(function (recs) {
      for (var i = 0; i < recs.length; i++) { if (recs[i].target !== lens) { clearTimeout(t); t = setTimeout(function () { sync(true); }, 40); return; } }   /* שינוי בעדשה שלנו לא מפעיל sync */
    }); navObs.observe(nav, { attributes: true, attributeFilter: ['class', 'data'], subtree: true, childList: true }); } catch (e) {}
  }
  try {
    new MutationObserver(function () {
      var nav = document.getElementById('MultiVendorBottomNav');
      if (nav && !nav.__mhNavObs) { watchNav(); sync(false); }
    }).observe(document.body || document.documentElement, { childList: true, subtree: true });
  } catch (e) {}
  window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { curX = null; sync(false); }, 120); });
  watchNav(); sync(false);

  window.MH_NAVGLASS = { version: VERSION, sync: sync, stats: function () { return JSON.parse(JSON.stringify(stats)); } };
  /* mh-navglass-v1 */
})();

/* ============================================================
   אזהרת כתובת משלוח בצ'ק-אאוט — MH AddrWarn  |  v1.1.0 | 2026-10-01 (v1.0.0 באותו יום)
   הבעיה (דוד, 1.10): לכל מבקר חדש המיקום הוא נקודת ברירת המחדל של החנות (getDefaultLocation →
   "הנחלים 61, מעלה אדומים"), ומסך "הוספת כתובת" נפתח על הנקודה הזאת — לקוחות שומרים אותה ומזמינים
   לכתובת הלא נכונה. בנוסף Hyperzod בוחרת לבד את הכתובת השמורה הקרובה למיקום הנוכחי.
   מה עושה: מעל רכיב הכתובת בצ'ק-אאוט (.address-card — כפתור "בחר כתובת" או הכתובת שנבחרה) כרטיס אזהרה:
     א. אין כתובת נבחרת  → "בדקו היטב את כתובת המשלוח" + הנחיה + "משלוח לכתובת לא נכונה עלול להתבטל".
     ב. נבחרה כתובת      → שורה דקה אחת בלבד (הכתובת כבר מוצגת בשורה של Hyperzod מתחת — בלי כפילות).
     ג. הכתובת בטווח 60 מ' מנקודת ברירת המחדל → פס אדום קומפקטי (עד 2 שורות).
     v1.1.0 (דוד, 1.10): ב-v1.0.0 הכרטיס הגביה את הפוטר הצף והסתיר את אמצעי התשלום (אשראי). עכשיו מצבים
     ב/ג מינימליים, וכשהכרטיס בתוך פוטר fixed — לדף נוסף ריפוד תחתון בגובה הכרטיס (html.mh-aw-on +
     --mh-aw-pad על #checkout), כך ששום דבר לא נשאר מתחת לפוטר.
   לחיצה על הכרטיס = לחיצה על רכיב הכתובת של Hyperzod (פותח את רשימת הכתובות). טקסט בלבד: לא משנה מה
   נבחר, לא חוסם הזמנה, לא נוגע במחיר. רק למחובר + סוג הזמנה שדורש כתובת. העיצוב בחלק 53.
   נכשל-פתוח. בדיקה: window.MH_ADDRWARN.stats()
   ============================================================ */
(function () {
  'use strict';
  if (window.__MH_ADDRWARN__) { return; }
  window.__MH_ADDRWARN__ = true;
  var VERSION = '1.1.0', ID = 'mh-addrwarn', RADIUS = 60;
  var stats = { version: VERSION, syncs: 0, renders: 0, state: 'none', pad: 0, errors: 0 };
  var lastKey = '';
  function store() { try { return document.getElementById('app').__vue_app__.config.globalProperties.$store; } catch (e) { return null; } }
  function num(v) { v = parseFloat(v); return isFinite(v) ? v : null; }
  /* [lat, lng] מכל צורה שהכתובת מגיעה בה */
  function coords(a) {
    if (!a || typeof a !== 'object') { return null; }
    var l = a.location, c = l && l.coordinates;
    var cand = [[a.latitude, a.longitude], [a.lat, a.lng], l && [l.latitude, l.longitude], l && [l.lat, l.lng], c && c.length === 2 && [c[1], c[0]]];
    for (var i = 0; i < cand.length; i++) {
      if (!cand[i]) { continue; }
      var la = num(cand[i][0]), ln = num(cand[i][1]);
      if (la !== null && ln !== null && Math.abs(la) <= 90 && Math.abs(ln) <= 180) { return [la, ln]; }
    }
    return null;
  }
  function meters(p, q) {
    var R = 6371000, r = Math.PI / 180, dLa = (q[0] - p[0]) * r, dLn = (q[1] - p[1]) * r;
    var h = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(p[0] * r) * Math.cos(q[0] * r) * Math.sin(dLn / 2) * Math.sin(dLn / 2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
  }
  /* רכיב הכתובת של Hyperzod: העוטף .address-card (לא ה-v-card הפנימי #AddressCard) */
  function anchor() {
    var els = document.querySelectorAll('.address-card');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.id === 'AddressCard' || !el.offsetParent) { continue; }
      if (el.querySelector('.add-address-btn') || el.querySelector('#AddressCard')) { return el; }
    }
    return null;
  }
  function addressRequired(S) {
    try {
      var t = S.getters.getOrderType, list = S.getters.getBootSettings.order_types_tenant || [];
      if (t === 'pick_drop') { return false; }
      for (var i = 0; i < list.length; i++) { if (list[i].order_type === t) { return !!list[i].requires_address; } }
    } catch (e) {}
    return false;
  }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) { e.className = cls; } if (txt) { e.textContent = txt; } return e; }
  /* הכרטיס בתוך פוטר fixed (מובייל) מגביה אותו — מוסיפים לדף ריפוד תחתון בדיוק בגובה הכרטיס */
  function pad(w) {
    var root = document.documentElement, fixed = false, p = w && w.parentElement;
    while (p && p !== document.body) { if (getComputedStyle(p).position === 'fixed') { fixed = true; break; } p = p.parentElement; }
    if (fixed) { root.style.setProperty('--mh-aw-pad', (w.offsetHeight + 8) + 'px'); if (!root.classList.contains('mh-aw-on')) { root.classList.add('mh-aw-on'); } stats.pad = w.offsetHeight + 8; }
    else if (root.classList.contains('mh-aw-on')) { root.classList.remove('mh-aw-on'); stats.pad = 0; }
  }
  function remove() { var w = document.getElementById(ID); if (w) { w.remove(); } pad(null); lastKey = ''; stats.state = 'none'; }
  function render(state, addr, a) {
    var w = document.getElementById(ID);
    if (!w) {
      w = el('div'); w.id = ID; w.setAttribute('role', 'alert');
      w.addEventListener('click', function () {   /* פותח את בחירת הכתובת של Hyperzod */
        try { var r = anchor(); var t = r && (r.querySelector('.add-address-btn') || r.querySelector('#AddressCard .address')); if (t) { t.click(); } } catch (e) {}
      });
    }
    w.className = 'mh-aw mh-aw--' + state;
    w.textContent = '';
    w.appendChild(el('span', 'mh-aw-ico', '!')).setAttribute('aria-hidden', 'true');
    var b = w.appendChild(el('div', 'mh-aw-body'));
    if (state === 'none') {
      b.appendChild(el('strong', 'mh-aw-title', 'בדקו היטב את כתובת המשלוח'));
      b.appendChild(el('span', 'mh-aw-text', 'חפשו ובחרו את הרחוב ומספר הבית המדויקים שלכם. משלוח לכתובת לא נכונה עלול להתבטל.'));
    } else if (state === 'default') {
      b.appendChild(el('strong', 'mh-aw-line', 'זו כתובת ברירת המחדל של האתר!'));
      b.appendChild(el('span', 'mh-aw-line', 'לא גרים שם? החליפו — המשלוח עלול להתבטל'));
    } else {
      b.appendChild(el('span', 'mh-aw-line', 'ודאו שהכתובת נכונה · משלוח לכתובת לא נכונה עלול להתבטל'));
    }
    if (w.nextSibling !== a || w.parentNode !== a.parentNode) { a.parentNode.insertBefore(w, a); }
    pad(w);
    stats.renders++; stats.state = state;
  }
  function sync() {
    try {
      stats.syncs++;
      if (!/\/checkout/.test(location.pathname)) { if (lastKey) { remove(); } return; }
      var S = store(), a = anchor();
      var F = window.MH_ADDRWARN_FAKE || null;   /* בדיקות בלבד (מוק בכרום ללא ראש); באתר לא קיים */
      var G = { loggedIn: F && 'loggedIn' in F ? F.loggedIn : S && S.getters.isLoggedIn, delivery: F && 'delivery' in F ? F.delivery : S && S.getters.getDeliveryAddress, def: F && 'def' in F ? F.def : S && S.getters.getDefaultLocation };
      if (!S || !a || !G.loggedIn || !addressRequired(S)) { if (lastKey) { remove(); } return; }
      var d = a.querySelector('.add-address-btn') ? null : G.delivery;
      var state = 'none', addr = '';
      if (d) {
        addr = String(d.address || '').trim() || 'הכתובת שנבחרה';
        state = 'set';
        var def = G.def, dl = def && def.enabled !== false && def.default_location, p = coords(d);
        if (dl && p && meters(p, [num(dl.lat), num(dl.lng)]) <= RADIUS) { state = 'default'; }
      }
      var key = state + '|' + addr;
      var w = document.getElementById(ID);
      if (key === lastKey && w && w.nextSibling === a) { return; }
      lastKey = key; render(state, addr, a);
    } catch (e) { stats.errors++; }
  }
  var pending = null;
  function schedule() { if (pending) { return; } pending = setTimeout(function () { pending = null; sync(); }, 150); }
  try {
    new MutationObserver(function (recs) {
      for (var i = 0; i < recs.length; i++) { var t = recs[i].target; if (t && t.id !== ID && !(t.closest && t.closest('#' + ID))) { schedule(); return; } }
    }).observe(document.body || document.documentElement, { childList: true, subtree: true });
    var hook = setInterval(function () {   /* מנוי ל-Vuex כשהוא מוכן: שינוי כתובת/סוג הזמנה/התחברות */
      var S = store(); if (!S || typeof S.subscribe !== 'function') { return; }
      clearInterval(hook);
      S.subscribe(function (m) { if (/address|ordertype|login|logged|location/i.test(m.type || '')) { schedule(); } });
    }, 500);
    setTimeout(function () { clearInterval(hook); }, 30000);
  } catch (e) { stats.errors++; }
  schedule();
  window.MH_ADDRWARN = { version: VERSION, sync: sync, stats: function () { return JSON.parse(JSON.stringify(stats)); } };
  /* mh-addrwarn-v1 */
})();

/* =========================================================================
   פרחי דליה — MH Dalia  |  v1.2.0 | 2026-10-08 (v1.0.0, v1.0.1: "טוב לדעת" עבר לסקשן; v1.1.0: שבת; v1.2.0: גם שישי אחרי 16:00)
   -------------------------------------------------------------------------
   רק לעסק שבמערך MERCHANTS (פרחי דליה). שלושה חלקים, כל אחד נכשל-פתוח בנפרד:

   1. חסימת מועדים — לפי שעון ישראל תמיד (Intl, Asia/Jerusalem), לא לפי אזור הזמן של המכשיר.
      ההגדרות ב-Hyperzod (הזמנות מתוזמנות בלבד, שעה מראש, 7 ימים, חלונות של שעה, א'–ה' 08–22,
      שישי 08–16, שבת סגור) נשארות; הבלוק מוסיף מעליהן:
        א'–ה' — 3.5 שעות מראש לפחות. לאותו יום: רק בהזמנה עד 15:00, ורק לחלון ערב.
                 למחר בבוקר: רק בהזמנה עד 15:00 היום (גם משבת לראשון, גם מחמישי לשישי).
                 למחר בערב: בכל שעה.
        שישי   — מהיום להיום: רק בהזמנה עד 13:00, שעה מראש לפחות, עד 16:00.
                 לשישי מיום קודם: כמו הכללים הרגילים.
        "ערב" = חלון שמתחיל ב-15:00 ואילך (CFG.EVENING). "עד 15:00" כולל את 15:00:00 עצמה (אישור דוד 7.10).
        שבת (v1.1.0, דוד 7.10; v1.2.0, דוד 8.10 — גם שישי אחרי 16:00): משישי 16:00:01 ועד סוף שבת (23:59,
                 שעון ישראל) אי אפשר להזמין בכלל — לשום מועד; ההזמנות נפתחות ביום ראשון 00:00. בזמן הזה הרשימה
                 ריקה, בצ'ק-אאוט מופיעה הודעה, ולחיצה על כפתור ההזמנה מציגה אותה במקום לעשות כלום.
                 "אחרי 16:00" — 16:00:00 עצמה עוד מותרת, כמו "עד 15:00" (CFG.FRI_CLOSE).
      שכבת רשת (שכבת הכסף): POST /store/v1/order של העסק עם מועד אסור / בלי מועד
        (is_scheduled:false) — נחסם לפני השליחה + טוסט אדום + המועד מתנקה. בלי השדה
        scheduling_slot בכלל (מבנה לא מזוהה) — עובר, כמו ב-MH Preorder.
      שכבת תצוגה: התשובה של GET /order/getSchedulingSlots מסוננת לפני ש-Hyperzod קוראת אותה
        (שני רכיבים קוראים אותה — Vuex וגם עותק מקומי — ולכן מסננים ברשת ולא ב-store).
        בנוסף, כל 30 שניות ובכל לחיצה על "לוח זמנים" (.schedule-switch) או בתוך הבורר: הרשימות הפתוחות מסוננות מחדש
        במקום (הזמן זז — חלון של 15:00 מותר ב-11:30 ואסור ב-11:31), ומועד שנבחר והפך לאסור מתנקה.
   2. (הוסר 7.10: כרטיס "טוב לדעת" — הופיע באיחור כי נוצר ב-JS אחרי הטעינה; עכשיו זה סקשן Custom HTML
      שדוד מדביק בדף העסק, #mh-dalia-tips, והעיצוב בתוכו.)
   3. "החל מ-" לפני המחיר בכרטיס של מוצר עם קבוצת "גודל" שהיא חובה ושהמחיר בה משתנה
      (קבוצה עם גודל אחד / אותו מחיר לכל הגדלים — בלי "החל מ-"). הנתונים: catalog/products/listByIds
      דרך הלקוח של Hyperzod (apiRequest של רכיב דף העסק, MH_MENULOAD.findComp), פעם אחת לכל מוצר בסשן.

   בדיקה: MH_DALIA.stats() · MH_DALIA.verdict(ms, 'YYYY-MM-DD', 'HH:MM', 'HH:MM')
   שעון מדומה לבדיקות: window.__MH_NOW__ = <ms>  (גם MH SchedUI קורא אותו)
   ========================================================================= */
(function () {
  'use strict';
  if (window.__MH_DALIA__) { return; }
  window.__MH_DALIA__ = true;

  var CFG = {
    VERSION: '1.2.0',
    MERCHANTS: ['6ac61fa523f1f833040171d2'],   /* פרחי דליה */
    TZ: 'Asia/Jerusalem',
    EVENING: 15 * 60,      /* "ערב" = חלון שמתחיל ב-15:00 ואילך — לשנות כאן */
    CUTOFF: 15 * 60,       /* א'–ה' (ושבת → ראשון בבוקר): הזמנה עד 15:00 */
    LEAD: 210,             /* א'–ה': 3.5 שעות מראש (בדקות) */
    FRI_CUTOFF: 13 * 60,   /* שישי מהיום להיום: הזמנה עד 13:00 */
    FRI_LEAD: 60,          /* שישי: שעה מראש */
    FRI_END: 16 * 60,      /* שישי: עד 16:00 */
    FRI_CLOSE: 16 * 60,    /* שישי אחרי 16:00 ועד סוף שבת: אי אפשר להזמין בכלל (דוד 8.10) */
    SIZE: 'גודל'
  };
  var WHY = {
    bad: 'המועד לא מזוהה',
    shabbat: 'משישי ב-16:00 לא מקבלים הזמנות — אפשר להזמין שוב ביום ראשון',
    sat: 'בשבת אין משלוחים',
    past: 'המועד כבר עבר',
    friEnd: 'בשישי המשלוחים עד 16:00',
    friCutoff: 'משלוח לשישי של היום אפשר להזמין עד 13:00',
    friLead: 'בשישי צריך להזמין לפחות שעה לפני חלון המשלוח',
    cutoff: 'משלוח לאותו יום אפשר להזמין עד 15:00',
    morning: 'משלוח לאותו יום — רק לחלונות הערב (מ-15:00)',
    tomorrowMorning: 'משלוח למחר בבוקר אפשר להזמין עד 15:00 היום',
    lead: 'צריך להזמין לפחות 3.5 שעות לפני חלון המשלוח',
    none: 'יש לבחור מועד למשלוח'
  };
  var S = { version: CFG.VERSION, slotsFiltered: 0, slotsRemoved: 0, ordersSeen: 0, ordersBlocked: 0, refreshes: 0,
            cleared: 0, fromMarked: 0, fromFetches: 0, errors: 0, last: null };
  function warn() { try { console.warn.apply(console, ['[MH Dalia]'].concat([].slice.call(arguments))); } catch (e) {} }
  function ours(mid) { return !!mid && CFG.MERCHANTS.indexOf(String(mid)) !== -1; }
  function store() {
    try { return document.getElementById('app').__vue_app__.config.globalProperties.$store; } catch (e) { return null; }
  }
  function nowMs() { return typeof window.__MH_NOW__ === 'number' ? window.__MH_NOW__ : Date.now(); }

  /* ---------- 1א. הכללים ---------- */

  var FMT = null, lastMs = NaN, lastWall = null;
  /* שעון ישראל: יום (מספר ימים מ-1970) + דקות מתחילת היום (עם שברי שניות) */
  function wall(ms) {
    if (ms === lastMs) { return lastWall; }          /* סינון רשימה = אותו "עכשיו" לכל החלונות */
    lastMs = ms; lastWall = wall0(ms);
    return lastWall;
  }
  function wall0(ms) {
    if (!FMT) {
      FMT = new Intl.DateTimeFormat('en-US', { timeZone: CFG.TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    var p = {}, a = FMT.formatToParts(new Date(ms));
    for (var i = 0; i < a.length; i++) { p[a[i].type] = a[i].value; }
    return { day: Date.UTC(+p.year, +p.month - 1, +p.day) / 864e5, min: (+p.hour % 24) * 60 + (+p.minute) + (+p.second) / 60 };
  }
  function hm(s) {
    var m = /^\s*(\d{1,2}):(\d{2})/.exec(String(s || ''));
    return m ? (+m[1]) * 60 + (+m[2]) : -1;
  }
  function no(k) { return { ok: false, why: k }; }
  var YES = { ok: true, why: '' };

  /* מותר להזמין עכשיו (ms) לחלון from–to בתאריך date (שעון ישראל, כפי ש-Hyperzod שולחת)? */
  /* "שבת" לעניין הזמנות = שישי אחרי 16:00 + כל השבת (שעון ישראל) */
  function isShabbat(now) { var w = wall(now), dow = (w.day + 4) % 7; return dow === 6 || (dow === 5 && w.min > CFG.FRI_CLOSE); }
  function verdict(now, date, from, to) {
    if (isShabbat(now)) { return no('shabbat'); }          /* קודם לכל — גם מועד לא מזוהה לא עובר בשבת */
    var dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(date || ''));
    var st = hm(from), en = hm(to);
    if (!dm || st < 0 || en < 0) { return no('bad'); }
    var day = Date.UTC(+dm[1], +dm[2] - 1, +dm[3]) / 864e5;
    var w = wall(now), delta = day - w.day, dow = (day + 4) % 7;     /* 1.1.1970 = חמישי; 0 = ראשון */
    /* ponytail: דקות של שעון קיר, לא זמן שעבר. נבדלות רק בליל מעבר שעון (01:00–02:00), ואין אז חלונות */
    var lead = delta * 1440 + st - w.min;
    if (dow === 6) { return no('sat'); }
    if (delta < 0 || lead <= 0) { return no('past'); }
    if (dow === 5) {
      if (en > CFG.FRI_END) { return no('friEnd'); }
      if (delta === 0) {
        if (w.min > CFG.FRI_CUTOFF) { return no('friCutoff'); }
        return lead >= CFG.FRI_LEAD ? YES : no('friLead');
      }
    } else if (delta === 0) {
      if (w.min > CFG.CUTOFF) { return no('cutoff'); }
      if (st < CFG.EVENING) { return no('morning'); }
    }
    if (delta === 1 && st < CFG.EVENING && w.min > CFG.CUTOFF) { return no('tomorrowMorning'); }
    return lead >= CFG.LEAD ? YES : no('lead');
  }
  /* "08:00 - 09:00" (הפורמט של Hyperzod: from + " - " + to) */
  function verdictTime(now, date, time) {
    if (isShabbat(now)) { return no('shabbat'); }
    var m = /^\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*$/.exec(String(time || ''));
    return m ? verdict(now, date, m[1], m[2]) : no('bad');
  }

  /* ---------- 1ב. סינון רשימת המועדים ---------- */

  /* מחזיר עותק מסונן של available_slots: [{date, slots:[[{from,to}]]}] — ימים ריקים יוצאים */
  function filterDays(days, now) {
    var out = [];
    for (var i = 0; i < days.length; i++) {
      var d = days[i];
      if (!d || !Array.isArray(d.slots)) { out.push(d); continue; }
      var groups = [], n = 0;
      for (var g = 0; g < d.slots.length; g++) {
        var grp = Array.isArray(d.slots[g]) ? d.slots[g] : [d.slots[g]], keep = [];
        for (var j = 0; j < grp.length; j++) {
          if (grp[j] && verdict(now, d.date, grp[j].from, grp[j].to).ok) { keep.push(grp[j]); } else { S.slotsRemoved++; }
        }
        if (keep.length) { groups.push(keep); n += keep.length; }
      }
      if (n) { var c = {}; for (var k in d) { if (Object.prototype.hasOwnProperty.call(d, k)) { c[k] = d[k]; } } c.slots = groups; out.push(c); }
    }
    return out;
  }
  function filterJson(j) {
    if (!j || !j.data || !Array.isArray(j.data.available_slots)) { return false; }
    j.data.available_slots = filterDays(j.data.available_slots, nowMs());
    S.slotsFiltered++;
    return true;
  }
  /* אותו סינון במקום, על מערכים ריאקטיביים שכבר אצל Vue (רשימה פתוחה שהזמן עבר עליה) */
  function pruneDays(days, now) {
    var removed = 0;
    for (var i = days.length - 1; i >= 0; i--) {
      var d = days[i]; if (!d || !Array.isArray(d.slots)) { continue; }
      var n = 0;
      for (var g = 0; g < d.slots.length; g++) {
        var grp = d.slots[g]; if (!Array.isArray(grp)) { continue; }
        for (var j = grp.length - 1; j >= 0; j--) {
          if (!grp[j] || !verdict(now, d.date, grp[j].from, grp[j].to).ok) { grp.splice(j, 1); removed++; }
        }
        n += grp.length;
      }
      if (!n) { days.splice(i, 1); }
    }
    return removed;
  }

  /* ---------- 1ג. שכבת רשת ---------- */

  var IS_ORDER = /\/store\/v1\/order(\?|$)/;
  var IS_SLOTS = /\/store\/v1\/order\/getSchedulingSlots(\?|$)/;
  function midOf(u) { var m = /[?&]merchant_id=([0-9a-fA-F]{16,})/.exec(String(u || '')); return m ? m[1] : null; }
  var CLEAR = { is_scheduled: false, date: '0000-00-00', time: '00:00' };
  function toast(msg) {
    var st = store();
    try { if (st) { st.commit('setToast', { message: msg, color: 'red', show: true }); } } catch (e) {}
  }

  /* true = מותר לשלוח */
  function guardOrder(body) {
    if (typeof body !== 'string') { return true; }
    var o; try { o = JSON.parse(body); } catch (e) { return true; }
    if (!o || !ours(o.merchant_id)) { return true; }
    S.ordersSeen++;
    if (!Object.prototype.hasOwnProperty.call(o, 'scheduling_slot')) { warn('הזמנה בלי scheduling_slot — מבנה לא מזוהה, עוברת'); return true; }
    var s = o.scheduling_slot || {};
    var now = nowMs();
    var v = isShabbat(now) ? no('shabbat') : (s.is_scheduled === true ? verdictTime(now, s.date, s.time) : no('none'));
    S.last = { date: s.date, time: s.time, ok: v.ok, why: v.why };
    if (v.ok) { return true; }
    if (v.why === 'bad') { warn('פורמט מועד לא מזוהה — עוברת:', s.date, s.time); return true; }
    S.ordersBlocked++;
    warn('🛑 הזמנה נחסמה:', s.date, s.time, v.why);
    var msg = v.why === 'none' ? 'יש לבחור מועד למשלוח — פרחי דליה מקבלים הזמנות מתוזמנות בלבד.'
      : v.why === 'shabbat' ? WHY.shabbat + '.'
      : 'המועד שבחרת לא זמין: ' + WHY[v.why] + '. בחרו מועד אחר.';
    setTimeout(function () {
      var st = store();
      try { if (st) { st.commit('setOrderSchedule', { is_scheduled: CLEAR.is_scheduled, date: CLEAR.date, time: CLEAR.time }); } } catch (e) {}
      toast(msg); refresh();
    }, 300);
    return false;
  }

  /* XHR (axios של Hyperzod). הבלוק נטען אחרון — העטיפה שלו חיצונית ורצה ראשונה. */
  try {
    var XP = XMLHttpRequest.prototype, _o = XP.open, _s = XP.send;
    var RT = Object.getOwnPropertyDescriptor(XP, 'responseText'), RS = Object.getOwnPropertyDescriptor(XP, 'response');
    XP.open = function (m, url) {
      var x = this;
      try {
        var M = String(m).toUpperCase(), u = String(url || '');
        x.__mhDaliaOrder = M === 'POST' && IS_ORDER.test(u);
        if (M === 'GET' && IS_SLOTS.test(u) && ours(midOf(u)) && RT && RS) {
          /* readystatechange נרשם כאן, לפני ש-axios מציב onloadend — ולכן רץ לפניו */
          x.addEventListener('readystatechange', function () {
            if (x.readyState !== 4 || x.status !== 200) { return; }
            try {
              var json = x.responseType === 'json', j = json ? RS.get.call(x) : JSON.parse(RT.get.call(x));
              if (!filterJson(j)) { return; }
              var txt = JSON.stringify(j);
              Object.defineProperty(x, 'responseText', { configurable: true, get: function () { return txt; } });
              Object.defineProperty(x, 'response', { configurable: true, get: function () { return json ? j : txt; } });
            } catch (e) { S.errors++; warn('slots', e); }
          });
        }
      } catch (e) { S.errors++; }
      return _o.apply(this, arguments);
    };
    XP.send = function (b) {
      if (this.__mhDaliaOrder) {
        var ok = true;
        try { ok = guardOrder(b); } catch (e) { S.errors++; warn('send', e); ok = true; }
        if (!ok) { throw new Error('MH Dalia: המועד שנבחר לא זמין'); }
      }
      return _s.apply(this, arguments);
    };
  } catch (e) { warn('xhr hook', e); }
  try {
    var _f = window.fetch;
    if (typeof _f === 'function') {
      window.fetch = function (input, init) {
        try {
          var u = typeof input === 'string' ? input : ((input && input.url) || '');
          var M = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();
          if (M === 'POST' && IS_ORDER.test(u) && init && typeof init.body === 'string' && !guardOrder(init.body)) {
            return Promise.reject(new Error('MH Dalia: המועד שנבחר לא זמין'));
          }
          if (M === 'GET' && IS_SLOTS.test(u) && ours(midOf(u))) {
            return _f.apply(this, arguments).then(function (res) {
              return res.clone().json().then(function (j) {
                if (!filterJson(j)) { return res; }
                return new Response(JSON.stringify(j), { status: res.status, statusText: res.statusText, headers: res.headers });
              }).catch(function () { return res; });
            });
          }
        } catch (e) { S.errors++; warn('fetch', e); }
        return _f.apply(this, arguments);
      };
    }
  } catch (e) { warn('fetch hook', e); }

  /* ---------- 1ד. רענון רשימות פתוחות + מועד שנבחר ---------- */

  /* כל הרכיבים שמחזיקים scheduling (ב-production אין __vueParentComponent — הולכים מ-#app._vnode) */
  function schedComps() {
    var el = document.getElementById('app'), out = [];
    if (!el || !el._vnode) { return out; }
    function inst(c, d) {
      if (!c || d > 80) { return; }
      try { var p = c.proxy; if (p && p.scheduling && Array.isArray(p.scheduling.available_slots)) { out.push(p); } } catch (e) {}
      node(c.subTree, d + 1);
    }
    function node(v, d) {
      if (!v || d > 300) { return; }
      if (v.component) { inst(v.component, d + 1); }
      if (v.suspense && v.suspense.activeBranch) { node(v.suspense.activeBranch, d + 1); }
      if (Array.isArray(v.children)) { for (var i = 0; i < v.children.length; i++) { node(v.children[i], d + 1); } }
    }
    node(el._vnode, 0);
    return out;
  }
  function refresh() {
    var st = store(); if (!st) { return; }
    try {
      var cm = st.getters.getCartMerchant;
      if (!cm || !ours(cm.merchant_id || cm._id)) { return; }
      S.refreshes++;
      var now = nowMs(), sch = st.getters.getScheduling;
      if (sch && Array.isArray(sch.available_slots)) { pruneDays(sch.available_slots, now); }
      var cs = schedComps();
      for (var i = 0; i < cs.length; i++) {
        var p = cs[i], days = p.scheduling.available_slots;
        pruneDays(days, now);
        if (p.date && Array.isArray(p.timeSlots)) {
          for (var j = p.timeSlots.length - 1; j >= 0; j--) {
            var t = p.timeSlots[j];
            if (!t || !verdict(now, p.date, t.from, t.to).ok) { p.timeSlots.splice(j, 1); }
          }
        }
        if (p.time && p.date && !verdictTime(now, p.date, p.time).ok) { p.time = null; }
        if (p.date) {
          var has = false;
          for (var k = 0; k < days.length; k++) { if (days[k] && days[k].date === p.date) { has = true; break; } }
          if (!has) {
            if (days.length && typeof p.selectDate === 'function') { p.selectDate(days[0], true); }
            else { p.date = null; p.timeSlots = null; p.time = null; }
          }
        }
      }
      var os = st.getters.getOrderSchedule;
      if (os && os.is_scheduled) {
        var v = verdictTime(now, os.date, os.time);
        if (!v.ok && v.why !== 'bad') {
          S.cleared++;
          st.commit('setOrderSchedule', { is_scheduled: CLEAR.is_scheduled, date: CLEAR.date, time: CLEAR.time });
          toast(v.why === 'shabbat' ? WHY.shabbat + '.' : 'המועד שבחרת כבר לא זמין: ' + WHY[v.why] + '. בחרו מועד אחר.');
        }
      }
    } catch (e) { S.errors++; warn('refresh', e); }
  }
  try {
    setInterval(refresh, 30000);
    /* לפני ש-Hyperzod פותחת את הבורר (capture רץ לפני ה-handler של Vue) */
    document.addEventListener('click', function (e) {
      try {
        /* השורה "לוח זמנים" (.navigation-item עם .schedule-switch; #OrderScheduling בבילדים קודמים)
           או בתוך הבורר הפתוח (גיליון עם .date-btn; #TimeSlotSlider / #slTimeSlotSlider לפי הבילד) */
        var t = e.target; if (!t || !t.closest) { return; }
        var ni = t.closest('.navigation-item'), ov = t.closest('.v-overlay--active');
        if (t.closest('#OrderScheduling, .schedule-switch') || (ni && ni.querySelector('.schedule-switch')) ||
            (ov && ov.querySelector('.date-btn, [id$="TimeSlotSlider"]'))) { refresh(); }
      } catch (err) {}
    }, true);
  } catch (e) { warn('refresh hooks', e); }

  /* ---------- 1ה. שבת בצ'ק-אאוט: הודעה, הטוסט של Hyperzod, כפתור ההזמנה ---------- */

  var SHABBAT_ID = 'mh-dalia-shabbat';
  var CANDLE = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2c1.2 1.6 2 2.9 2 4a2 2 0 0 1-4 0c0-1.1.8-2.4 2-4zM10.5 9.5h3a1 1 0 0 1 1 1V20h-5v-9.5a1 1 0 0 1 1-1zM6 21h12v1.5H6z"/></svg>';
  function cartOurs() {
    var st = store();
    try { var cm = st && st.getters.getCartMerchant; return !!(cm && ours(cm.merchant_id || cm._id)); } catch (e) { return false; }
  }
  function shabbatNow() { return isShabbat(nowMs()) && cartOurs(); }
  /* הודעה בראש הצ'ק-אאוט (בשבת הרשימה ריקה ו-Hyperzod מסתירה את כרטיס המועד — בלי זה הלקוח לא מבין למה) */
  function shabbatNotice() {
    var el = document.getElementById(SHABBAT_ID);
    var cart = document.getElementById('CartCard'), col = cart && cart.parentElement;
    if (!col || !document.getElementById('checkout') || !shabbatNow()) { if (el) { el.remove(); } return; }
    if (el && el.parentElement === col && col.firstElementChild === el) { return; }
    if (!el) {
      el = document.createElement('div');
      el.id = SHABBAT_ID;
      el.setAttribute('role', 'status');
      el.innerHTML = '<span class="mh-ds-ico">' + CANDLE + '</span><span class="mh-ds-txt"><b>שבת שלום</b>' +
        'משישי ב-16:00 פרחי דליה לא מקבלים הזמנות. אפשר להזמין שוב ביום ראשון — העגלה נשמרת.</span>';
    }
    col.insertBefore(el, col.firstChild);
  }
  /* "No slots available" של Hyperzod (בשבת: לחיצה על בחירת מועד) → הודעת השבת. רץ ישר מה-MutationObserver,
     לפני הציור. הבלוק נטען לפני MH SchedUI, שמתרגם את אותו טוסט באופן כללי. */
  function shabbatToast() {
    if (!document.querySelector('.v-snackbar') || !shabbatNow()) { return; }
    var bars = document.querySelectorAll('.v-snackbar');
    for (var i = 0; i < bars.length; i++) {
      var w = document.createTreeWalker(bars[i], NodeFilter.SHOW_TEXT, null), n;
      while ((n = w.nextNode())) { if (n.nodeValue.trim() === 'No slots available') { n.nodeValue = WHY.shabbat; } }
    }
  }
  try {
    /* בשבת כפתור ההזמנה (נייד: בפוטר .place-order; מחשב: #OrderPlaceButton בכרטיס הסיכום) מציג את ההודעה */
    document.addEventListener('click', function (e) {
      try {
        var t = e.target, btn = t && t.closest && t.closest('#OrderPlaceButton, .place-order button');
        if (!btn || !shabbatNow()) { return; }
        e.preventDefault(); e.stopImmediatePropagation();
        toast(WHY.shabbat + '.');
        var n = document.getElementById(SHABBAT_ID);
        if (n && n.scrollIntoView) { n.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      } catch (err) {}
    }, true);
  } catch (e) { warn('shabbat click', e); }

  /* ---------- 3. דף העסק: "החל מ-" ---------- */

  function pageMid() {
    var m = /\/m\/[^/]+\/([0-9a-fA-F]{16,})/.exec(location.pathname);
    return m && ours(m[1]) ? m[1] : null;
  }
  var FROM = {};          /* product_id → true ("החל מ-") / false; נבדק פעם אחת בסשן */
  var LS = 'mh_dalia_from';
  try { FROM = JSON.parse(sessionStorage.getItem(LS) || '{}') || {}; } catch (e) { FROM = {}; }
  var asking = false, tries = 0;   /* ponytail: עד 3 בקשות לסשן — רשת שנופלת לא תגרום לסערת בקשות בכל שינוי DOM */
  /* קבוצת "גודל" שהיא חובה, ושהמחיר בה משתנה. ponytail: גודל שהזול בו בתוספת מחיר (>0) — בלי "החל מ-",
     כי המספר בכרטיס (מחיר הבסיס) לא היה נכון; היום אין כזה (41 מוצרים, כולם מ-+₪0). */
  function isFrom(p) {
    var gs = (p && p.product_options) || [];
    for (var i = 0; i < gs.length; i++) {
      var g = gs[i]; if (!g || !g.is_required || String(g.option_name || '').trim() !== CFG.SIZE) { continue; }
      var prices = [], o = g.options || [];
      for (var j = 0; j < o.length; j++) { if (o[j] && o[j].status !== false) { prices.push(+o[j].price_sell || 0); } }
      if (prices.length < 2) { continue; }
      var mn = Math.min.apply(null, prices), mx = Math.max.apply(null, prices);
      if (mx > mn && mn === 0) { return true; }
    }
    return false;
  }
  function askFrom(mid, ids) {
    if (asking || !ids.length || tries >= 3) { return; }
    var comp = window.MH_MENULOAD && typeof window.MH_MENULOAD.findComp === 'function' ? window.MH_MENULOAD.findComp() : null;
    if (!comp || typeof comp.apiRequest !== 'function') { return; }
    asking = true; tries++; S.fromFetches++;
    var req;
    try { req = comp.apiRequest('Catalog', 'getProductsByIds', { ids: ids.slice(0, 120), merchant_id: mid }); } catch (e) { asking = false; return; }
    Promise.resolve(req).then(function (r) {
      var list = (r && r.data && r.data.success && Array.isArray(r.data.data)) ? r.data.data : null;
      if (!list) { return; }
      for (var i = 0; i < ids.length; i++) { FROM[ids[i]] = false; }
      for (var k = 0; k < list.length; k++) { var p = list[k], id = p && (p._id || p.id || p.product_id); if (id) { FROM[String(id)] = isFrom(p); } }
      try { sessionStorage.setItem(LS, JSON.stringify(FROM)); } catch (e) {}
    }).catch(function () {}).then(function () { asking = false; schedule(); });
  }
  function fromPrice(mid) {
    /* כרטיס רגיל (גריד) וכרטיס קרוסלה (.product-card-slider — למשל "מארזים עם אלכוהול"); לשניהם id = מזהה המוצר */
    var cards = document.querySelectorAll('.merchant-page .product-card-basic[id], .merchant-page .product-card-slider[id]'), need = [];
    for (var i = 0; i < cards.length; i++) {
      var id = cards[i].id, h = cards[i].querySelector('h4.product-price');
      if (!h) { continue; }
      if (!(id in FROM)) { need.push(id); continue; }
      if (FROM[id] && !h.hasAttribute('data-mh-from')) { h.setAttribute('data-mh-from', ''); S.fromMarked++; }
      if (!FROM[id] && h.hasAttribute('data-mh-from')) { h.removeAttribute('data-mh-from'); }
    }
    if (need.length) { askFrom(mid, need); }
  }
  function sync() {
    try { shabbatNotice(); } catch (e) { S.errors++; warn('shabbat', e); }
    var mid = pageMid();
    if (!mid) { return; }
    try { fromPrice(mid); } catch (e) { S.errors++; warn('from', e); }
  }
  var pending = false;
  function schedule() {
    if (pending) { return; }
    pending = true;
    setTimeout(function () { pending = false; try { sync(); } catch (e) { S.errors++; } }, 200);
  }
  try {
    new MutationObserver(function (muts) {
      try { shabbatToast(); } catch (e) {}          /* גם על שינוי טקסט בלבד (טוסט קיים שמתעדכן) */
      for (var i = 0; i < muts.length; i++) { if (muts[i].addedNodes && muts[i].addedNodes.length) { schedule(); return; } }
    }).observe(document.documentElement, { subtree: true, childList: true, characterData: true });
    window.addEventListener('load', schedule);
    schedule();
  } catch (e) { warn('page hooks', e); }

  window.MH_DALIA = {
    version: CFG.VERSION,
    verdict: verdict, verdictTime: verdictTime, filterDays: filterDays, refresh: refresh, sync: sync, isShabbat: isShabbat,
    why: function (k) { return WHY[k] || ''; },
    stats: function () { return JSON.parse(JSON.stringify(S)); }
  };
  /* mh-dalia-v1 */
})();

/* =========================================================================
   בורר מועד המשלוח (כל עסק עם תזמון) — MH SchedUI  |  v1.0.0 | 2026-10-07
   -------------------------------------------------------------------------
   העיצוב ב-"חלק 56" ב-global-cdn.css; כאן רק מה שחייב JS:
     1. טקסטים ברורים — החלפת טקסט מדויק בלבד (לא הכלה), רק בבורר ובכרטיס המועד:
        "בחר תאריך"→"מתי לשלוח?", "בחר תאריך עבור תזמון ההזמנה"→"בוחרים יום, ואז חלון זמן",
        "בחר חלון זמן"→"חלון זמן", "המשך"→"אישור המועד"; בצ'ק-אאוט הכרטיס עם .schedule-switch
        נקרא "סוג הזמנה" (כמו הכרטיס שמעליו) → "מועד המשלוח", והשורה "לוח זמנים" → "בחירת יום ושעה".
     2. "היום" / "מחר" במקום שם היום בשני הימים הראשונים (data-mh-day על שורת שם היום; ה-CSS מציג).
        היום לפי שעון ישראל, כמו ש-Hyperzod מחשבת את הימים (שעון העסק).
     3. הטוסט "No slots available" (באנגלית, קשיח בקוד של Hyperzod) → עברית.
   רץ ישר מה-MutationObserver (לפני הציור — בלי הבהוב של הטקסט הישן). נכשל-פתוח.
   בדיקה: MH_SCHEDUI.stats() · שעון מדומה: window.__MH_NOW__
   ========================================================================= */
(function () {
  'use strict';
  if (window.__MH_SCHEDUI__) { return; }
  window.__MH_SCHEDUI__ = true;
  var VERSION = '1.0.0';
  var PICKER = {
    'בחר תאריך': 'מתי לשלוח?',
    'בחר תאריך עבור תזמון ההזמנה': 'בוחרים יום, ואז חלון זמן',
    'בחר חלון זמן': 'חלון זמן',
    'המשך': 'אישור המועד'
  };
  var CARD = { 'סוג הזמנה': 'מועד המשלוח', 'לוח זמנים': 'בחירת יום ושעה' };
  var TOAST = { 'No slots available': 'אין כרגע מועדים פנויים למשלוח' };
  var stats = { version: VERSION, texts: 0, days: 0, toasts: 0, runs: 0, errors: 0 };
  /* מחליף רק את צומת הטקסט היחיד (הערות-עוגן של Vue נשארות); אלמנט עם ילדים אחרים — לא נוגעים */
  function setText(el, he) {
    var t = null, n = 0;
    for (var c = el.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 3 && c.nodeValue.trim()) { t = c; n++; } else if (c.nodeType === 1) { return false; }
    }
    if (n !== 1) { return false; }
    t.nodeValue = he;
    return true;
  }
  function swap(root, sel, map) {
    var els = root.querySelectorAll(sel);
    for (var i = 0; i < els.length; i++) {
      var k = (els[i].textContent || '').trim();
      if (Object.prototype.hasOwnProperty.call(map, k) && setText(els[i], map[k])) { stats.texts++; }
    }
  }
  function nowMs() { return typeof window.__MH_NOW__ === 'number' ? window.__MH_NOW__ : Date.now(); }
  var FMT = null;
  function ilDay(ms) {
    if (!FMT) { FMT = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Jerusalem', year: 'numeric', month: 'numeric', day: 'numeric' }); }
    var p = {}, a = FMT.formatToParts(new Date(ms));
    for (var i = 0; i < a.length; i++) { p[a[i].type] = a[i].value; }
    return Date.UTC(+p.year, +p.month - 1, +p.day);
  }
  /* שני הימים הראשונים בלבד יכולים להיות "היום"/"מחר"; ההשוואה לפי מספר היום בחודש
     (רשימה של 7 ימים לא חוזרת על מספר) */
  function dayLabels(ov) {
    var t = ilDay(nowMs()), today = new Date(t).getUTCDate(), tomorrow = new Date(t + 864e5).getUTCDate();
    var btns = ov.querySelectorAll('.date-btn');
    for (var i = 0; i < btns.length; i++) {
      var num = btns[i].querySelector('.tw-text-lg'), wd = btns[i].querySelector('.line-clamp-1');
      if (!num || !wd) { continue; }
      var n = parseInt(num.textContent, 10);
      var lab = i < 2 && n === today ? 'היום' : (i < 2 && n === tomorrow ? 'מחר' : '');
      if (lab) { if (wd.getAttribute('data-mh-day') !== lab) { wd.setAttribute('data-mh-day', lab); stats.days++; } }
      else if (wd.hasAttribute('data-mh-day')) { wd.removeAttribute('data-mh-day'); }
    }
  }
  function toasts() {
    var bars = document.querySelectorAll('.v-snackbar');
    for (var i = 0; i < bars.length; i++) {
      var w = document.createTreeWalker(bars[i], NodeFilter.SHOW_TEXT, null), n;
      while ((n = w.nextNode())) {
        var k = n.nodeValue.trim();
        if (Object.prototype.hasOwnProperty.call(TOAST, k)) { n.nodeValue = TOAST[k]; stats.toasts++; }
      }
    }
  }
  function sync() {
    stats.runs++;
    try {
      var ovs = document.querySelectorAll('.v-overlay--active');
      for (var i = 0; i < ovs.length; i++) {
        if (!ovs[i].querySelector('.date-btn')) { continue; }
        swap(ovs[i], '.v-card-title > div:first-child, .v-card-title.text-h6, .v-card-subtitle, .v-card-actions .v-btn__content', PICKER);
        dayLabels(ovs[i]);
      }
      var sw = document.querySelectorAll('.schedule-switch');
      for (var j = 0; j < sw.length; j++) {
        var item = sw[j].closest('.navigation-item'), list = item && item.closest('.navigation-list'), card = list && list.parentElement;
        if (!card) { continue; }
        for (var c = card.firstElementChild; c; c = c.nextElementSibling) {
          if (c.tagName === 'H2') { var k = (c.textContent || '').trim(); if (CARD[k] && k === 'סוג הזמנה' && setText(c, CARD[k])) { stats.texts++; } }
        }
        swap(item, '.v-list-item-title', CARD);
      }
      if (document.querySelector('.v-snackbar')) { toasts(); }
    } catch (e) { stats.errors++; }
  }
  try {
    /* characterData: Vue מעדכן טקסט קיים (טוסט שכבר על המסך, יום שנבחר) בלי להוסיף צמתים */
    new MutationObserver(function () { sync(); })
      .observe(document.documentElement, { subtree: true, childList: true, characterData: true });
    sync();
  } catch (e) { console.warn('[MH SchedUI] disabled:', e); }
  window.MH_SCHEDUI = { version: VERSION, sync: sync, stats: function () { return JSON.parse(JSON.stringify(stats)); } };
  /* mh-schedui-v1 */
})();

/* =========================================================================
   כרטיס ברכה — כותבים את הברכה בחלון המוצר — MH Greet  |  v1.0.0 | 2026-10-08
   -------------------------------------------------------------------------
   כל מוצר ששמו מכיל "כרטיס ברכה" (פרחי דליה, קצפת, וכל עסק עתידי): בחלון המוצר, מתחת לתיאור,
   כרטיס כתיבה מעוצב (חלק 57 ב-global-cdn.css). הברכה נכתבת **לאותו שדה בדיוק** של "יש הערה
   למטבח?" בדף התשלום — Vuex Cart.orderNote (setOrderNote), שנשלח בהזמנה כ-order_comment
   (buildOrderPayload של Hyperzod), ומשם לקבלה ולוואטסאפ. הברכה נוספת לסוף ההערה, באותה שורה:
       <מה שכבר היה בהערה> | כרטיס ברכה: <הברכה>        (ירידות שורה בברכה → " / ")
   שורה אחת בכוונה: שדה ההערה בצ'ק-אאוט הוא <input> חד-שורתי — ירידת שורה נמחקת בו והטקסט נדבק (נמדד 8.10).
   בלי הצעות ברכה מוכנות (דוד 8.10: "אל תעשה וריאנס") — שדה טקסט אחד, ומה שנכתב בו הוא הברכה.
   מתי נכתב: אחרי "הוספה" בחלון — רק כשהכרטיס באמת בעגלה (בודקים את העגלה עד 8 שניות).
   מה Hyperzod עושה ומה הבלוק משלים (נבדק בקוד 8.10, בילד index-DU4_pdC9):
     - שדה ההערה בצ'ק-אאוט מתחיל ריק (note:"") ולא טוען את ההערה מה-store — הלקוח לא ראה מה
       נשלח, והקלדה בו דרסה הכל. הבלוק ממלא את השדה בהערה האמיתית פעם אחת בכל כניסה לצ'ק-אאוט (לכל עסק).
     - עם יותר מעגלה אחת Hyperzod מאפסת את ההערה (setOrderNote null) — הבלוק מחזיר את הברכה
       אם הכרטיס עדיין בעגלה של אותו עסק. עריכה/מחיקה של הלקוח בשדה בצ'ק-אאוט מכובדת: הרשומה
       מתעדכנת/נמחקת. אחרי הזמנה (setOrderNote "") — הרשומה נמחקת.
     - הכרטיס יצא מהעגלה (הוסר / העגלה התרוקנה) → הברכה יוצאת מההערה. "בעגלה" = getCartItems
       (רשימת הפריטים המקומית, נשמרת ב-localStorage, לכל העסקים) — זמינה כבר בטעינה.
     - ההערה של Hyperzod אחת לכל העגלות: כשהעגלה הפעילה של עסק אחר, הברכה יוצאת מההערה וחוזרת
       כשחוזרים לעגלה של העסק שלה — שלא תישלח עם הזמנה של עסק אחר.
   "+" בכרטיס המוצר (קצפת — מוצר בלי אפשרויות נוסף ישר לעגלה) פותח את חלון המוצר, כדי לראות את הכרטיס.
   נכשל-פתוח. בדיקה: MH_GREET.stats() · MH_GREET.merge(note, text)
   ========================================================================= */
(function () {
  'use strict';
  if (window.__MH_GREET__) { return; }
  window.__MH_GREET__ = true;
  var VERSION = '1.0.0';
  var NAME_RX = /כרטיס\s*ברכה/;
  var LABEL = 'כרטיס ברכה:';
  var MAX = 200;
  var LS = 'mh_greet';                  /* {mid, text, ts} — הברכה, ולאיזה עסק היא שייכת */
  var TTL = 3 * 864e5;
  var stats = { version: VERSION, shown: 0, committed: 0, reapplied: 0, removed: 0, fieldSynced: 0, plusRouted: 0, errors: 0 };
  var ours = false;                     /* מסמן commit שלנו — כדי שהמאזין לא יפרש אותו כעריכה של הלקוח */

  function store() {
    try { return document.getElementById('app').__vue_app__.config.globalProperties.$store; } catch (e) { return null; }
  }
  function noteOf(st) { var n = st.getters.getOrderNote; return n == null ? '' : String(n); }
  function clean(t) { return String(t || '').replace(/\s*[\r\n]+\s*/g, ' / ').replace(/[ \t]{2,}/g, ' ').trim().slice(0, MAX); }
  var SEP = ' | ';
  /* הברכה = מה שאחרי "כרטיס ברכה:" עד סוף ההערה (היא תמיד בסוף) */
  function greetingOf(note) {
    var n = String(note || ''), i = n.indexOf(LABEL);
    return i < 0 ? '' : n.slice(i + LABEL.length).trim();
  }
  /* ההערה בלי הברכה + הברכה בסוף אותה שורה (או בלי, כשהברכה ריקה); מה שהיה לפני נשאר כמו שהוא */
  function merge(note, text) {
    var n = String(note || ''), i = n.indexOf(LABEL), t = clean(text);
    if (i < 0 && !t) { return n; }
    var rest = (i < 0 ? n : n.slice(0, i)).replace(/[\s|]+$/, '').trim();
    return t ? (rest ? rest + SEP : '') + LABEL + ' ' + t : rest;
  }
  function setNote(st, value) {
    if (noteOf(st) === value) { return; }
    ours = true;
    try { st.commit('setOrderNote', value); } finally { ours = false; }
  }
  function readRec() {
    try { var r = JSON.parse(localStorage.getItem(LS) || 'null'); if (r && Date.now() - r.ts < TTL) { return r; } } catch (e) {}
    return null;
  }
  function writeRec(r) { try { if (r) { localStorage.setItem(LS, JSON.stringify(r)); } else { localStorage.removeItem(LS); } } catch (e) {} }
  function activeMid(st) {
    var m = st.getters.getCartMerchant || {}, c = st.getters.getCart || {};
    return m.merchant_id || m._id || c.merchant_id || null;
  }
  function isCard(it, mid) { return !!(it && (!mid || it.merchant_id === mid) && NAME_RX.test(String(it.product_name || ''))); }
  /* הכרטיס בעגלה של העסק? null = לא ידוע (לא נוגעים) */
  function cardIn(st, mid) {
    var a = st.getters.getCartItems;
    if (!Array.isArray(a)) { return null; }
    for (var i = 0; i < a.length; i++) { if (isCard(a[i], mid)) { return true; } }
    return false;
  }

  /* ---------- כתיבה להערה ---------- */
  function commit(text, mid) {
    var st = store(); if (!st) { return; }
    var t = clean(text);
    setNote(st, merge(noteOf(st), t));
    writeRec(t ? { mid: mid, text: t, ts: Date.now() } : null);
    stats.committed++;
    syncField(true);
    paintAll();
  }
  var pending = null;
  function afterAdd(text) {
    pending = { text: text, until: Date.now() + 8000 };
    (function tick() {
      if (!pending) { return; }
      var st = store(); if (!st) { return; }
      var c = st.getters.getCart || {}, items = Array.isArray(c.cart_items) ? c.cart_items : [];   /* העגלה מהשרת — ההוספה הצליחה */
      for (var i = 0; i < items.length; i++) { if (isCard(items[i])) { var p = pending; pending = null; commit(p.text, items[i].merchant_id || activeMid(st)); return; } }
      if (Date.now() > pending.until) { pending = null; return; }
      setTimeout(tick, 300);
    })();
  }

  /* ---------- שדה ההערה בצ'ק-אאוט ---------- */
  function noteComp() {
    var el = document.getElementById('app'), found = null;
    if (!el || !el._vnode) { return null; }
    function inst(c, d) {
      if (!c || found || d > 80) { return; }
      try { var p = c.proxy; if (p && typeof p.setNote === 'function' && ('note' in p)) { found = p; return; } } catch (e) {}
      node(c.subTree, d + 1);
    }
    function node(v, d) {
      if (!v || found || d > 300) { return; }
      if (v.component) { inst(v.component, d + 1); }
      if (v.suspense && v.suspense.activeBranch) { node(v.suspense.activeBranch, d + 1); }
      if (Array.isArray(v.children)) { for (var i = 0; i < v.children.length && !found; i++) { node(v.children[i], d + 1); } }
    }
    node(el._vnode, 0);
    return found;
  }
  /* פעם אחת לכל שדה (כל כניסה לצ'ק-אאוט יוצרת שדה חדש, ריק) + אחרי שאנחנו שינינו את ההערה (force).
     לא יותר: הלקוח שמחק את השדה ויצא ממנו לפני ה-debounce (400ms) — שלא נחזיר לו את הטקסט */
  var syncedInput = null;
  function syncField(force) {
    var input = document.getElementById('messageInput');
    if (!input || document.activeElement === input || (!force && input === syncedInput)) { return; }
    var st = store(), p = st && noteComp(); if (!p) { return; }
    var n = noteOf(st), first = input !== syncedInput;
    syncedInput = input;
    if (p.note !== n && (force || (first && !p.note))) { p.note = n; stats.fieldSynced++; }
  }

  /* ---------- שמירה על הברכה מול האיפוסים של Hyperzod ---------- */
  function drop(st, n) { setNote(st, merge(n, '')); stats.removed++; syncField(true); }
  function reconcile() {
    var st = store(); if (!st) { return; }
    var r = readRec();
    if (r) {
      var n = noteOf(st), g = greetingOf(n), has = cardIn(st, r.mid), mid = activeMid(st);
      if (has === false) { if (g === r.text) { drop(st, n); } writeRec(null); }              /* הכרטיס יצא מהעגלה */
      else if (has && mid && mid !== r.mid) { if (g === r.text) { drop(st, n); } }           /* עגלה של עסק אחר פעילה */
      else if (has && !g) { setNote(st, merge(n, r.text)); stats.reapplied++; syncField(true); }   /* Hyperzod איפסה */
    }
    syncField(false);
  }
  var rt = null;
  function scheduleReconcile(ms) { clearTimeout(rt); rt = setTimeout(function () { try { reconcile(); } catch (e) { stats.errors++; } }, ms); }
  function hookStore() {
    var st = store(); if (!st || st.__mhGreetHooked) { return !!st; }
    st.__mhGreetHooked = true;
    var last = noteOf(st);
    st.subscribe(function (m) {
      try {
        if (m.type === 'setOrderNote') {
          var was = last; last = noteOf(st);
          if (ours) { return; }
          var v = m.payload;
          if (v === null || v === undefined) { scheduleReconcile(900); return; }        /* איפוס (כמה עגלות / התנתקות) */
          var g = greetingOf(v), r = readRec();
          if (r && !g && greetingOf(was) === r.text) { writeRec(null); }                 /* הלקוח מחק את הברכה / ההזמנה נשלחה ("") */
          else if (r && g && r.text !== g) { r.text = g; r.ts = Date.now(); writeRec(r); }   /* הלקוח ערך את הברכה בשדה */
          paintAll();
          return;
        }
        if (/[Cc]art/.test(m.type)) { scheduleReconcile(900); }
      } catch (e) { stats.errors++; }
    });
    return true;
  }

  /* ---------- כרטיס הכתיבה בחלון המוצר ---------- */
  var ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2v.01L12 11 4 6.01V6h16zM4 18V8.24l7.47 4.67a1 1 0 0 0 1.06 0L20 8.24V18H4z"/><path fill="currentColor" d="M17.6 13.1c-.7-.7-1.8-.7-2.4 0l-.2.2-.2-.2c-.7-.7-1.8-.7-2.4 0-.7.7-.7 1.8 0 2.5L15 18.2l2.6-2.6c.7-.7.7-1.8 0-2.5z" opacity=".9"/></svg>';
  function popupIsCard(pp) {
    var n = pp.querySelector('.product-name');
    return !!(n && NAME_RX.test(n.textContent || ''));
  }
  function build(prefill) {
    var w = document.createElement('div');
    w.id = 'mh-greet';
    w.innerHTML =
      '<div class="mh-gr-card"><div class="mh-gr-inner">' +
        '<div class="mh-gr-head"><span class="mh-gr-ico">' + ICON + '</span>' +
          '<span class="mh-gr-titles"><b>מה לכתוב בכרטיס?</b><span>הברכה תגיע לחנות יחד עם ההזמנה</span></span></div>' +
        '<div class="mh-gr-paper"><textarea class="mh-gr-text" rows="4" maxlength="' + MAX + '" dir="rtl" enterkeyhint="done" ' +
          'aria-label="הברכה לכרטיס" placeholder="לדוגמה: מזל טוב ליום ההולדת! אוהבים, משפחת כהן"></textarea></div>' +
        '<div class="mh-gr-foot"><span class="mh-gr-status"></span><span class="mh-gr-count"></span></div>' +
        '<div class="mh-gr-help">הברכה תופיע גם בדף התשלום, בשדה "יש הערה למטבח?" — אפשר לערוך אותה גם שם.</div>' +
      '</div></div>';
    var ta = w.querySelector('textarea');
    ta.value = prefill || '';
    ta.addEventListener('input', function () { paint(w); });
    return w;
  }
  function paint(w) {
    try {
      var ta = w.querySelector('textarea'), v = ta.value, st = store();
      w.querySelector('.mh-gr-count').textContent = v.length + '/' + MAX;
      var saved = st && clean(v) && greetingOf(noteOf(st)) === clean(v);
      var s = w.querySelector('.mh-gr-status');
      s.textContent = saved ? '✓ שמור בהערות להזמנה' : (clean(v) ? 'יישמר בהוספה לעגלה' : '');
      w.classList.toggle('mh-gr-saved', !!saved);
    } catch (e) {}
  }
  function paintAll() { var w = document.getElementById('mh-greet'); if (w) { paint(w); } }
  function mount() {
    var pp = document.querySelector('.product-popup');
    var w = document.getElementById('mh-greet');
    if (!pp || !popupIsCard(pp)) { if (w) { w.remove(); } return; }
    var info = pp.querySelector('#productInfo'), wrap = info && info.parentElement;
    if (!wrap || !wrap.parentNode) { return; }
    if (w && w.previousElementSibling === wrap) { return; }
    if (!w) { var st = store(); w = build(st ? greetingOf(noteOf(st)) : ''); stats.shown++; }
    wrap.parentNode.insertBefore(w, wrap.nextSibling);
    paint(w);
  }

  try {
    document.addEventListener('click', function (e) {
      try {
        var t = e.target; if (!t || !t.closest) { return; }
        /* "הוספה" בחלון של כרטיס ברכה → הברכה נכתבת כשהכרטיס בעגלה */
        var btn = t.closest('.product-popup .v-card-actions .v-btn--block');
        if (btn) {
          var w = document.getElementById('mh-greet'), pp = btn.closest('.product-popup');
          if (w && pp && pp.contains(w)) { afterAdd(w.querySelector('textarea').value); }
          return;
        }
        /* "+" בכרטיס מוצר של כרטיס ברכה → פותחים את חלון המוצר (שם כותבים את הברכה) */
        var add = t.closest('button.add-btn'), card = add && add.closest('.product-card-basic, .product-card-slider');
        var name = card && card.querySelector('.product-name');
        if (name && NAME_RX.test(name.textContent || '')) {
          e.preventDefault(); e.stopImmediatePropagation();
          stats.plusRouted++;
          name.click();
        }
      } catch (err) { stats.errors++; }
    }, true);
    var pend = false;
    new MutationObserver(function () {
      if (pend) { return; }
      pend = true;
      setTimeout(function () { pend = false; try { hookStore(); mount(); syncField(false); } catch (e) { stats.errors++; } }, 120);
    }).observe(document.documentElement, { subtree: true, childList: true });
    setTimeout(function () { hookStore(); reconcile(); }, 1500);
  } catch (e) { console.warn('[MH Greet] disabled:', e); }

  window.MH_GREET = {
    version: VERSION, merge: merge, greetingOf: greetingOf, reconcile: reconcile,
    stats: function () { return JSON.parse(JSON.stringify(stats)); }
  };
  /* mh-greet-v1 */
})();

/* =========================================================================
   "ייפתח שוב ב-" — שעון 24 שעות + תאריך — MH Reopen  |  v1.1.0 | 2026-10-09 (v1.1.0: מוצ״ש)
   -------------------------------------------------------------------------
   מוצר עם לוח זמינות (schedule) שסגור עכשיו: Hyperzod כותבת בכרטיס (.product-availability-message)
   ובכפתור של חלון המוצר "ייפתח שוב ב- שישי, 08:00 AM". השעה עצמה נכונה — next_publish_time_utc
   מהשרת, מוצג באזור הזמן של החנות (getTimezone = Asia/Jerusalem, נבדק 9.10) — אבל:
     - 12 שעות עם AM/PM (ובחלון המוצר ה-"AM" קופץ לצד השני בגלל RTL);
     - רק יום בשבוע, בלי תאריך: בשישי, "שישי 08:00" של השבוע הבא נקרא כמו "היום" (דוד 9.10).
   התיקון במקור האחד: formattedUTCDateTimeWithTranslation של Hyperzod (5 הקוראים — כרטיסים, חיפוש,
   חלון המוצר) מעצבת עם dayjs format("ddd, hh:mm A"), מחרוזת שאין לה שום שימוש אחר בבאנדל (index-jfOdlzWH).
   הבלוק עוטף את format של dayjs ומחליף רק אותה ל-"ddd D.M, HH:mm" → "שישי 16.10, 08:00"
   (את שם היום ממשיכה לתרגם Hyperzod). תוויות שצוירו לפני שהבלוק נטען (computed במטמון) — מתוקנות
   בטקסט, עם התאריך מנתוני המוצר ב-store לפי ה-id של הכרטיס; אם לא נמצא — רק 24 שעות.
   מוצ״ש (v1.1.0, דוד 9.10): פתיחה בשבת מ-17:00 (CFG MOTZASH) כתובה "מוצ״ש" במקום "שבת":
     - מוצר: "ייפתח שוב ב- מוצ״ש 10.10, 20:30";
     - עסק — "הפתיחה הבאה" בכרטיס העסק (.merchant-close-comment) ובראש דף העסק
       (.scheme-merchant-order-warning__text): Hyperzod בונה מהתבנית "{opening_next} {on} {saturday} {at} 20:30"
       (getComment, בשני רכיבים) → "הפתיחה הבאה  שבת ב- 20:30"; הבלוק מחליף בטקסט ל-"הפתיחה הבאה במוצ״ש ב- 20:30".
     שבת לפני 17:00 נשארת "שבת". 9.10: 9 עסקים פותחים בשבת 20:00–20:30.
   נכשל-פתוח. בדיקה: MH_REOPEN.stats() · MH_REOPEN.motz('הפתיחה הבאה  שבת ב- 20:30')
   ========================================================================= */
(function () {
  'use strict';
  if (window.__MH_REOPEN__) { return; }
  window.__MH_REOPEN__ = true;
  var VERSION = '1.1.0';
  var OLD = 'ddd, hh:mm A', NEW = 'ddd D.M, HH:mm';
  var MOTZASH = 17 * 60;                                  /* שבת מהשעה הזו = "מוצ״ש" — לשנות כאן */
  var MOTZ = 'מוצ״ש';
  var RX = /([^\s,]+), (\d{1,2}):(\d{2}) ([AP]M)/;          /* "שישי, 08:00 AM" — הפורמט הישן */
  var stats = { version: VERSION, patched: false, formatted: 0, relabeled: 0, noDate: 0, motzash: 0, errors: 0 };
  var G = null;

  function patch() {
    var g; try { g = document.getElementById('app').__vue_app__.config.globalProperties; } catch (e) { return false; }
    if (!g || typeof g.$date !== 'function') { return false; }
    var proto = Object.getPrototypeOf(g.$date()), orig = proto && proto.format;
    if (typeof orig !== 'function') { return false; }
    proto.format = function (f) {
      if (f === OLD) {
        stats.formatted++;
        if (hebrew() && this.day() === 6 && this.hour() * 60 + this.minute() >= MOTZASH) { stats.motzash++; return orig.call(this, '[' + MOTZ + '] D.M, HH:mm'); }
        return orig.call(this, NEW);
      }
      return orig.apply(this, arguments);
    };
    G = g; stats.patched = true;
    return true;
  }

  /* next_publish_time_utc של מוצר לפי id — מהרשימות שבדף העסק / בחיפוש / בדף קטגוריה */
  function nextPub(id) {
    var M = G.$store.state.Merchant, found = null;
    (function scan(o, d) {
      if (found || !o || typeof o !== 'object' || d > 4) { return; }
      if (Array.isArray(o)) { for (var i = 0; i < o.length && !found; i++) { scan(o[i], d + 1); } return; }
      if (o._id === id) { found = o.next_publish_time_utc || null; return; }
      if (o.category_products) { scan(o.category_products, d + 1); }
      if (o.data) { scan(o.data, d + 1); }
    })([M.categoryProducts, M.searchedProducts, M.categoryPageProducts], 0);
    return found;
  }
  function hebrew() { try { return (G.$store.getters.getLocale || {}).locale === 'he'; } catch (e) { return false; } }
  function to24(h, m, ap) { var H = (+h % 12) + (ap === 'PM' ? 12 : 0); return (H < 10 ? '0' : '') + H + ':' + m; }
  /* תווית בפורמט הישן → "שישי 16.10, 08:00" (התאריך רק אם השעה מהנתונים זהה לשעה שבתווית) */
  function relabel() {
    var els = document.querySelectorAll('.product-availability-message, .product-popup .v-card-actions .v-btn');
    for (var i = 0; i < els.length; i++) {
      var w = document.createTreeWalker(els[i], NodeFilter.SHOW_TEXT, null), n;
      while ((n = w.nextNode())) {
        var m = RX.exec(n.nodeValue); if (!m) { continue; }
        var hm = to24(m[2], m[3], m[4]), rep = m[1] + ', ' + hm;
        var card = els[i].closest('[id]'), id = card && /^[0-9a-f]{24}$/.test(card.id) ? card.id : null;
        var ts = id ? nextPub(id) : null;
        var d = ts ? G.$date.utc(ts).tz(G.$store.getters.getTimezone || 'Asia/Jerusalem') : null;
        var day = m[1] === 'שבת' && (+hm.slice(0, 2)) * 60 + (+hm.slice(3)) >= MOTZASH ? MOTZ : m[1];
        if (d && d.format('HH:mm') === hm) { rep = day + ' ' + d.format('D.M') + ', ' + hm; } else { rep = day + ', ' + hm; stats.noDate++; }
        n.nodeValue = n.nodeValue.replace(m[0], rep);
        stats.relabeled++;
      }
    }
  }

  /* "הפתיחה הבאה  שבת ב- 20:30" → "הפתיחה הבאה במוצ״ש ב- 20:30" (רק שבת מ-17:00) */
  var RXC = /(^|\s+)(?:ביום\s+|ב\s+)?שבת(\s+ב-\s*)(\d{1,2}):(\d{2})/;   /* גם אם {on} יתורגם ל"ב"/"ביום" */
  function motz(t) {
    var m = RXC.exec(t);
    if (!m || (+m[3]) * 60 + (+m[4]) < MOTZASH) { return t; }
    return t.slice(0, m.index) + (m[1] ? ' ' : '') + 'ב' + MOTZ + m[2] + m[3] + ':' + m[4] + t.slice(m.index + m[0].length);
  }
  function comments() {
    var els = document.querySelectorAll('.merchant-close-comment, .scheme-merchant-order-warning__text');
    for (var i = 0; i < els.length; i++) {
      var w = document.createTreeWalker(els[i], NodeFilter.SHOW_TEXT, null), n;
      while ((n = w.nextNode())) { var v = motz(n.nodeValue); if (v !== n.nodeValue) { n.nodeValue = v; stats.motzash++; } }
    }
  }

  try {
    var pend = false;
    var run = function () { pend = false; try { comments(); if (stats.patched || patch()) { relabel(); } } catch (e) { stats.errors++; } };
    new MutationObserver(function () { if (!pend) { pend = true; setTimeout(run, 150); } })
      .observe(document.documentElement, { subtree: true, childList: true, characterData: true });
    run();
  } catch (e) { console.warn('[MH Reopen] disabled:', e); }

  window.MH_REOPEN = { version: VERSION, motz: motz, stats: function () { return JSON.parse(JSON.stringify(stats)); } };
  /* mh-reopen-v1 */
})();

/* =========================================================
   הירו דף הבית — "התרנגול" — MH HomeFilm v1.0.0 | 2026-10-09
   ההתנהגות של #mh-home-film (העיצוב: CSS חלק 58; התוכן: הסקשן שדוד מדביק — home-film.html בריפו).
   - הסרטון מקבל src רק מכאן (data-src): "פחות תנועה" / חיסכון בנתונים → לא מורידים אותו בכלל.
   - הוא שקוף עד שפריים אמיתי מוצג (מתחת: תמונת הפריים הראשון) — אין הבהוב שחור ואין כפתור ▶ של המערכת.
   - ניגון חסום (מצב חיסכון בסוללה באייפון, אפליקציה שלא מתירה ניגון) → הסרטון יוצא מהדף ונשארת תמונה אחת:
     פריים המסירה. בלי ניסיונות חוזרים בנגיעה (באפליקציה זה עלול לפתוח נגן במסך מלא).
   - כפתור עצירה/המשך עם טבעת התקדמות (WCAG 2.2.2), מופיע רק כשהסרט באמת מתנגן; עצירה של המשתמש נשמרת.
   - הסרט עוצר מחוץ למסך / ברקע וממשיך כשחוזרים.
   - "יש מה לאכול." — המילים אחרי "יש" מתחלפות עם הסצנה (פיצה, מאפים, המבורגר, סטייק — רק מה שיש באפליקציה;
     סושי אין — בסצנה הזו, בפני התרנגול ובמשלוח חוזר "מה לאכול").
   - המספרים בשורה מאינדקס החיפוש (MH_SEARCH.index — אותה הורדה) — מתעדכנים לבד.
   נכשל-פתוח: בלי ה-JS — התמונה + הטקסט. בדיקה: MH_HOMEFILM.stats()
   ========================================================= */
(function () {
  'use strict';
  if (window.__MH_HOMEFILM__) { return; }
  window.__MH_HOMEFILM__ = true;
  var VERSION = '1.0.0';
  /* הפונט של הכותרת בלבד: Noto Sans Hebrew צר-שחור (wdth 75 / wght 900) — רק האותיות של הכותרת (text=, ~2-4KB),
     נבנה מהתוכן בפועל (הכותרת + כל המילים של הסצנות), כך ששינוי טקסט בסקשן לא שובר אותו */
  var FONT = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wdth,wght@75,900&display=swap';
  var FONT_TEST = '900 60px "Noto Sans Hebrew"';
  var STILL = 'https://davidebug10.github.io/maale-css/home-film-still.webp';   /* תמונה אחת כשאין סרט: התרנגול מוסר את השקית */
  /* 6 הסצנות (נמדד מהפריימים 9.10): סושי | פיצה 1.375 | מאפים 3.0 | המבורגר 4.292 | סטייק 5.708 → פני התרנגול 6.5 | משלוח 7.417 */
  var SCENES = [[0, ''], [1.375, 'פיצה'], [3.0, 'מאפים'], [4.292, 'המבורגר'], [5.708, 'סטייק'], [6.5, '']];   /* '' = הטקסט מהסקשן ("מה לאכול") */
  var stats = { bound: 0, playing: 0, live: 0, still: '', userPause: 0, userPlay: 0, offscreen: 0, words: 0, counts: null, cta: 0, errors: 0 };
  var RM = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var SVGNS = 'http://www.w3.org/2000/svg', R = 16, C = 2 * Math.PI * R, animated = false;

  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function router() { try { return document.getElementById('app').__vue_app__.config.globalProperties.$router; } catch (e) { return null; } }
  var LEAD = 0.22;   /* הגלגול (0.5 שנ') מתחיל לפני החיתוך — אמצע המעבר נופל על החיתוך עצמו (נמדד מול הפריימים המוצגים, 9.10) */
  function sceneAt(t) { var w = ''; for (var i = 0; i < SCENES.length; i++) { if (t + LEAD >= SCENES[i][0]) { w = SCENES[i][1]; } } return w; }

  /* "למעלה מ-1,500 מנות" / "אלפי מנות" (2,000+) · "מעשרות מסעדות ובתי עסק" (20+) — לפי האינדקס */
  function counts(root) {
    var S = window.MH_SEARCH;
    if (!S || typeof S.index !== 'function') { return; }
    S.index().then(function (j) {
      if (!j || !j.stores || !j.stores.length) { return; }
      var items = 0, seen = {};   /* מוצר שמופיע בכמה קטגוריות נספר פעם אחת */
      j.stores.forEach(function (s) { (s.secs || []).forEach(function (x) { (x[1] || []).forEach(function (p) { if (p && p[0] && !seen[p[0]]) { seen[p[0]] = 1; items++; } }); }); });
      stats.counts = { stores: j.stores.length, items: items };
      var it = root.querySelector('[data-mhf-n="items"]'), st = root.querySelector('[data-mhf-n="stores"]');
      if (it && items >= 300) { it.textContent = items >= 2000 ? 'אלפי מנות' : 'למעלה מ-' + fmt(Math.floor(items / 100) * 100) + ' מנות'; }
      if (st && j.stores.length >= 5) { st.textContent = j.stores.length >= 20 ? 'מעשרות מסעדות ובתי\u00a0עסק' : 'מ-' + j.stores.length + ' מסעדות ובתי\u00a0עסק'; }
    })['catch'](function () { stats.errors++; });
  }

  /* החריץ בסוף השורה ("יש ___."), הנקודה חלק מהמילה — שום דבר אחריו לא זז. המעבר: "מסוע" — הישנה עולה והחדשה עולה
     מלמטה באותו קצב ובאותו מרחק, כך שאין רגע של חפיפה; המסכה היא השורה עצמה (.mhf-line, overflow:hidden). */
  function wordSlot(root) {
    var slot = root.querySelector('.mhf-w'); if (!slot) { return null; }
    var base = (slot.textContent || '').replace(/\s+/g, ' ').trim(); if (!base) { return null; }
    var tail = (base.match(/[.!?\u2026]+$/) || [''])[0], cur = null, live = null;
    slot.textContent = '';
    function set(word, instant) {
      var text = word ? word + tail : base;
      if (text === cur) { return; }
      cur = text; stats.words++;
      var old = live;
      if (old) {
        if (instant) { old.parentNode.removeChild(old); }
        else { old.classList.add('mhf-out'); setTimeout(function () { if (old.parentNode) { old.parentNode.removeChild(old); } }, 600); }
      }
      live = document.createElement('span'); live.className = 'mhf-wi' + (instant ? ' mhf-now' : ''); live.textContent = text;
      slot.appendChild(live);
    }
    set('', true);
    return set;
  }

  function loadFont(root, done) {
    var t = ((root.querySelector('.mhf-line') || {}).textContent || '') + '.';
    SCENES.forEach(function (x) { t += x[1]; });
    var seen = {}, chars = '';
    t.replace(/\s+/g, '').split('').forEach(function (c) { if (!seen[c]) { seen[c] = 1; chars += c; } });
    var url = FONT + '&text=' + encodeURIComponent(chars), fired = false;
    function go() { if (!fired) { fired = true; done(); } }
    setTimeout(go, 700);                                   /* לא מחכים יותר מזה — הכותרת עולה בפונט המערכת ומתחלפת כשהפונט מגיע */
    try {
      var l = document.querySelector('link[data-mhf-font]');
      if (l && l.getAttribute('href') === url && l.__mhfOk) { go(); return; }
      if (!l) { l = document.createElement('link'); l.rel = 'stylesheet'; l.setAttribute('data-mhf-font', ''); document.head.appendChild(l); }
      l.onload = function () { l.__mhfOk = true; if (document.fonts && document.fonts.load) { document.fonts.load(FONT_TEST, chars).then(go, go); } else { go(); } };
      l.onerror = go;
      if (l.getAttribute('href') !== url) { l.href = url; }
    } catch (e) { go(); }
  }

  function button() {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'mhf-pp';
    var s = document.createElementNS(SVGNS, 'svg'); s.setAttribute('viewBox', '0 0 38 38'); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<circle class="mhf-ring-bg" cx="19" cy="19" r="' + R + '" fill="none" stroke-width="2"/>' +
      '<circle class="mhf-ring" cx="19" cy="19" r="' + R + '" fill="none" stroke-width="2" stroke-linecap="round" stroke-dasharray="' + C.toFixed(2) + '" stroke-dashoffset="' + C.toFixed(2) + '"/>' +
      '<g class="mhf-i-pause" fill="#fff"><rect x="14" y="12.5" width="3.4" height="13" rx="1.2"/><rect x="20.6" y="12.5" width="3.4" height="13" rx="1.2"/></g>' +
      '<path class="mhf-i-play" fill="#fff" d="M15.5 12.4v13.2c0 .8.9 1.3 1.6.9l10.2-6.6c.6-.4.6-1.3 0-1.7l-10.2-6.6c-.7-.5-1.6 0-1.6.8z"/>';
    b.appendChild(s);
    return b;
  }

  function bind(root) {
    if (root.__mhf) { return; }
    root.__mhf = true; stats.bound++;
    var film = root.querySelector('.mhf-film'), v = root.querySelector('video.mhf-video'), img = root.querySelector('.mhf-poster');
    var setWord = wordSlot(root);
    var b = null, ring = null, userPaused = false, vis = true, raf = 0, shown = false;
    counts(root);
    root.classList.add('mhf-wait');                        /* הכותרת מחכה לפונט (עד 0.7 שנ'), ואז הכניסה — פעם אחת לטעינה */
    loadFont(root, function () { root.classList.remove('mhf-wait'); if (!animated) { animated = true; root.classList.add('mhf-in'); } });
    if (!film || !v) { return; }

    function still(why) {
      stats.still = why;
      root.classList.add('mhf-still'); root.classList.remove('mhf-live', 'mhf-playing');
      if (img && img.getAttribute('src') !== STILL) { img.src = STILL; }
      try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) {}
      if (v.parentNode) { v.parentNode.removeChild(v); }
      if (b && b.parentNode) { b.parentNode.removeChild(b); }
      if (setWord) { setWord('', true); }
    }
    var saveData = !!(navigator.connection && navigator.connection.saveData);
    if ((RM && RM.matches) || saveData || !v.getAttribute('data-src')) { still(RM && RM.matches ? 'reduced-motion' : saveData ? 'save-data' : 'no-src'); return; }

    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    v.src = v.getAttribute('data-src');

    function tick() {
      raf = 0;
      if (ring && v.duration > 0) { ring.setAttribute('stroke-dashoffset', (C * (1 - v.currentTime / v.duration)).toFixed(2)); }
      if (setWord && !rvfc) { setWord(sceneAt(v.currentTime)); }
      if (!v.paused) { raf = requestAnimationFrame(tick); }
    }
    function label() { if (b) { b.setAttribute('aria-label', v.paused ? 'המשך הסרטון' : 'עצירת הסרטון'); b.setAttribute('aria-pressed', v.paused ? 'true' : 'false'); } }
    function sync() {
      if (!v.isConnected) { return; }
      if (vis && !userPaused && !document.hidden) {
        if (!v.paused) { return; }
        var p; try { p = v.play(); } catch (e) { p = null; }
        if (p && p.then) { p.then(null, function (e) { if (e && /NotAllowed|NotSupported/.test(e.name)) { still(e.name); } }); }
      } else if (!v.paused) { v.pause(); }
    }
    function reveal() {   /* הסרט נכנס רק כשפריים אמיתי על המסך (במקום הבהוב שחור / object-fit שגוי בספארי) */
      if (shown || !v.isConnected) { return; }
      shown = true; stats.live++;
      root.classList.add('mhf-live');
      b = button(); ring = b.querySelector('.mhf-ring'); film.appendChild(b); label();
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        if (v.paused) { userPaused = false; stats.userPlay++; sync(); } else { userPaused = true; stats.userPause++; v.pause(); }
      });
    }
    /* סנכרון לפריים שמוצג בפועל (mediaTime) — לא לשעון: currentTime/rAF מפגרים אחרי התמונה כשהמכשיר עמוס */
    var rvfc = !!v.requestVideoFrameCallback, frameCb = 0;
    function onFrame(now, md) {
      frameCb = 0;
      if (setWord && md) { setWord(sceneAt(md.mediaTime)); }
      if (!v.paused && v.isConnected) { frameCb = v.requestVideoFrameCallback(onFrame); }
    }
    v.addEventListener('playing', function () {
      stats.playing++; root.classList.add('mhf-playing'); label();
      if (!raf) { raf = requestAnimationFrame(tick); }
      if (rvfc && !frameCb) { frameCb = v.requestVideoFrameCallback(onFrame); }
      if (!shown) {
        if (v.requestVideoFrameCallback) { v.requestVideoFrameCallback(function () { v.requestVideoFrameCallback(reveal); }); }
        setTimeout(reveal, 400);
      }
    });
    v.addEventListener('pause', function () { root.classList.remove('mhf-playing'); label(); });
    v.addEventListener('timeupdate', function () { if (setWord && (!rvfc || v.paused)) { setWord(sceneAt(v.currentTime)); } });   /* גיבוי: בלי rVFC, או seek כשעצור (אחרת currentTime המפגר היה מחזיר את המילה הקודמת) */
    v.addEventListener('error', function () { still('error'); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { vis = es[es.length - 1].isIntersecting; if (!vis && !v.paused) { stats.offscreen++; } sync(); }, { threshold: 0.2 }).observe(film);
    }
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('pageshow', sync);

    var cta = root.querySelector('.mhf-cta');
    if (cta) {
      cta.addEventListener('click', function (e) {
        var r = router(); if (!r) { return; }        /* בלי ה-router — הקישור הרגיל */
        e.preventDefault(); stats.cta++;
        r.push({ name: 'search' })['catch'](function () {});
      });
    }
    sync();
  }

  var queued = false;
  function scan() {
    queued = false;
    try { var r = document.getElementById('mh-home-film'); if (r) { bind(r); } } catch (e) { stats.errors++; }
  }
  try {
    new MutationObserver(function () { if (!queued) { queued = true; requestAnimationFrame(scan); } }).observe(document.documentElement, { childList: true, subtree: true });
    scan();
  } catch (e) { console.warn('[MH HomeFilm] disabled:', e); }

  window.MH_HOMEFILM = { version: VERSION, stats: function () { return Object.assign({}, stats); } };
  /* mh-homefilm-v1 */
})();

/* =========================================================
   אוספי העסקים בדף הבית + הדף "הכל" — MH Collections v1.0.0 | 2026-10-09
   הבעלים של ההתנהגות של #MerchantCollection (סקשני "Merchant Collection" שדוד בונה באדמין) ושל כותרת הדף
   שנפתח מ"הכל" (#merchants_by_category?collection=true). העיצוב: CSS חלק 59.
   - "View all" (קשיח באנגלית ב-chunk pb-MerchantCollection) → "הכל" + מספר העסקים.
   - כותרת דף "הכל": Hyperzod בונה slug מהכותרת ומוחקת כל מה שאינו a-z → כותרת עברית = "nearby-merchants".
     שומרים את כותרת הסקשן בלחיצה (שלב capture, לפני Hyperzod) וכותבים אותה ב-H1 של הדף.
   - הכרטיס: "הודעת חלון הראווה" (אלרגנים + כשרות + "התמונות להמחשה בלבד") → רק הכשרות בשורה קטנה
     (data-mh-meta); הודעה בלי "כשרות:" (טוסטראק, דליה) → כמו שהיא. הסטטוס הסגור → נוסח קצר (data-mh-when).
   - סדר: פתוחים קודם, אחריהם לפי שעת הפתיחה הקרובה, "בקרוב נפתח" (מתג ידני) בסוף — CSS order, בלי לגעת ב-DOM של Vue.
   נכשל-פתוח: בלי ה-JS הכרטיסים של Hyperzod כמו שהם (עם העיצוב של חלק 59). בדיקה: MH_COLLECTIONS.stats()
   ========================================================= */
(function () {
  'use strict';
  if (window.__MH_COLLECTIONS__) { return; }
  window.__MH_COLLECTIONS__ = true;
  var VERSION = '1.1.0';
  var stats = { labels: 0, titles: 0, cards: 0, kosher: 0, tags: 0, closed: 0, ordered: 0, errors: 0, pageNote: '' };
  var lastTitle = null;   /* הכותרת של הסקשן שממנו לחצו "הכל" */

  /* ---- כשרות מתוך "הודעת חלון הראווה" ---- */
  function kosher(msg) {
    var m = /כשרות\s*:\s*([^\n]+)/.exec(msg || '');
    if (!m) { return null; }
    var parts = m[1].split(/\s*·\s*|\s*,\s*/), out = [];
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].replace(/\s+/g, ' ').trim();
      if (!p) { continue; }
      if (/^(אלרגנים|אלרגן)|^(גלוטן|אגוזים|בוטנים|שומשום|ביצים|סויה|חלב)$/.test(p)) { break; }   /* אלרגן בלי כותרת ("· גלוטן") */
      out.push(p);
    }
    return out.length ? out.join(' · ') : null;
  }
  function tagline(msg) {
    var t = (msg || '').replace(/\s+/g, ' ').trim();
    if (!t || /כשרות\s*:|אלרגנים\s*:|להמחשה/.test(t)) { return null; }
    return t;
  }

  /* ---- סטטוס: "הפתיחה הבאה במוצ״ש ב- 20:30" → { label, rank } ---- */
  var DAYS = { 'ראשון': 0, 'שני': 1, 'שלישי': 2, 'רביעי': 3, 'חמישי': 4, 'שישי': 5, 'שבת': 6, 'מוצ״ש': 6.5 };
  function ilNow() {   /* יום (0=ראשון) ודקה בשעון ישראל */
    try {
      var p = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Jerusalem', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()), o = {};
      p.forEach(function (x) { o[x.type] = x.value; });
      return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday), min: (+o.hour) * 60 + (+o.minute) };
    } catch (e) { var d = new Date(); return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() }; }
  }
  function status(text, now) {
    var t = (text || '').replace(/\s+/g, ' ').trim();
    if (!t) { return { state: 'open', rank: 0 }; }
    var tm = /(\d{1,2}):(\d{2})/.exec(t), dw = /מוצ״ש|ראשון|שני|שלישי|רביעי|חמישי|שישי|שבת|היום|מחר/.exec(t);
    if (!tm) { return { state: 'soon', rank: 1e7, label: t }; }   /* "בקרוב נפתח" — מתג ידני, בלי שעה */
    now = now || ilNow();
    var day = dw ? (dw[0] === 'היום' ? now.day : dw[0] === 'מחר' ? (now.day + 1) % 7 : Math.floor(DAYS[dw[0]])) : now.day;
    var min = (+tm[1]) * 60 + (+tm[2]), ahead = ((day - now.day + 7) % 7) * 1440 + min - now.min;
    if (ahead < 0) { ahead += 7 * 1440; }
    return { state: 'closed', rank: 1 + ahead, label: t, day: dw ? dw[0] : '', time: tm[1] + ':' + tm[2] };
  }

  /* "הפתיחה הבאה במוצ״ש ב- 20:30" → "נפתח במוצ״ש 20:30" (כרטיס רגיל) / "מוצ״ש 20:30" (כרטיס קטן) */
  function shortWhen(st) {
    if (st.state !== 'closed') { return null; }
    var d = st.day === 'היום' || !st.day ? '' : st.day === 'מחר' ? 'מחר ' : st.day === 'מוצ״ש' ? 'במוצ״ש ' : st.day + ' ';
    return { full: 'נפתח ' + d + st.time, tiny: (d ? d.replace(/^ב(?=מוצ״ש)/, '') : 'היום ') + st.time };
  }
  function spoken(st, name) {   /* לקורא מסך: "מוצאי שבת" במלואו, לא אות-אות */
    if (st.state === 'open') { return null; }
    if (st.state === 'soon') { return name + ', סגור כרגע'; }
    return name + ', סגור, נפתח ' + (st.day === 'מוצ״ש' ? 'במוצאי שבת' : st.day || 'היום') + ' בשעה ' + st.time;
  }

  function cardState(card) {
    var cc = card.querySelector('.merchant-close-comment');
    var st = status(cc ? cc.textContent : '');
    if (st.state === 'open' && card.querySelector('.cover-img.is-unavailable')) { st = { state: 'soon', rank: 1e7 }; }
    return st;
  }

  function decorate(card) {
    var body = card.querySelector('.merchant-card-body'), msgEl = card.querySelector('.merchant-store-front-message');
    var msg = msgEl ? msgEl.textContent : '', k = kosher(msg), t = k ? null : tagline(msg);
    var rt = card.querySelector('[id="AverageRating"] span'), r = rt ? parseFloat(rt.textContent) : 0;
    var meta = [r > 0 ? '★ ' + (Math.round(r * 10) / 10) : '', k || t || ''].filter(Boolean).join(' · ');   /* "★ 4.8 · בשרי · מהדרין" */
    if (body && body.getAttribute('data-mh-meta') !== meta) { body.setAttribute('data-mh-meta', meta); if (k) { stats.kosher++; } else if (t) { stats.tags++; } }
    var st = cardState(card), w = shortWhen(st), cc = card.querySelector('.merchant-close-comment');
    card.setAttribute('data-mh-state', st.state);
    if (cc && w) { if (cc.getAttribute('data-mh-when') !== w.full) { cc.setAttribute('data-mh-when', w.full); cc.setAttribute('data-mh-tiny', w.tiny); } }
    var name = ((card.querySelector('.merchant-card-title') || {}).textContent || '').trim(), sp = spoken(st, name);
    if (sp) { card.setAttribute('aria-label', sp); } else if (card.getAttribute('aria-label')) { card.removeAttribute('aria-label'); }
    stats.cards++;
    return st;
  }

  /* חיצי הקרוסלה במחשב: Hyperzod גוללת לפי LTR — ב-RTL "הבאים" לא זז בכלל ו"הקודמים" נעול לתמיד (scrollLeft>1
     לא מתקיים כשהגלילה שלילית). כאן: גלילה לפי כיוון הקרוסלה, מצב נעול לפי ההתחלה/הסוף בפועל, ותוויות בעברית. */
  function arrows(sec) {
    var car = sec.querySelector('.nm-carousel'), btns = sec.querySelectorAll('.nm-carousel-arrow-btn');
    if (!car || btns.length < 2) { return; }
    var pos = Math.abs(car.scrollLeft), atStart = pos < 2, atEnd = pos + car.clientWidth >= car.scrollWidth - 2;
    [].forEach.call(btns, function (b) {
      var next = /next/i.test(b.getAttribute('data-mh-dir') || b.getAttribute('aria-label') || '');
      if (!b.getAttribute('data-mh-dir')) { b.setAttribute('data-mh-dir', next ? 'next' : 'prev'); }
      b.setAttribute('aria-label', next ? 'המקומות הבאים' : 'המקומות הקודמים');
      var off = next ? atEnd : atStart;
      if (b.disabled !== off) { b.disabled = off; }
    });
    if (!car.__mhArrows) { car.__mhArrows = true; car.addEventListener('scroll', function () { arrows(sec); }, { passive: true }); }
  }
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest && e.target.closest('[id="MerchantCollection"] .nm-carousel-arrow-btn');
    if (!b) { return; }
    var car = b.closest('[id="MerchantCollection"]').querySelector('.nm-carousel');
    if (!car) { return; }
    e.preventDefault(); e.stopImmediatePropagation();      /* הגלילה של Hyperzod (LTR) לא זזה ב-RTL */
    var next = b.getAttribute('data-mh-dir') === 'next', rtl = getComputedStyle(car).direction === 'rtl';
    var step = Math.max(260, Math.round(car.clientWidth * 0.8));
    car.scrollBy({ left: (next ? 1 : -1) * (rtl ? -1 : 1) * step, behavior: 'smooth' });
    stats.arrows = (stats.arrows || 0) + 1;
  }, true);

  /* סקשן: תווית "הכול (N)", אימוג'י התיאור ליד הכותרת, סדר פתוחים-קודם, ושורת "כולם סגורים" */
  function section(sec) {
    var title = sec.querySelector('h1'), btn = sec.querySelector('.nm-see-all-btn'), desc = title && title.parentElement && title.parentElement.parentElement && title.parentElement.parentElement.querySelector('p');
    var slides = [].slice.call(sec.querySelectorAll('.nm-carousel-slide')), cards = [].slice.call(sec.querySelectorAll('a.merchant-card'));
    var n = cards.length, t = title ? title.textContent.replace(/\s+/g, ' ').trim() : '';
    if (btn) {
      var lbl = 'הכול' + (n ? ' (' + n + ')' : '');
      if (btn.textContent !== lbl) { btn.textContent = lbl; stats.labels++; }
      btn.setAttribute('aria-label', 'כל ' + (n || '') + ' המקומות ב„' + t + '”');
    }
    if (desc && title) {   /* תיאור שהוא רק אימוג'י → ליד הכותרת, לא שורה משלו */
      var d = desc.textContent.replace(/\s+/g, '').trim(), emo = d && !/[֐-׿A-Za-z0-9]/.test(d);
      if (emo) { sec.setAttribute('data-mh-emoji-desc', ''); } else { sec.removeAttribute('data-mh-emoji-desc'); }   /* מאפיין ולא class — Vue כותב מחדש את ה-class של הסקשן */
      if (emo && title.getAttribute('data-mh-emoji') !== d) { title.setAttribute('data-mh-emoji', d); }
    }
    var states = cards.map(decorate), rows2 = !!sec.querySelector('.nm-carousel--rows-2');
    if (!rows2) {
      var car = sec.querySelector('.nm-carousel'), moved = false;
      slides.forEach(function (sl) { var c = sl.querySelector('a.merchant-card'); if (!c) { return; } var r = cardState(c).rank; var o = String(Math.min(r, 1e7) | 0); if (sl.style.order !== o) { sl.style.order = o; moved = true; stats.ordered++; } });
      /* scroll-snap "נצמד" לכרטיס שהיה ראשון ומגלגל אחריו לסוף — חוזרים להתחלה, רק אם הלקוח עוד לא נגע בשורה */
      if (car && moved && !car.__mhTouched) {
        if (!car.__mhWatch) { car.__mhWatch = true; ['pointerdown', 'touchstart', 'wheel'].forEach(function (ev) { car.addEventListener(ev, function () { car.__mhTouched = true; }, { passive: true }); }); }
        car.scrollLeft = 0;
      }
    }
    /* "הכול" מופיע רק אם Hyperzod מדדה גלישה — המדידה קורית פעם אחת (ResizeObserver), לפעמים לפני שהכרטיסים
       נטענו → אין כפתור לתמיד. אירוע scroll מפעיל אצלם את המדידה מחדש (onScroll → updateCarouselScrollState). */
    var crs = sec.querySelector('.nm-carousel');
    if (crs && !rows2 && n && !btn && !crs.__mhNudged && crs.scrollWidth > crs.clientWidth + 1) { crs.__mhNudged = true; crs.dispatchEvent(new Event('scroll')); stats.nudged = (stats.nudged || 0) + 1; }
    arrows(sec);
    /* כולם סגורים → שורה אחת רגועה במקום להבין לבד מתוך כרטיסים אפורים */
    var open = states.filter(function (s) { return s.state === 'open'; }).length, first = null;
    states.forEach(function (s) { if (s.state === 'closed' && (!first || s.rank < first.rank)) { first = s; } });
    var note = '';
    if (n && !open && !pageNote) { var w = first && shortWhen(first); note = w ? 'כולם סגורים עכשיו · הראשון ' + w.full : 'כולם סגורים עכשיו'; }
    var head = sec.firstElementChild;   /* attr() קורא מהאלמנט של ה-::after עצמו — לכן על הכותרת, לא על הסקשן */
    if (head && head.getAttribute('data-mh-note') !== note) { if (note) { head.setAttribute('data-mh-note', note); } else { head.removeAttribute('data-mh-note'); } }
    stats.closed = states.filter(function (s) { return s.state !== 'open'; }).length;
    return states;
  }

  /* דף "הכול": הכותרת = כותרת הסקשן (Hyperzod מציגה "nearby-merchants") */
  function collectionPage() {
    var page = document.getElementById('merchants_by_category');
    if (!page || !/[?&]collection=true/.test(location.search)) { return; }
    var h = page.querySelector('.scheme-mobile-page-header h1, h1');
    var want = lastTitle || 'כל המקומות';
    if (h && h.textContent.trim() !== want) { h.textContent = want; stats.titles++; }
    /* אותו סדר כמו בבית (פתוחים, ואז לפי שעת הפתיחה) + שורת סיכום בראש הרשימה */
    var row = null, states = [];
    [].forEach.call(page.querySelectorAll('a.merchant-card'), function (c) {
      var st = decorate(c), col = c.closest('[class*="v-col"]');
      states.push(st);
      if (col) { row = row || col.parentElement; var o = String(Math.min(st.rank, 1e7) | 0); if (col.style.order !== o) { col.style.order = o; } }
    });
    if (row) {
      var open = states.filter(function (x) { return x.state === 'open'; }).length, first = null, note;
      states.forEach(function (x) { if (x.state === 'closed' && (!first || x.rank < first.rank)) { first = x; } });
      note = states.length + ' מקומות · ' + (open ? (open === states.length ? 'כולם פתוחים עכשיו' : open + ' פתוחים עכשיו') : 'כולם סגורים עכשיו' + (first ? ' · הראשון ' + shortWhen(first).full : ''));
      if (row.getAttribute('data-mh-note') !== note) { row.setAttribute('data-mh-note', note); }
    }
  }

  /* רוב הדף סגור (80%+) → שורה אחת לפני האוסף הראשון. שבת (רוב הפתיחות במוצ״ש) → "שבת שלום" */
  var pageNote = '';
  function pageSummary(secs) {
    var all = [], seen = {};
    secs.forEach(function (sec) { [].forEach.call(sec.querySelectorAll('a.merchant-card'), function (c) { var id = c.getAttribute('data-merchant-id') || c.getAttribute('href'); if (seen[id]) { return; } seen[id] = 1; all.push(cardState(c)); }); });
    var closed = all.filter(function (x) { return x.state !== 'open'; }), timed = closed.filter(function (x) { return x.state === 'closed'; }), first = null, motz = 0;
    timed.forEach(function (x) { if (!first || x.rank < first.rank) { first = x; } if (x.day === 'מוצ״ש') { motz++; } });
    if (all.length < 4 || closed.length / all.length < 0.8 || !first) { return ''; }
    if (motz * 2 >= timed.length && first.day === 'מוצ״ש') { return 'שבת שלום · נפתחים במוצ״ש, הראשון ב-' + first.time; }
    return 'רוב המקומות סגורים עכשיו · הראשון נפתח ' + (first.day && first.day !== 'היום' ? first.day + ' ' : '') + 'ב-' + first.time;
  }
  /* פונט הכותרות (Noto Sans Hebrew צר 800, ~30KB, נשמר במטמון של Google) — רק כשיש סקשנים כאלה בדף */
  var fontOn = false;
  function titleFont() {
    if (fontOn || !document.querySelector('[id="MerchantCollection"], [id="ProductHighlights"]')) { return; }
    fontOn = true;
    try { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wdth,wght@75,800&display=swap'; l.setAttribute('data-mh-col-font', ''); document.head.appendChild(l); } catch (e) {}
  }
  function sync() {
    try {
      titleFont();
      var secs = [].slice.call(document.querySelectorAll('[id="MerchantCollection"]'));
      pageNote = pageSummary(secs); stats.pageNote = pageNote;
      secs.forEach(function (sec, i) {
        var head = sec.firstElementChild, want = i === 0 ? pageNote : '';
        if (head && (head.getAttribute('data-mh-page-note') || '') !== want) { if (want) { head.setAttribute('data-mh-page-note', want); } else { head.removeAttribute('data-mh-page-note'); } }
      });
      secs.forEach(section);
      collectionPage();
    } catch (e) { stats.errors++; }
  }

  /* שלב capture — לפני ש-Hyperzod מנווטת: זוכרים את כותרת הסקשן (+ אימוג'י) */
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest && e.target.closest('.nm-see-all-btn');
    if (!b) { return; }
    var sec = b.closest('[id="MerchantCollection"]'), h = sec && sec.querySelector('h1');
    if (h) { lastTitle = (h.textContent.replace(/\s+/g, ' ').trim() + (h.getAttribute('data-mh-emoji') ? ' ' + h.getAttribute('data-mh-emoji') : '')).trim(); }
  }, true);

  try { document.addEventListener('touchstart', function () {}, { passive: true }); } catch (e) {}   /* בלי מאזין touchstart ספארי באייפון לא מפעיל :active (הלחיצה על הכרטיס) */
  /* MutationObserver → rAF: רץ לפני הציור הבא — "View all"/"nearby-merchants" לא מהבהבים */
  var busy = false;
  try {
    new MutationObserver(function () { if (busy) { return; } busy = true; requestAnimationFrame(function () { try { sync(); } finally { busy = false; } }); })   /* לפני הציור הבא, פעם אחת לפריים */
      .observe(document.documentElement, { subtree: true, childList: true, characterData: true });
    sync();
  } catch (e) { console.warn('[MH Collections] disabled:', e); }

  window.MH_COLLECTIONS = { version: VERSION, sync: sync, kosher: kosher, tagline: tagline, status: status, stats: function () { return JSON.parse(JSON.stringify(stats)); } };
  /* mh-collections-v1 */
})();
