import SwiftUI
import UIKit

// MARK: - Tab Bar Icon Helper

/// Helper to create properly sized tab bar icons from images
struct TabBarIcon {
    /// Creates a UIImage suitable for tab bar use with proper sizing
    static func createIcon(named: String, size: CGSize = CGSize(width: 25, height: 25)) -> UIImage? {
        guard let originalImage = UIImage(named: named) else {
            return nil
        }

        // Create a graphics context
        UIGraphicsBeginImageContextWithOptions(size, false, 0.0)
        defer { UIGraphicsEndImageContext() }

        // Draw the image centered and scaled to fit
        let aspectWidth = size.width / originalImage.size.width
        let aspectHeight = size.height / originalImage.size.height
        let aspectRatio = min(aspectWidth, aspectHeight)

        let scaledWidth = originalImage.size.width * aspectRatio
        let scaledHeight = originalImage.size.height * aspectRatio
        let x = (size.width - scaledWidth) / 2.0
        let y = (size.height - scaledHeight) / 2.0

        originalImage.draw(in: CGRect(x: x, y: y, width: scaledWidth, height: scaledHeight))

        return UIGraphicsGetImageFromCurrentImageContext()?.withRenderingMode(.alwaysTemplate)
    }
}

// MARK: - Custom Tab Bar Item View

struct CustomTabBarItem: View {
    let title: String
    let imageName: String
    let isSystemImage: Bool

    init(title: String, systemImage: String) {
        self.title = title
        self.imageName = systemImage
        self.isSystemImage = true
    }

    init(title: String, imageName: String) {
        self.title = title
        self.imageName = imageName
        self.isSystemImage = false
    }

    var body: some View {
        VStack(spacing: 4) {
            if isSystemImage {
                Image(systemName: imageName)
                    .font(.system(size: 24))
            } else {
                Image(imageName)
                    .renderingMode(.template)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 24, height: 24)
            }

            Text(title)
                .font(.system(size: 10))
        }
    }
}
