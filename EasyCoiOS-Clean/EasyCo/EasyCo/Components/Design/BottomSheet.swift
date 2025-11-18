import SwiftUI

// MARK: - Bottom Sheet Component

/// A modern bottom sheet with drag to dismiss and multiple sizes
struct BottomSheet<Content: View>: View {
    @Binding var isPresented: Bool
    let detents: Set<BottomSheetDetent>
    let content: Content

    @State private var dragOffset: CGFloat = 0
    @State private var currentDetent: BottomSheetDetent

    init(
        isPresented: Binding<Bool>,
        detents: Set<BottomSheetDetent> = [.medium, .large],
        @ViewBuilder content: () -> Content
    ) {
        self._isPresented = isPresented
        self.detents = detents
        self.content = content()

        // Set initial detent to the smallest one
        _currentDetent = State(initialValue: detents.sorted { $0.height < $1.height }.first ?? .medium)
    }

    var body: some View {
        ZStack {
            if isPresented {
                // Overlay
                Color.black.opacity(0.4)
                    .ignoresSafeArea()
                    .onTapGesture {
                        dismissSheet()
                    }
                    .transition(.opacity)

                // Sheet
                VStack(spacing: 0) {
                    Spacer()

                    VStack(spacing: 0) {
                        // Drag indicator
                        dragIndicator

                        // Content
                        content
                            .frame(maxWidth: .infinity)
                    }
                    .frame(height: currentDetent.height + dragOffset)
                    .background(
                        Theme.AdaptiveColors.background
                            .cornerRadius(Theme.CornerRadius._3xl, corners: [.topLeft, .topRight])
                    )
                    .shadow(color: Theme.AdaptiveColors.shadow, radius: 20, x: 0, y: -5)
                    .offset(y: max(dragOffset, 0))
                    .gesture(
                        DragGesture()
                            .onChanged { value in
                                dragOffset = value.translation.height
                            }
                            .onEnded { value in
                                handleDragEnd(value.translation.height)
                            }
                    )
                }
                .transition(.move(edge: .bottom).combined(with: .opacity))
            }
        }
        .animation(.smooth, value: isPresented)
        .animation(.smooth, value: dragOffset)
    }

    private var dragIndicator: some View {
        VStack(spacing: Theme.Spacing._3) {
            Capsule()
                .fill(Theme.AdaptiveColors.Gray._400)
                .frame(width: 36, height: 5)
                .padding(.top, Theme.Spacing._3)

            Divider()
        }
    }

    private func handleDragEnd(_ translation: CGFloat) {
        HapticManager.shared.light()

        // Dismiss if dragged down significantly
        if translation > 100 {
            dismissSheet()
            return
        }

        // Snap to nearest detent if there are multiple
        if detents.count > 1 {
            let sortedDetents = detents.sorted { $0.height < $1.height }
            let nextDetentIndex = sortedDetents.firstIndex(of: currentDetent).map { $0 + 1 } ?? 0

            if translation < -50 && nextDetentIndex < sortedDetents.count {
                // Swipe up to expand
                currentDetent = sortedDetents[nextDetentIndex]
            } else if translation > 50 && nextDetentIndex > 0 {
                // Swipe down to collapse
                currentDetent = sortedDetents[nextDetentIndex - 1]
            }
        }

        dragOffset = 0
    }

    private func dismissSheet() {
        HapticManager.shared.soft()
        withAnimation(.smooth) {
            isPresented = false
        }
    }
}

// MARK: - Bottom Sheet Detent

enum BottomSheetDetent: Hashable {
    case small
    case medium
    case large
    case custom(CGFloat)

    var height: CGFloat {
        switch self {
        case .small:
            return UIScreen.main.bounds.height * 0.25
        case .medium:
            return UIScreen.main.bounds.height * 0.5
        case .large:
            return UIScreen.main.bounds.height * 0.9
        case .custom(let height):
            return height
        }
    }
}

// MARK: - View Extension

extension View {
    /// Present a bottom sheet
    func bottomSheet<Content: View>(
        isPresented: Binding<Bool>,
        detents: Set<BottomSheetDetent> = [.medium, .large],
        @ViewBuilder content: @escaping () -> Content
    ) -> some View {
        ZStack {
            self

            BottomSheet(
                isPresented: isPresented,
                detents: detents,
                content: content
            )
        }
    }
}

// MARK: - Previews
// Note: RoundedCorner shape and cornerRadius extension are defined in Extensions/View+Extensions.swift

#Preview("Bottom Sheet - Medium") {
    struct PreviewWrapper: View {
        @State private var isPresented = true

        var body: some View {
            VStack {
                Text("Main Content")
                Button("Show Sheet") {
                    isPresented = true
                }
            }
            .bottomSheet(isPresented: $isPresented, detents: [.medium]) {
                VStack(spacing: Theme.Spacing._4) {
                    Text("Bottom Sheet Content")
                        .font(.title)
                        .padding()

                    Text("Drag to dismiss")
                        .foregroundColor(Theme.AdaptiveColors.textSecondary)

                    Spacer()
                }
                .padding()
            }
        }
    }

    return PreviewWrapper()
}

#Preview("Bottom Sheet - Multiple Detents") {
    struct PreviewWrapper: View {
        @State private var isPresented = true

        var body: some View {
            VStack {
                Text("Main Content")
                Button("Show Sheet") {
                    isPresented = true
                }
            }
            .bottomSheet(isPresented: $isPresented, detents: [.small, .medium, .large]) {
                VStack(spacing: Theme.Spacing._4) {
                    Text("Multi-Size Sheet")
                        .font(.title)
                        .padding()

                    Text("Drag up or down to resize")
                        .foregroundColor(Theme.AdaptiveColors.textSecondary)

                    ForEach(0..<10) { index in
                        Text("Item \(index + 1)")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Theme.AdaptiveColors.backgroundSecondary)
                            .cornerRadius(Theme.CornerRadius.md)
                    }
                }
                .padding()
            }
        }
    }

    return PreviewWrapper()
}
