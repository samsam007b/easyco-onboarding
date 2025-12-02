//
//  PropertyDetailView.swift
//  EasyCo
//
//  Complete property detail view (inspired by Airbnb + Immoweb)
//

import SwiftUI

struct PropertyDetailView: View {
    let property: Property
    @Environment(\.dismiss) private var dismiss
    @State private var currentImageIndex = 0
    @State private var showFullGallery = false
    @State private var isFavorite = false
    @State private var showContactSheet = false
    @State private var scrollOffset: CGFloat = 0

    var body: some View {
        ZStack(alignment: .top) {
            // Content
            ScrollView {
                VStack(spacing: 0) {
                    // Photo Gallery
                    photoGallery
                        .background(
                            GeometryReader { geo in
                                Color.clear
                                    .preference(
                                        key: ScrollOffsetPreferenceKey.self,
                                        value: geo.frame(in: .named("scroll")).minY
                                    )
                            }
                        )

                    // Content sections
                    VStack(spacing: 24) {
                        // Quick Info Card
                        quickInfoCard
                            .padding(.top, -30)
                            .zIndex(1)

                        // Host Card
                        hostCard
                            .padding(.horizontal)

                        Divider()
                            .padding(.horizontal)

                        // Description
                        descriptionSection
                            .padding(.horizontal)

                        Divider()
                            .padding(.horizontal)

                        // Amenities
                        amenitiesSection
                            .padding(.horizontal)

                        Divider()
                            .padding(.horizontal)

                        // Location
                        locationSection
                            .padding(.horizontal)

                        Divider()
                            .padding(.horizontal)

                        // House Rules
                        houseRulesSection
                            .padding(.horizontal)

                        Divider()
                            .padding(.horizontal)

                        // Reviews
                        reviewsSection
                            .padding(.horizontal)

                        Divider()
                            .padding(.horizontal)

                        // Similar Properties
                        similarPropertiesSection
                    }
                    .padding(.bottom, 120) // Space for sticky footer
                }
            }
            .coordinateSpace(name: "scroll")
            .onPreferenceChange(ScrollOffsetPreferenceKey.self) { value in
                scrollOffset = value
            }

            // Floating header buttons
            floatingHeader
                .opacity(scrollOffset < -100 ? 1 : 0)

            // Sticky Footer CTA
            VStack {
                Spacer()
                stickyFooter
            }
        }
        .ignoresSafeArea(edges: .top)
        .sheet(isPresented: $showFullGallery) {
            FullGalleryView(images: property.images, currentIndex: $currentImageIndex)
        }
        .sheet(isPresented: $showContactSheet) {
            ContactHostSheet(property: property)
        }
    }

    // MARK: - Photo Gallery

    private var photoGallery: some View {
        ZStack(alignment: .topLeading) {
            TabView(selection: $currentImageIndex) {
                ForEach(Array(property.images.enumerated()), id: \.offset) { index, imageURL in
                    AsyncImage(url: URL(string: imageURL)) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Rectangle()
                            .fill(Theme.Colors.gray200)
                            .overlay(ProgressView())
                    }
                    .tag(index)
                }
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
            .frame(height: 400)
            .onTapGesture {
                showFullGallery = true
            }

            // Gradient overlay top
            LinearGradient(
                colors: [Color.black.opacity(0.4), Color.clear],
                startPoint: .top,
                endPoint: .center
            )
            .frame(height: 150)
            .allowsHitTesting(false)

            // Top buttons
            HStack {
                IconButton(
                    icon: "chevron-left",
                    action: { dismiss() },
                    color: .white,
                    backgroundColor: Color.black.opacity(0.3)
                )

                Spacer()

                HStack(spacing: 12) {
                    IconButton(
                        icon: "share",
                        action: shareProperty,
                        color: .white,
                        backgroundColor: Color.black.opacity(0.3)
                    )

                    IconButton(
                        icon: isFavorite ? "heart" : "heart",
                        action: {
                            isFavorite.toggle()
                            Haptic.impact(.medium)
                        },
                        color: isFavorite ? Theme.Colors.heartRed : .white,
                        backgroundColor: isFavorite ? .white : Color.black.opacity(0.3)
                    )
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 60)

            // Page indicator
            VStack {
                Spacer()

                HStack(spacing: 4) {
                    Text("\(currentImageIndex + 1)")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.white)

                    Text("/")
                        .font(.system(size: 14))
                        .foregroundColor(.white.opacity(0.7))

                    Text("\(property.images.count)")
                        .font(.system(size: 14))
                        .foregroundColor(.white.opacity(0.7))
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(Color.black.opacity(0.6))
                .cornerRadius(16)
                .padding(.bottom, 50)
            }
        }
    }

    // MARK: - Floating Header

    private var floatingHeader: some View {
        HStack {
            IconButton(
                icon: "chevron-left",
                action: { dismiss() },
                color: Theme.Colors.gray700,
                backgroundColor: .white
            )

            Spacer()

            HStack(spacing: 12) {
                IconButton(
                    icon: "share",
                    action: shareProperty,
                    color: Theme.Colors.gray700,
                    backgroundColor: .white
                )

                IconButton(
                    icon: isFavorite ? "heart" : "heart",
                    action: {
                        isFavorite.toggle()
                        Haptic.impact(.medium)
                    },
                    color: isFavorite ? Theme.Colors.heartRed : Theme.Colors.gray700,
                    backgroundColor: .white
                )
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 60)
        .padding(.bottom, 16)
        .background(.ultraThinMaterial)
        .shadow(color: .black.opacity(0.1), radius: 8, y: 2)
        .animation(Theme.Animation.springFast, value: scrollOffset)
    }

    // MARK: - Quick Info Card

    private var quickInfoCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text("\(property.price)€")
                            .font(Theme.Typography.price())
                            .foregroundColor(Theme.Colors.primary)

                        Text("/mois")
                            .font(Theme.Typography.body())
                            .foregroundColor(Theme.Colors.textSecondary)
                            .padding(.top, 6)
                    }

                    Text(property.propertyType.rawValue)
                        .font(Theme.Typography.bodySmall(.medium))
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 8) {
                    if property.isVerified {
                        Badge(text: "Vérifié", style: .verified, icon: "check")
                    }

                    if let matchScore = property.matchScore {
                        HStack(spacing: 4) {
                            Circle()
                                .fill(Theme.Colors.success)
                                .frame(width: 6, height: 6)

                            Text("\(matchScore)% Compatible")
                                .font(Theme.Typography.badge())
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Theme.Colors.primaryGradient)
                        .cornerRadius(12)
                    }
                }
            }

            // Features row
            HStack(spacing: 20) {
                if property.bedrooms > 0 {
                    QuickFeature(icon: "bed", value: "\(property.bedrooms)", label: "Chambre\(property.bedrooms > 1 ? "s" : "")")
                }

                if property.bathrooms > 0 {
                    QuickFeature(icon: "bath", value: "\(property.bathrooms)", label: "SdB")
                }

                if let area = property.area {
                    QuickFeature(icon: "ruler", value: "\(area)", label: "m²")
                }
            }

            // Location
            HStack(spacing: 8) {
                Image.lucide("map-pin")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 18, height: 18)
                    .foregroundColor(Theme.Colors.primary)

                Text(property.location)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                if let distance = property.distance {
                    Text("• \(String(format: "%.1f", distance))km")
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }

            // Availability
            if let availableFrom = property.availableFrom {
                HStack(spacing: 8) {
                    Image.lucide("calendar")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 18, height: 18)
                        .foregroundColor(Theme.Colors.success)

                    Text("Disponible dès le \(availableFrom)")
                        .font(Theme.Typography.body(.medium))
                        .foregroundColor(Theme.Colors.success)
                }
                .padding(12)
                .background(Theme.Colors.successLight)
                .cornerRadius(12)
            }
        }
        .padding(20)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.lg)
        .elevatedShadow()
        .padding(.horizontal, 20)
    }

    // MARK: - Host Card

    private var hostCard: some View {
        HStack(spacing: 16) {
            // Host avatar
            ZStack {
                Circle()
                    .fill(Theme.Colors.primaryGradient)
                    .frame(width: 60, height: 60)

                Text("JD")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(.white)
            }

            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Text("Jean Dupont")
                        .font(Theme.Typography.bodyLarge(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    if true { // isVerifiedHost
                        Image.lucide("check")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 16, height: 16)
                            .foregroundColor(Theme.Colors.success)
                    }
                }

                Text("Propriétaire")
                    .font(Theme.Typography.bodySmall())
                    .foregroundColor(Theme.Colors.textSecondary)

                HStack(spacing: 12) {
                    HStack(spacing: 4) {
                        Image.lucide("star")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 12, height: 12)
                            .foregroundColor(Theme.Colors.starOrange)

                        Text("4.8")
                            .font(Theme.Typography.bodySmall(.medium))
                            .foregroundColor(Theme.Colors.textSecondary)
                    }

                    Text("•")
                        .foregroundColor(Theme.Colors.textTertiary)

                    Text("Répond en ~2h")
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }

            Spacer()

            Button(action: {
                showContactSheet = true
            }) {
                Image.lucide("message-circle")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 20, height: 20)
                    .foregroundColor(Theme.Colors.primary)
                    .frame(width: 44, height: 44)
                    .background(Theme.Colors.primary.opacity(0.1))
                    .cornerRadius(22)
            }
        }
        .padding(16)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }

    // MARK: - Description

    @State private var isDescriptionExpanded = false

    private var descriptionSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Description")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            Text(property.description ?? "Magnifique appartement situé dans un quartier calme et recherché. Proche de toutes commodités (transports, commerces, écoles). L'appartement est meublé avec goût et dispose de tout le confort nécessaire. Idéal pour une personne ou un couple.")
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textSecondary)
                .lineLimit(isDescriptionExpanded ? nil : 3)

            if !isDescriptionExpanded {
                Button(action: {
                    withAnimation(Theme.Animation.spring) {
                        isDescriptionExpanded = true
                    }
                }) {
                    Text("Voir plus")
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.primary)
                }
            }
        }
    }

    // MARK: - Amenities

    private var amenitiesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Équipements")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 16) {
                AmenityRow(icon: "wifi", title: "WiFi inclus")
                AmenityRow(icon: "car", title: "Parking")
                AmenityRow(icon: "flame", title: "Chauffage")
                AmenityRow(icon: "snowflake", title: "Climatisation")
                AmenityRow(icon: "washing-machine", title: "Machine à laver")
                AmenityRow(icon: "tv", title: "TV")
            }

            Button(action: {
                // Show all amenities
            }) {
                Text("Voir tous les équipements (\(15))")
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.primary)
            }
        }
    }

    // MARK: - Location

    private var locationSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Localisation")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            // Map placeholder
            ZStack {
                Rectangle()
                    .fill(Theme.Colors.gray100)
                    .frame(height: 200)
                    .cornerRadius(Theme.CornerRadius.card)

                VStack(spacing: 12) {
                    Image.lucide("map")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 48, height: 48)
                        .foregroundColor(Theme.Colors.gray400)

                    Text("Carte interactive")
                        .font(Theme.Typography.body())
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }

            Text(property.location)
                .font(Theme.Typography.body(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            // Nearby
            VStack(alignment: .leading, spacing: 12) {
                NearbyItem(icon: "train", title: "Gare Centrale", distance: "500m")
                NearbyItem(icon: "shopping-cart", title: "Delhaize", distance: "200m")
                NearbyItem(icon: "coffee", title: "Cafés & Restaurants", distance: "100m")
            }
        }
    }

    // MARK: - House Rules

    private var houseRulesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Règlement")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            VStack(spacing: 12) {
                RuleRow(icon: "dog", title: "Animaux acceptés", allowed: true)
                RuleRow(icon: "smoking", title: "Non-fumeur", allowed: false)
                RuleRow(icon: "users", title: "Invités autorisés", allowed: true)
                RuleRow(icon: "music", title: "Fêtes interdites", allowed: false)
            }
        }
    }

    // MARK: - Reviews

    private var reviewsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Avis")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                HStack(spacing: 6) {
                    Image.lucide("star")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 18, height: 18)
                        .foregroundColor(Theme.Colors.starOrange)

                    Text("4.8")
                        .font(Theme.Typography.bodyLarge(.bold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text("(12 avis)")
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }

            VStack(spacing: 16) {
                ReviewCard(
                    name: "Marie L.",
                    rating: 5,
                    date: "Il y a 2 semaines",
                    comment: "Excellent appartement, très propre et bien situé. Le propriétaire est très réactif."
                )

                ReviewCard(
                    name: "Thomas B.",
                    rating: 4,
                    date: "Il y a 1 mois",
                    comment: "Bon rapport qualité/prix, quartier agréable."
                )
            }

            Button(action: {
                // Show all reviews
            }) {
                Text("Voir tous les avis")
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.primary)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(Theme.Colors.primary.opacity(0.1))
                    .cornerRadius(Theme.CornerRadius.md)
            }
        }
    }

    // MARK: - Similar Properties

    private var similarPropertiesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Propriétés similaires")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)
                .padding(.horizontal, 20)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(0..<3) { _ in
                        PropertyCardCompact(property: .mock)
                            .frame(width: 180)
                    }
                }
                .padding(.horizontal, 20)
            }
        }
    }

    // MARK: - Sticky Footer

    private var stickyFooter: some View {
        HStack(spacing: 16) {
            VStack(alignment: .leading, spacing: 2) {
                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    Text("\(property.price)€")
                        .font(.system(size: 22, weight: .bold))
                        .foregroundColor(Theme.Colors.primary)

                    Text("/mois")
                        .font(Theme.Typography.caption())
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                if let matchScore = property.matchScore {
                    Text("\(matchScore)% compatible")
                        .font(Theme.Typography.bodySmall(.medium))
                        .foregroundColor(Theme.Colors.success)
                }
            }

            Spacer()

            PrimaryButton(
                title: "Postuler",
                icon: "send",
                action: {
                    // Handle application
                    Haptic.notification(.success)
                },
                fullWidth: false
            )
            .frame(width: 160)
        }
        .padding(20)
        .background(.ultraThinMaterial)
        .overlay(
            Divider()
                .background(Theme.Colors.gray200),
            alignment: .top
        )
        .shadow(color: .black.opacity(0.1), radius: 8, y: -2)
    }

    // MARK: - Actions

    private func shareProperty() {
        // Share implementation
        Haptic.impact(.light)
    }
}

// MARK: - Supporting Views

struct QuickFeature: View {
    let icon: String
    let value: String
    let label: String

    var body: some View {
        HStack(spacing: 8) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 20, height: 20)
                .foregroundColor(Theme.Colors.primary)

            VStack(alignment: .leading, spacing: 0) {
                Text(value)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(label)
                    .font(Theme.Typography.caption())
                    .foregroundColor(Theme.Colors.textSecondary)
            }
        }
    }
}

struct AmenityRow: View {
    let icon: String
    let title: String

    var body: some View {
        HStack(spacing: 12) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 20, height: 20)
                .foregroundColor(Theme.Colors.primary)

            Text(title)
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textPrimary)

            Spacer()
        }
    }
}

struct NearbyItem: View {
    let icon: String
    let title: String
    let distance: String

    var body: some View {
        HStack(spacing: 12) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 18, height: 18)
                .foregroundColor(Theme.Colors.textSecondary)

            Text(title)
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textPrimary)

            Spacer()

            Text(distance)
                .font(Theme.Typography.bodySmall(.medium))
                .foregroundColor(Theme.Colors.textSecondary)
        }
    }
}

struct RuleRow: View {
    let icon: String
    let title: String
    let allowed: Bool

    var body: some View {
        HStack(spacing: 12) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 20, height: 20)
                .foregroundColor(allowed ? Theme.Colors.success : Theme.Colors.error)

            Text(title)
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textPrimary)

            Spacer()

            Image.lucide(allowed ? "check" : "x")
                .resizable()
                .scaledToFit()
                .frame(width: 18, height: 18)
                .foregroundColor(allowed ? Theme.Colors.success : Theme.Colors.error)
        }
    }
}

struct ReviewCard: View {
    let name: String
    let rating: Int
    let date: String
    let comment: String

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Circle()
                    .fill(Theme.Colors.gray200)
                    .frame(width: 40, height: 40)
                    .overlay(
                        Text(String(name.prefix(1)))
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Theme.Colors.textPrimary)
                    )

                VStack(alignment: .leading, spacing: 2) {
                    Text(name)
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    HStack(spacing: 4) {
                        ForEach(0..<rating, id: \.self) { _ in
                            Image.lucide("star")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 12, height: 12)
                                .foregroundColor(Theme.Colors.starOrange)
                        }

                        Text(date)
                            .font(Theme.Typography.caption())
                            .foregroundColor(Theme.Colors.textTertiary)
                            .padding(.leading, 4)
                    }
                }

                Spacer()
            }

            Text(comment)
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textSecondary)
                .lineLimit(3)
        }
        .padding(16)
        .background(Theme.Colors.gray50)
        .cornerRadius(Theme.CornerRadius.md)
    }
}

// MARK: - Scroll Offset Preference

struct ScrollOffsetPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}

// MARK: - Full Gallery View (Placeholder)

struct FullGalleryView: View {
    let images: [String]
    @Binding var currentIndex: Int
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ZStack(alignment: .topTrailing) {
            TabView(selection: $currentIndex) {
                ForEach(Array(images.enumerated()), id: \.offset) { index, imageURL in
                    AsyncImage(url: URL(string: imageURL)) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                    } placeholder: {
                        ProgressView()
                    }
                    .tag(index)
                }
            }
            .tabViewStyle(.page)
            .background(Color.black)

            IconButton(
                icon: "xmark",
                action: { dismiss() },
                color: .white,
                backgroundColor: Color.black.opacity(0.6)
            )
            .padding(20)
            .padding(.top, 40)
        }
        .ignoresSafeArea()
    }
}

// MARK: - Contact Host Sheet (Placeholder)

struct ContactHostSheet: View {
    let property: Property
    @Environment(\.dismiss) private var dismiss
    @State private var message = ""

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                Text("Contacter le propriétaire")
                    .font(Theme.Typography.title2())
                    .foregroundColor(Theme.Colors.textPrimary)

                ModernTextField(
                    placeholder: "Votre message...",
                    text: $message,
                    icon: "message-circle"
                )

                Spacer()

                PrimaryButton(title: "Envoyer", icon: "send") {
                    dismiss()
                }
            }
            .padding(24)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    IconButton(
                        icon: "xmark",
                        action: { dismiss() },
                        size: 32,
                        iconSize: 14,
                        backgroundColor: Theme.Colors.gray100,
                        hasShadow: false
                    )
                }
            }
        }
    }
}

// MARK: - Preview

struct PropertyDetailView_Previews: PreviewProvider {
    static var previews: some View {
        PropertyDetailView(property: .mock)
    }
}
