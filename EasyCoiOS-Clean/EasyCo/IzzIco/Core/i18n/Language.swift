import Foundation

// MARK: - Language Types

/// Supported languages in the app
enum Language: String, CaseIterable, Codable {
    case fr = "fr"
    case en = "en"
    case nl = "nl"
    case de = "de"

    var code: String { rawValue }

    var name: String {
        switch self {
        case .fr: return "Français"
        case .en: return "English"
        case .nl: return "Nederlands"
        case .de: return "Deutsch"
        }
    }

    var flag: String {
        switch self {
        case .fr: return "🇫🇷"
        case .en: return "🇬🇧"
        case .nl: return "🇳🇱"
        case .de: return "🇩🇪"
        }
    }

    var locale: Locale {
        Locale(identifier: rawValue)
    }
}

// MARK: - Language Info

struct LanguageInfo: Identifiable {
    let id: String
    let language: Language
    let name: String
    let flag: String

    init(language: Language) {
        self.id = language.rawValue
        self.language = language
        self.name = language.name
        self.flag = language.flag
    }
}

// MARK: - Available Languages

extension Language {
    static var availableLanguages: [LanguageInfo] {
        Language.allCases.map { LanguageInfo(language: $0) }
    }

    static var `default`: Language {
        .fr
    }
}
