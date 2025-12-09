//
//  CreatePropertyViewModel.swift
//  IzzIco
//
//  ViewModel pour la création de propriété en plusieurs étapes
//

import SwiftUI
import PhotosUI

// MARK: - Create Property ViewModel

class CreatePropertyViewModel: ObservableObject {
    // MARK: - Étape 1: Infos de base
    @Published var title: String = ""
    @Published var description: String = ""
    @Published var propertyType: PropertyType = .apartment
    @Published var address: String = ""
    @Published var city: String = ""
    @Published var neighborhood: String = ""
    @Published var postalCode: String = ""
    @Published var country: String = "Belgique"
    @Published var surfaceArea: String = ""
    @Published var bedrooms: Int = 1
    @Published var bathrooms: Int = 1
    @Published var totalRooms: Int = 3
    @Published var floorNumber: String = ""
    @Published var totalFloors: String = ""
    @Published var furnished: Bool = true

    // MARK: - Étape 2: Finances
    @Published var monthlyRent: String = ""
    @Published var chargesIncluded: Bool = true
    @Published var charges: String = ""
    @Published var deposit: String = ""
    @Published var agencyFees: String = ""

    // MARK: - Étape 3: Équipements
    @Published var selectedAmenities: Set<PropertyAmenity> = []
    @Published var roomDescriptions: String = ""
    @Published var houseRules: String = ""

    // MARK: - Étape 4: Photos
    @Published var images: [UIImage] = []
    @Published var selectedMainImageIndex: Int = 0
    @Published var isUploadingImages: Bool = false

    // MARK: - Étape 5: Disponibilité
    @Published var availableFrom: Date = Date()
    @Published var minimumStayMonths: Int = 6
    @Published var maximumStayMonths: Int? = nil
    @Published var hasMaximumStay: Bool = false
    @Published var preferredAgeMin: Double = 18
    @Published var preferredAgeMax: Double = 35
    @Published var preferredGender: TenantGenderPreference = .any
    @Published var smokingAllowed: Bool = false
    @Published var petsAllowed: Bool = false
    @Published var couplesAllowed: Bool = true
    @Published var childrenAllowed: Bool = false

    // MARK: - État
    @Published var isCreating: Bool = false
    @Published var error: String?
    @Published var successMessage: String?

    // MARK: - Validation par étape

    func isStepValid(_ step: Int) -> Bool {
        switch step {
        case 1:
            return !title.isEmpty &&
                   !description.isEmpty &&
                   !address.isEmpty &&
                   !city.isEmpty &&
                   !postalCode.isEmpty &&
                   bedrooms > 0 &&
                   bathrooms > 0

        case 2:
            guard let rent = Double(monthlyRent), rent > 0 else { return false }
            if !chargesIncluded {
                guard let chargesAmount = Double(charges), chargesAmount >= 0 else { return false }
            }
            if !deposit.isEmpty {
                guard let _ = Double(deposit) else { return false }
            }
            return true

        case 3:
            return !selectedAmenities.isEmpty

        case 4:
            return !images.isEmpty

        case 5:
            return preferredAgeMin < preferredAgeMax &&
                   minimumStayMonths > 0

        default:
            return false
        }
    }

    // MARK: - Gestion des images

    func loadImages(from items: [PhotosPickerItem]) async {
        isUploadingImages = true

        for item in items {
            if let data = try? await item.loadTransferable(type: Data.self),
               let uiImage = UIImage(data: data) {
                // Compression de l'image
                if let compressedData = compressImage(uiImage) {
                    if let compressedImage = UIImage(data: compressedData) {
                        await MainActor.run {
                            images.append(compressedImage)
                        }
                    }
                }
            }
        }

        await MainActor.run {
            isUploadingImages = false
        }
    }

    func removeImage(at index: Int) {
        images.remove(at: index)
        // Ajuster l'index de l'image principale si nécessaire
        if selectedMainImageIndex >= images.count {
            selectedMainImageIndex = max(0, images.count - 1)
        }
    }

    private func compressImage(_ image: UIImage) -> Data? {
        // Compresse à 80% qualité
        guard let data = image.jpegData(compressionQuality: 0.8) else {
            return nil
        }

        // Si > 1MB, compresse plus
        if data.count > 1_000_000 {
            return image.jpegData(compressionQuality: 0.5)
        }

        return data
    }

    // MARK: - Création de la propriété

    func createProperty() async {
        await MainActor.run {
            isCreating = true
            error = nil
        }

        // Mode démo
        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 1_500_000_000)

            await MainActor.run {
                isCreating = false
                successMessage = "Propriété créée avec succès !"
            }

            return
        }

        // TODO: Implémenter l'appel API réel
        // let propertyData = buildPropertyData()
        // try? await apiClient.createProperty(propertyData)

        await MainActor.run {
            isCreating = false
        }
    }

    // MARK: - Helper pour construire les données

    private func buildPropertyData() -> Property? {
        guard let rent = Double(monthlyRent) else { return nil }

        let chargesAmount = chargesIncluded ? 0 : (Double(charges) ?? 0)
        let depositAmount = Double(deposit) ?? rent * 2

        return Property(
            id: UUID(),
            ownerID: UUID(), // TODO: Get from auth
            title: title,
            description: description,
            propertyType: propertyType,
            address: address,
            city: city,
            neighborhood: neighborhood.isEmpty ? nil : neighborhood,
            postalCode: postalCode,
            country: country,
            latitude: nil, // TODO: Géocodage
            longitude: nil,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            totalRooms: totalRooms,
            surfaceArea: Double(surfaceArea),
            floorNumber: Int(floorNumber),
            totalFloors: Int(totalFloors),
            furnished: furnished,
            monthlyRent: rent,
            charges: chargesAmount,
            deposit: depositAmount,
            availableFrom: availableFrom,
            availableUntil: nil,
            minimumStayMonths: minimumStayMonths,
            maximumStayMonths: hasMaximumStay ? maximumStayMonths : nil,
            isAvailable: true,
            amenities: Array(selectedAmenities),
            smokingAllowed: smokingAllowed,
            petsAllowed: petsAllowed,
            couplesAllowed: couplesAllowed,
            childrenAllowed: childrenAllowed,
            images: [], // TODO: Upload images first
            mainImage: nil,
            status: .draft,
            viewsCount: 0,
            applicationsCount: 0,
            favoritesCount: 0,
            rating: 0,
            reviewsCount: 0,
            createdAt: Date(),
            updatedAt: Date(),
            publishedAt: nil,
            archivedAt: nil
        )
    }
}

// MARK: - Tenant Gender Preference

enum TenantGenderPreference: String, CaseIterable {
    case any = "any"
    case male = "male"
    case female = "female"

    var displayName: String {
        switch self {
        case .any: return "Peu importe"
        case .male: return "Hommes uniquement"
        case .female: return "Femmes uniquement"
        }
    }
}

// AppConfig est déjà défini dans Config/AppConfig.swift
