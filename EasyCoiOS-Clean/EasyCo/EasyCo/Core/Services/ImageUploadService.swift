//
//  ImageUploadService.swift
//  EasyCo
//
//  Service for uploading images to Supabase Storage
//

import Foundation
import UIKit

class ImageUploadService {

    private let supabaseURL: String
    private let supabaseKey: String

    init() {
        self.supabaseURL = AppConfig.supabaseURL
        self.supabaseKey = AppConfig.supabaseAnonKey
    }

    // MARK: - Upload Image

    /// Upload an image to Supabase Storage
    /// - Parameters:
    ///   - image: The UIImage to upload
    ///   - bucket: The storage bucket name (e.g., "avatars", "maintenance", "properties")
    ///   - path: The file path within the bucket (e.g., "user_123/profile.jpg")
    ///   - accessToken: JWT access token
    /// - Returns: The public URL of the uploaded image
    func uploadImage(
        _ image: UIImage,
        toBucket bucket: String,
        atPath path: String,
        accessToken: String
    ) async throws -> String {

        // Compress image
        guard let imageData = compressImage(image) else {
            throw ImageUploadError.compressionFailed
        }

        // Supabase Storage upload URL
        let uploadURL = "\(supabaseURL)/storage/v1/object/\(bucket)/\(path)"

        guard let url = URL(string: uploadURL) else {
            throw NetworkError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("image/jpeg", forHTTPHeaderField: "Content-Type")
        request.setValue("public", forHTTPHeaderField: "x-upsert") // Overwrite if exists
        request.httpBody = imageData

        print("📸 Uploading image to: \(bucket)/\(path)")
        print("   Size: \(ByteCountFormatter.string(fromByteCount: Int64(imageData.count), countStyle: .file))")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 200 {
            print("❌ Image upload failed: \(httpResponse.statusCode)")
            if let responseStr = String(data: data, encoding: .utf8) {
                print("Response: \(responseStr.prefix(500))")
            }
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        // Return public URL
        let publicURL = "\(supabaseURL)/storage/v1/object/public/\(bucket)/\(path)"
        print("✅ Image uploaded successfully")
        print("   URL: \(publicURL)")

        return publicURL
    }

    // MARK: - Delete Image

    /// Delete an image from Supabase Storage
    func deleteImage(
        fromBucket bucket: String,
        atPath path: String,
        accessToken: String
    ) async throws {
        let deleteURL = "\(supabaseURL)/storage/v1/object/\(bucket)/\(path)"

        guard let url = URL(string: deleteURL) else {
            throw NetworkError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        print("🗑️ Deleting image: \(bucket)/\(path)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 200 {
            print("❌ Image deletion failed: \(httpResponse.statusCode)")
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        print("✅ Image deleted successfully")
    }

    // MARK: - Image Compression

    /// Compress image to JPEG with quality adjustment
    private func compressImage(_ image: UIImage, maxSizeKB: Int = 500) -> Data? {
        // Start with high quality
        var compression: CGFloat = 0.9
        var imageData = image.jpegData(compressionQuality: compression)

        // Reduce quality until size is acceptable
        while let data = imageData, data.count > maxSizeKB * 1024 && compression > 0.1 {
            compression -= 0.1
            imageData = image.jpegData(compressionQuality: compression)
        }

        if let data = imageData {
            let sizeKB = Double(data.count) / 1024.0
            print("   Compressed to: \(String(format: "%.1f", sizeKB)) KB (quality: \(String(format: "%.1f", compression * 100))%)")
        }

        return imageData
    }

    // MARK: - Resize Image

    /// Resize image to max dimensions while maintaining aspect ratio
    func resizeImage(_ image: UIImage, maxWidth: CGFloat = 1024, maxHeight: CGFloat = 1024) -> UIImage {
        let size = image.size
        let widthRatio = maxWidth / size.width
        let heightRatio = maxHeight / size.height
        let ratio = min(widthRatio, heightRatio, 1.0) // Don't upscale

        if ratio >= 1.0 {
            return image // No resize needed
        }

        let newSize = CGSize(width: size.width * ratio, height: size.height * ratio)

        UIGraphicsBeginImageContextWithOptions(newSize, false, 1.0)
        image.draw(in: CGRect(origin: .zero, size: newSize))
        let resizedImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()

        return resizedImage ?? image
    }

    // MARK: - Generate Unique Path

    /// Generate a unique file path for uploads
    func generateUniquePath(userId: String, prefix: String = "image") -> String {
        let timestamp = Int(Date().timeIntervalSince1970)
        let random = UUID().uuidString.prefix(8)
        return "\(userId)/\(prefix)_\(timestamp)_\(random).jpg"
    }
}

// MARK: - Errors

enum ImageUploadError: LocalizedError {
    case compressionFailed
    case invalidImage

    var errorDescription: String? {
        switch self {
        case .compressionFailed:
            return "Impossible de compresser l'image"
        case .invalidImage:
            return "Image invalide"
        }
    }
}
