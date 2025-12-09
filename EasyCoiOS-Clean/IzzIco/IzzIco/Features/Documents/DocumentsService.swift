//
//  DocumentsService.swift
//  IzzIco
//
//  Service for fetching and downloading documents from Supabase Storage
//

import Foundation
import UIKit

class DocumentsService {

    private let supabaseURL: String
    private let supabaseKey: String

    init() {
        self.supabaseURL = AppConfig.supabaseURL
        self.supabaseKey = AppConfig.supabaseAnonKey
    }

    // MARK: - Fetch Documents List

    /// Fetch all documents for a user from Supabase
    func fetchDocuments(userId: String, accessToken: String) async throws -> [DocumentResponse] {
        let url = URL(string: "\(supabaseURL)/rest/v1/documents")!
        var components = URLComponents(url: url, resolvingAgainstBaseURL: false)!

        components.queryItems = [
            URLQueryItem(name: "user_id", value: "eq.\(userId)"),
            URLQueryItem(name: "select", value: "id,name,document_type,file_path,file_size,created_at,updated_at"),
            URLQueryItem(name: "order", value: "created_at.desc")
        ]

        var request = URLRequest(url: components.url!)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        print("📄 Fetching documents for user: \(userId)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 200 {
            print("❌ Documents fetch failed: \(httpResponse.statusCode)")
            if let responseStr = String(data: data, encoding: .utf8) {
                print("Response: \(responseStr.prefix(500))")
            }
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        let documents = try decoder.decode([DocumentResponse].self, from: data)
        print("✅ Loaded \(documents.count) documents")

        return documents
    }

    // MARK: - Download Document

    /// Download a document from Supabase Storage
    func downloadDocument(filePath: String, accessToken: String) async throws -> URL {
        // Supabase Storage URL format: {supabaseURL}/storage/v1/object/public/{bucket}/{filePath}
        // Or for private: {supabaseURL}/storage/v1/object/authenticated/{bucket}/{filePath}

        let storageURL = "\(supabaseURL)/storage/v1/object/authenticated/documents/\(filePath)"

        guard let url = URL(string: storageURL) else {
            throw NetworkError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        print("⬇️ Downloading document: \(filePath)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 200 {
            print("❌ Document download failed: \(httpResponse.statusCode)")
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        // Save to temporary file
        let fileName = URL(fileURLWithPath: filePath).lastPathComponent
        let tempDir = FileManager.default.temporaryDirectory
        let fileURL = tempDir.appendingPathComponent(fileName)

        try data.write(to: fileURL)

        print("✅ Document downloaded to: \(fileURL.path)")

        return fileURL
    }

    // MARK: - Get Public URL

    /// Get public URL for a document (if bucket is public)
    func getPublicURL(filePath: String) -> URL? {
        let publicURL = "\(supabaseURL)/storage/v1/object/public/documents/\(filePath)"
        return URL(string: publicURL)
    }
}

// MARK: - Response Models

struct DocumentResponse: Codable {
    let id: String
    let name: String
    let documentType: String
    let filePath: String
    let fileSize: Int?
    let createdAt: String
    let updatedAt: String

    enum CodingKeys: String, CodingKey {
        case id, name
        case documentType = "document_type"
        case filePath = "file_path"
        case fileSize = "file_size"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }

    var parsedCreatedAt: Date? {
        return ISO8601DateFormatter().date(from: createdAt)
    }
}
