import SwiftUI

// MARK: - Onboarding View

struct OnboardingView: View {
    @Binding var hasCompletedOnboarding: Bool
    @State private var currentPage = 0

    private let pages: [OnboardingPage] = [
        OnboardingPage(
            icon: "house.fill",
            title: "Trouve ta colocation idéale",
            description: "Parcours des centaines de propriétés vérifiées dans toute la Belgique."
        ),
        OnboardingPage(
            icon: "person.3.fill",
            title: "Matching intelligent",
            description: "Notre algorithme te met en relation avec des colocataires compatibles."
        ),
        OnboardingPage(
            icon: "checkmark.shield.fill",
            title: "100% sécurisé",
            description: "Vérification d'identité obligatoire. Fini les arnaques et profils fake."
        )
    ]

    var body: some View {
        VStack {
            // Page Indicator
            HStack(spacing: Theme.Spacing.sm) {
                ForEach(0..<pages.count, id: \.self) { index in
                    Circle()
                        .fill(index == currentPage ? Theme.Colors.primary : Theme.Colors.border)
                        .frame(width: 8, height: 8)
                }
            }
            .padding(.top, Theme.Spacing.xl)

            // Pages
            TabView(selection: $currentPage) {
                ForEach(Array(pages.enumerated()), id: \.offset) { index, page in
                    OnboardingPageView(page: page)
                        .tag(index)
                }
            }
            .tabViewStyle(.page(indexDisplayMode: .never))

            // Button
            VStack(spacing: Theme.Spacing.md) {
                if currentPage == pages.count - 1 {
                    CustomButton("Commencer", icon: "arrow.right", style: .primary) {
                        withAnimation {
                            hasCompletedOnboarding = true
                        }
                    }
                } else {
                    CustomButton("Suivant", icon: "arrow.right", style: .primary) {
                        withAnimation {
                            currentPage += 1
                        }
                    }
                }

                Button("Passer") {
                    hasCompletedOnboarding = true
                }
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textSecondary)
            }
            .padding(.horizontal, Theme.Spacing.xl)
            .padding(.bottom, Theme.Spacing.xl)
        }
    }
}

// MARK: - Onboarding Page

struct OnboardingPage {
    let icon: String
    let title: String
    let description: String
}

struct OnboardingPageView: View {
    let page: OnboardingPage

    var body: some View {
        VStack(spacing: Theme.Spacing.xl) {
            Spacer()

            Image(systemName: page.icon)
                .font(.system(size: 100))
                .foregroundColor(Theme.Colors.primary)

            VStack(spacing: Theme.Spacing.md) {
                Text(page.title)
                    .font(Theme.Typography.title1())
                    .foregroundColor(Theme.Colors.textPrimary)
                    .multilineTextAlignment(.center)

                Text(page.description)
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, Theme.Spacing.xl)
            }

            Spacer()
        }
    }
}

// MARK: - Preview

#Preview {
    OnboardingView(hasCompletedOnboarding: .constant(false))
}
