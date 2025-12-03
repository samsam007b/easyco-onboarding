//
//  FilterChip.swift
//  EasyCo
//
//  Filter chip component for selections
//

import SwiftUI

// struct FilterChip: View {
//     let title: String
//     let icon: String?
//     @Binding var isSelected: Bool
//     var action: (() -> Void)? = nil
// 
//     var body: some View {
//         Button(action: {
//             Haptic.selection()
//             isSelected.toggle()
//             action?()
//         }) {
//             HStack(spacing: 6) {
//                 if let icon = icon {
//                     Image.lucide(icon)
//                         .resizable()
//                         .scaledToFit()
//                         .frame(width: 14, height: 14)
//                 }
// 
//                 Text(title)
//                     .font(Theme.Typography.bodySmall(.semibold))
// 
//                 if isSelected {
//                     Image(systemName: "checkmark")
//                         .font(.system(size: 12, weight: .bold))
//                 }
//             }
//             .foregroundColor(isSelected ? .white : Theme.Colors.gray700)
//             .padding(.horizontal, Theme.Spacing.lg)
//             .padding(.vertical, 10)
//             .background(
//                 Group {
//                     if isSelected {
//                         Theme.Colors.primaryGradient
//                     } else {
//                         LinearGradient(
//                             colors: [Theme.Colors.gray100],
//                             startPoint: .leading,
//                             endPoint: .trailing
//                         )
//                     }
//                 }
//             )
//             .cornerRadius(Theme.CornerRadius.chip)
//         }
//         .buttonStyle(PlainButtonStyle())
//         .animation(Theme.Animation.springFast, value: isSelected)
//     }
// }
// 
// MARK: - Preview
// 
// struct FilterChip_Previews: PreviewProvider {
//     static var previews: some View {
//         VStack(spacing: 20) {
//             HStack(spacing: 12) {
//                 FilterChip(
//                     title: "Meublé",
//                     icon: nil,
//                     isSelected: .constant(false)
//                 )
//
//                 FilterChip(
//                     title: "Animaux",
//                     icon: "dog",
//                     isSelected: .constant(true)
//                 )
//
//                 FilterChip(
//                     title: "Balcon",
//                     icon: nil,
//                     isSelected: .constant(false)
//                 )
//             }
//
//             ScrollView(.horizontal, showsIndicators: false) {
//                 HStack(spacing: 12) {
//                     FilterChip(title: "Appartement", icon: nil, isSelected: .constant(true))
//                     FilterChip(title: "Studio", icon: nil, isSelected: .constant(false))
//                     FilterChip(title: "Maison", icon: nil, isSelected: .constant(false))
//                     FilterChip(title: "Colocation", icon: "users", isSelected: .constant(true))
//                     FilterChip(title: "Parking", icon: "car", isSelected: .constant(false))
//                 }
//                 .padding(.horizontal)
//             }
//         }
//     }
// }
