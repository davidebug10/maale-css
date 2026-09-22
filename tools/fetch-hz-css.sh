#!/bin/sh
# מוריד את ה-CSS הנוכחי של Hyperzod לתיקיית tools/hz — למוקים. שמות הקבצים משתנים בכל build.
# vendor.css + index.css מה-HTML של דף הבית; non-critical.css + merchant-search.css הם chunks עצלים
# (שמותיהם נמצאים רק בתוך ה-JS הראשי) — בלעדיהם המוק של דף עסק שגוי: .merchant-header-img{position:absolute}
# יושב ב-non-critical, וכפתורי החזרה/סינון/חיפוש הצפים (.merchant-floating-*) ב-merchant-search.
set -e
cd "$(dirname "$0")"; mkdir -p hz
HTML=$(curl -s 'https://www.maalehamishlohim.co.il/he/home')
V=$(echo "$HTML" | grep -o 'href="[^"]*vendor-vuetify[^"]*\.css"' | head -1 | sed 's/href="//;s/"$//')
I=$(echo "$HTML" | grep -o 'href="[^"]*index-[^"]*\.css"' | head -1 | sed 's/href="//;s/"$//')
J=$(echo "$HTML" | grep -o 'src="[^"]*assets/index-[^"]*\.js"' | head -1 | sed 's/src="//;s/"$//')
case "$J" in http*) ;; *) J="https://www.maalehamishlohim.co.il$J";; esac
JS=$(curl -s "$J")
N=$(echo "$JS" | grep -o 'non-critical-[A-Za-z0-9_-]*\.css' | head -1)
M=$(echo "$JS" | grep -o 'merchant-search-[A-Za-z0-9_-]*\.css' | head -1)
for pair in "$V:vendor.css" "$I:index.css" "https://cdn-store.hyperzod.app/assets/$N:non-critical.css" "https://cdn-store.hyperzod.app/assets/$M:merchant-search.css"; do url=${pair%:*}; name=${pair##*:}; case "$url" in http*) ;; *) url="https://www.maalehamishlohim.co.il$url";; esac; curl -s "$url" -o "hz/$name"; echo "$name <- $url ($(wc -c < hz/$name) bytes)"; done
