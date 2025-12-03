//
//  BottomSheet.swift
//  EasyCo
//
//  Reusable bottom sheet component
//

import SwiftUI

enum BottomSheetDetent {
    case small // 30%
    case medium // 60%
    case large // 90%

    var height: CGFloat {
        let screenHeight = UIScreen.main.bounds.height
        switch self {
        case .small:
            return screenHeight * 0.3
        case .medium:
            return screenHeight * 0.6
        case .large:
            return screenHeight * 0.9
        }
    }
}

struct BottomSheet<Content: View>: View {
    @Binding var isPresented: Bool
    let title: String?
    let detent: BottomSheetDetent
    let content: Content

    @State private var offset: CGFloat = 0
    @State private var isDragging = false

    init(
        isPresented: Binding<Bool>,
        title: String? = nil,
        detent: BottomSheetDetent = .medium,
        @ViewBuilder content: () -> Content
    ) {
        self._isPresented = isPresented
        self.title = title
        self.detent = detent
        self.content = content()
    }

    var body: some View {
        ZStack {
            if isPresented {
                // Background overlay
                Color.black.opacity(0.4)
                    .ignoresSafeArea()
                    .onTapGesture {
                        dismissSheet()
                    }
                    .transition(.opacity)

                // Sheet content
                VStack(spacing: 0) {
                    Spacer()

                    VStack(spacing: 0) {
                        // Handle
                        RoundedRectangle(cornerRadius: 2.5)
                            .fill(Theme.Colors.gray300)
                            .frame(width: 40, height: 5)
                            .padding(.top, 12)
                            .padding(.bottom, 8)

                        // Header
                        if let title = title {
                            HStack {
                                Text(title)
                                    .font(Theme.Typography.title3())
                                    .foregroundColor(Theme.Colors.textPrimary)

                                Spacer()

                                IconButton(
                                    icon: "xmark",
                                    action: dismissSheet,
                                    size: 32,
                                    iconSize: 14,
                                    backgroundColor: Theme.Colors.gray100,
                                    hasShadow: false
                                )
                            }
                            .padding(.horizontal, Theme.Spacing.xl)
                            .padding(.bottom, Theme.Spacing.lg)
                        }

                        // Content
                        content
                    }
                    .frame(height: detent.height)
                    .frame(maxWidth: .infinity)
                    .background(
                        RoundedCorner(radius: Theme.CornerRadius.modal, corners: [.topLeft, .topRight])
                            .fill(Theme.Colors.backgroundPrimary)
                    )
                    .offset(y: max(0, offset))
                    .gesture(
                        DragGesture()
                            .onChanged { value in
                                isDragging = true
                                if value.translation.height > 0 {
                                    offset = value.translation.height
                                }
                            }
                            .onEnded { value in
                                isDragging = false
                                if value.translation.height > 100 {
                                    dismissSheet()
                                } else {
                                    withAnimation(Theme.Animation.spring) {
                                        offset = 0
                                    }
                                }
                            }
                    )
                }
                .transition(.move(edge: .bottom))
            }
        }
        .animation(Theme.Animation.spring, value: isPresented)
    }

    private func dismissSheet() {
        withAnimation(Theme.Animation.spring) {
            isPresented = false
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            offset = 0
        }
    }
}

// MARK: - Preview

struct BottomSheet_Previews: PreviewProvider {
    static var previews: some View {
        ZStack {
            Color.gray.opacity(0.2)
                .ignoresSafeArea()

            BottomSheet(
                isPresented: .constant(true),
                title: "Filtres",
                detent: .medium
            ) {
                ScrollView {
                    VStack(spacing: 20) {
                        ForEach(0..<10) { index in
                            Text("Item \(index)")
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Theme.Colors.gray100)
                                .cornerRadius(12)
                        }
                    }
                    .padding()
                }
            }
        }
    }
}
