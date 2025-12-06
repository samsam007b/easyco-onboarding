//
//  ModernDesignSystem.swift
//  EasyCo
//
//  Extension moderne du Design System avec glassmorphism
//  Basé sur les références Pinterest (Alena, Home app, etc.)
//  Préserve l'identité de marque EasyCo (gradients signature)
//

import SwiftUI

// MARK: - Modern Design System Extension

extension Theme {

    // MARK: - Modern Backgrounds

    /// Backgrounds avec gradients organiques inspirés des références Pinterest
    struct ModernBackgrounds {

        /// Background avec gradient signature EasyCo (utilisé pour splash, onboarding)
        static var brandGradient: some View {
            LinearGradient(
                colors: [
                    Color(hex: "9256A4").opacity(0.15), // Mauve léger
                    Color(hex: "FF6F3C").opacity(0.12), // Orange léger
                    Color(hex: "FFB10B").opacity(0.10)  // Jaune léger
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .overlay(
                // Ajout de "blobs" organiques pour effet moderne
                GeometryReader { geo in
                    ZStack {
                        // Blob 1 - Top right
                        Circle()
                            .fill(
                                RadialGradient(
                                    colors: [
                                        Color(hex: "FFB10B").opacity(0.2),
                                        Color.clear
                                    ],
                                    center: .center,
                                    startRadius: 0,
                                    endRadius: 200
                                )
                            )
                            .frame(width: 400, height: 400)
                            .offset(x: geo.size.width * 0.6, y: -100)
                            .blur(radius: 60)

                        // Blob 2 - Bottom left
                        Circle()
                            .fill(
                                RadialGradient(
                                    colors: [
                                        Color(hex: "9256A4").opacity(0.18),
                                        Color.clear
                                    ],
                                    center: .center,
                                    startRadius: 0,
                                    endRadius: 180
                                )
                            )
                            .frame(width: 350, height: 350)
                            .offset(x: -100, y: geo.size.height * 0.7)
                            .blur(radius: 50)

                        // Blob 3 - Center right
                        Circle()
                            .fill(
                                RadialGradient(
                                    colors: [
                                        Color(hex: "FF6F3C").opacity(0.15),
                                        Color.clear
                                    ],
                                    center: .center,
                                    startRadius: 0,
                                    endRadius: 150
                                )
                            )
                            .frame(width: 300, height: 300)
                            .offset(x: geo.size.width * 0.7, y: geo.size.height * 0.4)
                            .blur(radius: 40)
                    }
                }
            )
            .background(Color(hex: "FEFEFE")) // Base blanche très légère
        }

        /// Background Searcher avec gradient jaune/orange doux
        static var searcherGradient: some View {
            LinearGradient(
                colors: [
                    Color(hex: "FFF9E6"), // Jaune très pâle
                    Color(hex: "FFEFCC"),
                    Color(hex: "FFE4B3")
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .overlay(
                GeometryReader { geo in
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    Color(hex: "FFB10B").opacity(0.15),
                                    Color.clear
                                ],
                                center: .center,
                                startRadius: 0,
                                endRadius: 250
                            )
                        )
                        .frame(width: 500, height: 500)
                        .offset(x: geo.size.width * 0.5, y: geo.size.height * 0.3)
                        .blur(radius: 60)
                }
            )
        }

        /// Background Owner avec gradient mauve/rose doux
        static var ownerGradient: some View {
            LinearGradient(
                colors: [
                    Color(hex: "F9F8FF"), // Mauve très pâle
                    Color(hex: "F3F1FF"),
                    Color(hex: "EDE9FF")
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .overlay(
                GeometryReader { geo in
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    Color(hex: "9256A4").opacity(0.12),
                                    Color.clear
                                ],
                                center: .center,
                                startRadius: 0,
                                endRadius: 250
                            )
                        )
                        .frame(width: 500, height: 500)
                        .offset(x: geo.size.width * 0.5, y: geo.size.height * 0.3)
                        .blur(radius: 60)
                }
            )
        }

        /// Background Resident avec gradient orange/pêche doux
        static var residentGradient: some View {
            LinearGradient(
                colors: [
                    Color(hex: "FFFAF8"), // Orange très pâle
                    Color(hex: "FFF3EF"),
                    Color(hex: "FFE8DD")
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .overlay(
                GeometryReader { geo in
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    Color(hex: "FF6F3C").opacity(0.15),
                                    Color.clear
                                ],
                                center: .center,
                                startRadius: 0,
                                endRadius: 250
                            )
                        )
                        .frame(width: 500, height: 500)
                        .offset(x: geo.size.width * 0.5, y: geo.size.height * 0.3)
                        .blur(radius: 60)
                }
            )
        }
    }

    // MARK: - Glassmorphism Cards

    /// Styles de cartes glassmorphism modernes
    struct GlassCards {

        /// Carte glassmorphism standard (fond blanc translucide avec blur)
        static func standard(cornerRadius: CGFloat = 24) -> some ViewModifier {
            GlassCardModifier(
                backgroundColor: Color.white.opacity(0.75),
                borderColor: Color.white.opacity(0.5),
                borderWidth: 1.5,
                cornerRadius: cornerRadius,
                shadowColor: Color.black.opacity(0.08),
                shadowRadius: 20,
                shadowY: 10,
                blurRadius: 20
            )
        }

        /// Carte glassmorphism élevée (plus opaque, plus de shadow)
        static func elevated(cornerRadius: CGFloat = 24) -> some ViewModifier {
            GlassCardModifier(
                backgroundColor: Color.white.opacity(0.85),
                borderColor: Color.white.opacity(0.6),
                borderWidth: 1.5,
                cornerRadius: cornerRadius,
                shadowColor: Color.black.opacity(0.12),
                shadowRadius: 30,
                shadowY: 15,
                blurRadius: 25
            )
        }

        /// Carte glassmorphism subtile (très transparente, pour overlays)
        static func subtle(cornerRadius: CGFloat = 20) -> some ViewModifier {
            GlassCardModifier(
                backgroundColor: Color.white.opacity(0.55),
                borderColor: Color.white.opacity(0.4),
                borderWidth: 1,
                cornerRadius: cornerRadius,
                shadowColor: Color.black.opacity(0.05),
                shadowRadius: 12,
                shadowY: 6,
                blurRadius: 15
            )
        }

        /// Carte glassmorphism colorée (teintée avec la couleur du rôle)
        static func tinted(role: Theme.UserRole, cornerRadius: CGFloat = 24) -> some ViewModifier {
            let tintColor: Color
            switch role {
            case .searcher:
                tintColor = Color(hex: "FFB10B")
            case .owner:
                tintColor = Color(hex: "9256A4")
            case .resident:
                tintColor = Color(hex: "FF5722")
            }

            return GlassCardModifier(
                backgroundColor: tintColor.opacity(0.15),
                borderColor: tintColor.opacity(0.3),
                borderWidth: 1.5,
                cornerRadius: cornerRadius,
                shadowColor: tintColor.opacity(0.15),
                shadowRadius: 25,
                shadowY: 12,
                blurRadius: 20
            )
        }
    }

    // MARK: - Modern Buttons

    /// Styles de boutons modernes
    struct ModernButtons {

        /// Bouton CTA principal avec gradient du rôle
        static func primary(role: Theme.UserRole) -> some View {
            ModernPrimaryButton(role: role)
        }

        /// Bouton secondaire glassmorphism
        static func secondary(role: Theme.UserRole) -> some View {
            ModernSecondaryButton(role: role)
        }

        /// Petit bouton icon glassmorphism (comme dans les références)
        static func iconButton(systemName: String, role: Theme.UserRole) -> some View {
            ModernIconButton(systemName: systemName, role: role)
        }
    }

    // MARK: - Modern Typography

    /// Extensions typographiques modernes (plus bold, plus d'espace)
    struct ModernTypography {

        /// Grand titre hero (comme dans les références Pinterest)
        static func hero(_ weight: Font.Weight = .bold) -> Font {
            .system(size: 40, weight: weight, design: .rounded)
        }

        /// Titre de section moderne
        static func sectionTitle(_ weight: Font.Weight = .bold) -> Font {
            .system(size: 24, weight: weight, design: .rounded)
        }

        /// Corps avec design arrondi (plus doux)
        static func bodyRounded(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 16, weight: weight, design: .rounded)
        }

        /// Caption moderne
        static func captionRounded(_ weight: Font.Weight = .medium) -> Font {
            .system(size: 13, weight: weight, design: .rounded)
        }
    }
}

// MARK: - Glass Card Modifier

private struct GlassCardModifier: ViewModifier {
    let backgroundColor: Color
    let borderColor: Color
    let borderWidth: CGFloat
    let cornerRadius: CGFloat
    let shadowColor: Color
    let shadowRadius: CGFloat
    let shadowY: CGFloat
    let blurRadius: CGFloat

    func body(content: Content) -> some View {
        content
            .background(
                ZStack {
                    // Backdrop blur effect (simulé avec overlay)
                    RoundedRectangle(cornerRadius: cornerRadius)
                        .fill(backgroundColor)
                        .overlay(
                            RoundedRectangle(cornerRadius: cornerRadius)
                                .stroke(borderColor, lineWidth: borderWidth)
                        )
                }
            )
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
            .shadow(color: shadowColor, radius: shadowRadius, x: 0, y: shadowY)
    }
}

// MARK: - Modern Button Components

/// Bouton CTA principal moderne
struct ModernPrimaryButton: View {
    let role: Theme.UserRole
    let title: String
    let action: () -> Void

    init(role: Theme.UserRole, title: String = "Continue", action: @escaping () -> Void = {}) {
        self.role = role
        self.title = title
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(Theme.ModernTypography.bodyRounded(.semibold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 56)
                .background(role.gradient)
                .clipShape(RoundedRectangle(cornerRadius: 16))
                .shadow(color: role.primaryColor.opacity(0.3), radius: 15, x: 0, y: 8)
        }
    }
}

/// Bouton secondaire glassmorphism
struct ModernSecondaryButton: View {
    let role: Theme.UserRole
    let title: String
    let action: () -> Void

    init(role: Theme.UserRole, title: String = "Skip", action: @escaping () -> Void = {}) {
        self.role = role
        self.title = title
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(Theme.ModernTypography.bodyRounded(.medium))
                .foregroundColor(role.primaryColor)
                .frame(maxWidth: .infinity)
                .frame(height: 56)
                .background(
                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color.white.opacity(0.7))
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(role.primaryColor.opacity(0.3), lineWidth: 1.5)
                        )
                )
                .shadow(color: Color.black.opacity(0.05), radius: 10, x: 0, y: 5)
        }
    }
}

/// Bouton icon glassmorphism (comme dans les références Pinterest)
struct ModernIconButton: View {
    let systemName: String
    let role: Theme.UserRole
    let action: () -> Void

    init(systemName: String, role: Theme.UserRole, action: @escaping () -> Void = {}) {
        self.systemName = systemName
        self.role = role
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            Image(systemName: systemName)
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(role.primaryColor)
                .frame(width: 48, height: 48)
                .background(
                    Circle()
                        .fill(Color.white.opacity(0.75))
                        .overlay(
                            Circle()
                                .stroke(Color.white.opacity(0.5), lineWidth: 1.5)
                        )
                )
                .shadow(color: Color.black.opacity(0.08), radius: 12, x: 0, y: 6)
        }
    }
}

// MARK: - Modern Card Components

/// Carte glassmorphism standard réutilisable
struct ModernGlassCard<Content: View>: View {
    let content: Content
    let cornerRadius: CGFloat

    init(cornerRadius: CGFloat = 24, @ViewBuilder content: () -> Content) {
        self.cornerRadius = cornerRadius
        self.content = content()
    }

    var body: some View {
        content
            .padding(20)
            .modifier(Theme.GlassCards.standard(cornerRadius: cornerRadius))
    }
}

/// Carte glassmorphism avec header coloré (comme dans les références)
struct ModernGlassCardWithHeader<Content: View>: View {
    let title: String
    let role: Theme.UserRole
    let content: Content

    init(title: String, role: Theme.UserRole, @ViewBuilder content: () -> Content) {
        self.title = title
        self.role = role
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header avec gradient
            Text(title)
                .font(Theme.ModernTypography.sectionTitle(.bold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(20)
                .background(
                    RoundedCorner(radius: 24, corners: [.topLeft, .topRight])
                        .fill(role.gradient)
                )

            // Contenu
            content
                .padding(20)
                .background(
                    Color.white.opacity(0.8)
                )
        }
        .clipShape(RoundedRectangle(cornerRadius: 24))
        .overlay(
            RoundedRectangle(cornerRadius: 24)
                .stroke(Color.white.opacity(0.5), lineWidth: 1.5)
        )
        .shadow(color: Color.black.opacity(0.1), radius: 20, x: 0, y: 10)
    }
}

// MARK: - View Extensions
// Note: RoundedCorner is already defined in Extensions/View+Extensions.swift

extension View {
    /// Applique le style glassmorphism standard
    func glassCard(cornerRadius: CGFloat = 24) -> some View {
        self.modifier(Theme.GlassCards.standard(cornerRadius: cornerRadius))
    }

    /// Applique le style glassmorphism élevé
    func glassCardElevated(cornerRadius: CGFloat = 24) -> some View {
        self.modifier(Theme.GlassCards.elevated(cornerRadius: cornerRadius))
    }

    /// Applique le style glassmorphism subtil
    func glassCardSubtle(cornerRadius: CGFloat = 20) -> some View {
        self.modifier(Theme.GlassCards.subtle(cornerRadius: cornerRadius))
    }

    /// Applique le style glassmorphism teinté
    func glassCardTinted(role: Theme.UserRole, cornerRadius: CGFloat = 24) -> some View {
        self.modifier(Theme.GlassCards.tinted(role: role, cornerRadius: cornerRadius))
    }
}
