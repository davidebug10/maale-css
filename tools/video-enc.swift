// סרטון הירו לאתר: HEVC/כל מקור → H.264 High, בביטרייט שבוחרים, בלי אודיו, moov בהתחלה (fast-start), חיתוך ריבועי ממורכז.
// בלי ffmpeg (אין במכונה) ובלי חבילות — AVFoundation של macOS. בנייה: swiftc -O tools/video-enc.swift -o /tmp/video-enc
// שימוש: /tmp/video-enc <in.mp4> <out.mp4> <size> <kbps> [startSec] [durSec] [keyframeEveryFrames=48]
// דוגמה (הירו דף הבית 9.10): 1440² HEVC 17MB → 960² @ 2000kbps = 2.25MB ל-9 שניות; באייפון (390px × 3) לא נראה הבדל מול 2600kbps.
// avconvert לא מאפשר לקבוע ביטרייט ולא מוריד אודיו (Preset1920x1080 נתן 10.8MB לאותו סרטון).
import AVFoundation
let a = CommandLine.arguments
let src = URL(fileURLWithPath: a[1]), dst = URL(fileURLWithPath: a[2])
let size = Int(a[3])!, kbps = Int(a[4])!
let start = a.count > 5 ? Double(a[5])! : 0, dur = a.count > 6 ? Double(a[6])! : -1, gop = a.count > 7 ? Int(a[7])! : 48
try? FileManager.default.removeItem(at: dst)
let asset = AVURLAsset(url: src)
let track = asset.tracks(withMediaType: .video)[0]
let reader = try! AVAssetReader(asset: asset)
let total = CMTimeGetSeconds(asset.duration)
reader.timeRange = CMTimeRange(start: CMTime(seconds: start, preferredTimescale: 600), duration: CMTime(seconds: dur > 0 ? dur : total - start, preferredTimescale: 600))
let out = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange])
reader.add(out)
let writer = try! AVAssetWriter(outputURL: dst, fileType: .mp4)
writer.shouldOptimizeForNetworkUse = true
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: size, AVVideoHeightKey: size,
  AVVideoScalingModeKey: AVVideoScalingModeResizeAspectFill,
  AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: kbps * 1000, AVVideoMaxKeyFrameIntervalKey: gop,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel, AVVideoAllowFrameReorderingKey: true,
    AVVideoH264EntropyModeKey: AVVideoH264EntropyModeCABAC, AVVideoExpectedSourceFrameRateKey: 24]
])
input.expectsMediaDataInRealTime = false
input.transform = track.preferredTransform
writer.add(input)
reader.startReading(); writer.startWriting(); writer.startSession(atSourceTime: CMTime(seconds: start, preferredTimescale: 600))
let q = DispatchQueue(label: "enc"); let done = DispatchSemaphore(value: 0); var n = 0
input.requestMediaDataWhenReady(on: q) {
  while input.isReadyForMoreMediaData {
    if let s = out.copyNextSampleBuffer() { input.append(s); n += 1 } else { input.markAsFinished(); writer.finishWriting { done.signal() }; return }
  }
}
done.wait()
let bytes = (try? FileManager.default.attributesOfItem(atPath: dst.path)[.size] as? Int) ?? 0
print("frames \(n) → \(dst.lastPathComponent) \(size)x\(size) \(String(format: "%.2f", Double(bytes) / 1e6))MB status \(writer.status.rawValue) \(writer.error?.localizedDescription ?? "")")
