import SwiftUI

// MARK: - Dark Mode Support Extension

extension Theme {

    // MARK: - Adaptive Colors

    /// Adaptive colors that change based on color scheme
    struct AdaptiveColors {

        // MARK: - Background Colors

        /// Primary background (white in light, dark in dark mode)
        static var background: Color {
            Color(UIColor { traitCollection in
                traitCollection.userInterfaceStyle == .dark
                    ? UIColor(hex: "121212")
                    : UIColor(hex: "FFFFFF")
            })
        }

        /// Secondary background
        static var backgroundSecondary: Color {
            Color(UIColor { traitCollection in
                traitCollection.userInterfaceStyle == .dark
                    ? UIColor(hex: "1E1E1E")
                    : UIColor(hex: "F9F9F9")
            })
        }

        /// Tertiary background
        static var backgroundTertiary: Color {
            Color(UIColor { traitCollection in
                traitCollection.userInterfaceStyle == .dark
                    ? UIColor(hex: "2A2A2A")
                    : UIColor(hex: "F2F2F2")
            })
        }

        // MARK: - Text Colors

        /// Primary text color
        static var textPrimary: Color {
            Color(UIColor { traitCollection in
                traitCollection.userInterfaceStyle == .dark
                    ? UIColor(hex: "FFFFFF")
                    : UIColor(hex: "111827")
            })
        }

        /// Secondary text color
        static var textSecondary: Color {
            Color(UIColor { traitCollection in
                traitCollection.userInterfaceStyle == .dark
                    ? UIColor(hex: "A0A0A0")
                    : UIColor(hex: "6B7280")
            })
        }

        /// Tertiary text color
        static var textTertiary: Color {
            Color(UIColor { traitCollection in
                traitCollection.userInterfaceStyle == .dark
                    ? UIColor(hex: "707070")
                    : UIColor(hex: "9CA3AF")
            })
        }

        // MARK: - Border Colors

        /// Default border color
        static var border: Color {
            Color(UIColor { traitCollection in
                traitCollection.userInterfaceStyle == .dark
                    ? UIColor(hex: "3A3A3A")
                    : UIColor(hex: "E5E5E5")
            })
        }

        /// Input border color
        static var borderInput: Color {
            Color(UIColor { traitCollection in
                traitCollection.userInterfaceStyle == .dark
                    ? UIColor(hex: "4A4A4A")
                    : UIColor(hex: "D9D9D9")
            })
        }

        // MARK: - Card Colors

        /// Card background with subtle elevation
        static var card: Color {
            Color(UIColor { traitCollection in
                traitCollection.userInterfaceStyle == .dark
                    ? UIColor(hex: "1E1E1E")
                    : UIColor(hex: "FFFFFF")
            })
        }

        /// Elevated card background
        static var cardElevated: Color {
            Color(UIColor { traitCollection in
                traitCollection.userInterfaceStyle == .dark
                    ? UIColor(hex: "2A2A2A")
                    : UIColor(hex: "FFFFFF")
            })
        }

        // MARK: - Shadow Colors

        /// Shadow opacity for dark mode
        static var shadowOpacity: Double {
            return 0.3 // Stronger shadows in dark mode
        }

        /// Shadow color
        static var shadow: Color {
            Color(UIColor { traitCollection in
                traitCollection.userInterfaceStyle == .dark
                    ? UIColor.black.withAlphaComponent(0.5)
                    : UIColor.black.withAlphaComponent(0.1)
            })
        }

        // MARK: - Gray Scale Adaptive

        struct Gray {
            static var _50: Color {
                Color(UIColor { traitCollection in
                    traitCollection.userInterfaceStyle == .dark
                        ? UIColor(hex: "2A2A2A")
                        : UIColor(hex: "F9F9F9")
                })
            }

            static var _100: Color {
                Color(UIColor { traitCollection in
                    traitCollection.userInterfaceStyle == .dark
                        ? UIColor(hex: "333333")
                        : UIColor(hex: "F2F2F2")
                })
            }

            static var _200: Color {
                Color(UIColor { traitCollection in
                    traitCollection.userInterfaceStyle == .dark
                        ? UIColor(hex: "404040")
                        : UIColor(hex: "E5E5E5")
                })
            }

            static var _300: Color {
                Color(UIColor { traitCollection in
                    traitCollection.userInterfaceStyle == .dark
                        ? UIColor(hex: "4D4D4D")
                        : UIColor(hex: "D9D9D9")
                })
            }

            static var _400: Color {
                Color(UIColor { traitCollection in
                    traitCollection.userInterfaceStyle == .dark
                        ? UIColor(hex: "666666")
                        : UIColor(hex: "BFBFBF")
                })
            }

            static var _500: Color {
                Theme.GrayColors._500 // Neutral, works in both modes
            }

            static var _600: Color {
                Color(UIColor { traitCollection in
                    traitCollection.userInterfaceStyle == .dark
                        ? UIColor(hex: "BFBFBF")
                        : UIColor(hex: "666666")
                })
            }

            static var _700: Color {
                Color(UIColor { traitCollection in
                    traitCollection.userInterfaceStyle == .dark
                        ? UIColor(hex: "D9D9D9")
                        : UIColor(hex: "404040")
                })
            }

            static var _800: Color {
                Color(UIColor { traitCollection in
                    traitCollection.userInterfaceStyle == .dark
                        ? UIColor(hex: "E5E5E5")
                        : UIColor(hex: "2D2D2D")
                })
            }

            static var _900: Color {
                Color(UIColor { traitCollection in
                    traitCollection.userInterfaceStyle == .dark
                        ? UIColor(hex: "F2F2F2")
                        : UIColor(hex: "1A1A1A")
                })
            }
        }
    }
}

// MARK: - UIColor Extension for Hex

extension UIColor {
    convenience init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }

        self.init(
            red: CGFloat(r) / 255,
            green: CGFloat(g) / 255,
            blue: CGFloat(b) / 255,
            alpha: CGFloat(a) / 255
        )
    }
}

// MARK: - Color Scheme Environment Helper

/// Helper to detect current color scheme
struct ColorSchemeDetector: ViewModifier {
    @Environment(\.colorScheme) var colorScheme
    let onChange: (ColorScheme) -> Void

    func body(content: Content) -> some View {
        content
            .onChange(of: colorScheme) { newScheme in
                onChange(newScheme)
            }
            .onAppear {
                onChange(colorScheme)
            }
    }
}

extension View {
    /// Detect color scheme changes
    func onColorSchemeChange(_ action: @escaping (ColorScheme) -> Void) -> some View {
        modifier(ColorSchemeDetector(onChange: action))
    }
}
