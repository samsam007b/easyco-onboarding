//
//  LoadingAndEmptyStates.swift
//  IzzIco
//
//  Reusable loading, empty, and error state components
//

import SwiftUI

// MARK: - Loading View

struct LoadingStateView: View {
    let message: String

    init(message: String = "Chargement...") {
        self.message = message
    }

    var body: some View {
        VStack(spacing: 20) {
            ProgressView()
                .scaleEffect(1.5)
                .tint(Theme.Colors.primary)

            Text(message)
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textSecondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Theme.Colors.backgroundSecondary)
    }
}

// MARK: - Skeleton Loader

struct SkeletonLoader: View {
    let width: CGFloat
    let height: CGFloat
    let cornerRadius: CGFloat

    @State private var isAnimating = false

    init(width: CGFloat = 100, height: CGFloat = 20, cornerRadius: CGFloat = 8) {
        self.width = width
        self.height = height
        self.cornerRadius = cornerRadius
    }

    var body: some View {
        Rectangle()
            .fill(
                LinearGradient(
                    colors: [
                        Theme.Colors.gray200,
                        Theme.Colors.gray100,
                        Theme.Colors.gray200
                    ],
                    startPoint: isAnimating ? .leading : .trailing,
                    endPoint: isAnimating ? .trailing : .leading
                )
            )
            .frame(width: width, height: height)
            .cornerRadius(cornerRadius)
            .onAppear {
                withAnimation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true)) {
                    isAnimating = true
                }
            }
    }
}

// MARK: - Property Card Skeleton

struct PropertyCardSkeleton: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Image skeleton
            SkeletonLoader(width: .infinity, height: 200, cornerRadius: 12)
                .frame(maxWidth: .infinity)

            VStack(alignment: .leading, spacing: 8) {
                // Title
                SkeletonLoader(width: 200, height: 18)

                // Location
                SkeletonLoader(width: 150, height: 14)

                // Price
                HStack(spacing: 8) {
                    SkeletonLoader(width: 80, height: 20)
                    SkeletonLoader(width: 60, height: 14)
                }

                // Features
                HStack(spacing: 12) {
                    SkeletonLoader(width: 50, height: 14)
                    SkeletonLoader(width: 50, height: 14)
                    SkeletonLoader(width: 60, height: 14)
                }
            }
            .padding(12)
        }
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }
}

// MARK: - Empty State View

// struct EmptyStateView: View {
//     let icon: String
//     let title: String
//     let message: String
//     let actionTitle: String?
//     let action: (() -> Void)?
// 
//     init(
//         icon: String,
//         title: String,
//         message: String,
//         actionTitle: String? = nil,
//         action: (() -> Void)? = nil
//     ) {
//         self.icon = icon
//         self.title = title
//         self.message = message
//         self.actionTitle = actionTitle
//         self.action = action
//     }
// 
//     var body: some View {
//         VStack(spacing: 24) {
//             Spacer()
// 
//             Image.lucide(icon)
//                 .resizable()
//                 .scaledToFit()
//                 .frame(width: 100, height: 100)
//                 .foregroundColor(Theme.Colors.gray300)
// 
//             VStack(spacing: 12) {
//                 Text(title)
//                     .font(Theme.Typography.title2())
//                     .foregroundColor(Theme.Colors.textPrimary)
// 
//                 Text(message)
//                     .font(Theme.Typography.body())
//                     .foregroundColor(Theme.Colors.textSecondary)
//                     .multilineTextAlignment(.center)
//                     .padding(.horizontal, 32)
//             }
//
//             if let actionTitle = actionTitle, let action = action {
//                 Button(action: {
//                     Haptic.impact(.medium)
//                     action()
//                 }) {
//                     Text(actionTitle)
//                         .font(Theme.Typography.body(.semibold))
//                         .foregroundColor(.white)
//                         .frame(maxWidth: 300)
//                         .frame(height: Theme.Size.buttonHeight)
//                         .background(Theme.Colors.primaryGradient)
//                         .cornerRadius(Theme.CornerRadius.button)
//                 }
//                 .padding(.top, 8)
//             }
//
//             Spacer()
//         }
//         .frame(maxWidth: .infinity, maxHeight: .infinity)
//         .background(Theme.Colors.backgroundSecondary)
//     }
// }

// MARK: - Error State View

struct ErrorStateView: View {
    let error: AppError
    let retryAction: (() -> Void)?

    init(error: AppError, retryAction: (() -> Void)? = nil) {
        self.error = error
        self.retryAction = retryAction
    }

    var body: some View {
        VStack(spacing: 24) {
            Spacer()

            Image.lucide(error.icon)
                .resizable()
                .scaledToFit()
                .frame(width: 100, height: 100)
                .foregroundColor(Theme.Colors.error)
                .padding(24)
                .background(Theme.Colors.error.opacity(0.1))
                .clipShape(Circle())

            VStack(spacing: 12) {
                Text(error.title)
                    .font(Theme.Typography.title2())
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(error.message)
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            if let retryAction = retryAction {
                VStack(spacing: 12) {
                    Button(action: {
                        Haptic.impact(.medium)
                        retryAction()
                    }) {
                        HStack {
                            Image.lucide("refresh-cw")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 20, height: 20)

                            Text("Réessayer")
                                .font(Theme.Typography.body(.semibold))
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: 300)
                        .frame(height: Theme.Size.buttonHeight)
                        .background(Theme.Colors.primaryGradient)
                        .cornerRadius(Theme.CornerRadius.button)
                    }

                    if error.hasSupport {
                        Button(action: {
                            Haptic.impact(.light)
                        }) {
                            Text("Contacter le support")
                                .font(Theme.Typography.body(.semibold))
                                .foregroundColor(Theme.Colors.primary)
                                .frame(maxWidth: 300)
                                .frame(height: Theme.Size.buttonHeight)
                                .background(Theme.Colors.backgroundPrimary)
                                .cornerRadius(Theme.CornerRadius.button)
                                .overlay(
                                    RoundedRectangle(cornerRadius: Theme.CornerRadius.button)
                                        .stroke(Theme.Colors.gray200, lineWidth: 1)
                                )
                        }
                    }
                }
                .padding(.top, 8)
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Theme.Colors.backgroundSecondary)
    }
}

// MARK: - Toast Notification

struct ToastView: View {
    let type: ToastType
    let message: String

    var body: some View {
        HStack(spacing: 12) {
            Image.lucide(type.icon)
                .resizable()
                .scaledToFit()
                .frame(width: 20, height: 20)
                .foregroundColor(.white)

            Text(message)
                .font(Theme.Typography.body(.semibold))
                .foregroundColor(.white)

            Spacer()
        }
        .padding(16)
        .background(type.backgroundColor)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.2), radius: 10, y: 5)
    }
}

enum ToastType {
    case success
    case error
    case info
    case warning

    var icon: String {
        switch self {
        case .success: return "check-circle"
        case .error: return "x-circle"
        case .info: return "info"
        case .warning: return "alert-triangle"
        }
    }

    var backgroundColor: Color {
        switch self {
        case .success: return Theme.Colors.success
        case .error: return Theme.Colors.error
        case .info: return Color(hex: "60A5FA")
        case .warning: return Theme.Colors.warning
        }
    }
}

// MARK: - App Error Model

// struct AppError: Identifiable {
//     let id = UUID()
//     let type: ErrorType
//     let title: String
//     let message: String
//     let icon: String
//     let hasSupport: Bool
// 
//     enum ErrorType {
//         case network
//         case server
//         case notFound
//         case unauthorized
//         case unknown
//     }
// 
//     static let networkError = AppError(
//         type: .network,
//         title: "Pas de connexion",
//         message: "Vérifiez votre connexion internet et réessayez",
//         icon: "wifi-off",
//         hasSupport: false
//     )
// 
//     static let serverError = AppError(
//         type: .server,
//         title: "Erreur serveur",
//         message: "Nos serveurs rencontrent un problème. Veuillez réessayer dans quelques instants",
//         icon: "server",
//         hasSupport: true
//     )
// 
//     static let notFoundError = AppError(
//         type: .notFound,
//         title: "Introuvable",
//         message: "Le contenu que vous recherchez n'existe pas ou a été supprimé",
//         icon: "search-x",
//         hasSupport: false
//     )
//
//     static let unauthorizedError = AppError(
//         type: .unauthorized,
//         title: "Non autorisé",
//         message: "Vous devez vous connecter pour accéder à ce contenu",
//         icon: "lock",
//         hasSupport: false
//     )
// }

// MARK: - Loading Overlay

struct LoadingOverlay: View {
    let message: String

    init(message: String = "Chargement...") {
        self.message = message
    }

    var body: some View {
        ZStack {
            Color.black.opacity(0.4)
                .ignoresSafeArea()

            VStack(spacing: 20) {
                ProgressView()
                    .scaleEffect(1.5)
                    .tint(.white)

                Text(message)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(.white)
            }
            .padding(32)
            .background(.ultraThinMaterial)
            .cornerRadius(16)
        }
    }
}

// MARK: - Pull to Refresh Indicator

struct PullToRefreshView: View {
    let isRefreshing: Bool

    var body: some View {
        HStack {
            Spacer()

            if isRefreshing {
                ProgressView()
                    .scaleEffect(1.2)
                    .tint(Theme.Colors.primary)
            } else {
                Image.lucide("arrow-down")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 20, height: 20)
                    .foregroundColor(Theme.Colors.primary)
            }

            Text(isRefreshing ? "Actualisation..." : "Tirer pour actualiser")
                .font(Theme.Typography.bodySmall())
                .foregroundColor(Theme.Colors.textSecondary)

            Spacer()
        }
        .padding(.vertical, 12)
    }
}

// MARK: - Previews

struct LoadingStateView_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 20) {
                LoadingStateView()

                LoadingStateView(message: "Chargement des propriétés...")

                EmptyStateView(
                    icon: "home",
                    title: "Aucun logement",
                    message: "Commencez à chercher votre logement idéal",
                    actionTitle: "Explorer",
                    action: {}
                )

                ErrorStateView(
                    error: .network(.noInternetConnection),
                    retryAction: {}
                )

                VStack(spacing: 16) {
                    ToastView(type: .success, message: "Candidature envoyée avec succès")
                    ToastView(type: .error, message: "Une erreur est survenue")
                    ToastView(type: .info, message: "Nouvelle mise à jour disponible")
                    ToastView(type: .warning, message: "Votre session expire bientôt")
                }
                .padding()
                .background(Theme.Colors.backgroundSecondary)

                VStack(spacing: 16) {
                    PropertyCardSkeleton()
                    PropertyCardSkeleton()
                    PropertyCardSkeleton()
                }
                .padding()
                .background(Theme.Colors.backgroundSecondary)
            }
            .padding()
        }
    }
}
