#!/bin/sh
# מוריד את ה-CSS הנוכחי של Hyperzod (vendor-vuetify + index) לתיקיית tools/hz — למוקים. שמות הקבצים משתנים בכל build.
set -e
cd "$(dirname "$0")"; mkdir -p hz
HTML=$(curl -s 'https://www.maalehamishlohim.co.il/he/home')
V=$(echo "$HTML" | grep -o 'href="[^"]*vendor-vuetify[^"]*\.css"' | head -1 | sed 's/href="//;s/"$//')
I=$(echo "$HTML" | grep -o 'href="[^"]*index-[^"]*\.css"' | head -1 | sed 's/href="//;s/"$//')
for pair in "$V:vendor.css" "$I:index.css"; do url=${pair%%:*}; url=${pair%:*}; name=${pair##*:}; case "$url" in http*) ;; *) url="https://www.maalehamishlohim.co.il$url";; esac; curl -s "$url" -o "hz/$name"; echo "$name <- $url ($(wc -c < hz/$name) bytes)"; done
