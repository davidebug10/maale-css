// wk-snap: טוען דף ב-WebKit אמיתי (המנוע של ספארי) ברוחב טלפון, מריץ צעדים ומצלם. בנייה והרצה:
//   swiftc -O tools/wk-snap.swift -o /tmp/wk-snap && /tmp/wk-snap steps.json
// מגבלה: takeSnapshot של WebKit לא מצייר backdrop-filter בכלל — טשטוש זכוכית בודקים בכרום (cdp.mjs);
// כאן בודקים את כל השאר: אייקונים (mask), צבעים, גבולות, צללים, פריסה. הצעד הראשון לפעמים לפני טעינת הפונט.
// steps.json: { "url": "...", "width": 390, "height": 844, "ua": "...", "block": ["regex", ...],
//               "injectCss": "path", "injectJs": "path", "wait": 6,
//               "steps": [ { "js": "...", "wait": 1.0, "snap": "out.png", "clip": [x,y,w,h], "print": true } ] }
// js שמחזיר מחרוזת/מספר מודפס ל-stdout כשה-print=true. clip ביחידות CSS.
import Cocoa
import WebKit

struct Step: Decodable { let js: String?; let wait: Double?; let snap: String?; let clip: [Double]?; let print: Bool? }
struct Cfg: Decodable { let url: String; let width: Double?; let height: Double?; let ua: String?; let block: [String]?; let injectCss: String?; let injectJs: String?; let wait: Double?; let steps: [Step] }

final class Runner: NSObject, WKNavigationDelegate {
  let cfg: Cfg; var web: WKWebView!; var window: NSWindow!; var loaded = false
  init(_ c: Cfg) { cfg = c }
  func start() {
    let w = cfg.width ?? 390, h = cfg.height ?? 844
    let conf = WKWebViewConfiguration()
    let ucc = WKUserContentController()
    if let p = cfg.injectCss, let css = try? String(contentsOfFile: p, encoding: .utf8) {
      let data = try! JSONSerialization.data(withJSONObject: [css]); let lit = String(data: data, encoding: .utf8)!
      ucc.addUserScript(WKUserScript(source: "(function(){var s=document.createElement('style');s.id='wk-local-css';s.textContent=\(lit)[0];(document.head||document.documentElement).appendChild(s);})();", injectionTime: .atDocumentEnd, forMainFrameOnly: true))
    }
    if let p = cfg.injectJs, let js = try? String(contentsOfFile: p, encoding: .utf8) {
      ucc.addUserScript(WKUserScript(source: js, injectionTime: .atDocumentEnd, forMainFrameOnly: true))
    }
    conf.userContentController = ucc
    conf.websiteDataStore = .nonPersistent()   /* בלי מטמון מריצה קודמת — אחרת נטען CSS ישן (max-age=600 של GitHub Pages) */
    let finish = { [self] in
      web = WKWebView(frame: NSRect(x: 0, y: 0, width: w, height: h), configuration: conf)
      web.customUserAgent = cfg.ua ?? "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1"
      web.navigationDelegate = self
      /* WebKit מאט דף שחלונו "מכוסה" (עוצר אנימציות וציור). מכבים דרך מתודות פרטיות — רק אם קיימות, ומפתח KVC בלי קו תחתון (KVC מוצא לבד את _setX:) */
      if web.responds(to: NSSelectorFromString("_setWindowOcclusionDetectionEnabled:")) { web.setValue(false, forKey: "windowOcclusionDetectionEnabled") }
      for k in ["HiddenPageDOMTimerThrottlingEnabled", "HiddenPageCSSAnimationSuspensionEnabled", "PageVisibilityBasedProcessSuppressionEnabled"] {
        if conf.preferences.responds(to: NSSelectorFromString("_set" + k + ":")) { conf.preferences.setValue(false, forKey: k.prefix(1).lowercased() + k.dropFirst()) }
      }
      /* חלון על המסך אבל כמעט שקוף ולא לוכד עכבר — חלון מחוץ למסך נחשב "מוסתר" ו-WebKit עוצר אנימציות וציור */
      window = NSWindow(contentRect: NSRect(x: 0, y: 0, width: w, height: h), styleMask: [.borderless], backing: .buffered, defer: false)
      window.alphaValue = 0.01; window.ignoresMouseEvents = true; window.hasShadow = false; window.level = .normal
      window.contentView = web; window.orderFront(nil)
      let u = URL(string: cfg.url)!
      if u.isFileURL { web.loadFileURL(u, allowingReadAccessTo: u.deletingLastPathComponent()) } else { web.load(URLRequest(url: u)) }
    }
    if let b = cfg.block, !b.isEmpty {
      let rules = b.map { ["trigger": ["url-filter": $0], "action": ["type": "block"]] }
      let json = String(data: try! JSONSerialization.data(withJSONObject: rules), encoding: .utf8)!
      WKContentRuleListStore.default().compileContentRuleList(forIdentifier: "wkblock\(Int(Date().timeIntervalSince1970))", encodedContentRuleList: json) { list, err in
        if let list = list { conf.userContentController.add(list) } else { FileHandle.standardError.write("rule error \(String(describing: err))\n".data(using: .utf8)!) }
        finish()
      }
    } else { finish() }
  }
  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    if loaded { return }; loaded = true
    DispatchQueue.main.asyncAfter(deadline: .now() + (cfg.wait ?? 6)) { self.run(0) }
  }
  func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) { FileHandle.standardError.write("fail \(error)\n".data(using: .utf8)!); exit(2) }
  func run(_ i: Int) {
    if i >= cfg.steps.count { exit(0) }
    let s = cfg.steps[i]
    let afterJs = { [self] in
      DispatchQueue.main.asyncAfter(deadline: .now() + (s.wait ?? 0.5)) { [self] in
        guard let out = s.snap else { run(i + 1); return }
        let sc = WKSnapshotConfiguration()
        if let c = s.clip, c.count == 4 { sc.rect = NSRect(x: c[0], y: c[1], width: c[2], height: c[3]); sc.snapshotWidth = NSNumber(value: c[2] * 2) }
        web.takeSnapshot(with: sc) { img, err in
          if let img = img, let tiff = img.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff), let png = rep.representation(using: .png, properties: [:]) {
            try? png.write(to: URL(fileURLWithPath: out))
          } else { FileHandle.standardError.write("snap error \(String(describing: err))\n".data(using: .utf8)!) }
          self.run(i + 1)
        }
      }
    }
    if let js = s.js {
      web.evaluateJavaScript(js) { res, err in
        if s.print == true { print(res.map { "\($0)" } ?? "ERR \(String(describing: err))") }
        afterJs()
      }
    } else { afterJs() }
  }
}

let path = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "steps.json"
let cfg = try! JSONDecoder().decode(Cfg.self, from: Data(contentsOf: URL(fileURLWithPath: path)))
let app = NSApplication.shared
app.setActivationPolicy(.accessory)
let runner = Runner(cfg)
DispatchQueue.main.async { runner.start() }
DispatchQueue.main.asyncAfter(deadline: .now() + 180) { FileHandle.standardError.write("timeout\n".data(using: .utf8)!); exit(3) }
app.run()
