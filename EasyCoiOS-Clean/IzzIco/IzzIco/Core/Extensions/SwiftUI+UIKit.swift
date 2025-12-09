import SwiftUI
import UIKit

// MARK: - SwiftUI to UIKit Conversions

extension Color {
    /// Convert SwiftUI Color to UIColor
    var uiColor: UIColor {
        UIColor(self)
    }
}

extension Font {
    /// Convert SwiftUI Font to UIFont (approximation)
    var uiFont: UIFont {
        // This is a simplified conversion
        // For exact conversion, you'd need to parse the Font's properties
        return UIFont.systemFont(ofSize: 16, weight: .regular)
    }
}

extension CGFloat {
    /// Self-reference for compatibility
    var cgFloat: CGFloat {
        return self
    }
}

extension Double {
    /// Convert to CGFloat
    var cgFloat: CGFloat {
        return CGFloat(self)
    }
}
