//
//  ModernWelcomeView.swift
//  EasyCo
//
//  Vue d'accueil moderne full-screen avec fond violet
//  Design basé sur screenshot utilisateur
//

import SwiftUI

struct ModernWelcomeView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var showSignupSheet = false
    @State private var showLoginSheet = false
    @State private var showGuestMode = false
    @State private var animateGradient = false

    var body: some View {
        ZStack {
            // Fond violet avec gradient
            LinearGradient(
                colors: [
                    Color(hex: "6E56CF"),
                    Color(hex: "8B7ADB"),
                    Color(hex: "A394E6")
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            // Decorative gradient blobs (subtle)
            Circle()
                .fill(
                    RadialGradient(
                        colors: [
                            Color(hex: "FFD249").opacity(0.15),
                            Color.clear
                        ],
                        center: .center,
                        startRadius: 0,
                        endRadius: 150
                    )
                )
                .frame(width: 300, height: 300)
                .offset(x: -100, y: -200)
                .blur(radius: 50)

            Circle()
                .fill(
                    RadialGradient(
                        colors: [
                            Color(hex: "FF6F3C").opacity(0.12),
                            Color.clear
                        ],
                        center: .center,
                        startRadius: 0,
                        endRadius: 120
                    )
                )
                .frame(width: 250, height: 250)
                .offset(x: 120, y: 300)
                .blur(radius: 40)

            VStack(spacing: 0) {
                Spacer()
                    .frame(height: 60)

                // Logo EasyCo avec glow subtil
                ZStack {
                    // Glow effect
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    Color(hex: "FFA040").opacity(0.3),
                                    Color.clear
                                ],
                                center: .center,
                                startRadius: 0,
                                endRadius: 60
                            )
                        )
                        .frame(width: 120, height: 120)
                        .blur(radius: 15)

                    // Logo officiel
                    Image("EasyCoHouseIcon")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 100, height: 100)
                }
                .padding(.bottom, 20)

                // Titre principal
                Text("EasyCo")
                    .font(.system(size: 42, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.bottom, 8)

                // Sous-titre
                Text("La colocation simplifiée")
                    .font(.system(size: 18, weight: .regular))
                    .foregroundColor(.white.opacity(0.85))
                    .padding(.bottom, 60)

                // Boutons d'action
                VStack(spacing: 16) {
                    // Bouton "Créer un compte" - Gradient orange
                    Button(action: {
                        showSignupSheet = true
                    }) {
                        HStack(spacing: 10) {
                            Image(systemName: "person.badge.plus")
                                .font(.system(size: 18, weight: .semibold))
                            Text("Créer un compte")
                                .font(.system(size: 17, weight: .semibold))
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 56)
                        .background(
                            LinearGradient(
                                colors: [
                                    Color(hex: "FF8C42"),
                                    Color(hex: "FFB85C")
                                ],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(16)
                        .shadow(color: Color(hex: "FF8C42").opacity(0.35), radius: 12, x: 0, y: 6)
                    }

                    // Bouton "Se connecter" - Semi-transparent glass
                    Button(action: {
                        showLoginSheet = true
                    }) {
                        HStack(spacing: 10) {
                            Image(systemName: "person.fill")
                                .font(.system(size: 18, weight: .semibold))
                            Text("Se connecter")
                                .font(.system(size: 17, weight: .semibold))
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 56)
                        .background(
                            ZStack {
                                RoundedRectangle(cornerRadius: 16)
                                    .fill(Color.white.opacity(0.25))
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color.white.opacity(0.4), lineWidth: 1.5)
                            }
                        )
                    }
                }
                .padding(.horizontal, 32)

                // Divider "ou"
                HStack(spacing: 16) {
                    Rectangle()
                        .frame(height: 1)
                        .foregroundColor(.white.opacity(0.3))
                    Text("ou")
                        .font(.system(size: 15, weight: .medium))
                        .foregroundColor(.white.opacity(0.7))
                    Rectangle()
                        .frame(height: 1)
                        .foregroundColor(.white.opacity(0.3))
                }
                .padding(.horizontal, 48)
                .padding(.vertical, 28)

                // Bouton "Explorer en mode invité"
                Button(action: {
                    showGuestMode = true
                }) {
                    HStack(spacing: 8) {
                        Text("Explorer en mode invité")
                            .font(.system(size: 16, weight: .medium))
                        Image(systemName: "arrow.down")
                            .font(.system(size: 15, weight: .semibold))
                    }
                    .foregroundColor(.white.opacity(0.9))
                }
                .padding(.bottom, 20)

                // Texte "Glissez vers le bas"
                VStack(spacing: 10) {
                    Image(systemName: "chevron.compact.down")
                        .font(.system(size: 30, weight: .light))
                        .foregroundColor(.white.opacity(0.4))

                    Text("Glissez vers le bas pour explorer")
                        .font(.system(size: 14))
                        .foregroundColor(.white.opacity(0.5))
                }
                .padding(.bottom, 40)

                Spacer()
            }
        }
        .sheet(isPresented: $showSignupSheet) {
            SignupSheetView(isPresented: $showSignupSheet)
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
        }
        .sheet(isPresented: $showLoginSheet) {
            LoginSheetView(isPresented: $showLoginSheet)
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
        }
        .fullScreenCover(isPresented: $showGuestMode) {
            GuestTabView()
        }
    }
}

// MARK: - Preview

struct ModernWelcomeView_Previews: PreviewProvider {
    static var previews: some View {
        ModernWelcomeView()
            .environmentObject(AuthManager.shared)
    }
}
