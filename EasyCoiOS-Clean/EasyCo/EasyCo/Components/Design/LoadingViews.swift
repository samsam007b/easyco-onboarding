import SwiftUI

// MARK: - Skeleton Loader Component

/// Skeleton loading component matching web app design
struct SkeletonView: View {
    let cornerRadius: CGFloat
    let height: CGFloat?

    @State private var isAnimating = false

    init(
        height: CGFloat? = nil,
        cornerRadius: CGFloat = Theme.CornerRadius.md
    ) {
        self.height = height
        self.cornerRadius = cornerRadius
    }

    var body: some View {
        Rectangle()
            .fill(Theme.GrayColors._200)
            .if(height != nil) { view in
                view.frame(height: height!)
            }
            .cornerRadius(cornerRadius)
            .overlay(
                GeometryReader { geometry in
                    LinearGradient(
                        colors: [
                            .clear,
                            Color.white.opacity(0.6),
                            .clear
                        ],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                    .frame(width: geometry.size.width * 2)
                    .offset(x: isAnimating ? geometry.size.width : -geometry.size.width)
                }
            )
            .onAppear {
                withAnimation(
                    Animation.linear(duration: 1.5)
                        .repeatForever(autoreverses: false)
                ) {
                    isAnimating = true
                }
            }
    }
}

// MARK: - Skeleton Card

struct SkeletonCard: View {
    var body: some View {
        ModernCard {
            VStack(alignment: .leading, spacing: Theme.Spacing._3) {
                // Image skeleton
                SkeletonView(height: 160, cornerRadius: Theme.CornerRadius.lg)

                // Title skeleton
                SkeletonView(height: 20, cornerRadius: Theme.CornerRadius.sm)
                    .frame(width: 200)

                // Subtitle skeleton
                SkeletonView(height: 16, cornerRadius: Theme.CornerRadius.sm)
                    .frame(width: 150)

                // Details skeleton
                HStack(spacing: Theme.Spacing._2) {
                    SkeletonView(height: 14, cornerRadius: Theme.CornerRadius.sm)
                        .frame(width: 80)
                    SkeletonView(height: 14, cornerRadius: Theme.CornerRadius.sm)
                        .frame(width: 60)
                }
            }
        }
    }
}

// MARK: - Skeleton List

struct SkeletonList: View {
    let count: Int

    init(count: Int = 5) {
        self.count = count
    }

    var body: some View {
        VStack(spacing: Theme.Spacing._3) {
            ForEach(0..<count, id: \.self) { _ in
                HStack(spacing: Theme.Spacing._3) {
                    // Avatar
                    SkeletonView(cornerRadius: Theme.CornerRadius.full)
                        .frame(width: 48, height: 48)

                    // Content
                    VStack(alignment: .leading, spacing: Theme.Spacing._2) {
                        SkeletonView(height: 16, cornerRadius: Theme.CornerRadius.sm)
                        SkeletonView(height: 14, cornerRadius: Theme.CornerRadius.sm)
                            .frame(width: 200)
                    }

                    Spacer()
                }
                .padding(Theme.Spacing._3)
                .background(Color.white)
                .cornerRadius(Theme.CornerRadius.lg)
            }
        }
    }
}

// MARK: - Loading Spinner

struct LoadingSpinner: View {
    let role: UserType?
    let size: CGFloat

    init(role: UserType? = nil, size: CGFloat = 40) {
        self.role = role
        self.size = size
    }

    var body: some View {
        ProgressView()
            .progressViewStyle(CircularProgressViewStyle(tint: spinnerColor))
            .scaleEffect(size / 40)
    }

    private var spinnerColor: Color {
        guard let role = role else { return Theme.OwnerColors._500 }
        switch role {
        case .searcher: return Theme.SearcherColors._500
        case .owner: return Theme.OwnerColors._500
        case .resident: return Theme.ResidentColors._500
        }
    }
}

// MARK: - Full Screen Loading

struct FullScreenLoading: View {
    let role: UserType?
    let message: String?

    init(role: UserType? = nil, message: String? = nil) {
        self.role = role
        self.message = message
    }

    var body: some View {
        ZStack {
            Color.black.opacity(0.3)
                .ignoresSafeArea()

            VStack(spacing: Theme.Spacing._4) {
                LoadingSpinner(role: role, size: 60)

                if let message = message {
                    Text(message)
                        .font(Theme.Typography.body(.medium))
                        .foregroundColor(.white)
                }
            }
            .padding(Theme.Spacing._8)
            .background(
                RoundedRectangle(cornerRadius: Theme.CornerRadius.xl)
                    .fill(Color.black.opacity(0.8))
            )
        }
    }
}

// MARK: - Pulsing Dot

struct PulsingDot: View {
    let color: Color
    let size: CGFloat

    @State private var isPulsing = false

    init(color: Color = Theme.SemanticColors.success, size: CGFloat = 8) {
        self.color = color
        self.size = size
    }

    var body: some View {
        Circle()
            .fill(color)
            .frame(width: size, height: size)
            .scaleEffect(isPulsing ? 1.2 : 1.0)
            .opacity(isPulsing ? 0.6 : 1.0)
            .onAppear {
                withAnimation(
                    Animation.easeInOut(duration: 1.0)
                        .repeatForever(autoreverses: true)
                ) {
                    isPulsing = true
                }
            }
    }
}

// MARK: - Modern Typing Indicator

struct ModernTypingIndicator: View {
    let role: UserType

    @State private var animatingDots: [Bool] = [false, false, false]

    init(role: UserType) {
        self.role = role
    }

    var body: some View {
        HStack(spacing: 4) {
            ForEach(0..<3) { index in
                Circle()
                    .fill(dotColor)
                    .frame(width: 8, height: 8)
                    .scaleEffect(animatingDots[index] ? 1.0 : 0.5)
                    .animation(
                        Animation.easeInOut(duration: 0.6)
                            .repeatForever()
                            .delay(Double(index) * 0.2),
                        value: animatingDots[index]
                    )
            }
        }
        .padding(.horizontal, Theme.Spacing._3)
        .padding(.vertical, Theme.Spacing._2)
        .background(Theme.GrayColors._100)
        .cornerRadius(Theme.CornerRadius.full)
        .onAppear {
            for i in 0..<3 {
                animatingDots[i] = true
            }
        }
    }

    private var dotColor: Color {
        switch role {
        case .searcher: return Theme.SearcherColors._500
        case .owner: return Theme.OwnerColors._500
        case .resident: return Theme.ResidentColors._500
        }
    }
}

// MARK: - Previews

struct LoadingViews_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: Theme.Spacing._6) {
                // Skeleton views
                SkeletonView(height: 100)
                SkeletonCard()
                SkeletonList(count: 3)

                // Loading spinners
                HStack(spacing: Theme.Spacing._4) {
                    LoadingSpinner()
                    LoadingSpinner(role: .searcher)
                    LoadingSpinner(role: .owner, size: 60)
                }

                // Pulsing dots
                HStack(spacing: Theme.Spacing._3) {
                    PulsingDot()
                    PulsingDot(color: Theme.OwnerColors._500)
                    PulsingDot(color: Theme.SearcherColors._500, size: 12)
                }

                // Typing indicator
                ModernTypingIndicator(role: .owner)

                // Note: EmptyStateView is defined in Components/Common/EmptyStateView.swift
            }
            .padding()
        }
        .background(Theme.Colors.backgroundSecondary)
    }
}
