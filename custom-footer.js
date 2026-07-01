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
