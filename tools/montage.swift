// montage: גיליון של צילומים עם שם הקובץ מעל כל אחד (בלי ImageMagick/PIL). בנייה והרצה:
//   swiftc -O tools/montage.swift -o /tmp/montage && /tmp/montage out.jpg <עמודות> <רוחב-תא> a.jpg b.jpg ...
import AppKit
let a = CommandLine.arguments
let out = a[1], cols = Int(a[2])!, cw = CGFloat(Double(a[3])!)
let files = Array(a[4...])
let imgs = files.compactMap { NSImage(contentsOfFile: $0) }
let ratio = imgs[0].size.height / imgs[0].size.width
let ch = cw * ratio, rows = Int(ceil(Double(imgs.count) / Double(cols)))
let W = cw * CGFloat(cols), H = (ch + 22) * CGFloat(rows)
let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: Int(W), pixelsHigh: Int(H), bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
NSGraphicsContext.saveGraphicsState(); NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
NSColor.white.setFill(); NSRect(x: 0, y: 0, width: W, height: H).fill()
for (i, im) in imgs.enumerated() {
  let r = i / cols, c = i % cols, y = H - CGFloat(r + 1) * (ch + 22)
  im.draw(in: NSRect(x: CGFloat(c) * cw, y: y, width: cw - 4, height: ch))
  (((files[i] as NSString).lastPathComponent as NSString).deletingPathExtension as NSString).draw(at: NSPoint(x: CGFloat(c) * cw + 4, y: y + ch + 3), withAttributes: [.font: NSFont.boldSystemFont(ofSize: 13), .foregroundColor: NSColor.red])
}
NSGraphicsContext.restoreGraphicsState()
try! rep.representation(using: .jpeg, properties: [.compressionFactor: 0.72])!.write(to: URL(fileURLWithPath: out))
