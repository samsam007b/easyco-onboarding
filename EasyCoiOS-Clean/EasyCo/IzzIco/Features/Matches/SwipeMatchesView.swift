import SwiftUI

// MARK: - Swipe Matches View

struct SwipeMatchesView: View {
    @StateObject private var viewModel = SwipeMatchesViewModel()
    @State private var showMatchPopup = false
    @State private var currentMatch: Property?

    var body: some View {
        ZStack {
            // Background
            Theme.Colors.background
                .ignoresSafeArea()

            VStack(spacing: 0) {
                // Header
                header

                // Card Stack
                ZStack {
                    if viewModel.isLoading {
                        ProgressView("Chargement des propriétés...")
                            .font(.headline)
                    } else if viewModel.properties.isEmpty {
                        emptyState
                    } else {
                        cardStack
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .padding(.horizontal, 20)

                // Action Buttons
                actionButtons
                    .padding(.horizontal, 40)
                    .padding(.vertical, 20)
            }

            // Match Popup
            if showMatchPopup, let match = currentMatch {
                matchPopup(property: match)
                    .transition(.scale.combined(with: .opacity))
                    .zIndex(1000)
            }
        }
        .task {
            await viewModel.loadProperties()
        }
    }

    // MARK: - Header

    private var header: some View {
        HStack {
            Text("Découvrir")
                .font(.largeTitle)
                .fontWeight(.bold)

            Spacer()

            Button(action: {
                // TODO: Open filters
            }) {
                Image(systemName: "slider.horizontal.3")
                    .font(.title2)
                    .foregroundColor(Theme.Colors.primary)
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 16)
    }

    // MARK: - Card Stack

    private var cardStack: some View {
        ZStack {
            // Show top 3 cards for depth effect
            ForEach(Array(viewModel.properties.prefix(3).enumerated()), id: \.element.id) { index, property in
                SwipeCardView(property: property) { direction in
                    handleSwipe(property: property, direction: direction)
                }
                .zIndex(Double(viewModel.properties.count - index))
                .offset(y: CGFloat(index * 8))
                .scaleEffect(1 - CGFloat(index) * 0.05)
                .opacity(1 - Double(index) * 0.2)
            }
        }
    }

    // MARK: - Empty State

    private var emptyState: some View {
        VStack(spacing: 20) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 80))
                .foregroundColor(Theme.Colors.primary)

            Text("Plus de propriétés")
                .font(.title2)
                .fontWeight(.bold)

            Text("Vous avez vu toutes les propriétés disponibles.\nRevenez plus tard pour de nouvelles annonces !")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)

            Button(action: {
                Task {
                    await viewModel.loadProperties()
                }
            }) {
                Text("Actualiser")
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .frame(width: 200, height: 50)
                    .background(Theme.Colors.primary)
                    .clipShape(RoundedRectangle(cornerRadius: 25))
            }
            .padding(.top, 20)
        }
    }

    // MARK: - Action Buttons

    private var actionButtons: some View {
        HStack(spacing: 30) {
            // Dislike Button
            Button(action: {
                simulateSwipe(direction: .left)
            }) {
                ZStack {
                    Circle()
                        .fill(Color.white)
                        .frame(width: 60, height: 60)
                        .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)

                    Image(systemName: "xmark")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.red)
                }
            }
            .disabled(viewModel.properties.isEmpty)

            // Super Like Button
            Button(action: {
                // TODO: Implement super like
            }) {
                ZStack {
                    Circle()
                        .fill(Color.white)
                        .frame(width: 50, height: 50)
                        .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)

                    Image(systemName: "star.fill")
                        .font(.title3)
                        .foregroundColor(.blue)
                }
            }
            .disabled(viewModel.properties.isEmpty)

            // Like Button
            Button(action: {
                simulateSwipe(direction: .right)
            }) {
                ZStack {
                    Circle()
                        .fill(Color.white)
                        .frame(width: 60, height: 60)
                        .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)

                    Image(systemName: "heart.fill")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.green)
                }
            }
            .disabled(viewModel.properties.isEmpty)
        }
    }

    // MARK: - Match Popup

    private func matchPopup(property: Property) -> some View {
        ZStack {
            // Background overlay
            Color.black.opacity(0.8)
                .ignoresSafeArea()
                .onTapGesture {
                    withAnimation {
                        showMatchPopup = false
                    }
                }

            VStack(spacing: 30) {
                // Celebration
                Text("C'est un Match ! 🎉")
                    .font(.system(size: 36, weight: .bold))
                    .foregroundColor(.white)

                // Property Image
                if let firstImage = property.images.first {
                    AsyncImage(url: URL(string: firstImage)) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Rectangle()
                            .fill(Theme.Colors.primary.opacity(0.3))
                    }
                    .frame(width: 200, height: 200)
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                    .shadow(color: .white.opacity(0.3), radius: 20)
                }

                Text(property.title)
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.white)

                // Actions
                VStack(spacing: 16) {
                    Button(action: {
                        withAnimation {
                            showMatchPopup = false
                        }
                        // TODO: Navigate to chat
                    }) {
                        Text("Envoyer un message")
                            .fontWeight(.semibold)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                            .background(Theme.Colors.primary)
                            .clipShape(RoundedRectangle(cornerRadius: 25))
                    }

                    Button(action: {
                        withAnimation {
                            showMatchPopup = false
                        }
                    }) {
                        Text("Continuer à swiper")
                            .fontWeight(.semibold)
                            .foregroundColor(.white.opacity(0.7))
                    }
                }
                .padding(.horizontal, 40)
            }
            .padding(40)
        }
    }

    // MARK: - Actions

    private func simulateSwipe(direction: SwipeDirection) {
        guard let property = viewModel.properties.first else { return }
        handleSwipe(property: property, direction: direction)
    }

    private func handleSwipe(property: Property, direction: SwipeDirection) {
        Task {
            await viewModel.handleSwipe(property: property, direction: direction)

            // Check for match (simplified - in real app, this comes from backend)
            if direction == .right {
                // Simulate 30% match rate for demo
                if Int.random(in: 1...10) <= 3 {
                    currentMatch = property
                    withAnimation(.spring(response: 0.5, dampingFraction: 0.7)) {
                        showMatchPopup = true
                    }
                }
            }
        }
    }
}

// MARK: - Preview

#Preview {
    SwipeMatchesView()
}
