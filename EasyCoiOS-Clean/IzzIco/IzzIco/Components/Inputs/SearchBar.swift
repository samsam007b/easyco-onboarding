//
//  SearchBar.swift
//  IzzIco
//
//  Modern search bar component (pill-shaped)
//

import SwiftUI

struct SearchBar: View {
    @Binding var text: String
    var placeholder: String = "Rechercher..."
    var showFilterButton: Bool = true
    var filterCount: Int = 0
    var onFilterTap: (() -> Void)? = nil

    @FocusState private var isFocused: Bool

    var body: some View {
        HStack(spacing: 12) {
            // Search icon
            Image.lucide("search")
                .resizable()
                .scaledToFit()
                .frame(width: Theme.Size.iconMedium, height: Theme.Size.iconMedium)
                .foregroundColor(Theme.Colors.primary)

            // Text field
            TextField(placeholder, text: $text)
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textPrimary)
                .accentColor(Theme.Colors.primary)
                .focused($isFocused)

            // Clear button
            if !text.isEmpty {
                Button(action: {
                    text = ""
                }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(Theme.Colors.gray400)
                        .frame(width: 20, height: 20)
                }
                .transition(.scale.combined(with: .opacity))
            }

            // Filter button
            if showFilterButton {
                Button(action: {
                    Haptic.selection()
                    onFilterTap?()
                }) {
                    ZStack(alignment: .topTrailing) {
                        Image.lucide("sliders-horizontal")
                            .resizable()
                            .scaledToFit()
                            .frame(width: Theme.Size.iconMedium, height: Theme.Size.iconMedium)
                            .foregroundColor(filterCount > 0 ? Theme.Colors.primary : Theme.Colors.gray600)

                        // Badge count
                        if filterCount > 0 {
                            Text("\(filterCount)")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.white)
                                .frame(minWidth: 16, minHeight: 16)
                                .background(Theme.Colors.primary)
                                .clipShape(Circle())
                                .offset(x: 8, y: -8)
                        }
                    }
                }
            }
        }
        .padding(.horizontal, Theme.Spacing.lg)
        .frame(height: Theme.Size.searchBarHeight)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.Size.searchBarHeight / 2) // Pill shape
        .softShadow()
        .animation(Theme.Animation.springFast, value: text.isEmpty)
        .animation(Theme.Animation.springFast, value: filterCount)
    }
}

// MARK: - Preview

struct SearchBar_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 24) {
            SearchBar(text: .constant(""), showFilterButton: false)

            SearchBar(text: .constant("Bruxelles"))

            SearchBar(
                text: .constant(""),
                filterCount: 3,
                onFilterTap: {}
            )

            SearchBar(
                text: .constant("Appartement 2 chambres"),
                placeholder: "Ville, quartier...",
                filterCount: 12,
                onFilterTap: {}
            )
        }
        .padding()
        .background(Theme.Colors.gray50)
    }
}
