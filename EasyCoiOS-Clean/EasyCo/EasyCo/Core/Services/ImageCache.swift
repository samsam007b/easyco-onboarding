//
//  ImageCache.swift
//  EasyCo
//
//  Système de cache d'images optimisé pour les performances
//

import SwiftUI
import UIKit

// MARK: - Image Cache Manager

actor ImageCache {
    static let shared = ImageCache()

    private var cache = NSCache<NSString, UIImage>()
    private var loadingTasks: [URL: Task<UIImage?, Never>] = [:]

    private init() {
        // Configure cache limits (100MB max)
        cache.totalCostLimit = 100 * 1024 * 1024
        cache.countLimit = 200
    }

    // MARK: - Cache Operations

    func get(for url: URL) -> UIImage? {
        return cache.object(forKey: url.absoluteString as NSString)
    }

    func set(_ image: UIImage, for url: URL) {
        // Calculate approximate cost in bytes
        let cost = image.jpegData(compressionQuality: 1.0)?.count ?? 0
        cache.setObject(image, forKey: url.absoluteString as NSString, cost: cost)
    }

    func remove(for url: URL) {
        cache.removeObject(forKey: url.absoluteString as NSString)
    }

    func clearAll() {
        cache.removeAllObjects()
        loadingTasks.removeAll()
    }

    // MARK: - Image Loading

    func load(from url: URL, maxWidth: CGFloat = 800) async -> UIImage? {
        // Check if already cached
        if let cachedImage = get(for: url) {
            return cachedImage
        }

        // Check if already loading
        if let existingTask = loadingTasks[url] {
            return await existingTask.value
        }

        // Create new loading task
        let task = Task<UIImage?, Never> {
            do {
                let (data, _) = try await URLSession.shared.data(from: url)

                guard let image = UIImage(data: data) else {
                    return nil
                }

                // Resize image to save memory
                let resizedImage = await resizeImage(image, maxWidth: maxWidth)

                // Cache the resized image
                set(resizedImage, for: url)

                return resizedImage
            } catch {
                print("❌ Failed to load image from \(url): \(error.localizedDescription)")
                return nil
            }
        }

        loadingTasks[url] = task
        let result = await task.value
        loadingTasks.removeValue(forKey: url)

        return result
    }

    // MARK: - Image Processing

    private func resizeImage(_ image: UIImage, maxWidth: CGFloat) async -> UIImage {
        let size = image.size

        // Don't resize if already small enough
        guard size.width > maxWidth else {
            return image
        }

        let ratio = maxWidth / size.width
        let newSize = CGSize(width: maxWidth, height: size.height * ratio)

        return await Task {
            let renderer = UIGraphicsImageRenderer(size: newSize)
            return renderer.image { _ in
                image.draw(in: CGRect(origin: .zero, size: newSize))
            }
        }.value
    }
}

// MARK: - Cached Async Image View

struct CachedAsyncImage<Content: View, Placeholder: View>: View {
    let url: URL?
    let maxWidth: CGFloat
    let content: (Image) -> Content
    let placeholder: () -> Placeholder

    @State private var image: UIImage?
    @State private var isLoading = false

    init(
        url: URL?,
        maxWidth: CGFloat = 800,
        @ViewBuilder content: @escaping (Image) -> Content,
        @ViewBuilder placeholder: @escaping () -> Placeholder
    ) {
        self.url = url
        self.maxWidth = maxWidth
        self.content = content
        self.placeholder = placeholder
    }

    var body: some View {
        Group {
            if let image = image {
                content(Image(uiImage: image))
            } else {
                placeholder()
                    .task {
                        await loadImage()
                    }
            }
        }
    }

    private func loadImage() async {
        guard let url = url, image == nil, !isLoading else { return }

        isLoading = true

        // First check synchronous cache
        if let cachedImage = await ImageCache.shared.get(for: url) {
            image = cachedImage
            isLoading = false
            return
        }

        // Load from network
        if let loadedImage = await ImageCache.shared.load(from: url, maxWidth: maxWidth) {
            image = loadedImage
        }

        isLoading = false
    }
}

// MARK: - Convenience Extension

extension CachedAsyncImage where Placeholder == Color {
    init(
        url: URL?,
        maxWidth: CGFloat = 800,
        @ViewBuilder content: @escaping (Image) -> Content
    ) {
        self.init(
            url: url,
            maxWidth: maxWidth,
            content: content,
            placeholder: { Color(hex: "E5E7EB") }
        )
    }
}

// Convenience initializer removed - use CachedAsyncImage with explicit content and placeholder closures

// MARK: - Memory Warning Handler

extension ImageCache {
    static func setupMemoryWarningHandler() {
        NotificationCenter.default.addObserver(
            forName: UIApplication.didReceiveMemoryWarningNotification,
            object: nil,
            queue: .main
        ) { _ in
            Task {
                await ImageCache.shared.clearAll()
                print("🧹 Image cache cleared due to memory warning")
            }
        }
    }
}
