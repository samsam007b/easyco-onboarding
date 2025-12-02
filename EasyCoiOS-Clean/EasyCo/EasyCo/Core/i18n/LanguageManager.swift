import Foundation
import Combine
import SwiftUI

// MARK: - Language Manager

/// Manages the app's current language and provides translation access
@MainActor
class LanguageManager: ObservableObject {
    static let shared = LanguageManager()

    @Published var currentLanguage: Language {
        didSet {
            saveLanguage(currentLanguage)
        }
    }

    private let storageKey = "easyco_language"

    private init() {
        // Load saved language or use default
        if let savedLanguageCode = UserDefaults.standard.string(forKey: storageKey),
           let savedLanguage = Language(rawValue: savedLanguageCode) {
            self.currentLanguage = savedLanguage
        } else {
            self.currentLanguage = .default
        }
    }

    // MARK: - Public Methods

    /// Changes the current language
    func setLanguage(_ language: Language) {
        currentLanguage = language
    }

    /// Gets a translation for a key in the current language
    func translate(_ key: String) -> String {
        // TODO: Implement real translation system
        // For now, return the key as-is
        return key
        // Translations.t(key, language: currentLanguage)
    }

    // TODO: Re-enable when TranslationSections is implemented
    /*
    /// Gets a section of translations in the current language
    func getSection<T>(_ keyPath: KeyPath<TranslationSections, T>) -> T {
        // TODO: Implement real translation sections
        fatalError("Translation sections not yet implemented")
        // Translations.getSection(keyPath, language: currentLanguage)
    }
    */

    // MARK: - Private Methods

    private func saveLanguage(_ language: Language) {
        UserDefaults.standard.set(language.rawValue, forKey: storageKey)
    }
}

// MARK: - SwiftUI Environment Key

private struct LanguageManagerKey: EnvironmentKey {
    static let defaultValue = LanguageManager.shared
}

extension EnvironmentValues {
    var languageManager: LanguageManager {
        get { self[LanguageManagerKey.self] }
        set { self[LanguageManagerKey.self] = newValue }
    }
}

// MARK: - View Extension for Easy Access

extension View {
    /// Provides access to the language manager in the view
    func withLanguageManager() -> some View {
        self.environmentObject(LanguageManager.shared)
    }
}
