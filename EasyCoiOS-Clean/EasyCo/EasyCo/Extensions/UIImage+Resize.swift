import UIKit

extension UIImage {
    /// Resize image to specified size while maintaining aspect ratio
    func resized(to size: CGSize) -> UIImage {
        let aspectWidth = size.width / self.size.width
        let aspectHeight = size.height / self.size.height
        let aspectRatio = min(aspectWidth, aspectHeight)

        let scaledWidth = self.size.width * aspectRatio
        let scaledHeight = self.size.height * aspectRatio
        let x = (size.width - scaledWidth) / 2.0
        let y = (size.height - scaledHeight) / 2.0

        let renderer = UIGraphicsImageRenderer(size: size)
        return renderer.image { context in
            self.draw(in: CGRect(x: x, y: y, width: scaledWidth, height: scaledHeight))
        }
    }

    /// Create a properly sized tab bar icon
    static func tabBarIcon(named: String, size: CGSize = CGSize(width: 25, height: 25)) -> UIImage? {
        guard let image = UIImage(named: named) else {
            return nil
        }
        return image.resized(to: size).withRenderingMode(.alwaysTemplate)
    }
}
