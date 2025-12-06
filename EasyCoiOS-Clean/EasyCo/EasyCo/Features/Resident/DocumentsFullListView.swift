//
//  DocumentsFullListView.swift
//  EasyCo
//
//  Full documents list for residents
//

import SwiftUI

struct DocumentsFullListView: View {
    @StateObject private var viewModel = DocumentsListViewModel()
    @State private var selectedCategory: DocumentCategory = .all
    @State private var showUploadSheet = false

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Category filters
                categorySection

                // Upload button
                uploadSection

                // Documents grid
                documentsGrid
            }
            .padding()
        }
        .background(Theme.Colors.backgroundSecondary)
        .navigationTitle("Mes Documents")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showUploadSheet) {
            DocumentUploadSheet()
        }
        .task {
            await viewModel.loadDocuments()
        }
    }

    private var categorySection: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(DocumentCategory.allCases, id: \.self) { category in
                    CategoryChipDocs(
                        title: category.label,
                        icon: category.icon,
                        count: viewModel.documents.filter { $0.category == category || category == .all }.count,
                        isSelected: selectedCategory == category,
                        action: {
                            withAnimation(.spring(response: 0.3)) {
                                selectedCategory = category
                            }
                            Haptic.impact(.light)
                        }
                    )
                }
            }
        }
    }

    private var uploadSection: some View {
        Button(action: {
            showUploadSheet = true
            Haptic.impact(.medium)
        }) {
            HStack(spacing: 12) {
                Image.lucide("upload")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 20, height: 20)

                Text("Ajouter un document")
                    .font(Theme.Typography.body(.semibold))

                Spacer()

                Image.lucide("chevron-right")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 16, height: 16)
            }
            .foregroundColor(Theme.Colors.Resident.primary)
            .padding(16)
            .background(Theme.Colors.Resident.primary.opacity(0.1))
            .cornerRadius(Theme.CornerRadius.card)
        }
    }

    private var documentsGrid: some View {
        VStack(spacing: 12) {
            ForEach(filteredDocuments) { document in
                DocumentFullCard(document: document)
            }
        }
    }

    private var filteredDocuments: [ResidentDocumentFull] {
        viewModel.documents.filter { doc in
            selectedCategory == .all || doc.category == selectedCategory
        }
    }
}

// MARK: - Document Category

enum DocumentCategory: CaseIterable {
    case all, contract, inventory, receipts, insurance, other

    var label: String {
        switch self {
        case .all: return "Tous"
        case .contract: return "Contrats"
        case .inventory: return "États des lieux"
        case .receipts: return "Quittances"
        case .insurance: return "Assurances"
        case .other: return "Autres"
        }
    }

    var icon: String {
        switch self {
        case .all: return "folder"
        case .contract: return "file-text"
        case .inventory: return "clipboard-check"
        case .receipts: return "receipt"
        case .insurance: return "shield"
        case .other: return "file"
        }
    }

    var color: Color {
        switch self {
        case .all: return Theme.Colors.textPrimary
        case .contract: return Theme.Colors.Resident.primary
        case .inventory: return Theme.Colors.Resident._300
        case .receipts: return Theme.Colors.Resident._400
        case .insurance: return Color(hex: "10B981")
        case .other: return Theme.Colors.gray400
        }
    }
}

// MARK: - Resident Document

struct ResidentDocumentFull: Identifiable {
    let id: String
    let title: String
    let category: DocumentCategory
    let uploadedAt: Date
    let size: String
    let url: String?

    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "d MMM yyyy"
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: uploadedAt)
    }
}

// MARK: - Category Chip

private struct CategoryChipDocs: View {
    let title: String
    let icon: String
    let count: Int
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                Image.lucide(icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 16, height: 16)

                Text(title)
                    .font(Theme.Typography.bodySmall(.semibold))

                if count > 0 {
                    Text("\(count)")
                        .font(Theme.Typography.caption(.bold))
                        .foregroundColor(isSelected ? .white : Theme.Colors.textSecondary)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(isSelected ? .white.opacity(0.3) : Theme.Colors.gray200)
                        .cornerRadius(8)
                }
            }
            .foregroundColor(isSelected ? .white : Theme.Colors.textPrimary)
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(isSelected ? AnyShapeStyle(Theme.Gradients.residentCTA) : AnyShapeStyle(Theme.Colors.backgroundPrimary))
            .cornerRadius(Theme.CornerRadius.button)
            .shadow(color: .black.opacity(isSelected ? 0.1 : 0.05), radius: 4, y: 2)
        }
    }
}

// MARK: - Document Full Card

private struct DocumentFullCard: View {
    let document: ResidentDocumentFull

    var body: some View {
        HStack(spacing: 16) {
            // Icon
            Image.lucide(document.category.icon)
                .resizable()
                .scaledToFit()
                .frame(width: 24, height: 24)
                .foregroundColor(document.category.color)
                .frame(width: 56, height: 56)
                .background(document.category.color.opacity(0.1))
                .cornerRadius(14)

            // Info
            VStack(alignment: .leading, spacing: 6) {
                Text(document.title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .lineLimit(2)

                HStack(spacing: 8) {
                    Text(document.formattedDate)
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)

                    Text("•")
                        .foregroundColor(Theme.Colors.textTertiary)

                    Text(document.size)
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                Text(document.category.label)
                    .font(Theme.Typography.caption())
                    .foregroundColor(document.category.color)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(document.category.color.opacity(0.1))
                    .cornerRadius(6)
            }

            Spacer()

            // Actions
            VStack(spacing: 12) {
                Button(action: {
                    Haptic.impact(.light)
                    // Download action
                }) {
                    Image.lucide("download")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)
                        .foregroundColor(Theme.Colors.Resident.primary)
                        .frame(width: 40, height: 40)
                        .background(Theme.Colors.Resident.primary.opacity(0.1))
                        .cornerRadius(10)
                }

                Button(action: {
                    Haptic.impact(.light)
                    // Share action
                }) {
                    Image.lucide("share-2")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 18, height: 18)
                        .foregroundColor(Theme.Colors.textSecondary)
                        .frame(width: 40, height: 40)
                        .background(Theme.Colors.gray100)
                        .cornerRadius(10)
                }
            }
        }
        .padding(16)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }
}

// MARK: - Document Upload Sheet

private struct DocumentUploadSheet: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                Image.lucide("upload-cloud")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 80, height: 80)
                    .foregroundColor(Theme.Colors.Resident.primary)

                VStack(spacing: 8) {
                    Text("Ajouter un document")
                        .font(Theme.Typography.title2())
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text("Sélectionnez un fichier depuis votre appareil")
                        .font(Theme.Typography.body())
                        .foregroundColor(Theme.Colors.textSecondary)
                        .multilineTextAlignment(.center)
                }

                Button(action: {
                    Haptic.impact(.medium)
                }) {
                    HStack(spacing: 12) {
                        Image.lucide("folder-open")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 20, height: 20)

                        Text("Parcourir mes fichiers")
                            .font(Theme.Typography.body(.semibold))
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Theme.Gradients.residentCTA)
                    .cornerRadius(Theme.CornerRadius.button)
                }
                .padding(.horizontal)

                Spacer()
            }
            .padding(.top, 40)
            .navigationTitle("Upload")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Fermer") {
                        dismiss()
                    }
                }
            }
        }
    }
}

// MARK: - View Model

@MainActor
class DocumentsListViewModel: ObservableObject {
    @Published var documents: [ResidentDocumentFull] = []
    @Published var isLoading = false

    func loadDocuments() async {
        isLoading = true
        defer { isLoading = false }

        // Demo mode - generate mock data
        documents = [
            ResidentDocumentFull(
                id: "1",
                title: "Contrat de location",
                category: .contract,
                uploadedAt: Calendar.current.date(byAdding: .month, value: -6, to: Date())!,
                size: "2.4 MB",
                url: nil
            ),
            ResidentDocumentFull(
                id: "2",
                title: "État des lieux d'entrée",
                category: .inventory,
                uploadedAt: Calendar.current.date(byAdding: .month, value: -6, to: Date())!,
                size: "1.8 MB",
                url: nil
            ),
            ResidentDocumentFull(
                id: "3",
                title: "Quittance Janvier 2025",
                category: .receipts,
                uploadedAt: Calendar.current.date(byAdding: .day, value: -5, to: Date())!,
                size: "156 KB",
                url: nil
            ),
            ResidentDocumentFull(
                id: "4",
                title: "Quittance Décembre 2024",
                category: .receipts,
                uploadedAt: Calendar.current.date(byAdding: .month, value: -1, to: Date())!,
                size: "152 KB",
                url: nil
            ),
            ResidentDocumentFull(
                id: "5",
                title: "Attestation d'assurance habitation",
                category: .insurance,
                uploadedAt: Calendar.current.date(byAdding: .month, value: -2, to: Date())!,
                size: "890 KB",
                url: nil
            ),
            ResidentDocumentFull(
                id: "6",
                title: "Règlement intérieur",
                category: .other,
                uploadedAt: Calendar.current.date(byAdding: .month, value: -6, to: Date())!,
                size: "345 KB",
                url: nil
            )
        ]
    }
}

// MARK: - Preview

struct DocumentsFullListView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            DocumentsFullListView()
        }
    }
}
