import SwiftUI

// MARK: - Property Detail View (Web App Design)

struct PropertyDetailView: View {
    let property: Property
    @Environment(\.dismiss) private var dismiss
    @State private var currentImageIndex = 0
    @State private var showApplySheet = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                // Image Gallery
                imageGallery

                // Content
                VStack(alignment: .leading, spacing: 24) {
                    // Header with title and price
                    headerSection

                    Divider()

                    // Quick Info (bedrooms, bathrooms, surface)
                    quickInfoSection

                    Divider()

                    // Description
                    if let description = property.description, !description.isEmpty {
                        descriptionSection(description)
                        Divider()
                    }

                    // Location
                    locationSection

                    Divider()

                    // Amenities
                    if !property.amenities.isEmpty {
                        amenitiesSection
                        Divider()
                    }

                    // House Rules
                    houseRulesSection

                    Divider()

                    // Availability
                    availabilitySection
                }
                .padding(16)
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button {
                    // Share
                } label: {
                    Image(systemName: "square.and.arrow.up")
                        .foregroundColor(Color(hex: "374151"))
                }
            }
        }
        .safeAreaInset(edge: .bottom) {
            bottomActions
        }
        // TODO: Implement ApplyView
        // .sheet(isPresented: $showApplySheet) {
        //     ApplyView(property: property)
        // }
    }

    // MARK: - Image Gallery

    private var imageGallery: some View {
        ZStack(alignment: .bottomTrailing) {
            TabView(selection: $currentImageIndex) {
                ForEach(Array(property.images.enumerated()), id: \.offset) { index, imageUrl in
                    AsyncImage(url: URL(string: imageUrl)) { phase in
                        switch phase {
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(height: 400)
                                .clipped()
                        case .failure(_), .empty:
                            Rectangle()
                                .fill(Color(hex: "E5E7EB"))
                                .frame(height: 400)
                                .overlay(
                                    Image(systemName: "photo")
                                        .font(.system(size: 48))
                                        .foregroundColor(Color(hex: "9CA3AF"))
                                )
                        @unknown default:
                            EmptyView()
                        }
                    }
                    .tag(index)
                }
            }
            .frame(height: 400)
            .tabViewStyle(.page(indexDisplayMode: .never))

            // Custom page indicator
            HStack(spacing: 8) {
                Text("\(currentImageIndex + 1) / \(property.images.count)")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Color.black.opacity(0.6))
                    .cornerRadius(999)
            }
            .padding(16)
        }
    }

    // MARK: - Header Section

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Property type badge
            HStack {
                Text(property.propertyType.displayName)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(Color(hex: "FFA040"))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Color(hex: "FFF4ED"))
                    .cornerRadius(999)

                Spacer()

                // Rating
                if property.rating > 0 {
                    HStack(spacing: 4) {
                        Image(systemName: "star.fill")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "FBBF24"))
                        Text(String(format: "%.1f", property.rating))
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(Color(hex: "111827"))
                        Text("(\(property.reviewsCount))")
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
            }

            // Title
            Text(property.title)
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            // Price
            HStack(alignment: .firstTextBaseline, spacing: 6) {
                Text("€\(Int(property.monthlyRent))")
                    .font(.system(size: 32, weight: .bold))
                    .foregroundColor(Color(hex: "FFA040"))
                Text("/mois")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))

                if property.charges > 0 {
                    Text("+ €\(Int(property.charges)) charges")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }
        }
    }

    // MARK: - Quick Info Section

    private var quickInfoSection: some View {
        HStack(spacing: 32) {
            QuickInfoItem(
                icon: "bed.double.fill",
                label: "\(property.bedrooms) chambre\(property.bedrooms > 1 ? "s" : "")"
            )

            QuickInfoItem(
                icon: "shower.fill",
                label: "\(property.bathrooms) salle\(property.bathrooms > 1 ? "s" : "") de bain"
            )

            if let area = property.surfaceArea {
                QuickInfoItem(
                    icon: "square.fill",
                    label: "\(Int(area))m²"
                )
            }
        }
    }

    // MARK: - Description Section

    private func descriptionSection(_ description: String) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Description")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            Text(description)
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "374151"))
                .lineSpacing(4)
        }
    }

    // MARK: - Location Section

    private var locationSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Localisation")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            VStack(alignment: .leading, spacing: 8) {
                HStack(spacing: 8) {
                    Image(systemName: "mappin.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "FFA040"))

                    Text(property.address)
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "374151"))
                }

                Text("\(property.postalCode) \(property.city)")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .padding(.leading, 28)
            }
        }
    }

    // MARK: - Amenities Section

    private var amenitiesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Équipements")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                ForEach(property.amenities, id: \.self) { amenity in
                    HStack(spacing: 8) {
                        Image(systemName: amenity.icon)
                            .font(.system(size: 18))
                            .foregroundColor(Color(hex: "FFA040"))
                            .frame(width: 24)

                        Text(amenity.displayName)
                            .font(.system(size: 15))
                            .foregroundColor(Color(hex: "374151"))

                        Spacer()
                    }
                }
            }
        }
    }

    // MARK: - House Rules Section

    private var houseRulesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Règles de la maison")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            VStack(spacing: 12) {
                RuleItem(
                    icon: property.smokingAllowed ? "checkmark.circle.fill" : "xmark.circle.fill",
                    text: "Fumeurs \(property.smokingAllowed ? "acceptés" : "non acceptés")",
                    allowed: property.smokingAllowed
                )

                RuleItem(
                    icon: property.petsAllowed ? "checkmark.circle.fill" : "xmark.circle.fill",
                    text: "Animaux \(property.petsAllowed ? "acceptés" : "non acceptés")",
                    allowed: property.petsAllowed
                )

                RuleItem(
                    icon: property.couplesAllowed ? "checkmark.circle.fill" : "xmark.circle.fill",
                    text: "Couples \(property.couplesAllowed ? "acceptés" : "non acceptés")",
                    allowed: property.couplesAllowed
                )

                RuleItem(
                    icon: property.furnished ? "checkmark.circle.fill" : "xmark.circle.fill",
                    text: property.furnished ? "Meublé" : "Non meublé",
                    allowed: property.furnished
                )
            }
        }
    }

    // MARK: - Availability Section

    private var availabilitySection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Disponibilité")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            VStack(alignment: .leading, spacing: 8) {
                if let availableFrom = property.availableFrom {
                    HStack(spacing: 8) {
                        Image(systemName: "calendar")
                            .font(.system(size: 16))
                            .foregroundColor(Color(hex: "FFA040"))
                        Text("Disponible à partir du \(formatDate(availableFrom))")
                            .font(.system(size: 15))
                            .foregroundColor(Color(hex: "374151"))
                    }
                }

                HStack(spacing: 8) {
                    Image(systemName: "clock")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "FFA040"))
                    Text("Durée minimum: \(property.minimumStayMonths) mois")
                        .font(.system(size: 15))
                        .foregroundColor(Color(hex: "374151"))
                }
            }
        }
    }

    // MARK: - Bottom Actions

    private var bottomActions: some View {
        HStack(spacing: 12) {
            // Favorite button
            Button(action: {
                // Toggle favorite
            }) {
                Image(systemName: (property.isFavorited ?? false) ? "heart.fill" : "heart")
                    .font(.system(size: 20))
                    .foregroundColor((property.isFavorited ?? false) ? Color(hex: "EF4444") : Color(hex: "6B7280"))
                    .frame(width: 56, height: 56)
                    .background(Color.white)
                    .cornerRadius(16)
                    .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)
            }

            // Apply button
            Button(action: {
                showApplySheet = true
            }) {
                HStack(spacing: 8) {
                    Image(systemName: "doc.text.fill")
                        .font(.system(size: 16, weight: .semibold))
                    Text("Postuler")
                        .font(.system(size: 16, weight: .semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 56)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(16)
                .shadow(color: Color(hex: "FFA040").opacity(0.3), radius: 8, x: 0, y: 4)
            }
        }
        .padding(16)
        .background(Color.white)
    }

    // MARK: - Helper Methods

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "dd/MM/yyyy"
        return formatter.string(from: date)
    }
}

// MARK: - Quick Info Item

struct QuickInfoItem: View {
    let icon: String
    let label: String

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundColor(Color(hex: "FFA040"))

            Text(label)
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "374151"))
        }
    }
}

// MARK: - Rule Item

struct RuleItem: View {
    let icon: String
    let text: String
    let allowed: Bool

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundColor(allowed ? Color(hex: "10B981") : Color(hex: "EF4444"))

            Text(text)
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "374151"))

            Spacer()
        }
    }
}

// MARK: - Preview

struct PropertyDetailView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            PropertyDetailView(property: Property.mockProperties[0])
        }
    }
}
