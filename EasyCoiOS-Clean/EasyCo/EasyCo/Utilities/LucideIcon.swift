//
//  LucideIcon.swift
//  EasyCo
//
//  Helper for using Lucide icons instead of SF Symbols
//

import SwiftUI

/// Lucide icon helper that maps SF Symbol names to Lucide icon asset names
struct LucideIcon {
    /// Map SF Symbol names to Lucide icon names in Assets
    private static let iconMapping: [String: String] = [
        // TabBar icons
        "house.fill": "home",
        "magnifyingglass": "search",
        "heart.fill": "heart",
        "bell.fill": "bell",
        "bookmark.fill": "bookmark",

        // Menu icons - Common
        "doc.text.fill": "file-text",
        "calendar.badge.clock": "calendar-clock",
        "person.3.fill": "users",
        "message.fill": "message-circle",
        "person.crop.circle": "user",
        "slider.horizontal.3": "sliders-horizontal",
        "gear": "settings",
        "chart.bar.fill": "bar-chart",
        "building.2.fill": "building-2",
        "eurosign.circle.fill": "euro",
        "mappin.circle.fill": "map-pin",
        "wrench.and.screwdriver.fill": "wrench",
        "checklist": "list-checks",
        "calendar": "calendar",
        "creditcard.fill": "credit-card",
        "megaphone.fill": "megaphone",
        "sparkles": "sparkles",

        // UI elements
        "plus": "plus",
        "plus.square.fill": "plus",
        "trash": "trash-2",
        "trash.fill": "trash-2",
        "chevron.right": "chevron-right",
        "chevron.left": "chevron-left",
        "xmark": "x",

        // Additional mappings
        "bell.badge": "bell",
        "hammer.fill": "wrench",
        "message.badge.fill": "message-circle",
    ]

    /// Get Lucide icon name from SF Symbol name
    static func name(for sfSymbol: String) -> String {
        return iconMapping[sfSymbol] ?? sfSymbol
    }

    /// Create an Image view for a Lucide icon
    static func image(_ sfSymbolName: String) -> Image {
        let lucideName = name(for: sfSymbolName)
        // Try to load from Assets, fall back to SF Symbol if not found
        if UIImage(named: lucideName) != nil {
            return Image(lucideName)
        } else {
            // Fallback to SF Symbol
            return Image(systemName: sfSymbolName)
        }
    }
}

/// SwiftUI extension for easier icon usage
extension Image {
    /// Create a Lucide icon from SF Symbol name
    static func lucide(_ sfSymbolName: String) -> Image {
        return LucideIcon.image(sfSymbolName)
    }
}
