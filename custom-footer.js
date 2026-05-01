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
   Bottom Nav - Anti-Vibrate (disable haptic feedback)
   תאריך: 2026-05-01
   מטרה: ביטול הרטט הפיזי במכשיר בכל לחיצה על הסרגל
   הבעיה: Hyperzod מפעיל navigator.vibrate בכל לחיצה - מציק במובייל
   הפתרון: דריסת navigator.vibrate לפונקציה ריקה
   ========================================================= */
(function() {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate = function() { return false; };
  }
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

/* =========================================================
   זמני: דיאגנוסטיקת רטט - יוסר אחרי האבחון
   תאריך: 2026-05-01
   מטרה: לזהות מאיפה מגיע הרטט באפליקציית מובייל
   ========================================================= */
(function() {
  // ממתינים 3 שניות אחרי טעינת הדף - שכל ה-bridges של האפליקציה ייטענו
  setTimeout(function() {
    var report = [];

    report.push('=== דיאגנוסטיקת רטט ===');
    report.push('זמן: ' + new Date().toLocaleTimeString('he-IL'));
    report.push('User Agent: ' + navigator.userAgent.substring(0, 60));
    report.push('');
    report.push('--- 1. navigator.vibrate ---');
    report.push('קיים: ' + (typeof navigator.vibrate));

    report.push('');
    report.push('--- 2. Capacitor (Hyperzod app likely) ---');
    if (window.Capacitor) {
      report.push('Capacitor: כן');
      try {
        report.push('isNative: ' + (window.Capacitor.isNativePlatform ? window.Capacitor.isNativePlatform() : 'unknown'));
        report.push('platform: ' + (window.Capacitor.getPlatform ? window.Capacitor.getPlatform() : 'unknown'));
        if (window.Capacitor.Plugins) {
          report.push('Plugins: ' + Object.keys(window.Capacitor.Plugins).join(', '));
          if (window.Capacitor.Plugins.Haptics) {
            report.push('Haptics נמצא! Methods: ' + Object.keys(window.Capacitor.Plugins.Haptics).join(', '));
          }
        }
      } catch(e) {
        report.push('שגיאה: ' + e.message);
      }
    } else {
      report.push('Capacitor: לא');
    }

    report.push('');
    report.push('--- 3. Cordova ---');
    report.push('cordova: ' + (typeof window.cordova));
    if (window.cordova && window.cordova.plugins) {
      report.push('plugins: ' + Object.keys(window.cordova.plugins).join(', '));
    }

    report.push('');
    report.push('--- 4. WebKit (iOS bridge) ---');
    if (window.webkit && window.webkit.messageHandlers) {
      report.push('messageHandlers: ' + Object.keys(window.webkit.messageHandlers).join(', '));
    } else {
      report.push('webkit: לא');
    }

    report.push('');
    report.push('--- 5. Android bridge ---');
    report.push('Android: ' + (typeof window.Android));
    report.push('AndroidVibrate: ' + (typeof window.AndroidVibrate));

    report.push('');
    report.push('--- 6. window.* keys with "vibr" or "haptic" ---');
    var matches = [];
    for (var key in window) {
      try {
        if (key.toLowerCase().indexOf('vibr') >= 0 || key.toLowerCase().indexOf('haptic') >= 0) {
          matches.push(key + ' (' + typeof window[key] + ')');
        }
      } catch(e) {}
    }
    report.push(matches.length ? matches.join('\n') : 'אין');

    // הצגת החלונית
    var modal = document.createElement('div');
    modal.id = 'mh-diag-modal';
    modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;border:3px solid #e31e24;border-radius:16px;padding:20px;max-width:90vw;max-height:80vh;overflow:auto;z-index:999999;font-family:monospace;font-size:11px;text-align:left;direction:ltr;box-shadow:0 20px 60px rgba(0,0,0,0.3);white-space:pre-wrap;line-height:1.5';
    modal.textContent = report.join('\n');

    var closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    closeBtn.style.cssText = 'position:absolute;top:8px;left:8px;background:#e31e24;color:white;border:none;border-radius:8px;padding:6px 12px;font-weight:bold;font-size:12px;cursor:pointer';
    closeBtn.onclick = function(){ modal.remove(); };
    modal.appendChild(closeBtn);

    document.body.appendChild(modal);
  }, 3000);
})();
