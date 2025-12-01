//
//  PropertyFormStep4View.swift
//  EasyCo
//
//  Étape 4 : Photos et médias
//

import SwiftUI
import PhotosUI

struct PropertyFormStep4View: View {
    @ObservedObject var viewModel: CreatePropertyViewModel
    @State private var selectedItems: [PhotosPickerItem] = []

    private let columns = [
        GridItem(.flexible()),
        GridItem(.flexible()),
        GridItem(.flexible())
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            // Header
            VStack(alignment: .leading, spacing: 8) {
                Text("Photos")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Ajoutez au moins une photo de votre propriété")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            // Compteur
            if !viewModel.images.isEmpty {
                HStack {
                    Image(systemName: "photo.fill")
                        .foregroundColor(Color(hex: "10B981"))
                    Text("\(viewModel.images.count) photo(s) ajoutée(s)")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "10B981"))
                }
                .padding(12)
                .background(Color(hex: "F0FDF4"))
                .cornerRadius(8)
            }

            // Photo Picker Button
            PhotosPicker(
                selection: $selectedItems,
                maxSelectionCount: 10,
                matching: .images
            ) {
                HStack(spacing: 12) {
                    Image(systemName: "photo.on.rectangle.angled")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "6E56CF"))

                    VStack(alignment: .leading, spacing: 4) {
                        Text("Ajouter des photos")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "6E56CF"))

                        Text("Maximum 10 photos")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "6B7280"))
                    }

                    Spacer()

                    Image(systemName: "chevron.right")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "9CA3AF"))
                }
                .padding(16)
                .background(Color.white)
                .cornerRadius(12)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color(hex: "6E56CF"), style: StrokeStyle(lineWidth: 2, dash: [5]))
                )
            }
            .onChange(of: selectedItems) { newItems in
                _Concurrency.Task {
                    await viewModel.loadImages(from: newItems)
                    selectedItems = []
                }
            }

            // Loading indicator
            if viewModel.isUploadingImages {
                HStack(spacing: 12) {
                    ProgressView()
                        .scaleEffect(0.8)
                    Text("Chargement des images...")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))
                }
                .padding(12)
                .frame(maxWidth: .infinity)
                .background(Color(hex: "F9FAFB"))
                .cornerRadius(8)
            }

            // Preview Grid
            if !viewModel.images.isEmpty {
                VStack(alignment: .leading, spacing: 12) {
                    Text("Photos ajoutées")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    Text("Appuyez longuement sur une photo pour la définir comme couverture")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))

                    LazyVGrid(columns: columns, spacing: 12) {
                        ForEach(viewModel.images.indices, id: \.self) { index in
                            PhotoThumbnail(
                                image: viewModel.images[index],
                                isMainImage: index == viewModel.selectedMainImageIndex,
                                onRemove: {
                                    withAnimation {
                                        viewModel.removeImage(at: index)
                                    }
                                },
                                onSetAsMain: {
                                    withAnimation {
                                        viewModel.selectedMainImageIndex = index
                                    }
                                }
                            )
                        }
                    }
                }
            }

            // Tips
            VStack(alignment: .leading, spacing: 12) {
                HStack(alignment: .top, spacing: 12) {
                    Image(systemName: "lightbulb.fill")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "FBBF24"))

                    VStack(alignment: .leading, spacing: 8) {
                        Text("Conseils pour de belles photos")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hex: "111827"))

                        VStack(alignment: .leading, spacing: 4) {
                            PhotoTipRow(text: "Prenez des photos en pleine lumière")
                            PhotoTipRow(text: "Montrez toutes les pièces principales")
                            PhotoTipRow(text: "Rangez et nettoyez avant de photographier")
                            PhotoTipRow(text: "Utilisez le mode paysage")
                        }
                    }
                }
            }
            .padding(16)
            .background(Color(hex: "FFFBEB"))
            .cornerRadius(12)

            Spacer(minLength: 40)
        }
    }
}

// MARK: - Photo Thumbnail

struct PhotoThumbnail: View {
    let image: UIImage
    let isMainImage: Bool
    let onRemove: () -> Void
    let onSetAsMain: () -> Void

    var body: some View {
        ZStack(alignment: .topTrailing) {
            // Image
            Image(uiImage: image)
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(width: 100, height: 100)
                .clipped()
                .cornerRadius(8)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(
                            isMainImage ? Color(hex: "6E56CF") : Color.clear,
                            lineWidth: 3
                        )
                )

            // Main image badge
            if isMainImage {
                VStack {
                    HStack {
                        Text("Couverture")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 3)
                            .background(Color(hex: "6E56CF"))
                            .cornerRadius(4)
                        Spacer()
                    }
                    .padding(4)
                    Spacer()
                }
            }

            // Remove button
            Button(action: onRemove) {
                Image(systemName: "xmark.circle.fill")
                    .font(.system(size: 20))
                    .foregroundColor(.white)
                    .background(
                        Circle()
                            .fill(Color.black.opacity(0.5))
                            .frame(width: 24, height: 24)
                    )
            }
            .offset(x: 4, y: -4)
        }
        .frame(width: 100, height: 100)
        .onLongPressGesture {
            onSetAsMain()
        }
    }
}

// MARK: - Tip Row

private struct PhotoTipRow: View {
    let text: String

    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 12))
                .foregroundColor(Color(hex: "10B981"))

            Text(text)
                .font(.system(size: 12))
                .foregroundColor(Color(hex: "6B7280"))
        }
    }
}
