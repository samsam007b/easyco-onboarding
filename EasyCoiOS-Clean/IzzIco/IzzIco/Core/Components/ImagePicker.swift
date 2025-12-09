//
//  ImagePicker.swift
//  IzzIco
//
//  UIKit Image Picker wrapped for SwiftUI
//

import SwiftUI
import PhotosUI

struct ImagePicker: UIViewControllerRepresentable {
    @Binding var selectedImage: UIImage?
    @Environment(\.dismiss) private var dismiss

    func makeUIViewController(context: Context) -> PHPickerViewController {
        var configuration = PHPickerConfiguration()
        configuration.filter = .images
        configuration.selectionLimit = 1

        let picker = PHPickerViewController(configuration: configuration)
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_ uiViewController: PHPickerViewController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, PHPickerViewControllerDelegate {
        let parent: ImagePicker

        init(_ parent: ImagePicker) {
            self.parent = parent
        }

        func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
            parent.dismiss()

            guard let provider = results.first?.itemProvider else { return }

            if provider.canLoadObject(ofClass: UIImage.self) {
                provider.loadObject(ofClass: UIImage.self) { image, error in
                    DispatchQueue.main.async {
                        self.parent.selectedImage = image as? UIImage
                    }
                }
            }
        }
    }
}

// MARK: - Camera Picker

struct CameraPicker: UIViewControllerRepresentable {
    @Binding var selectedImage: UIImage?
    @Environment(\.dismiss) private var dismiss

    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = .camera
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
        let parent: CameraPicker

        init(_ parent: CameraPicker) {
            self.parent = parent
        }

        func imagePickerController(
            _ picker: UIImagePickerController,
            didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]
        ) {
            if let image = info[.originalImage] as? UIImage {
                parent.selectedImage = image
            }
            parent.dismiss()
        }

        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            parent.dismiss()
        }
    }
}

// MARK: - Image Source Picker Sheet

struct ImageSourcePicker: View {
    @Binding var selectedImage: UIImage?
    @Binding var showImagePicker: Bool
    @State private var showCamera = false
    @State private var showPhotoLibrary = false

    var body: some View {
        VStack(spacing: 0) {
            Button(action: {
                showImagePicker = false
                showCamera = true
            }) {
                HStack {
                    Image(systemName: "camera.fill")
                        .font(.system(size: 20))
                        .foregroundColor(Theme.Colors.primary)
                    Text("Prendre une photo")
                        .font(Theme.Typography.body())
                        .foregroundColor(Theme.Colors.textPrimary)
                    Spacer()
                }
                .padding()
            }

            Divider()

            Button(action: {
                showImagePicker = false
                showPhotoLibrary = true
            }) {
                HStack {
                    Image(systemName: "photo.fill")
                        .font(.system(size: 20))
                        .foregroundColor(Theme.Colors.primary)
                    Text("Choisir depuis la galerie")
                        .font(Theme.Typography.body())
                        .foregroundColor(Theme.Colors.textPrimary)
                    Spacer()
                }
                .padding()
            }

            Divider()

            Button(action: {
                showImagePicker = false
            }) {
                Text("Annuler")
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.error)
                    .frame(maxWidth: .infinity)
                    .padding()
            }
        }
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(16)
        .padding()
        .sheet(isPresented: $showCamera) {
            CameraPicker(selectedImage: $selectedImage)
        }
        .sheet(isPresented: $showPhotoLibrary) {
            ImagePicker(selectedImage: $selectedImage)
        }
    }
}
