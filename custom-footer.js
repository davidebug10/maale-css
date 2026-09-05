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

/* =========================================================
   Bottom Nav - Sliding Active Indicator (Apple Liquid Glass)
   תאריך: 2026-05-01
   מטרה: יצירת אינדיקטור גלולה שמחליק חלק בין הטאבים
   הערה: ה-CSS של .mh-active-pill מוגדר ב-global-cdn.css
   ========================================================= */
(function() {
  const navId = 'MultiVendorBottomNav';

  function initIndicator() {
    const pill = document.querySelector('#' + navId + ' .floating-nav-pill');
    if (!pill) {
      setTimeout(initIndicator, 1000);
      return;
    }

    // אם כבר התחבר - לא ליצור שוב
    if (pill.dataset.mhSliderAttached === 'yes') return;
    pill.dataset.mhSliderAttached = 'yes';

    // צור את האינדיקטור
    let indicator = pill.querySelector('.mh-active-pill');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'mh-active-pill';
      pill.insertBefore(indicator, pill.firstChild);
    }

    function updatePosition() {
      const activeBtn = pill.querySelector('.floating-tab-active');
      if (!activeBtn) {
        indicator.style.opacity = '0';
        return;
      }

      const btnRect = activeBtn.getBoundingClientRect();
      const pillRect = pill.getBoundingClientRect();

      // RTL: מודדים מהימין
      const rightOffset = pillRect.right - btnRect.right;
      const width = btnRect.width;

      indicator.style.right = rightOffset + 'px';
      indicator.style.width = width + 'px';
      indicator.style.opacity = '1';
    }

    updatePosition();

    // עדכון כשהטאב הפעיל מתחלף
    const observer = new MutationObserver(updatePosition);
    pill.querySelectorAll('.floating-frosted-btn').forEach(function(btn) {
      observer.observe(btn, {
        attributes: true,
        attributeFilter: ['class']
      });
    });

    window.addEventListener('resize', updatePosition);
  }

  // SPA support
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIndicator);
  } else {
    initIndicator();
  }

  // Vue SPA navigation - אם הסרגל יוחלף, נחבר מחדש
  const bodyObserver = new MutationObserver(function() {
    const pill = document.querySelector('#' + navId + ' .floating-nav-pill');
    if (pill && pill.dataset.mhSliderAttached !== 'yes') {
      initIndicator();
    }
  });
  bodyObserver.observe(document.body, { childList: true, subtree: true });
})();

/* =========================================================
   Bottom Nav - Material Ripple Animation
   תאריך: 2026-05-01
   מטרה: גל אדום שמתפשט מנקודת הלחיצה על כל טאב
   הערה: ה-keyframes mh-ripple-burst מוגדרים ב-global-cdn.css
   ========================================================= */
(function() {
  const navId = 'MultiVendorBottomNav';

  function rippleHandler(e) {
    const btn = e.target.closest('#' + navId + ' .floating-frosted-btn');
    if (!btn) return;

    const pill = document.querySelector('#' + navId + ' .floating-nav-pill');
    if (!pill) return;

    const btnRect = btn.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();

    let clientX, clientY;
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX || (btnRect.left + btnRect.width / 2);
      clientY = e.clientY || (btnRect.top + btnRect.height / 2);
    }

    const x = clientX - pillRect.left;
    const y = clientY - pillRect.top;
    const size = btnRect.width * 1.4;

    const ripple = document.createElement('span');
    ripple.style.cssText =
      'position: absolute;' +
      'width: ' + size + 'px;' +
      'height: ' + size + 'px;' +
      'left: ' + (x - size / 2) + 'px;' +
      'top: ' + (y - size / 2) + 'px;' +
      'border-radius: 50%;' +
      'background: radial-gradient(circle, rgba(227,30,36,0.6) 0%, rgba(227,30,36,0.3) 40%, transparent 70%);' +
      'pointer-events: none;' +
      'z-index: 50;' +
      'animation: mh-ripple-burst 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards;' +
      'will-change: transform, opacity;';

    pill.appendChild(ripple);
    setTimeout(function() { ripple.remove(); }, 600);
  }

  document.addEventListener('pointerdown', rippleHandler, true);
  document.addEventListener('touchstart', rippleHandler, { capture: true, passive: true });
  document.addEventListener('mousedown', rippleHandler, true);
})();

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
   אישור גיל 18+ בהוספה לעגלה (אלכוהול / סיגריות) | 2026-07-25
   - תופס לחיצה על button.add-btn בשלב ה-capture (לפני Vue)
   - מזהה קטגוריה: .product-category-name בפופאפ מוצר,
     או h3.category-name בתוך .special-listing-inner ברשימה
   - חוסם רק אם שם הקטגוריה הוא בדיוק "אלכוהול" או "סיגריות"
   - אחרי אישור: נשמר ב-sessionStorage ומופעל click חוזר על הכפתור
   ========================================================= */
(function () {
    'use strict';

    if (window.__mhAgeGateInit) { return; }
    window.__mhAgeGateInit = true;

    var RESTRICTED = ['אלכוהול', 'סיגריות'];
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

    function categoryOf(target) {
        var popup = target.closest('.product-popup') || pizzaRoot();
        if (popup) {
            var c = popup.querySelector('.product-category-name');
            return c ? c.textContent.trim() : null;
        }
        var section = target.closest('.special-listing-inner');
        if (section) {
            var h = section.querySelector('h3.category-name');
            return h ? h.textContent.trim() : null;
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
        if (!cat || RESTRICTED.indexOf(cat) === -1) { return; }
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        showGate(btn);
    }, true);
})();

/* ============================================================================
   MH Pizza Quarters — Production v1.2
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

  function circleSvg(big) {
    var s = '<svg class="mhq-circle" viewBox="0 0 100 100">';
    for (var i = 1; i <= 4; i++) {
      s += '<path class="mhq-q" data-q="' + i + '" d="' + QPATH[i] + '"></path>';
      if (big) s += '<text class="mhq-num" x="' + QNUM[i][0] + '" y="' + QNUM[i][1] + '">' + i + '</text>';
    }
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

    /* לפני בחירה מציגים "₪2.5 לרבע" ולא את מחיר המגש השלם — אחרת הלקוח
       קורא ₪10 וחושב שזה מחיר התוספת. אחרי בחירה: המחיר בפועל. */
    var txt = sel.size ? '₪' + (plan.ok ? plan.price : 0)
      : (t.quarterPrice != null ? '₪' + t.quarterPrice + ' לרבע'
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
   אכיפת סוג משלוח לפי מיקום — MH Zone Enforcement  |  v1.3.0 | 2026-08-30
   -------------------------------------------------------------------------
   מה זה עושה:
     מסווג את כתובת המסירה של הלקוח מול פוליגון מעלה אדומים (כולל מישור
     אדומים), וכופה את סוג ההזמנה הנכון:
       בתוך העיר  → delivery  (התעריף הזול)
       מחוץ לעיר  → custom_2  (התעריף היקר)

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
  VERSION:      '1.3.0',
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
  ]
};

/* קירוב שטוח — מדויק לחלוטין בסקאלה של עיר (קו רוחב ~31.79°) */
var MLAT = 111320, MLNG = 94640;
var S = { vSeen:0, vFixed:0, oSeen:0, oFixed:0,
          uiClicks:0, uiHides:0, uiShows:0, uiSkips:0, errors:0 };
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

/* סיווג. קואורדינטה חסרה או לא תקינה → OUTSIDE (Fail-Closed) */
function classify(lat, lng) {
  if (!isFinite(lat) || !isFinite(lng) || (lat===0 && lng===0))
    return { zone:'UNKNOWN', type:CFG.OUTSIDE_TYPE, edge:null };
  var ins = inPoly(lng, lat, CFG.POLY), d = Math.round(edgeDist(lng, lat, CFG.POLY));
  if (d < CFG.EDGE_WARN_M) warn('קרוב לגבול ('+d+' מ׳):', lat, lng, ins?'בפנים':'בחוץ');
  return { zone: ins?'INSIDE':'OUTSIDE', type: ins?CFG.INSIDE_TYPE:CFG.OUTSIDE_TYPE, edge:d };
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

  var c = classify(lat, lng), rec = addrById(aid);
  LAST = { zone:c.zone, type:c.type, addr: rec ? rec.text : null };
  setTimeout(reconcileUI, 60);

  if (c.type === ot) { log('✓ validate תקין:', ot, '|', c.zone); return url; }
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
  if (!a) { warn('POST: כתובת לא נמצאה — מאלץ', CFG.OUTSIDE_TYPE);
            o.order_type = CFG.OUTSIDE_TYPE; S.oFixed++; return JSON.stringify(o); }
  var c = classify(a.lat, a.lng);
  if (c.type === o.order_type) { log('✅ POST תקין:', o.order_type, '|', c.zone); return body; }
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
  clearTimeout(t); t = setTimeout(reconcileUI, 200);
}).observe(document.body, { childList:true, subtree:true });

/* ---------- אבחון ---------- */
window.MH_ZONE = {
  version: CFG.VERSION,
  stats: function(){ console.table(S); console.log('סיווג:', LAST, '| applied:', appliedSig); return S; },
  check: function(lat,lng){ return classify(lat,lng); },
  reset: function(){ S.uiClicks = 0; appliedSig = null; },
  showAll: function(){
    [].forEach.call(document.querySelectorAll('.custom-radio[value]'), function(r){
      var it = r.closest('.v-list-item'); if (it) it.style.display = '';
    });
    var n = document.getElementById(CFG.NOTE_ID); if (n) n.remove();
    console.log('[MH-ZONE] כל האופציות הוחזרו');
  },
  test: function(){
    [['מרכז מעלה אדומים',31.7715,35.2986,'INSIDE'],
     ['מצפה נבו',31.7927,35.3029,'INSIDE'],
     ['מישור אדומים',31.7936,35.3337,'INSIDE'],
     ['כפר אדומים',31.8272,35.3372,'OUTSIDE'],
     ['אלון',31.8334,35.3536,'OUTSIDE'],
     ['נופי פרת',31.8235,35.3199,'OUTSIDE'],
     ['הר הצופים',31.7931,35.2449,'OUTSIDE']]
    .forEach(function(x){
      var r = classify(x[1],x[2]);
      console.log((r.zone===x[3]?'✅':'❌ שגוי!'), x[0], '→', r.zone);
    });
  }
};

log('פעיל | גרסה', CFG.VERSION);
})();

/* =========================================================================
   הזמנה מראש בלבד — MH Preorder Scheduling Guard  |  v1.0.0 | 2026-09-05
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
  VERSION: '1.0.0',
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
      if (row.style.display !== 'none') { row.style.display = 'none'; S.uiHides++; log('🙈 משלוח מיידי הוסתר:', ev.names.join(', ')); }
      var txt = '🕒 ' + ev.names.join(', ') + ' — להזמנה מראש בלבד. בחרו מועד למשלוח.';
      if (n && n.textContent !== txt) n.textContent = txt;
      var st = store(), sch = st && st.getters.getOrderSchedule;
      if (!autoOpened && !(sch && sch.is_scheduled)) {
        var box = row.closest('#OrderScheduling') || (row.parentElement && row.parentElement.parentElement);
        var item = box && box.querySelector('.navigation-item');
        if (item) { autoOpened = true; S.autoOpen++; setTimeout(function(){ item.click(); }, 500); log('📅 בורר המועדים נפתח'); }
      }
    } else {
      if (row.style.display === 'none') { row.style.display = ''; S.uiShows++; log('👁 משלוח מיידי הוחזר'); }
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
