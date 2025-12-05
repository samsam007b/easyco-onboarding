//
//  DocumentsListView.swift
//  EasyCo
//
//  Documents list for residents with Supabase integration
//

import SwiftUI

struct DocumentsListViewNew: View {
    @StateObject private var viewModel = DocumentsViewModel()

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                if viewModel.isLoading {
                    ProgressView("Chargement...")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .padding(.top, 100)
                } else if viewModel.documents.isEmpty {
                    emptyState
                } else {
                    ForEach(viewModel.documents) { document in
                        ResidentDocumentCard(
                            document: document,
                            isDownloading: viewModel.downloadingDocumentId == document.id,
                            onDownload: {
                                Task {
                                    await viewModel.downloadDocument(document)
                                }
                            }
                        )
                    }
                }
            }
            .padding()
        }
        .background(Theme.Colors.backgroundSecondary)
        .navigationTitle("Mes Documents")
        .navigationBarTitleDisplayMode(.large)
        .task {
            await viewModel.loadDocuments()
        }
    }

    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "doc.text")
                .font(.system(size: 60))
                .foregroundColor(Theme.Colors.textTertiary)

            Text("Aucun document")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            Text("Vos documents apparaîtront ici")
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textSecondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.top, 100)
    }
}

private struct ResidentDocumentCard: View {
    let document: ResidentDocument
    let isDownloading: Bool
    let onDownload: () -> Void

    var body: some View {
        HStack(spacing: 16) {
            Image(systemName: iconForType(document.type))
                .font(.system(size: 24))
                .foregroundColor(Theme.Colors.primary)
                .frame(width: 48, height: 48)
                .background(Theme.Colors.primary.opacity(0.1))
                .cornerRadius(12)

            VStack(alignment: .leading, spacing: 4) {
                Text(document.name)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                HStack(spacing: 8) {
                    Text(document.formattedDate)
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)

                    if let fileSize = document.fileSize {
                        Text("•")
                            .foregroundColor(Theme.Colors.textTertiary)

                        Text(formatFileSize(fileSize))
                            .font(Theme.Typography.bodySmall())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }
                }
            }

            Spacer()

            Button(action: onDownload) {
                if isDownloading {
                    ProgressView()
                        .frame(width: 24, height: 24)
                } else {
                    Image(systemName: "arrow.down.circle.fill")
                        .font(.system(size: 24))
                        .foregroundColor(Theme.Colors.primary)
                }
            }
            .disabled(isDownloading)
        }
        .padding(16)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }

    private func iconForType(_ type: String) -> String {
        switch type.lowercased() {
        case "lease", "contract": return "doc.text.fill"
        case "receipt", "quittance": return "doc.plaintext.fill"
        case "invoice", "facture": return "doc.richtext.fill"
        case "inventory", "etat_lieux": return "list.bullet.rectangle"
        default: return "doc.fill"
        }
    }

    private func formatFileSize(_ bytes: Int) -> String {
        let formatter = ByteCountFormatter()
        formatter.allowedUnits = [.useKB, .useMB]
        formatter.countStyle = .file
        return formatter.string(fromByteCount: Int64(bytes))
    }
}

// MARK: - Models

struct ResidentDocument: Identifiable {
    let id: String
    let name: String
    let type: String
    let date: Date
    let url: String
    let fileSize: Int?

    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: date)
    }
}
