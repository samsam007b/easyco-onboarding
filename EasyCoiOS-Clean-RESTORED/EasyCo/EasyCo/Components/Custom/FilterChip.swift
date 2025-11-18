import SwiftUI

// MARK: - Filter Chip

struct FilterChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(Theme.Typography.bodySmall(.semibold))
                .foregroundColor(isSelected ? .white : Theme.Colors.textPrimary)
                .padding(.horizontal, Theme.Spacing.md)
                .padding(.vertical, Theme.Spacing.sm)
                .background(isSelected ? Theme.Colors.primary : Theme.Colors.backgroundSecondary)
                .cornerRadius(Theme.CornerRadius.full)
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.CornerRadius.full)
                        .stroke(isSelected ? Color.clear : Theme.Colors.border, lineWidth: 1)
                )
        }
    }
}

// MARK: - Chip Group

struct ChipGroup<Item: Identifiable & Hashable>: View where Item: CustomStringConvertible {
    let items: [Item]
    @Binding var selectedItem: Item?
    let multiSelect: Bool

    init(items: [Item], selectedItem: Binding<Item?>, multiSelect: Bool = false) {
        self.items = items
        self._selectedItem = selectedItem
        self.multiSelect = multiSelect
    }

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: Theme.Spacing.sm) {
                ForEach(items) { item in
                    FilterChip(
                        title: item.description,
                        isSelected: selectedItem == item
                    ) {
                        if selectedItem == item && multiSelect {
                            selectedItem = nil
                        } else {
                            selectedItem = item
                        }
                    }
                }
            }
            .padding(.horizontal, Theme.Spacing.md)
        }
    }
}

// MARK: - Preview

