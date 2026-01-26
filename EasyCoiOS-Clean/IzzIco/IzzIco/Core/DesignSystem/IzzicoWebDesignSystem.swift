//
//  IzzicoWebDesignSystem.swift
//  IzzIco
//
//  Design System reproduisant fidèlement le site web izzico.be
//  Basé sur les screenshots de la version responsive mobile
//  Created on 2026-01-23
//
//  Sources:
//  - https://swdevnotes.com/swift/2021/create-blob-shape-in-swiftui/
//  - https://github.com/alldritt/BlobMaker
//  - https://medium.com/@garejakirit/implementing-glassmorphism-effect-in-swiftui
//

import SwiftUI

// MARK: - Web Design Tokens

/// Tokens de design extraits du site web izzico.be
struct IzzicoWeb {

    // MARK: - Colors (SOURCE DE VÉRITÉ: brand-identity/izzico-color-system.html)

    struct Colors {
        // MARK: - Owner (Mauve) - Progression L* : 95 - 25
        static let owner50 = Color(hex: "F8F0F7")
        static let owner100 = Color(hex: "F0E0EE")
        static let owner200 = Color(hex: "E0C0DC")
        static let owner300 = Color(hex: "C990C2")
        static let owner400 = Color(hex: "B070A8")
        static let owner500 = Color(hex: "9c5698")  // Primary
        static let owner600 = Color(hex: "7E4580")
        static let owner700 = Color(hex: "633668")
        static let owner800 = Color(hex: "482850")
        static let owner900 = Color(hex: "2E1A38")

        // MARK: - Resident (Coral/Orange) - Progression L* : 96 - 22
        static let resident50 = Color(hex: "FEF2EE")
        static let resident100 = Color(hex: "FDE0D6")
        static let resident200 = Color(hex: "F9B8A0")
        static let resident300 = Color(hex: "F28B6A")
        static let resident400 = Color(hex: "E96A50")
        static let resident500 = Color(hex: "e05747")  // Primary
        static let resident600 = Color(hex: "C04538")
        static let resident700 = Color(hex: "9A362C")
        static let resident800 = Color(hex: "742920")
        static let resident900 = Color(hex: "4E1C16")

        // MARK: - Searcher (Gold/Amber) - Progression L* : 97 - 28
        static let searcher50 = Color(hex: "FFFBEB")
        static let searcher100 = Color(hex: "FEF3C7")
        static let searcher200 = Color(hex: "FDE68A")
        static let searcher300 = Color(hex: "FCD34D")
        static let searcher400 = Color(hex: "FBBF24")
        static let searcher500 = Color(hex: "ffa000")  // Primary
        static let searcher600 = Color(hex: "D98400")
        static let searcher700 = Color(hex: "A16300")
        static let searcher800 = Color(hex: "764800")
        static let searcher900 = Color(hex: "4D3000")

        // MARK: - Text variants for accessibility
        static let ownerText = Color(hex: "633668")      // owner-700
        static let residentText = Color(hex: "9A362C")   // resident-700
        static let searcherText = Color(hex: "A16300")   // searcher-700

        // MARK: - Neutrals (Zinc)
        static let white = Color(hex: "FFFFFF")
        static let background = Color(hex: "FAFAFA")
        static let gray50 = Color(hex: "FAFAFA")
        static let gray100 = Color(hex: "F4F4F5")
        static let gray200 = Color(hex: "E4E4E7")
        static let gray300 = Color(hex: "D4D4D8")
        static let gray400 = Color(hex: "A1A1AA")
        static let gray500 = Color(hex: "71717A")
        static let gray600 = Color(hex: "52525B")
        static let gray700 = Color(hex: "3F3F46")
        static let gray800 = Color(hex: "27272A")
        static let gray900 = Color(hex: "18181B")
        static let black = Color(hex: "18181B")

        // MARK: - Semantic Colors
        static let success = Color(hex: "10B981")
        static let successLight = Color(hex: "ECFDF5")
        static let error = Color(hex: "EF4444")
        static let errorLight = Color(hex: "FEF2F2")
        static let warning = Color(hex: "D97706")
        static let warningLight = Color(hex: "FFFBEB")
        static let info = Color(hex: "3B82F6")
        static let infoLight = Color(hex: "EFF6FF")

        // MARK: - UI Accents
        static let sage = Color(hex: "7CB89B")
        static let terracotta = Color(hex: "C87060")
        static let dustyRose = Color(hex: "D08090")
        static let lavender = Color(hex: "9B7BD9")
        static let sky = Color(hex: "5B8BD9")
        static let amber = Color(hex: "D9A870")
        static let teal = Color(hex: "70B0C0")
        static let blush = Color(hex: "E07BAD")

        // MARK: - Dark Mode
        static let darkBg = Color(hex: "121015")
        static let darkSurface = Color(hex: "1A171E")
        static let darkElevated = Color(hex: "242027")
        static let darkHover = Color(hex: "2A262F")
        static let darkBorder = Color(hex: "2E2A33")
        static let darkText = Color(hex: "F5F5F7")
        static let darkTextSecondary = Color(hex: "A8A4AC")
        static let darkMuted = Color(hex: "8A868E")

        // MARK: - Legacy aliases (backward compatibility - keep for existing code)
        static let pageBackground = background
        static let cardBackground = white
        static let ownerPrimary = owner500
        static let residentPrimary = resident500
        static let residentSecondary = Color(hex: "FF7C10")  // Transition color
        static let searcherPrimary = searcher500
        static let textPrimary = gray900
        static let textSecondary = gray600
        static let textTertiary = gray400

        // Blob colors (pastel versions for decorative shapes)
        static let blobPeach = Color(hex: "FFDAB9").opacity(0.4)
        static let blobPink = Color(hex: "F5D0D0").opacity(0.4)
        static let blobSage = Color(hex: "D4E8D4").opacity(0.4)
        static let blobLavender = Color(hex: "E8D4F5").opacity(0.4)
    }

    // MARK: - Gradients

    struct Gradients {
        /// Gradient signature Izzico (3 couleurs primaires des rôles)
        /// Utilisé pour le logo, branding, éléments signature
        static let signature = LinearGradient(
            colors: [
                Colors.owner500,      // #9c5698 à 0%
                Color(hex: "C85570"), // Bridge (évite zone boue) à 20%
                Color(hex: "D15659"), // Transition à 35%
                Colors.resident500,   // #e05747 à 50%
                Color(hex: "FF7C10"), // Transition à 75%
                Colors.searcher500    // #ffa000 à 100%
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        /// Gradient Resident (terracotta/coral)
        static let resident = LinearGradient(
            colors: [
                Colors.resident400,
                Colors.resident500,
                Colors.resident600
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        /// Gradient Owner (mauve/purple)
        static let owner = LinearGradient(
            colors: [
                Colors.owner500,
                Colors.owner400
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        /// Gradient Searcher (yellow/gold)
        static let searcher = LinearGradient(
            colors: [
                Colors.searcher500,
                Colors.searcher400
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        /// FAB Chat gradient (resident to searcher)
        static let fabChat = LinearGradient(
            colors: [
                Colors.resident500,
                Color(hex: "FF7C10"),
                Colors.searcher500
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        /// Gradient subtil pour backgrounds (version light)
        static let ownerSubtle = LinearGradient(
            colors: [Colors.owner50, Colors.owner100],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        static let residentSubtle = LinearGradient(
            colors: [Colors.resident50, Colors.resident100],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )

        static let searcherSubtle = LinearGradient(
            colors: [Colors.searcher50, Colors.searcher100],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }

    // MARK: - Radius (from web - very rounded)

    struct Radius {
        static let small: CGFloat = 12
        static let medium: CGFloat = 16
        static let large: CGFloat = 20
        static let xLarge: CGFloat = 24
        static let xxLarge: CGFloat = 28
        static let card: CGFloat = 24
        static let button: CGFloat = 16
        static let pill: CGFloat = 100
    }

    // MARK: - Spacing

    struct Spacing {
        static let xs: CGFloat = 4
        static let sm: CGFloat = 8
        static let md: CGFloat = 12
        static let lg: CGFloat = 16
        static let xl: CGFloat = 20
        static let xxl: CGFloat = 24
        static let xxxl: CGFloat = 32
    }

    // MARK: - Typography (matching web)

    struct Typography {
        // Headlines
        static func heroLarge(_ weight: Font.Weight = .bold) -> Font {
            .system(size: 32, weight: weight, design: .rounded)
        }

        static func heroMedium(_ weight: Font.Weight = .bold) -> Font {
            .system(size: 28, weight: weight, design: .rounded)
        }

        static func titleLarge(_ weight: Font.Weight = .bold) -> Font {
            .system(size: 24, weight: weight, design: .rounded)
        }

        static func titleMedium(_ weight: Font.Weight = .semibold) -> Font {
            .system(size: 20, weight: weight, design: .rounded)
        }

        static func titleSmall(_ weight: Font.Weight = .semibold) -> Font {
            .system(size: 18, weight: weight, design: .rounded)
        }

        // Body
        static func bodyLarge(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 17, weight: weight, design: .default)
        }

        static func bodyRegular(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 15, weight: weight, design: .default)
        }

        static func bodySmall(_ weight: Font.Weight = .regular) -> Font {
            .system(size: 14, weight: weight, design: .default)
        }

        // Caption
        static func caption(_ weight: Font.Weight = .medium) -> Font {
            .system(size: 12, weight: weight, design: .default)
        }

        static func captionSmall(_ weight: Font.Weight = .medium) -> Font {
            .system(size: 11, weight: weight, design: .default)
        }
    }

    // MARK: - Shadows (soft, subtle like web)

    struct Shadows {
        static let subtle = Shadow(color: Color.black.opacity(0.04), radius: 8, x: 0, y: 2)
        static let soft = Shadow(color: Color.black.opacity(0.06), radius: 12, x: 0, y: 4)
        static let medium = Shadow(color: Color.black.opacity(0.08), radius: 16, x: 0, y: 6)
        static let strong = Shadow(color: Color.black.opacity(0.12), radius: 24, x: 0, y: 8)

        /// Shadow coloré pour les éléments de rôle
        static func colored(_ color: Color, intensity: Double = 0.25) -> Shadow {
            Shadow(color: color.opacity(intensity), radius: 16, x: 0, y: 6)
        }
    }

    // MARK: - Animations

    struct Animations {
        static let quickSpring = Animation.spring(response: 0.3, dampingFraction: 0.7)
        static let smoothSpring = Animation.spring(response: 0.4, dampingFraction: 0.8)
        static let gentleSpring = Animation.spring(response: 0.5, dampingFraction: 0.85)
        static let bouncy = Animation.spring(response: 0.35, dampingFraction: 0.6)
    }
}

// MARK: - Shadow Helper Struct

struct Shadow {
    let color: Color
    let radius: CGFloat
    let x: CGFloat
    let y: CGFloat
}

// MARK: - Blob Shape (Organic decorative shapes like web)

/// Forme blob organique comme sur le site web
/// Source: https://swdevnotes.com/swift/2021/create-blob-shape-in-swiftui/
struct BlobShape: Shape {
    var sides: Int
    var smoothness: CGFloat

    var animatableData: CGFloat {
        get { smoothness }
        set { smoothness = newValue }
    }

    init(sides: Int = 6, smoothness: CGFloat = 0.5) {
        self.sides = sides
        self.smoothness = smoothness
    }

    func path(in rect: CGRect) -> Path {
        let center = CGPoint(x: rect.width / 2, y: rect.height / 2)
        let radius = min(rect.width, rect.height) / 2

        var path = Path()

        // Generate points using polar coordinates
        var points: [CGPoint] = []
        for i in 0..<sides {
            let angle = (CGFloat(i) / CGFloat(sides)) * 2 * .pi - .pi / 2
            let variation = CGFloat.random(in: 0.7...1.0) * smoothness + (1 - smoothness)
            let r = radius * variation
            let x = center.x + r * cos(angle)
            let y = center.y + r * sin(angle)
            points.append(CGPoint(x: x, y: y))
        }

        // Connect points with smooth curves
        guard points.count > 2 else { return path }

        path.move(to: points[0])

        for i in 0..<points.count {
            let p0 = points[(i - 1 + points.count) % points.count]
            let p1 = points[i]
            let p2 = points[(i + 1) % points.count]
            let p3 = points[(i + 2) % points.count]

            let cp1 = CGPoint(
                x: p1.x + (p2.x - p0.x) / 6,
                y: p1.y + (p2.y - p0.y) / 6
            )
            let cp2 = CGPoint(
                x: p2.x - (p3.x - p1.x) / 6,
                y: p2.y - (p3.y - p1.y) / 6
            )

            path.addCurve(to: p2, control1: cp1, control2: cp2)
        }

        path.closeSubpath()
        return path
    }
}

// MARK: - Animated Blob View

/// Blob animé pour les arrière-plans décoratifs
struct AnimatedBlobView: View {
    let color: Color
    let size: CGFloat

    @State private var animate = false

    var body: some View {
        BlobShape(sides: 6, smoothness: animate ? 0.6 : 0.4)
            .fill(color)
            .frame(width: size, height: size)
            .blur(radius: size * 0.15)
            .onAppear {
                withAnimation(
                    Animation.easeInOut(duration: 8)
                        .repeatForever(autoreverses: true)
                ) {
                    animate.toggle()
                }
            }
    }
}

// MARK: - Decorative Blobs Background

/// Arrière-plan avec blobs décoratifs comme sur le web
struct DecorativeBlobsBackground: View {
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Background color
                IzzicoWeb.Colors.pageBackground

                // Top-right blob (peach)
                AnimatedBlobView(color: IzzicoWeb.Colors.blobPeach, size: 200)
                    .offset(x: geometry.size.width * 0.3, y: -geometry.size.height * 0.1)

                // Bottom-left blob (pink)
                AnimatedBlobView(color: IzzicoWeb.Colors.blobPink, size: 180)
                    .offset(x: -geometry.size.width * 0.2, y: geometry.size.height * 0.3)

                // Mid-right blob (sage)
                AnimatedBlobView(color: IzzicoWeb.Colors.blobSage, size: 150)
                    .offset(x: geometry.size.width * 0.35, y: geometry.size.height * 0.4)

                // Bottom-right blob (lavender)
                AnimatedBlobView(color: IzzicoWeb.Colors.blobLavender, size: 120)
                    .offset(x: geometry.size.width * 0.25, y: geometry.size.height * 0.6)
            }
        }
        .ignoresSafeArea()
    }
}

// MARK: - Glass Card Modifier

/// Effet glassmorphism comme sur le web
struct WebGlassCardModifier: ViewModifier {
    var padding: CGFloat
    var radius: CGFloat
    var showBorder: Bool

    func body(content: Content) -> some View {
        content
            .padding(padding)
            .background(
                RoundedRectangle(cornerRadius: radius, style: .continuous)
                    .fill(Color.white)
                    .shadow(color: Color.black.opacity(0.06), radius: 16, x: 0, y: 4)
            )
            .overlay(
                showBorder ?
                RoundedRectangle(cornerRadius: radius, style: .continuous)
                    .stroke(Color.white.opacity(0.8), lineWidth: 1)
                : nil
            )
    }
}

extension View {
    /// Applique le style de card web glassmorphique
    func webGlassCard(
        padding: CGFloat = IzzicoWeb.Spacing.lg,
        radius: CGFloat = IzzicoWeb.Radius.card,
        showBorder: Bool = true
    ) -> some View {
        self.modifier(WebGlassCardModifier(padding: padding, radius: radius, showBorder: showBorder))
    }

    /// Applique une ombre web-style
    func webShadow(_ shadow: Shadow) -> some View {
        self.shadow(color: shadow.color, radius: shadow.radius, x: shadow.x, y: shadow.y)
    }
}

// MARK: - Web Header Bar (like izzico.be)

/// Barre de header comme sur le site web
struct WebHeaderBar: View {
    let onNotificationsTap: () -> Void
    let onKeyTap: () -> Void
    let onMenuTap: () -> Void

    var body: some View {
        HStack(spacing: IzzicoWeb.Spacing.md) {
            // Logo Izzico
            Text("izzico")
                .font(.system(size: 26, weight: .bold, design: .rounded))
                .foregroundStyle(IzzicoWeb.Gradients.signature)

            Spacer()

            // Notification bell
            Button(action: onNotificationsTap) {
                Image(systemName: "bell")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(IzzicoWeb.Colors.textSecondary)
            }

            // Key icon (gradient circle like web)
            Button(action: onKeyTap) {
                Circle()
                    .fill(IzzicoWeb.Gradients.resident)
                    .frame(width: 36, height: 36)
                    .overlay(
                        Image(systemName: "key.fill")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                    )
            }

            // Menu hamburger
            Button(action: onMenuTap) {
                Image(systemName: "line.3.horizontal")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(IzzicoWeb.Colors.textPrimary)
            }
        }
        .padding(.horizontal, IzzicoWeb.Spacing.lg)
        .padding(.vertical, IzzicoWeb.Spacing.md)
        .background(Color.white.opacity(0.95))
    }
}

// MARK: - Web Property Header Card

/// Header de propriété comme sur le dashboard web (gradient terracotta)
struct WebPropertyHeaderCard: View {
    let title: String
    let location: String
    let roommatesCount: Int
    let completionPercent: Int
    let onInviteTap: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: IzzicoWeb.Spacing.lg) {
            HStack(alignment: .top) {
                // House icon
                ZStack {
                    RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                        .fill(Color.white.opacity(0.2))
                        .frame(width: 48, height: 48)

                    Image(systemName: "house.fill")
                        .font(.system(size: 22, weight: .semibold))
                        .foregroundColor(.white)
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(IzzicoWeb.Typography.titleMedium(.bold))
                        .foregroundColor(.white)

                    HStack(spacing: 4) {
                        Image(systemName: "mappin")
                            .font(.system(size: 12))
                        Text(location)
                            .font(IzzicoWeb.Typography.bodySmall())
                    }
                    .foregroundColor(.white.opacity(0.8))
                }

                Spacer()

                // Invite button
                Button(action: onInviteTap) {
                    HStack(spacing: 6) {
                        Image(systemName: "person.badge.plus")
                            .font(.system(size: 14, weight: .semibold))
                        Text("Inviter")
                            .font(IzzicoWeb.Typography.bodySmall(.semibold))
                    }
                    .foregroundColor(IzzicoWeb.Colors.residentPrimary)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(
                        Capsule()
                            .fill(Color.white)
                    )
                }
            }

            // Bottom row: roommates count + completion badge
            HStack {
                // Roommates
                HStack(spacing: 6) {
                    Image(systemName: "person.2.fill")
                        .font(.system(size: 14))
                    Text("\(roommatesCount) coloc\(roommatesCount > 1 ? "s" : "")")
                        .font(IzzicoWeb.Typography.bodySmall(.medium))
                }
                .foregroundColor(.white.opacity(0.9))

                Spacer()

                // Completion badge
                HStack(spacing: 6) {
                    Text("\(completionPercent)%")
                        .font(IzzicoWeb.Typography.bodySmall(.bold))
                        .foregroundColor(IzzicoWeb.Colors.residentPrimary)
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(
                    Capsule()
                        .fill(Color.white)
                )
            }
        }
        .padding(IzzicoWeb.Spacing.xl)
        .background(
            RoundedRectangle(cornerRadius: IzzicoWeb.Radius.xxLarge, style: .continuous)
                .fill(IzzicoWeb.Gradients.resident)
        )
        .webShadow(IzzicoWeb.Shadows.colored(IzzicoWeb.Colors.residentPrimary, intensity: 0.3))
    }
}

// MARK: - Web KPI Card

/// Carte KPI comme sur le web (icône dans cercle pastel + valeur)
struct WebKPICard: View {
    let icon: String
    let iconColor: Color
    let value: String
    let label: String
    let subtitle: String?

    init(
        icon: String,
        iconColor: Color,
        value: String,
        label: String,
        subtitle: String? = nil
    ) {
        self.icon = icon
        self.iconColor = iconColor
        self.value = value
        self.label = label
        self.subtitle = subtitle
    }

    var body: some View {
        VStack(alignment: .leading, spacing: IzzicoWeb.Spacing.md) {
            // Icon in pastel circle
            ZStack {
                Circle()
                    .fill(iconColor.opacity(0.15))
                    .frame(width: 52, height: 52)

                Image(systemName: icon)
                    .font(.system(size: 22, weight: .semibold))
                    .foregroundColor(iconColor)
            }

            Spacer()

            // Value
            Text(value)
                .font(IzzicoWeb.Typography.heroMedium(.bold))
                .foregroundColor(IzzicoWeb.Colors.textPrimary)

            // Label
            Text(label)
                .font(IzzicoWeb.Typography.bodySmall())
                .foregroundColor(IzzicoWeb.Colors.textSecondary)

            // Subtitle (optional)
            if let subtitle = subtitle {
                Text(subtitle)
                    .font(IzzicoWeb.Typography.caption(.medium))
                    .foregroundColor(iconColor)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .frame(minHeight: 160)
        .webGlassCard(padding: IzzicoWeb.Spacing.lg, radius: IzzicoWeb.Radius.xLarge)
    }
}

// MARK: - Web KPI Grid (2x2 like dashboard)

/// Grille 2x2 des KPIs comme sur le dashboard web
struct WebKPIGrid: View {
    let rentPaid: Int
    let rentTotal: Int
    let rentDueDate: String
    let sharedExpenses: Int
    let yourBalance: Int
    let roommatesCount: Int

    var body: some View {
        LazyVGrid(
            columns: [
                GridItem(.flexible(), spacing: IzzicoWeb.Spacing.md),
                GridItem(.flexible(), spacing: IzzicoWeb.Spacing.md)
            ],
            spacing: IzzicoWeb.Spacing.md
        ) {
            // Loyer du Mois
            WebKPICard(
                icon: "house.fill",
                iconColor: IzzicoWeb.Colors.residentPrimary,
                value: "€\(rentPaid)/\(rentTotal)",
                label: "Loyer du Mois",
                subtitle: "Échéance: \(rentDueDate)"
            )

            // Dépenses Partagées
            WebKPICard(
                icon: "dollarsign.circle.fill",
                iconColor: IzzicoWeb.Colors.success,
                value: "€\(sharedExpenses)",
                label: "Dépenses Partagées",
                subtitle: "À répartir"
            )

            // Ton Solde
            WebKPICard(
                icon: "wallet.pass.fill",
                iconColor: yourBalance >= 0 ? IzzicoWeb.Colors.success : IzzicoWeb.Colors.residentPrimary,
                value: yourBalance >= 0 ? "+€\(yourBalance)" : "-€\(abs(yourBalance))",
                label: "Ton Solde",
                subtitle: yourBalance >= 0 ? "On te doit" : "Tu dois"
            )

            // Résidents
            WebKPICard(
                icon: "person.2.fill",
                iconColor: IzzicoWeb.Colors.ownerPrimary,
                value: "\(roommatesCount)",
                label: "Résidents",
                subtitle: "Membres actifs"
            )
        }
        .padding(.horizontal, IzzicoWeb.Spacing.lg)
    }
}

// MARK: - Web Task Item (with timeline)

/// Item de tâche avec timeline comme sur le web
struct WebTaskItem: View {
    let title: String
    let dueDate: String
    let priority: TaskPriority
    let isLast: Bool

    enum TaskPriority: String {
        case urgent = "Urgent"
        case medium = "Moyen"
        case low = "Bas"

        var color: Color {
            switch self {
            case .urgent: return Color(hex: "EF4444")
            case .medium: return Color(hex: "F59E0B")
            case .low: return Color(hex: "6B7280")
            }
        }
    }

    var body: some View {
        HStack(spacing: IzzicoWeb.Spacing.md) {
            // Timeline circle + line
            VStack(spacing: 0) {
                Circle()
                    .stroke(IzzicoWeb.Colors.residentPrimary, lineWidth: 2)
                    .frame(width: 16, height: 16)

                if !isLast {
                    Rectangle()
                        .fill(IzzicoWeb.Colors.residentPrimary.opacity(0.3))
                        .frame(width: 2)
                        .frame(maxHeight: .infinity)
                }
            }
            .frame(width: 16)

            // Task content
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(IzzicoWeb.Typography.bodyRegular(.medium))
                    .foregroundColor(IzzicoWeb.Colors.textPrimary)

                Text(dueDate)
                    .font(IzzicoWeb.Typography.caption())
                    .foregroundColor(IzzicoWeb.Colors.textSecondary)
            }

            Spacer()

            // Priority badge (outline style like web)
            Text(priority.rawValue)
                .font(IzzicoWeb.Typography.caption(.medium))
                .foregroundColor(priority.color)
                .padding(.horizontal, 10)
                .padding(.vertical, 5)
                .background(
                    Capsule()
                        .stroke(priority.color, lineWidth: 1)
                )
        }
        .padding(.vertical, IzzicoWeb.Spacing.sm)
    }
}

// MARK: - Web Section Header

/// Header de section comme sur le web
struct WebSectionHeader: View {
    let icon: String
    let title: String
    let badge: String?
    let actionText: String?
    let onAction: (() -> Void)?

    init(
        icon: String,
        title: String,
        badge: String? = nil,
        actionText: String? = nil,
        onAction: (() -> Void)? = nil
    ) {
        self.icon = icon
        self.title = title
        self.badge = badge
        self.actionText = actionText
        self.onAction = onAction
    }

    var body: some View {
        HStack {
            HStack(spacing: IzzicoWeb.Spacing.sm) {
                Image(systemName: icon)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(IzzicoWeb.Colors.residentPrimary)

                Text(title)
                    .font(IzzicoWeb.Typography.titleSmall())
                    .foregroundColor(IzzicoWeb.Colors.textPrimary)

                if let badge = badge {
                    Text(badge)
                        .font(IzzicoWeb.Typography.caption(.bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(
                            Capsule()
                                .fill(IzzicoWeb.Colors.residentPrimary)
                        )
                }
            }

            Spacer()

            if let actionText = actionText, let onAction = onAction {
                Button(action: onAction) {
                    HStack(spacing: 4) {
                        Text(actionText)
                            .font(IzzicoWeb.Typography.bodySmall(.medium))
                        Image(systemName: "chevron.right")
                            .font(.system(size: 12, weight: .semibold))
                    }
                    .foregroundColor(IzzicoWeb.Colors.residentPrimary)
                }
            }
        }
    }
}

// MARK: - Web Add Button (outline style)

/// Bouton d'ajout style web (outline orange avec +)
struct WebAddButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                Image(systemName: "plus")
                    .font(.system(size: 16, weight: .semibold))
                Text(title)
                    .font(IzzicoWeb.Typography.bodyRegular(.medium))
            }
            .foregroundColor(IzzicoWeb.Colors.residentPrimary)
            .frame(maxWidth: .infinity)
            .padding(.vertical, IzzicoWeb.Spacing.md)
            .background(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                    .stroke(IzzicoWeb.Colors.residentPrimary, lineWidth: 1.5)
                    .background(
                        RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                            .fill(IzzicoWeb.Colors.residentPrimary.opacity(0.05))
                    )
            )
        }
    }
}

// MARK: - Web Empty State

/// État vide comme sur le web (grande icône gradient + message)
struct WebEmptyState: View {
    let icon: String
    let title: String
    let subtitle: String
    let color: Color

    var body: some View {
        VStack(spacing: IzzicoWeb.Spacing.lg) {
            // Large icon in gradient rounded square
            ZStack {
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.xLarge, style: .continuous)
                    .fill(
                        LinearGradient(
                            colors: [color, color.opacity(0.7)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 80, height: 80)

                Image(systemName: icon)
                    .font(.system(size: 36, weight: .semibold))
                    .foregroundColor(.white)
            }
            .webShadow(IzzicoWeb.Shadows.colored(color, intensity: 0.3))

            VStack(spacing: 6) {
                Text(title)
                    .font(IzzicoWeb.Typography.titleSmall())
                    .foregroundColor(IzzicoWeb.Colors.textPrimary)

                Text(subtitle)
                    .font(IzzicoWeb.Typography.bodySmall())
                    .foregroundColor(IzzicoWeb.Colors.textSecondary)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, IzzicoWeb.Spacing.xxl)
    }
}

// MARK: - FAB Chat Button (gradient like web)

/// Floating Action Button pour le chat comme sur le web
struct WebFABChat: View {
    let unreadCount: Int
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            ZStack(alignment: .topTrailing) {
                Circle()
                    .fill(IzzicoWeb.Gradients.fabChat)
                    .frame(width: 56, height: 56)
                    .overlay(
                        Image(systemName: "message.fill")
                            .font(.system(size: 24, weight: .semibold))
                            .foregroundColor(.white)
                    )
                    .webShadow(IzzicoWeb.Shadows.colored(IzzicoWeb.Colors.residentPrimary, intensity: 0.4))

                // Unread badge
                if unreadCount > 0 {
                    Text("\(min(unreadCount, 99))")
                        .font(IzzicoWeb.Typography.captionSmall(.bold))
                        .foregroundColor(.white)
                        .frame(minWidth: 20, minHeight: 20)
                        .background(Color(hex: "EF4444"))
                        .clipShape(Circle())
                        .overlay(
                            Circle()
                                .stroke(Color.white, lineWidth: 2)
                        )
                        .offset(x: 4, y: -4)
                }
            }
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

// MARK: - Web Activity Item

/// Item d'activité récente comme sur le web
struct WebActivityItem: View {
    let icon: String
    let iconColor: Color
    let title: String
    let subtitle: String
    let timeAgo: String

    var body: some View {
        HStack(spacing: IzzicoWeb.Spacing.md) {
            // Icon in colored circle
            ZStack {
                Circle()
                    .fill(iconColor.opacity(0.15))
                    .frame(width: 44, height: 44)

                Image(systemName: icon)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(iconColor)
            }

            // Content
            VStack(alignment: .leading, spacing: 3) {
                Text(title)
                    .font(IzzicoWeb.Typography.bodyRegular(.medium))
                    .foregroundColor(IzzicoWeb.Colors.textPrimary)

                Text(subtitle)
                    .font(IzzicoWeb.Typography.bodySmall())
                    .foregroundColor(IzzicoWeb.Colors.textSecondary)
            }

            Spacer()

            // Time ago
            Text(timeAgo)
                .font(IzzicoWeb.Typography.caption())
                .foregroundColor(IzzicoWeb.Colors.textTertiary)
        }
        .padding(.vertical, IzzicoWeb.Spacing.sm)
    }
}

// MARK: - Form Components

/// Input field web-style avec label flottant
struct WebInputField: View {
    let label: String
    let placeholder: String
    @Binding var text: String
    var isSecure: Bool = false
    var keyboardType: UIKeyboardType = .default
    var icon: String? = nil
    var errorMessage: String? = nil

    @FocusState private var isFocused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: IzzicoWeb.Spacing.sm) {
            // Label
            Text(label)
                .font(IzzicoWeb.Typography.bodySmall(.medium))
                .foregroundColor(errorMessage != nil ? IzzicoWeb.Colors.error : IzzicoWeb.Colors.gray700)

            // Input container
            HStack(spacing: IzzicoWeb.Spacing.md) {
                if let icon = icon {
                    Image(systemName: icon)
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(isFocused ? IzzicoWeb.Colors.resident500 : IzzicoWeb.Colors.gray400)
                }

                if isSecure {
                    SecureField(placeholder, text: $text)
                        .font(IzzicoWeb.Typography.bodyRegular())
                        .focused($isFocused)
                        .keyboardType(keyboardType)
                } else {
                    TextField(placeholder, text: $text)
                        .font(IzzicoWeb.Typography.bodyRegular())
                        .focused($isFocused)
                        .keyboardType(keyboardType)
                }
            }
            .padding(IzzicoWeb.Spacing.md)
            .background(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                    .fill(IzzicoWeb.Colors.white)
            )
            .overlay(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                    .stroke(
                        errorMessage != nil ? IzzicoWeb.Colors.error :
                        isFocused ? IzzicoWeb.Colors.resident500 :
                        IzzicoWeb.Colors.gray200,
                        lineWidth: isFocused ? 2 : 1
                    )
            )

            // Error message
            if let errorMessage = errorMessage {
                HStack(spacing: 4) {
                    Image(systemName: "exclamationmark.circle.fill")
                        .font(.system(size: 12))
                    Text(errorMessage)
                        .font(IzzicoWeb.Typography.caption())
                }
                .foregroundColor(IzzicoWeb.Colors.error)
            }
        }
        .animation(IzzicoWeb.Animations.quickSpring, value: isFocused)
        .animation(IzzicoWeb.Animations.quickSpring, value: errorMessage)
    }
}

/// Toggle web-style (switch avec couleur de rôle)
struct WebToggle: View {
    let label: String
    let subtitle: String?
    @Binding var isOn: Bool
    var roleColor: Color = IzzicoWeb.Colors.resident500

    init(label: String, isOn: Binding<Bool>, subtitle: String? = nil, roleColor: Color = IzzicoWeb.Colors.resident500) {
        self.label = label
        self._isOn = isOn
        self.subtitle = subtitle
        self.roleColor = roleColor
    }

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(label)
                    .font(IzzicoWeb.Typography.bodyRegular(.medium))
                    .foregroundColor(IzzicoWeb.Colors.gray900)

                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(IzzicoWeb.Typography.caption())
                        .foregroundColor(IzzicoWeb.Colors.gray600)
                }
            }

            Spacer()

            Toggle("", isOn: $isOn)
                .tint(roleColor)
        }
    }
}

/// Checkbox web-style
struct WebCheckbox: View {
    let label: String
    @Binding var isChecked: Bool
    var roleColor: Color = IzzicoWeb.Colors.resident500

    var body: some View {
        Button(action: { isChecked.toggle() }) {
            HStack(spacing: IzzicoWeb.Spacing.md) {
                ZStack {
                    RoundedRectangle(cornerRadius: 6, style: .continuous)
                        .stroke(isChecked ? roleColor : IzzicoWeb.Colors.gray300, lineWidth: 2)
                        .frame(width: 24, height: 24)
                        .background(
                            RoundedRectangle(cornerRadius: 6, style: .continuous)
                                .fill(isChecked ? roleColor : Color.clear)
                        )

                    if isChecked {
                        Image(systemName: "checkmark")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                    }
                }

                Text(label)
                    .font(IzzicoWeb.Typography.bodyRegular())
                    .foregroundColor(IzzicoWeb.Colors.gray900)
                    .multilineTextAlignment(.leading)

                Spacer()
            }
        }
        .buttonStyle(PlainButtonStyle())
        .animation(IzzicoWeb.Animations.quickSpring, value: isChecked)
    }
}

/// Bouton principal web-style (rempli avec gradient)
struct WebPrimaryButton: View {
    let title: String
    let action: () -> Void
    var gradient: LinearGradient = IzzicoWeb.Gradients.resident
    var isLoading: Bool = false
    var isDisabled: Bool = false
    var icon: String? = nil

    var body: some View {
        Button(action: action) {
            HStack(spacing: IzzicoWeb.Spacing.sm) {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                } else {
                    if let icon = icon {
                        Image(systemName: icon)
                            .font(.system(size: 18, weight: .semibold))
                    }
                    Text(title)
                        .font(IzzicoWeb.Typography.bodyRegular(.semibold))
                }
            }
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, IzzicoWeb.Spacing.md)
            .background(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.button, style: .continuous)
                    .fill(buttonBackground)
            )
            .webShadow(isDisabled ? IzzicoWeb.Shadows.subtle : IzzicoWeb.Shadows.soft)
        }
        .disabled(isDisabled || isLoading)
    }

    private var buttonBackground: LinearGradient {
        if isDisabled {
            return LinearGradient(colors: [IzzicoWeb.Colors.gray300], startPoint: .leading, endPoint: .trailing)
        } else {
            return gradient
        }
    }
}

/// Bouton secondaire web-style (outline)
struct WebSecondaryButton: View {
    let title: String
    let action: () -> Void
    var color: Color = IzzicoWeb.Colors.resident500
    var icon: String? = nil

    var body: some View {
        Button(action: action) {
            HStack(spacing: IzzicoWeb.Spacing.sm) {
                if let icon = icon {
                    Image(systemName: icon)
                        .font(.system(size: 16, weight: .semibold))
                }
                Text(title)
                    .font(IzzicoWeb.Typography.bodyRegular(.medium))
            }
            .foregroundColor(color)
            .frame(maxWidth: .infinity)
            .padding(.vertical, IzzicoWeb.Spacing.md)
            .background(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.button, style: .continuous)
                    .stroke(color, lineWidth: 1.5)
                    .background(
                        RoundedRectangle(cornerRadius: IzzicoWeb.Radius.button, style: .continuous)
                            .fill(color.opacity(0.05))
                    )
            )
        }
    }
}

/// Sélecteur de rôle (Owner/Resident/Searcher)
struct WebRoleSelector: View {
    enum UserRole: String, CaseIterable {
        case owner = "Propriétaire"
        case resident = "Résident"
        case searcher = "Chercheur"

        var color: Color {
            switch self {
            case .owner: return IzzicoWeb.Colors.owner500
            case .resident: return IzzicoWeb.Colors.resident500
            case .searcher: return IzzicoWeb.Colors.searcher500
            }
        }

        var gradient: LinearGradient {
            switch self {
            case .owner: return IzzicoWeb.Gradients.owner
            case .resident: return IzzicoWeb.Gradients.resident
            case .searcher: return IzzicoWeb.Gradients.searcher
            }
        }

        var icon: String {
            switch self {
            case .owner: return "house.fill"
            case .resident: return "person.3.fill"
            case .searcher: return "magnifyingglass"
            }
        }
    }

    @Binding var selectedRole: UserRole

    var body: some View {
        VStack(spacing: IzzicoWeb.Spacing.md) {
            ForEach(UserRole.allCases, id: \.self) { role in
                roleButton(for: role)
            }
        }
        .animation(IzzicoWeb.Animations.quickSpring, value: selectedRole)
    }

    @ViewBuilder
    private func roleButton(for role: UserRole) -> some View {
        let isSelected = selectedRole == role

        Button(action: { selectedRole = role }) {
            HStack(spacing: IzzicoWeb.Spacing.md) {
                // Icon
                ZStack {
                    Circle()
                        .fill(iconBackground(for: role))
                        .frame(width: 48, height: 48)

                    Image(systemName: role.icon)
                        .font(.system(size: 20, weight: .semibold))
                        .foregroundColor(isSelected ? .white : role.color)
                }

                // Label
                Text(role.rawValue)
                    .font(IzzicoWeb.Typography.bodyRegular(.semibold))
                    .foregroundColor(IzzicoWeb.Colors.gray900)

                Spacer()

                // Checkmark
                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 24))
                        .foregroundColor(role.color)
                }
            }
            .padding(IzzicoWeb.Spacing.lg)
            .background(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.large, style: .continuous)
                    .fill(IzzicoWeb.Colors.white)
            )
            .overlay(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.large, style: .continuous)
                    .stroke(
                        isSelected ? role.color : IzzicoWeb.Colors.gray200,
                        lineWidth: isSelected ? 2 : 1
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
    }

    private func iconBackground(for role: UserRole) -> LinearGradient {
        if selectedRole == role {
            return role.gradient
        } else {
            return LinearGradient(
                colors: [role.color.opacity(0.15)],
                startPoint: .leading,
                endPoint: .trailing
            )
        }
    }
}

// MARK: - Auth Components

/// OAuth button (Google, Apple, Facebook)
struct WebOAuthButton: View {
    enum Provider {
        case google, apple, facebook

        var title: String {
            switch self {
            case .google: return "Continuer avec Google"
            case .apple: return "Continuer avec Apple"
            case .facebook: return "Continuer avec Facebook"
            }
        }

        var icon: String {
            switch self {
            case .google: return "g.circle.fill"
            case .apple: return "apple.logo"
            case .facebook: return "f.circle.fill"
            }
        }

        var backgroundColor: Color {
            switch self {
            case .google: return IzzicoWeb.Colors.white
            case .apple: return IzzicoWeb.Colors.black
            case .facebook: return Color(hex: "1877F2")
            }
        }

        var textColor: Color {
            switch self {
            case .google: return IzzicoWeb.Colors.gray900
            case .apple: return IzzicoWeb.Colors.white
            case .facebook: return IzzicoWeb.Colors.white
            }
        }

        var hasBorder: Bool {
            self == .google
        }
    }

    let provider: Provider
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: IzzicoWeb.Spacing.md) {
                Image(systemName: provider.icon)
                    .font(.system(size: 20, weight: .medium))

                Text(provider.title)
                    .font(IzzicoWeb.Typography.bodyRegular(.medium))
            }
            .foregroundColor(provider.textColor)
            .frame(maxWidth: .infinity)
            .padding(.vertical, IzzicoWeb.Spacing.md)
            .background(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.button, style: .continuous)
                    .fill(provider.backgroundColor)
            )
            .overlay(
                provider.hasBorder ?
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.button, style: .continuous)
                    .stroke(IzzicoWeb.Colors.gray300, lineWidth: 1)
                : nil
            )
            .webShadow(IzzicoWeb.Shadows.subtle)
        }
    }
}

/// Divider "ou" pour séparer les méthodes d'auth
struct WebOrDivider: View {
    var body: some View {
        HStack(spacing: IzzicoWeb.Spacing.md) {
            Rectangle()
                .fill(IzzicoWeb.Colors.gray200)
                .frame(height: 1)

            Text("ou")
                .font(IzzicoWeb.Typography.bodySmall())
                .foregroundColor(IzzicoWeb.Colors.gray500)

            Rectangle()
                .fill(IzzicoWeb.Colors.gray200)
                .frame(height: 1)
        }
    }
}

/// Auth header (logo + titre + subtitle)
struct WebAuthHeader: View {
    let title: String
    let subtitle: String?

    init(title: String, subtitle: String? = nil) {
        self.title = title
        self.subtitle = subtitle
    }

    var body: some View {
        VStack(spacing: IzzicoWeb.Spacing.lg) {
            // Logo Izzico avec gradient
            Text("izzico")
                .font(.system(size: 40, weight: .bold, design: .rounded))
                .foregroundStyle(IzzicoWeb.Gradients.signature)

            VStack(spacing: IzzicoWeb.Spacing.sm) {
                Text(title)
                    .font(IzzicoWeb.Typography.titleLarge())
                    .foregroundColor(IzzicoWeb.Colors.gray900)

                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(IzzicoWeb.Typography.bodyRegular())
                        .foregroundColor(IzzicoWeb.Colors.gray600)
                        .multilineTextAlignment(.center)
                }
            }
        }
    }
}

// MARK: - Navigation Components

/// Tab bar web-style (fixed bottom navigation)
struct WebTabBar: View {
    struct TabItem: Identifiable {
        let id = UUID()
        let icon: String
        let activeIcon: String
        let label: String
        let badge: Int?

        init(icon: String, activeIcon: String? = nil, label: String, badge: Int? = nil) {
            self.icon = icon
            self.activeIcon = activeIcon ?? icon + ".fill"
            self.label = label
            self.badge = badge
        }
    }

    let items: [TabItem]
    @Binding var selectedIndex: Int
    var roleColor: Color = IzzicoWeb.Colors.resident500

    var body: some View {
        HStack(spacing: 0) {
            ForEach(Array(items.enumerated()), id: \.element.id) { index, item in
                Button(action: { selectedIndex = index }) {
                    VStack(spacing: 4) {
                        ZStack(alignment: .topTrailing) {
                            Image(systemName: selectedIndex == index ? item.activeIcon : item.icon)
                                .font(.system(size: 24, weight: .medium))
                                .foregroundColor(selectedIndex == index ? roleColor : IzzicoWeb.Colors.gray500)

                            // Badge
                            if let badge = item.badge, badge > 0 {
                                Text("\(min(badge, 99))")
                                    .font(IzzicoWeb.Typography.captionSmall(.bold))
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(IzzicoWeb.Colors.error)
                                    .clipShape(Capsule())
                                    .offset(x: 10, y: -8)
                            }
                        }

                        Text(item.label)
                            .font(IzzicoWeb.Typography.caption(.medium))
                            .foregroundColor(selectedIndex == index ? roleColor : IzzicoWeb.Colors.gray500)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, IzzicoWeb.Spacing.sm)
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
        .padding(.horizontal, IzzicoWeb.Spacing.md)
        .padding(.top, IzzicoWeb.Spacing.sm)
        .background(
            IzzicoWeb.Colors.white
                .shadow(color: Color.black.opacity(0.08), radius: 16, x: 0, y: -4)
        )
        .animation(IzzicoWeb.Animations.quickSpring, value: selectedIndex)
    }
}

/// Nav bar web-style (top navigation)
struct WebNavBar: View {
    let title: String
    var subtitle: String? = nil
    var showBackButton: Bool = true
    var onBack: (() -> Void)? = nil
    var trailingIcon: String? = nil
    var onTrailingAction: (() -> Void)? = nil

    var body: some View {
        HStack(spacing: IzzicoWeb.Spacing.md) {
            // Back button
            if showBackButton {
                Button(action: { onBack?() }) {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 20, weight: .semibold))
                        .foregroundColor(IzzicoWeb.Colors.gray900)
                        .frame(width: 40, height: 40)
                }
            }

            // Title
            VStack(alignment: showBackButton ? .leading : .center, spacing: 2) {
                Text(title)
                    .font(IzzicoWeb.Typography.titleSmall(.bold))
                    .foregroundColor(IzzicoWeb.Colors.gray900)

                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(IzzicoWeb.Typography.caption())
                        .foregroundColor(IzzicoWeb.Colors.gray600)
                }
            }

            Spacer()

            // Trailing action
            if let trailingIcon = trailingIcon, let onTrailingAction = onTrailingAction {
                Button(action: onTrailingAction) {
                    Image(systemName: trailingIcon)
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(IzzicoWeb.Colors.gray900)
                        .frame(width: 40, height: 40)
                }
            }
        }
        .padding(.horizontal, IzzicoWeb.Spacing.lg)
        .padding(.vertical, IzzicoWeb.Spacing.md)
        .background(IzzicoWeb.Colors.white)
    }
}

// MARK: - Property Components

/// Property card web-style
struct WebPropertyCard: View {
    let imageUrl: String?
    let title: String
    let location: String
    let price: Int
    let rooms: Int?
    let size: Int?
    let isFavorite: Bool
    let onTap: () -> Void
    let onFavoriteToggle: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 0) {
                // Image
                ZStack(alignment: .topTrailing) {
                    if let imageUrl = imageUrl {
                        AsyncImage(url: URL(string: imageUrl)) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Rectangle()
                                .fill(IzzicoWeb.Colors.gray200)
                        }
                        .frame(height: 180)
                        .clipped()
                    } else {
                        Rectangle()
                            .fill(IzzicoWeb.Colors.gray200)
                            .frame(height: 180)
                            .overlay(
                                Image(systemName: "house.fill")
                                    .font(.system(size: 40))
                                    .foregroundColor(IzzicoWeb.Colors.gray400)
                            )
                    }

                    // Favorite button
                    Button(action: onFavoriteToggle) {
                        Circle()
                            .fill(IzzicoWeb.Colors.white)
                            .frame(width: 36, height: 36)
                            .overlay(
                                Image(systemName: isFavorite ? "heart.fill" : "heart")
                                    .font(.system(size: 18, weight: .medium))
                                    .foregroundColor(isFavorite ? IzzicoWeb.Colors.error : IzzicoWeb.Colors.gray700)
                            )
                            .shadow(color: Color.black.opacity(0.1), radius: 4)
                    }
                    .padding(IzzicoWeb.Spacing.md)
                }

                // Content
                VStack(alignment: .leading, spacing: IzzicoWeb.Spacing.sm) {
                    // Price
                    Text("€\(price)/mois")
                        .font(IzzicoWeb.Typography.titleSmall(.bold))
                        .foregroundColor(IzzicoWeb.Colors.resident500)

                    // Title
                    Text(title)
                        .font(IzzicoWeb.Typography.bodyRegular(.semibold))
                        .foregroundColor(IzzicoWeb.Colors.gray900)
                        .lineLimit(2)

                    // Location
                    HStack(spacing: 4) {
                        Image(systemName: "mappin")
                            .font(.system(size: 12))
                        Text(location)
                            .font(IzzicoWeb.Typography.bodySmall())
                    }
                    .foregroundColor(IzzicoWeb.Colors.gray600)

                    // Specs
                    HStack(spacing: IzzicoWeb.Spacing.md) {
                        if let rooms = rooms {
                            HStack(spacing: 4) {
                                Image(systemName: "bed.double.fill")
                                    .font(.system(size: 14))
                                Text("\(rooms)")
                                    .font(IzzicoWeb.Typography.caption())
                            }
                        }

                        if let size = size {
                            HStack(spacing: 4) {
                                Image(systemName: "square.fill")
                                    .font(.system(size: 12))
                                Text("\(size)m²")
                                    .font(IzzicoWeb.Typography.caption())
                            }
                        }
                    }
                    .foregroundColor(IzzicoWeb.Colors.gray600)
                }
                .padding(IzzicoWeb.Spacing.md)
            }
            .background(IzzicoWeb.Colors.white)
            .cornerRadius(IzzicoWeb.Radius.large)
            .webShadow(IzzicoWeb.Shadows.soft)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

/// Search bar web-style
struct WebSearchBar: View {
    @Binding var text: String
    var placeholder: String = "Rechercher..."
    var onFilterTap: (() -> Void)? = nil

    @FocusState private var isFocused: Bool

    var body: some View {
        HStack(spacing: IzzicoWeb.Spacing.md) {
            // Search field
            HStack(spacing: IzzicoWeb.Spacing.sm) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundColor(IzzicoWeb.Colors.gray500)

                TextField(placeholder, text: $text)
                    .font(IzzicoWeb.Typography.bodyRegular())
                    .focused($isFocused)

                if !text.isEmpty {
                    Button(action: { text = "" }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 18))
                            .foregroundColor(IzzicoWeb.Colors.gray400)
                    }
                }
            }
            .padding(IzzicoWeb.Spacing.md)
            .background(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                    .fill(IzzicoWeb.Colors.white)
            )
            .overlay(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                    .stroke(
                        isFocused ? IzzicoWeb.Colors.searcher500 : IzzicoWeb.Colors.gray200,
                        lineWidth: isFocused ? 2 : 1
                    )
            )

            // Filter button
            if let onFilterTap = onFilterTap {
                Button(action: onFilterTap) {
                    ZStack {
                        RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                            .fill(IzzicoWeb.Colors.searcher500)
                            .frame(width: 48, height: 48)

                        Image(systemName: "slider.horizontal.3")
                            .font(.system(size: 20, weight: .medium))
                            .foregroundColor(.white)
                    }
                }
            }
        }
        .animation(IzzicoWeb.Animations.quickSpring, value: isFocused)
    }
}

/// Filter chip
struct WebFilterChip: View {
    let label: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(IzzicoWeb.Typography.bodySmall(.medium))
                .foregroundColor(isSelected ? .white : IzzicoWeb.Colors.gray700)
                .padding(.horizontal, IzzicoWeb.Spacing.md)
                .padding(.vertical, IzzicoWeb.Spacing.sm)
                .background(
                    Capsule()
                        .fill(isSelected ? IzzicoWeb.Colors.searcher500 : IzzicoWeb.Colors.gray100)
                )
        }
        .animation(IzzicoWeb.Animations.quickSpring, value: isSelected)
    }
}

// MARK: - Message Components

/// Chat bubble web-style
struct WebChatBubble: View {
    let message: String
    let timestamp: String
    let isFromCurrentUser: Bool
    var roleColor: Color = IzzicoWeb.Colors.resident500

    var body: some View {
        HStack {
            if isFromCurrentUser { Spacer(minLength: 40) }

            VStack(alignment: isFromCurrentUser ? .trailing : .leading, spacing: 4) {
                Text(message)
                    .font(IzzicoWeb.Typography.bodyRegular())
                    .foregroundColor(isFromCurrentUser ? .white : IzzicoWeb.Colors.gray900)
                    .padding(IzzicoWeb.Spacing.md)
                    .background(
                        RoundedRectangle(
                            cornerRadius: IzzicoWeb.Radius.medium,
                            style: .continuous
                        )
                        .fill(isFromCurrentUser ? roleColor : IzzicoWeb.Colors.gray100)
                    )

                Text(timestamp)
                    .font(IzzicoWeb.Typography.caption())
                    .foregroundColor(IzzicoWeb.Colors.gray500)
                    .padding(.horizontal, IzzicoWeb.Spacing.sm)
            }

            if !isFromCurrentUser { Spacer(minLength: 40) }
        }
    }
}

/// Conversation list item web-style
struct WebConversationItem: View {
    let avatarUrl: String?
    let name: String
    let lastMessage: String
    let timestamp: String
    let unreadCount: Int
    let isOnline: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: IzzicoWeb.Spacing.md) {
                // Avatar with online indicator
                ZStack(alignment: .bottomTrailing) {
                    if let avatarUrl = avatarUrl {
                        AsyncImage(url: URL(string: avatarUrl)) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Circle()
                                .fill(IzzicoWeb.Colors.gray200)
                        }
                        .frame(width: 56, height: 56)
                        .clipShape(Circle())
                    } else {
                        Circle()
                            .fill(IzzicoWeb.Gradients.resident)
                            .frame(width: 56, height: 56)
                            .overlay(
                                Text(String(name.prefix(1)))
                                    .font(.system(size: 24, weight: .bold))
                                    .foregroundColor(.white)
                            )
                    }

                    if isOnline {
                        Circle()
                            .fill(IzzicoWeb.Colors.success)
                            .frame(width: 14, height: 14)
                            .overlay(
                                Circle()
                                    .stroke(IzzicoWeb.Colors.white, lineWidth: 2)
                            )
                    }
                }

                // Content
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(name)
                            .font(IzzicoWeb.Typography.bodyRegular(.semibold))
                            .foregroundColor(IzzicoWeb.Colors.gray900)

                        Spacer()

                        Text(timestamp)
                            .font(IzzicoWeb.Typography.caption())
                            .foregroundColor(IzzicoWeb.Colors.gray500)
                    }

                    HStack {
                        Text(lastMessage)
                            .font(IzzicoWeb.Typography.bodySmall())
                            .foregroundColor(IzzicoWeb.Colors.gray600)
                            .lineLimit(1)

                        Spacer()

                        if unreadCount > 0 {
                            Text("\(min(unreadCount, 99))")
                                .font(IzzicoWeb.Typography.captionSmall(.bold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(IzzicoWeb.Colors.resident500)
                                .clipShape(Capsule())
                        }
                    }
                }
            }
            .padding(IzzicoWeb.Spacing.md)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

/// Message input bar web-style
struct WebMessageInputBar: View {
    @Binding var text: String
    let onSend: () -> Void
    var placeholder: String = "Votre message..."

    var body: some View {
        HStack(spacing: IzzicoWeb.Spacing.md) {
            // Input field
            TextField(placeholder, text: $text)
                .font(IzzicoWeb.Typography.bodyRegular())
                .padding(IzzicoWeb.Spacing.md)
                .background(
                    RoundedRectangle(cornerRadius: IzzicoWeb.Radius.pill, style: .continuous)
                        .fill(IzzicoWeb.Colors.gray100)
                )

            // Send button
            Button(action: onSend) {
                Circle()
                    .fill(sendButtonBackground)
                    .frame(width: 40, height: 40)
                    .overlay(
                        Image(systemName: "arrow.up")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white)
                    )
            }
            .disabled(text.isEmpty)
        }
        .padding(IzzicoWeb.Spacing.md)
        .background(IzzicoWeb.Colors.white)
    }

    private var sendButtonBackground: LinearGradient {
        if text.isEmpty {
            return LinearGradient(colors: [IzzicoWeb.Colors.gray300], startPoint: .leading, endPoint: .trailing)
        } else {
            return IzzicoWeb.Gradients.resident
        }
    }
}

// MARK: - Onboarding Components

/// Progress bar web-style
struct WebProgressBar: View {
    let current: Int
    let total: Int
    var roleColor: Color = IzzicoWeb.Colors.resident500

    var progress: CGFloat {
        CGFloat(current) / CGFloat(total)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: IzzicoWeb.Spacing.sm) {
            // Progress text
            Text("\(current)/\(total)")
                .font(IzzicoWeb.Typography.bodySmall(.medium))
                .foregroundColor(IzzicoWeb.Colors.gray600)

            // Progress bar
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    // Background
                    RoundedRectangle(cornerRadius: IzzicoWeb.Radius.small, style: .continuous)
                        .fill(IzzicoWeb.Colors.gray200)
                        .frame(height: 8)

                    // Fill
                    RoundedRectangle(cornerRadius: IzzicoWeb.Radius.small, style: .continuous)
                        .fill(roleColor)
                        .frame(width: geometry.size.width * progress, height: 8)
                }
            }
            .frame(height: 8)
        }
        .animation(IzzicoWeb.Animations.smoothSpring, value: current)
    }
}

/// Step indicator (dots) web-style
struct WebStepIndicator: View {
    let current: Int
    let total: Int
    var roleColor: Color = IzzicoWeb.Colors.resident500

    var body: some View {
        HStack(spacing: IzzicoWeb.Spacing.sm) {
            ForEach(0..<total, id: \.self) { index in
                Circle()
                    .fill(index <= current ? roleColor : IzzicoWeb.Colors.gray300)
                    .frame(width: index == current ? 10 : 8, height: index == current ? 10 : 8)
            }
        }
        .animation(IzzicoWeb.Animations.smoothSpring, value: current)
    }
}

/// Onboarding step card web-style
struct WebOnboardingStepCard: View {
    let icon: String
    let title: String
    let subtitle: String
    var roleColor: Color = IzzicoWeb.Colors.resident500

    var body: some View {
        VStack(spacing: IzzicoWeb.Spacing.xl) {
            // Icon
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [roleColor.opacity(0.2), roleColor.opacity(0.1)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 120, height: 120)

                Image(systemName: icon)
                    .font(.system(size: 50, weight: .semibold))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [roleColor, roleColor.opacity(0.7)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }

            // Text
            VStack(spacing: IzzicoWeb.Spacing.md) {
                Text(title)
                    .font(IzzicoWeb.Typography.titleLarge(.bold))
                    .foregroundColor(IzzicoWeb.Colors.gray900)
                    .multilineTextAlignment(.center)

                Text(subtitle)
                    .font(IzzicoWeb.Typography.bodyRegular())
                    .foregroundColor(IzzicoWeb.Colors.gray600)
                    .multilineTextAlignment(.center)
            }
        }
        .padding(IzzicoWeb.Spacing.xxl)
    }
}

/// Option card for selection (e.g., personality traits)
struct WebOptionCard: View {
    let icon: String
    let title: String
    let isSelected: Bool
    let action: () -> Void
    var roleColor: Color = IzzicoWeb.Colors.resident500

    var body: some View {
        Button(action: action) {
            HStack(spacing: IzzicoWeb.Spacing.md) {
                // Icon
                ZStack {
                    Circle()
                        .fill(isSelected ? roleColor : IzzicoWeb.Colors.gray100)
                        .frame(width: 48, height: 48)

                    Image(systemName: icon)
                        .font(.system(size: 20, weight: .semibold))
                        .foregroundColor(isSelected ? .white : IzzicoWeb.Colors.gray600)
                }

                // Title
                Text(title)
                    .font(IzzicoWeb.Typography.bodyRegular(.medium))
                    .foregroundColor(IzzicoWeb.Colors.gray900)

                Spacer()

                // Checkmark
                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 24))
                        .foregroundColor(roleColor)
                }
            }
            .padding(IzzicoWeb.Spacing.md)
            .background(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                    .fill(IzzicoWeb.Colors.white)
            )
            .overlay(
                RoundedRectangle(cornerRadius: IzzicoWeb.Radius.medium, style: .continuous)
                    .stroke(
                        isSelected ? roleColor : IzzicoWeb.Colors.gray200,
                        lineWidth: isSelected ? 2 : 1
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
        .animation(IzzicoWeb.Animations.quickSpring, value: isSelected)
    }
}

// Note: ScaleButtonStyle is defined in PinterestComponents.swift - no duplicate needed
// Note: Color(hex:) extension is defined in DesignTokens.swift - no duplicate needed

// MARK: - Preview

struct IzzicoWebDesignSystem_Previews: PreviewProvider {
    static var previews: some View {
        ZStack {
            DecorativeBlobsBackground()

            ScrollView {
                VStack(spacing: 20) {
                    WebHeaderBar(
                        onNotificationsTap: {},
                        onKeyTap: {},
                        onMenuTap: {}
                    )

                    WebPropertyHeaderCard(
                        title: "Appartement 2 Chambres - Ixelles Flagey",
                        location: "Ixelles",
                        roommatesCount: 3,
                        completionPercent: 65,
                        onInviteTap: {}
                    )
                    .padding(.horizontal)

                    WebKPIGrid(
                        rentPaid: 1062,
                        rentTotal: 1250,
                        rentDueDate: "5 nov.",
                        sharedExpenses: 125,
                        yourBalance: -45,
                        roommatesCount: 4
                    )

                    WebEmptyState(
                        icon: "checkmark.circle.fill",
                        title: "Aucune tâche en attente",
                        subtitle: "Tout est fait !",
                        color: IzzicoWeb.Colors.residentPrimary
                    )
                    .padding(.horizontal)
                    .webGlassCard()
                    .padding(.horizontal)
                }
                .padding(.bottom, 100)
            }

            // FAB
            VStack {
                Spacer()
                HStack {
                    Spacer()
                    WebFABChat(unreadCount: 3, action: {})
                        .padding()
                }
            }
        }
    }
}
