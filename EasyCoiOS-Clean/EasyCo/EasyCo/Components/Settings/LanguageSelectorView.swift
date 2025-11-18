import SwiftUI

// MARK: - Language Selector View

/// Language selector component matching web app design
struct LanguageSelectorView: View {
    @EnvironmentObject var languageManager: LanguageManager
    @State private var showLanguagePicker = false

    var body: some View {
        Button(action: {
            showLanguagePicker = true
        }) {
            HStack(spacing: Theme.Spacing._3) {
                // Current language flag
                Text(languageManager.currentLanguage.flag)
                    .font(.system(size: 24))

                VStack(alignment: .leading, spacing: Theme.Spacing._1) {
                    Text("Langue")
                        .font(Theme.Typography.bodySmall(.medium))
                        .foregroundColor(Theme.Colors.textSecondary)

                    Text(languageManager.currentLanguage.name)
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Theme.Colors.textSecondary)
            }
            .padding(Theme.Spacing._4)
            .background(Color.white)
            .cornerRadius(Theme.CornerRadius.lg)
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
        .buttonStyle(PlainButtonStyle())
        .sheet(isPresented: $showLanguagePicker) {
            LanguagePickerSheet()
                .environmentObject(languageManager)
        }
    }
}

// MARK: - Language Picker Sheet

private struct LanguagePickerSheet: View {
    @EnvironmentObject var languageManager: LanguageManager
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            List {
                ForEach(Language.availableLanguages) { languageInfo in
                    LanguageSelectorRow(
                        languageInfo: languageInfo,
                        isSelected: languageManager.currentLanguage == languageInfo.language
                    ) {
                        withAnimation(Theme.Animations.base) {
                            languageManager.setLanguage(languageInfo.language)
                            dismiss()
                        }
                    }
                }
            }
            .listStyle(.insetGrouped)
            .navigationTitle("Choisir une langue")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Fermer") {
                        dismiss()
                    }
                    .foregroundColor(Theme.ResidentColors._600)
                }
            }
        }
    }
}

// MARK: - Language Selector Row

private struct LanguageSelectorRow: View {
    let languageInfo: LanguageInfo
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: Theme.Spacing._4) {
                // Flag
                Text(languageInfo.flag)
                    .font(.system(size: 32))

                // Language name
                VStack(alignment: .leading, spacing: Theme.Spacing._1) {
                    Text(languageInfo.name)
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text(languageInfo.language.code.uppercased())
                        .font(Theme.Typography.caption())
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                Spacer()

                // Checkmark if selected
                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 24))
                        .foregroundColor(Theme.ResidentColors._600)
                }
            }
            .padding(.vertical, Theme.Spacing._2)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Compact Language Switcher

/// Compact language switcher for navigation bars
struct CompactLanguageSwitcher: View {
    @EnvironmentObject var languageManager: LanguageManager
    @State private var showPicker = false

    var body: some View {
        Button(action: {
            showPicker = true
        }) {
            HStack(spacing: Theme.Spacing._2) {
                Text(languageManager.currentLanguage.flag)
                    .font(.system(size: 20))

                Image(systemName: "chevron.down")
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundColor(Theme.Colors.textSecondary)
            }
            .padding(.horizontal, Theme.Spacing._3)
            .padding(.vertical, Theme.Spacing._2)
            .background(Theme.GrayColors._100)
            .cornerRadius(Theme.CornerRadius.full)
        }
        .sheet(isPresented: $showPicker) {
            LanguagePickerSheet()
                .environmentObject(languageManager)
        }
    }
}

// MARK: - Preview

struct LanguageSelectorView_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: Theme.Spacing._4) {
            LanguageSelectorView()
                .environmentObject(LanguageManager.shared)
                .padding()

            CompactLanguageSwitcher()
                .environmentObject(LanguageManager.shared)
        }
        .background(Theme.Colors.backgroundSecondary)
    }
}
