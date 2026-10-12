// רצף תמונות (JPEG/PNG) → MP4 (H.264) — לסרטון "איך זה נראה" לדוד. שימוש: frames2mp4 <list.txt> <out.mp4> <fps> <kbps>
// list.txt: נתיב לתמונה בכל שורה, שורה = פריים (חזרה על שורה = החזקת פריים)
import AVFoundation
import ImageIO
let a = CommandLine.arguments
let paths = try! String(contentsOfFile: a[1]).split(separator: "\n").map(String.init).filter { !$0.isEmpty }
let out = URL(fileURLWithPath: a[2]); let fps = Int32(a[3])!; let kbps = Int(a[4])!
try? FileManager.default.removeItem(at: out)
func load(_ p: String) -> CGImage { let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: p) as CFURL, nil)!; return CGImageSourceCreateImageAtIndex(src, 0, nil)! }
let first = load(paths[0]); let W = first.width & ~1, H = first.height & ~1
let w = try! AVAssetWriter(outputURL: out, fileType: .mp4); w.shouldOptimizeForNetworkUse = true
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: W, AVVideoHeightKey: H,
  AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: kbps * 1000, AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel, AVVideoMaxKeyFrameIntervalKey: Int(fps) * 2]])
let ad = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB, kCVPixelBufferWidthKey as String: W, kCVPixelBufferHeightKey as String: H])
w.add(input); w.startWriting(); w.startSession(atSourceTime: .zero)
var cache: [String: CGImage] = [:]
for (i, p) in paths.enumerated() {
  while !input.isReadyForMoreMediaData { usleep(2000) }
  let img = cache[p] ?? load(p); cache = [p: img]
  var pb: CVPixelBuffer?; CVPixelBufferPoolCreatePixelBuffer(nil, ad.pixelBufferPool!, &pb)
  CVPixelBufferLockBaseAddress(pb!, [])
  let ctx = CGContext(data: CVPixelBufferGetBaseAddress(pb!), width: W, height: H, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(pb!), space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue)!
  ctx.draw(img, in: CGRect(x: 0, y: 0, width: W, height: H))
  CVPixelBufferUnlockBaseAddress(pb!, [])
  ad.append(pb!, withPresentationTime: CMTime(value: Int64(i), timescale: fps))
}
input.markAsFinished(); let sem = DispatchSemaphore(value: 0); w.finishWriting { sem.signal() }; sem.wait()
print("wrote \(out.lastPathComponent) \(W)x\(H) \(paths.count) frames @\(fps)fps status \(w.status.rawValue) \(w.error?.localizedDescription ?? "")")
