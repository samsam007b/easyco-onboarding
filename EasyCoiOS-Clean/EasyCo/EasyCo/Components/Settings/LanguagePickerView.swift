import SwiftUI

// MARK: - Language Picker View

/// Full-screen language picker with immediate selection
struct LanguagePickerView: View {
    @EnvironmentObject var languageManager: LanguageManager
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            List {
                ForEach(Language.availableLanguages) { languageInfo in
                    LanguagePickerRow(
                        languageInfo: languageInfo,
                        isSelected: languageManager.currentLanguage == languageInfo.language
                    ) {
                        withAnimation(Theme.Animations.base) {
                            languageManager.setLanguage(languageInfo.language)
                            // Dismiss after a short delay to show selection
                            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                                dismiss()
                            }
                        }
                    }
                }
            }
            .listStyle(.insetGrouped)
            .navigationTitle("Langue / Language")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(Theme.GrayColors._400)
                            .symbolRenderingMode(.hierarchical)
                    }
                }
            }
        }
    }
}

// MARK: - Language Picker Row

private struct LanguagePickerRow: View {
    let languageInfo: LanguageInfo
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: Theme.Spacing._4) {
                // Flag circle
                ZStack {
                    Circle()
                        .fill(Theme.GrayColors._100)
                        .frame(width: 48, height: 48)

                    Text(languageInfo.flag)
                        .font(.system(size: 28))
                }

                // Language info
                VStack(alignment: .leading, spacing: Theme.Spacing._1) {
                    Text(languageInfo.name)
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text(languageInfo.language.code.uppercased())
                        .font(Theme.Typography.caption(.medium))
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                Spacer()

                // Selection indicator
                if isSelected {
                    ZStack {
                        Circle()
                            .fill(Theme.ResidentColors._100)
                            .frame(width: 32, height: 32)

                        Image(systemName: "checkmark")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Theme.ResidentColors._600)
                    }
                    .transition(.scale.combined(with: .opacity))
                }
            }
            .padding(.vertical, Theme.Spacing._2)
            .contentShape(Rectangle())
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Preview

struct LanguagePickerView_Previews: PreviewProvider {
    static var previews: some View {
        LanguagePickerView()
            .environmentObject(LanguageManager.shared)
    }
}
