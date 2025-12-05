//
//  DocumentsViewModel.swift
//  EasyCo
//
//  ViewModel for Documents list with Supabase integration
//

import Foundation
import SwiftUI

@MainActor
class DocumentsViewModel: ObservableObject {
    @Published var documents: [ResidentDocument] = []
    @Published var isLoading = false
    @Published var error: AppError?
    @Published var downloadingDocumentId: String?

    private let service = DocumentsService()

    func loadDocuments() async {
        isLoading = true
        error = nil

        do {
            // Get current user
            guard let user = AuthManager.shared.currentUser else {
                print("⚠️ No user logged in")
                loadMockDocuments()
                isLoading = false
                return
            }

            // Get access token
            guard let accessToken = EasyCoKeychainManager.shared.getAuthToken() else {
                print("⚠️ No access token found")
                loadMockDocuments()
                isLoading = false
                return
            }

            let userId = user.id.uuidString

            // Fetch documents from Supabase
            let documentsResponse = try await service.fetchDocuments(
                userId: userId,
                accessToken: accessToken
            )

            // Convert to ResidentDocument model
            documents = documentsResponse.map { docResp in
                ResidentDocument(
                    id: docResp.id,
                    name: docResp.name,
                    type: docResp.documentType,
                    date: docResp.parsedCreatedAt ?? Date(),
                    url: docResp.filePath,
                    fileSize: docResp.fileSize
                )
            }

            isLoading = false
            print("✅ Documents loaded from Supabase")

        } catch {
            print("❌ Error loading documents: \(error.localizedDescription)")
            self.error = AppError.unknown(error)
            loadMockDocuments()
            isLoading = false
        }
    }

    func downloadDocument(_ document: ResidentDocument) async {
        downloadingDocumentId = document.id

        do {
            guard let accessToken = EasyCoKeychainManager.shared.getAuthToken() else {
                throw NetworkError.unauthorized
            }

            // Download document
            let fileURL = try await service.downloadDocument(
                filePath: document.url,
                accessToken: accessToken
            )

            // Open document in system viewer
            await openDocument(fileURL)

            downloadingDocumentId = nil

        } catch {
            print("❌ Error downloading document: \(error.localizedDescription)")
            self.error = AppError.unknown(error)
            downloadingDocumentId = nil
        }
    }

    private func openDocument(_ url: URL) async {
        // Share document using UIActivityViewController
        // This allows the user to open it in another app, save it, etc.
        await MainActor.run {
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let rootViewController = windowScene.windows.first?.rootViewController {

                let activityVC = UIActivityViewController(
                    activityItems: [url],
                    applicationActivities: nil
                )

                // For iPad
                if let popover = activityVC.popoverPresentationController {
                    popover.sourceView = rootViewController.view
                    popover.sourceRect = CGRect(x: rootViewController.view.bounds.midX,
                                               y: rootViewController.view.bounds.midY,
                                               width: 0, height: 0)
                    popover.permittedArrowDirections = []
                }

                rootViewController.present(activityVC, animated: true)
            }
        }
    }

    private func loadMockDocuments() {
        // Fallback mock data
        documents = [
            ResidentDocument(
                id: "1",
                name: "Contrat de location",
                type: "lease",
                date: Calendar.current.date(byAdding: .month, value: -6, to: Date())!,
                url: "contracts/lease_contract.pdf",
                fileSize: 2457600
            ),
            ResidentDocument(
                id: "2",
                name: "État des lieux d'entrée",
                type: "inventory",
                date: Calendar.current.date(byAdding: .month, value: -6, to: Date())!,
                url: "inventories/entry_inventory.pdf",
                fileSize: 5242880
            ),
            ResidentDocument(
                id: "3",
                name: "Quittance Novembre 2024",
                type: "receipt",
                date: Calendar.current.date(byAdding: .month, value: -1, to: Date())!,
                url: "receipts/receipt_nov_2024.pdf",
                fileSize: 245760
            )
        ]
    }
}
