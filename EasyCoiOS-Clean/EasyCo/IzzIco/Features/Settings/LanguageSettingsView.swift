import SwiftUI

// MARK: - Language Settings View

struct LanguageSettingsView: View {
    @EnvironmentObject var languageManager: LanguageManager
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List {
                Section {
                    ForEach(Language.availableLanguages) { languageInfo in
                        LanguageRow(
                            languageInfo: languageInfo,
                            isSelected: languageManager.currentLanguage == languageInfo.language
                        ) {
                            languageManager.setLanguage(languageInfo.language)
                        }
                    }
                } header: {
                    Text("Sélectionner la langue / Select language")
                        .font(.subheadline)
                }

                Section {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Current Language")
                            .font(.caption)
                            .foregroundColor(.secondary)

                        HStack {
                            Text(languageManager.currentLanguage.flag)
                                .font(.title)
                            Text(languageManager.currentLanguage.name)
                                .font(.headline)
                        }
                    }
                    .padding(.vertical, 4)
                } header: {
                    Text("Active")
                }
            }
            .navigationTitle("Language / Langue")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
        }
    }
}

// MARK: - Language Row

struct LanguageRow: View {
    let languageInfo: LanguageInfo
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                // Flag
                Text(languageInfo.flag)
                    .font(.title2)

                // Language name
                VStack(alignment: .leading, spacing: 2) {
                    Text(languageInfo.name)
                        .font(.body)
                        .foregroundColor(.primary)

                    Text(languageInfo.language.code.uppercased())
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Spacer()

                // Checkmark if selected
                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(Theme.Colors.primary)
                        .font(.title3)
                }
            }
            .padding(.vertical, 4)
        }
    }
}

// MARK: - Example Usage View

/// This view demonstrates how to use translations in your views
struct TranslationExampleView: View {
    @EnvironmentObject var languageManager: LanguageManager

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Language settings
                Text("Language Settings")
                    .font(.title)
                    .padding()

                Text("Current language: \(languageManager.currentLanguage.name)")
                    .font(.body)
                    .padding()

                ForEach(Language.allCases, id: \.self) { language in
                    Button(action: {
                        languageManager.setLanguage(language)
                    }) {
                        HStack {
                            Text(language.flag)
                            Text(language.name)
                            Spacer()
                            if languageManager.currentLanguage == language {
                                Image(systemName: "checkmark")
                                    .foregroundColor(.blue)
                            }
                        }
                        .padding()
                    }
                }
            }
            .padding()
        }
        .navigationTitle("Language")
    }
}

// Commented out examples to fix compilation
/*
                // Example 2: Using common translations
                VStack {
                    Text("Example 2: Common translations")
                        .font(.headline)

                    let common = languageManager.getSection(\.common)
                    HStack {
                        Button(common.save) {}
                            .buttonStyle(.borderedProminent)
                        Button(common.cancel) {}
                            .buttonStyle(.bordered)
                    }
                }

                Divider()

                // Example 3: Onboarding translations
                Group {
                    Text("Example 3: Onboarding")
                        .font(.headline)

                    let onboarding = languageManager.getSection(\.onboarding)
                    Text(onboarding.welcome)
                        .font(.largeTitle)
                        .fontWeight(.bold)

                    Button(onboarding.getStarted) {}
                        .buttonStyle(.borderedProminent)
                }

                Divider()

                // Example 4: Navigation translations
                Group {
                    Text("Example 4: Navigation")
                        .font(.headline)

                    let nav = languageManager.getSection(\.nav)
                    VStack(alignment: .leading, spacing: 8) {
                        Label(nav.home, systemImage: "house.fill")
                        Label(nav.properties, systemImage: "building.2.fill")
                        Label(nav.messages, systemImage: "message.fill")
                        Label(nav.profile, systemImage: "person.fill")
                    }
                }

                Divider()

                // Language selector button
                NavigationLink {
                    LanguageSettingsView()
                } label: {
                    HStack {
                        Text("Change Language")
                            .font(.headline)
                        Spacer()
                        Text(languageManager.currentLanguage.flag)
                            .font(.title2)
                        Text(languageManager.currentLanguage.name)
                            .foregroundColor(.secondary)
                        Image(systemName: "chevron.right")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .padding()
                    .background(Color(.systemGray6))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                }
                .buttonStyle(.plain)
            }
            .padding()
        }
        .navigationTitle("Translation Examples")
    }
}
*/

// MARK: - Preview

#Preview("Language Settings") {
    NavigationStack {
        LanguageSettingsView()
            .environmentObject(LanguageManager.shared)
    }
}

#Preview("Examples") {
    NavigationStack {
        TranslationExampleView()
            .environmentObject(LanguageManager.shared)
    }
}
