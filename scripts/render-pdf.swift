// Renders every page of a PDF to PNG using macOS PDFKit (no extra software needed).
// usage: swift scripts/render-pdf.swift <file.pdf> <outDir> <widthPx>
// Writes outDir/01.png, 02.png, ... on a white background.
import Foundation
import PDFKit
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count == 4, let width = Double(args[3]) else {
  FileHandle.standardError.write("usage: render-pdf.swift <file.pdf> <outDir> <widthPx>\n".data(using: .utf8)!)
  exit(2)
}
guard let doc = PDFDocument(url: URL(fileURLWithPath: args[1])) else {
  FileHandle.standardError.write("cannot open \(args[1])\n".data(using: .utf8)!)
  exit(1)
}
let outDir = URL(fileURLWithPath: args[2])
try FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)

for i in 0..<doc.pageCount {
  guard let page = doc.page(at: i) else { continue }
  let box = page.bounds(for: .mediaBox)
  let scale = width / Double(box.width)
  let w = Int(width.rounded())
  let h = Int((Double(box.height) * scale).rounded())
  guard let ctx = CGContext(
    data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0,
    space: CGColorSpaceCreateDeviceRGB(),
    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
  ) else { exit(1) }
  ctx.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
  ctx.fill(CGRect(x: 0, y: 0, width: w, height: h))
  ctx.scaleBy(x: CGFloat(scale), y: CGFloat(scale))
  page.draw(with: .mediaBox, to: ctx)
  guard let image = ctx.makeImage() else { exit(1) }
  let file = outDir.appendingPathComponent(String(format: "%02d.png", i + 1))
  guard let dest = CGImageDestinationCreateWithURL(file as CFURL, UTType.png.identifier as CFString, 1, nil) else { exit(1) }
  CGImageDestinationAddImage(dest, image, nil)
  CGImageDestinationFinalize(dest)
}
print("\(args[1]): \(doc.pageCount) pages -> \(args[2])")
