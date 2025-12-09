//
//  ReviewsSystem.swift
//  IzzIco
//
//  Complete reviews system with rating stars, form, and list
//

import SwiftUI

// MARK: - Rating Stars Component

struct RatingStars: View {
    @Binding var rating: Int
    let maxRating: Int = 5
    let size: CGFloat
    let isInteractive: Bool

    init(rating: Binding<Int>, size: CGFloat = 24, isInteractive: Bool = true) {
        self._rating = rating
        self.size = size
        self.isInteractive = isInteractive
    }

    var body: some View {
        HStack(spacing: 8) {
            ForEach(1...maxRating, id: \.self) { index in
                Button(action: {
                    if isInteractive {
                        rating = index
                        Haptic.impact(.light)
                    }
                }) {
                    Image.lucide(index <= rating ? "star" : "star")
                        .resizable()
                        .scaledToFit()
                        .frame(width: size, height: size)
                        .foregroundColor(index <= rating ? Color(hex: "FFB800") : Theme.Colors.gray300)
                }
                .disabled(!isInteractive)
            }
        }
    }
}

// MARK: - Review Form View

struct ReviewFormView: View {
    let property: Property
    @Environment(\.dismiss) private var dismiss

    @State private var overallRating = 0
    @State private var cleanlinessRating = 0
    @State private var locationRating = 0
    @State private var valueRating = 0
    @State private var hostRating = 0
    @State private var reviewText = ""
    @State private var isAnonymous = false
    @State private var showSuccess = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Property card
                    propertyCard

                    // Overall rating
                    overallRatingSection

                    // Detailed ratings
                    detailedRatingsSection

                    // Review text
                    reviewTextSection

                    // Options
                    optionsSection
                }
                .padding()
                .padding(.bottom, 100)
            }
            .background(Theme.Colors.backgroundSecondary)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Image.lucide("x")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 20, height: 20)
                            .foregroundColor(Theme.Colors.textPrimary)
                    }
                }

                ToolbarItem(placement: .principal) {
                    Text("Laisser un avis")
                        .font(Theme.Typography.title3())
                        .foregroundColor(Theme.Colors.textPrimary)
                }
            }
            .overlay(alignment: .bottom) {
                bottomButton
            }
            .sheet(isPresented: $showSuccess) {
                ReviewSuccessView()
            }
        }
    }

    // MARK: - Property Card

    private var propertyCard: some View {
        HStack(spacing: 12) {
            AsyncImage(url: URL(string: property.images.first ?? "")) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Rectangle()
                    .fill(Theme.Colors.gray200)
            }
            .frame(width: 80, height: 80)
            .cornerRadius(12)

            VStack(alignment: .leading, spacing: 6) {
                Text(property.title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .lineLimit(2)

                Text(property.city)
                    .font(Theme.Typography.bodySmall())
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            Spacer()
        }
        .padding(16)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }

    // MARK: - Overall Rating Section

    private var overallRatingSection: some View {
        VStack(spacing: 16) {
            Text("Note globale")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)
                .frame(maxWidth: .infinity, alignment: .leading)

            VStack(spacing: 12) {
                RatingStars(rating: $overallRating, size: 40)

                if overallRating > 0 {
                    Text(ratingLabel(overallRating))
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.primary)
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 20)
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.card)
            .cardShadow()
        }
    }

    // MARK: - Detailed Ratings Section

    private var detailedRatingsSection: some View {
        VStack(spacing: 16) {
            Text("Notes détaillées")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)
                .frame(maxWidth: .infinity, alignment: .leading)

            VStack(spacing: 16) {
                RatingRow(label: "Propreté", rating: $cleanlinessRating, icon: "sparkles")
                RatingRow(label: "Emplacement", rating: $locationRating, icon: "map-pin")
                RatingRow(label: "Rapport qualité/prix", rating: $valueRating, icon: "euro")
                RatingRow(label: "Hôte", rating: $hostRating, icon: "user")
            }
            .padding(20)
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.card)
            .cardShadow()
        }
    }

    // MARK: - Review Text Section

    private var reviewTextSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Votre avis")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Partagez votre expérience avec la communauté")
                    .font(Theme.Typography.bodySmall())
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            TextEditor(text: $reviewText)
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textPrimary)
                .frame(height: 150)
                .padding(12)
                .background(Theme.Colors.backgroundPrimary)
                .cornerRadius(Theme.CornerRadius.md)
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                        .stroke(Theme.Colors.gray200, lineWidth: 1)
                )

            Text("\(reviewText.count)/500 caractères")
                .font(Theme.Typography.caption())
                .foregroundColor(Theme.Colors.textTertiary)
                .frame(maxWidth: .infinity, alignment: .trailing)
        }
    }

    // MARK: - Options Section

    private var optionsSection: some View {
        VStack(spacing: 12) {
            Toggle(isOn: $isAnonymous) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Publier anonymement")
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text("Votre nom ne sera pas affiché")
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }
            .toggleStyle(SwitchToggleStyle(tint: Theme.Colors.primary))
            .padding(16)
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.md)
        }
    }

    // MARK: - Bottom Button

    private var bottomButton: some View {
        VStack {
            Button(action: submitReview) {
                Text("Publier mon avis")
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: Theme.Size.buttonHeight)
                    .background(Theme.Colors.primaryGradient)
                    .cornerRadius(Theme.CornerRadius.button)
            }
            .disabled(!canSubmit)
            .opacity(canSubmit ? 1 : 0.5)
            .padding()
            .background(.ultraThinMaterial)
        }
    }

    // MARK: - Helpers

    private var canSubmit: Bool {
        overallRating > 0 && !reviewText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    private func ratingLabel(_ rating: Int) -> String {
        switch rating {
        case 1: return "Décevant"
        case 2: return "Moyen"
        case 3: return "Bien"
        case 4: return "Très bien"
        case 5: return "Excellent"
        default: return ""
        }
    }

    private func submitReview() {
        Haptic.notification(.success)
        showSuccess = true
    }
}

// MARK: - Rating Row

struct RatingRow: View {
    let label: String
    @Binding var rating: Int
    let icon: String

    var body: some View {
        HStack {
            HStack(spacing: 12) {
                Image.lucide(icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 20, height: 20)
                    .foregroundColor(Theme.Colors.textTertiary)

                Text(label)
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textPrimary)
            }

            Spacer()

            RatingStars(rating: $rating, size: 20)
        }
    }
}

// MARK: - Review Success View

struct ReviewSuccessView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(spacing: 32) {
            Spacer()

            Image.lucide("check-circle")
                .resizable()
                .scaledToFit()
                .frame(width: 80, height: 80)
                .foregroundColor(Theme.Colors.success)
                .padding(24)
                .background(Theme.Colors.success.opacity(0.1))
                .clipShape(Circle())

            VStack(spacing: 12) {
                Text("Merci pour votre avis !")
                    .font(Theme.Typography.title1())
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Votre retour aide la communauté à faire les meilleurs choix")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
            }

            Spacer()

            Button(action: { dismiss() }) {
                Text("Fermer")
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: Theme.Size.buttonHeight)
                    .background(Theme.Colors.primaryGradient)
                    .cornerRadius(Theme.CornerRadius.button)
            }
            .padding()
        }
        .background(Theme.Colors.backgroundSecondary)
    }
}

// MARK: - Reviews List View

struct ReviewsListView: View {
    let property: Property
    @State private var reviews: [Review] = []
    @State private var showReviewForm = false

    private var averageRating: Double {
        guard !reviews.isEmpty else { return 0 }
        let sum = reviews.reduce(0.0) { $0 + Double($1.overallRating) }
        return sum / Double(reviews.count)
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Summary card
                summaryCard

                // Filters/Sort
                Text("Tous les avis (\(reviews.count))")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal)

                // Reviews list
                LazyVStack(spacing: 16) {
                    ForEach(reviews) { review in
                        ReviewCard(review: review)
                    }
                }
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .background(Theme.Colors.backgroundSecondary)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .principal) {
                Text("Avis")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)
            }

            ToolbarItem(placement: .navigationBarTrailing) {
                Button(action: { showReviewForm = true }) {
                    Image.lucide("plus")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)
                        .foregroundColor(Theme.Colors.primary)
                }
            }
        }
        .sheet(isPresented: $showReviewForm) {
            ReviewFormView(property: property)
        }
        .onAppear {
            loadReviews()
        }
    }

    // MARK: - Summary Card

    private var summaryCard: some View {
        VStack(spacing: 20) {
            HStack(spacing: 16) {
                VStack(spacing: 8) {
                    Text(String(format: "%.1f", averageRating))
                        .font(.system(size: 48, weight: .bold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    RatingStars(rating: .constant(Int(averageRating.rounded())), size: 20, isInteractive: false)

                    Text("\(reviews.count) avis")
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                }
                .frame(maxWidth: .infinity)

                Divider()
                    .frame(height: 120)

                VStack(alignment: .leading, spacing: 12) {
                    RatingBar(label: "5★", count: reviews.filter { $0.overallRating == 5 }.count, total: reviews.count)
                    RatingBar(label: "4★", count: reviews.filter { $0.overallRating == 4 }.count, total: reviews.count)
                    RatingBar(label: "3★", count: reviews.filter { $0.overallRating == 3 }.count, total: reviews.count)
                    RatingBar(label: "2★", count: reviews.filter { $0.overallRating == 2 }.count, total: reviews.count)
                    RatingBar(label: "1★", count: reviews.filter { $0.overallRating == 1 }.count, total: reviews.count)
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(20)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
        .padding(.horizontal)
    }

    // MARK: - Data Loading

    private func loadReviews() {
        let calendar = Calendar.current
        reviews = [
            Review(
                id: "1",
                authorName: "Marie D.",
                overallRating: 5,
                reviewText: "Logement parfait ! Très bien situé, propre et conforme aux photos. Le propriétaire est réactif et arrangeant. Je recommande vivement.",
                createdAt: calendar.date(byAdding: .day, value: -5, to: Date())!,
                isAnonymous: false
            ),
            Review(
                id: "2",
                authorName: "Utilisateur anonyme",
                overallRating: 4,
                reviewText: "Bon logement dans l'ensemble. Quelques petits détails à améliorer mais rien de rédhibitoire. Bon rapport qualité/prix pour le quartier.",
                createdAt: calendar.date(byAdding: .day, value: -12, to: Date())!,
                isAnonymous: true
            ),
            Review(
                id: "3",
                authorName: "Thomas B.",
                overallRating: 5,
                reviewText: "Excellente expérience. L'appartement est encore mieux qu'en photo, très lumineux et calme. Quartier agréable avec tous les commerces à proximité.",
                createdAt: calendar.date(byAdding: .day, value: -20, to: Date())!,
                isAnonymous: false
            )
        ]
    }
}

// MARK: - Review Card

struct ReviewCard: View {
    let review: Review

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Circle()
                    .fill(Theme.Colors.primaryGradient)
                    .frame(width: 40, height: 40)
                    .overlay(
                        Text(review.authorName.prefix(1))
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white)
                    )

                VStack(alignment: .leading, spacing: 4) {
                    Text(review.authorName)
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    HStack(spacing: 8) {
                        RatingStars(rating: .constant(review.overallRating), size: 14, isInteractive: false)

                        Text("•")
                            .foregroundColor(Theme.Colors.textTertiary)

                        Text(review.timeAgo)
                            .font(Theme.Typography.bodySmall())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }
                }

                Spacer()
            }

            Text(review.reviewText)
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textPrimary)
                .lineSpacing(4)
        }
        .padding(16)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }
}

// MARK: - Rating Bar

struct RatingBar: View {
    let label: String
    let count: Int
    let total: Int

    private var percentage: Double {
        guard total > 0 else { return 0 }
        return Double(count) / Double(total)
    }

    var body: some View {
        HStack(spacing: 8) {
            Text(label)
                .font(Theme.Typography.bodySmall())
                .foregroundColor(Theme.Colors.textSecondary)
                .frame(width: 30, alignment: .leading)

            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    Rectangle()
                        .fill(Theme.Colors.gray200)
                        .frame(height: 6)
                        .cornerRadius(3)

                    Rectangle()
                        .fill(Color(hex: "FFB800"))
                        .frame(width: geometry.size.width * percentage, height: 6)
                        .cornerRadius(3)
                }
            }
            .frame(height: 6)

            Text("\(count)")
                .font(Theme.Typography.bodySmall())
                .foregroundColor(Theme.Colors.textSecondary)
                .frame(width: 30, alignment: .trailing)
        }
    }
}

// MARK: - Review Model

struct Review: Identifiable {
    let id: String
    let authorName: String
    let overallRating: Int
    let reviewText: String
    let createdAt: Date
    let isAnonymous: Bool

    var timeAgo: String {
        let now = Date()
        let interval = now.timeIntervalSince(createdAt)
        let days = Int(interval / 86400)

        if days == 0 {
            return "Aujourd'hui"
        } else if days < 7 {
            return "Il y a \(days)j"
        } else if days < 30 {
            let weeks = days / 7
            return "Il y a \(weeks)sem"
        } else {
            let months = days / 30
            return "Il y a \(months)mois"
        }
    }
}

// MARK: - Previews

struct RatingStars_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            RatingStars(rating: .constant(3), size: 32)
            RatingStars(rating: .constant(5), size: 24, isInteractive: false)
        }
        .padding()
    }
}

struct ReviewFormView_Previews: PreviewProvider {
    static var previews: some View {
        ReviewFormView(property: .mock)
    }
}

struct ReviewsListView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            ReviewsListView(property: .mock)
        }
    }
}
