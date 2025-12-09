//
//  AccessibilityHelpers.swift
//  IzzIco
//
//  Accessibility helpers and extensions for VoiceOver support
//

import SwiftUI

// MARK: - View Extensions for Accessibility

extension View {
    /// Add accessibility label and hint
    func accessibleElement(
        label: String,
        hint: String? = nil,
        traits: AccessibilityTraits = []
    ) -> some View {
        self
            .accessibilityLabel(label)
            .accessibilityHint(hint ?? "")
            .accessibilityAddTraits(traits)
    }

    /// Make element a button with proper accessibility
    func accessibleButton(
        label: String,
        hint: String? = nil
    ) -> some View {
        self
            .accessibilityLabel(label)
            .accessibilityHint(hint ?? "")
            .accessibilityAddTraits(.isButton)
    }

    /// Make element a header
    func accessibleHeader(_ label: String) -> some View {
        self
            .accessibilityLabel(label)
            .accessibilityAddTraits(.isHeader)
    }

    /// Group accessibility elements
    func accessibilityGroup(label: String? = nil) -> some View {
        Group {
            if let label = label {
                self
                    .accessibilityElement(children: .combine)
                    .accessibilityLabel(label)
            } else {
                self.accessibilityElement(children: .combine)
            }
        }
    }

    /// Hidden from accessibility
    func accessibilityHidden() -> some View {
        self.accessibilityHidden(true)
    }
}

// MARK: - Accessibility Identifiers

enum AccessibilityID {
    // MARK: - Navigation
    static let tabBarHome = "tab_bar_home"
    static let tabBarSearch = "tab_bar_search"
    static let tabBarSwipe = "tab_bar_swipe"
    static let tabBarMessages = "tab_bar_messages"
    static let tabBarProfile = "tab_bar_profile"

    // MARK: - Property Cards
    static let propertyCard = "property_card"
    static let propertyImage = "property_image"
    static let propertyTitle = "property_title"
    static let propertyPrice = "property_price"
    static let propertyLocation = "property_location"
    static let propertyMatchScore = "property_match_score"

    // MARK: - Actions
    static let likeButton = "like_button"
    static let passButton = "pass_button"
    static let superLikeButton = "super_like_button"
    static let applyButton = "apply_button"
    static let messageButton = "message_button"

    // MARK: - Forms
    static let emailField = "email_field"
    static let passwordField = "password_field"
    static let searchField = "search_field"
    static let messageField = "message_field"

    // MARK: - Filters
    static let priceFilter = "price_filter"
    static let typeFilter = "type_filter"
    static let bedroomsFilter = "bedrooms_filter"
    static let amenitiesFilter = "amenities_filter"
}

// MARK: - Semantic Accessibility Labels

struct AccessibilityLabel {
    // MARK: - Property Related
    static func property(title: String, price: Int, location: String) -> String {
        "\(title), \(price) euros par mois, situé à \(location)"
    }

    static func propertyFeatures(bedrooms: Int, bathrooms: Int, area: Int?) -> String {
        var features = "\(bedrooms) chambre\(bedrooms > 1 ? "s" : ""), \(bathrooms) salle\(bathrooms > 1 ? "s" : "") de bain"
        if let area = area {
            features += ", \(area) mètres carrés"
        }
        return features
    }

    static func matchScore(_ score: Int) -> String {
        "\(score) pourcent de compatibilité"
    }

    // MARK: - Actions
    static let swipeLeft = "Passer ce logement"
    static let swipeRight = "J'aime ce logement"
    static let swipeUp = "Super like ce logement"

    static func applyToProperty(_ title: String) -> String {
        "Postuler pour \(title)"
    }

    static func messageProperty(_ title: String) -> String {
        "Envoyer un message concernant \(title)"
    }

    // MARK: - Status
    static func applicationStatus(_ status: String) -> String {
        "Statut de la candidature: \(status)"
    }

    static func visitScheduled(date: String, time: String) -> String {
        "Visite programmée le \(date) à \(time)"
    }

    // MARK: - Rating
    static func rating(_ rating: Int, outOf max: Int = 5) -> String {
        "\(rating) étoile\(rating > 1 ? "s" : "") sur \(max)"
    }

    static func reviewCount(_ count: Int) -> String {
        "\(count) avis"
    }
}

// MARK: - Dynamic Type Support

struct ScaledFont: ViewModifier {
    @Environment(\.sizeCategory) var sizeCategory
    let textStyle: Font.TextStyle
    let weight: Font.Weight

    func body(content: Content) -> some View {
        content
            .font(.system(textStyle, design: .default).weight(weight))
            .lineLimit(nil)
            .minimumScaleFactor(0.8)
    }
}

extension View {
    func scaledFont(
        textStyle: Font.TextStyle = .body,
        weight: Font.Weight = .regular
    ) -> some View {
        modifier(ScaledFont(textStyle: textStyle, weight: weight))
    }
}

// MARK: - Contrast Helper

struct HighContrastModifier: ViewModifier {
    @Environment(\.colorSchemeContrast) var contrast

    let normalColor: Color
    let highContrastColor: Color

    func body(content: Content) -> some View {
        content
            .foregroundColor(contrast == .increased ? highContrastColor : normalColor)
    }
}

extension View {
    func adaptiveContrast(
        normal: Color,
        increased: Color
    ) -> some View {
        modifier(HighContrastModifier(normalColor: normal, highContrastColor: increased))
    }
}

// MARK: - Reduce Motion Support

struct AnimationModifier: ViewModifier {
    @Environment(\.accessibilityReduceMotion) var reduceMotion

    let animation: Animation?

    func body(content: Content) -> some View {
        if reduceMotion {
            content
        } else {
            content.animation(animation, value: UUID())
        }
    }
}

extension View {
    func accessibleAnimation(_ animation: Animation?) -> some View {
        modifier(AnimationModifier(animation: animation))
    }
}

// MARK: - Accessibility Announcements

struct AccessibilityAnnouncement {
    static func announce(_ message: String, delay: TimeInterval = 0.1) {
        DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
            #if !targetEnvironment(macCatalyst)
            UIAccessibility.post(notification: .announcement, argument: message)
            #endif
        }
    }

    static func screenChanged(to element: Any? = nil) {
        #if !targetEnvironment(macCatalyst)
        UIAccessibility.post(notification: .screenChanged, argument: element)
        #endif
    }

    static func layoutChanged(to element: Any? = nil) {
        #if !targetEnvironment(macCatalyst)
        UIAccessibility.post(notification: .layoutChanged, argument: element)
        #endif
    }

    // MARK: - Common Announcements
    static let loadingComplete = "Chargement terminé"
    static let refreshComplete = "Actualisation terminée"
    static let searchComplete = "Recherche terminée"
    static let filterApplied = "Filtres appliqués"
    static let messageSent = "Message envoyé"
    static let applicationSubmitted = "Candidature envoyée"
    static let visitScheduled = "Visite programmée"
    static let reviewSubmitted = "Avis publié"

    static func itemsFound(_ count: Int) -> String {
        "\(count) résultat\(count > 1 ? "s" : "") trouvé\(count > 1 ? "s" : "")"
    }

    static func matchFound(_ propertyTitle: String) -> String {
        "C'est un match avec \(propertyTitle)"
    }
}

// MARK: - Accessibility Environment

struct AccessibilityEnvironment {
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    @Environment(\.accessibilityReduceTransparency) var reduceTransparency
    @Environment(\.accessibilityDifferentiateWithoutColor) var differentiateWithoutColor
    @Environment(\.accessibilityInvertColors) var invertColors
    @Environment(\.sizeCategory) var sizeCategory
    @Environment(\.colorSchemeContrast) var contrast

    var isAccessibilityMode: Bool {
        reduceMotion || reduceTransparency || differentiateWithoutColor || sizeCategory.isAccessibilityCategory
    }

    var shouldSimplifyUI: Bool {
        reduceMotion || sizeCategory.isAccessibilityCategory
    }
}

// MARK: - Tap Target Size Helper

struct MinimumTapTargetModifier: ViewModifier {
    let minimumSize: CGFloat = 44 // Apple HIG recommendation

    func body(content: Content) -> some View {
        content
            .frame(minWidth: minimumSize, minHeight: minimumSize)
    }
}

extension View {
    func minimumTapTarget() -> some View {
        modifier(MinimumTapTargetModifier())
    }
}

// MARK: - Accessibility Preview Helper

struct AccessibilityPreviewModifier: ViewModifier {
    let label: String?

    func body(content: Content) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            if let label = label {
                Text(label)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .padding(.horizontal)
            }

            content
                .border(Color.blue.opacity(0.3), width: 1)
        }
    }
}

extension View {
    func accessibilityPreview(_ label: String? = nil) -> some View {
        modifier(AccessibilityPreviewModifier(label: label))
    }
}
