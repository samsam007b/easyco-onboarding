import SwiftUI

// MARK: - Chat View

// struct ChatView: View {
//     let conversation: Conversation
//     @StateObject private var viewModel: ChatViewModel
//     @State private var messageText = ""
//     @State private var showImagePicker = false
//     @FocusState private var isInputFocused: Bool
// 
//     init(conversation: Conversation) {
//         self.conversation = conversation
//         self._viewModel = StateObject(wrappedValue: ChatViewModel(conversation: conversation))
//     }
// 
//     var body: some View {
//         VStack(spacing: 0) {
            // Messages list
//             messagesScrollView
// 
            // Input bar
//             messageInputBar
//         }
//         .background(Color(hex: "F9FAFB"))
//         .navigationBarTitleDisplayMode(.inline)
//         .toolbar {
//             ToolbarItem(placement: .principal) {
//                 conversationHeader
//             }
//         }
//         .task {
            // Connect to Realtime if not already connected
//             if !SupabaseRealtime.shared.isConnected {
//                 SupabaseRealtime.shared.connect()
//             }
// 
//             await viewModel.onAppear()
//         }
//         .onDisappear {
//             viewModel.onDisappear()
//         }
//         .onChange(of: messageText) { newValue in
//             if !newValue.isEmpty {
//                 viewModel.startTyping()
//             } else {
//                 viewModel.stopTyping()
//             }
//         }
//     }
// 
    // MARK: - Conversation Header
// 
//     private var conversationHeader: some View {
//         HStack(spacing: 12) {
            // Avatar
//             if let avatarURL = conversation.otherUserAvatarURL, let url = URL(string: avatarURL) {
//                 AsyncImage(url: url) { image in
//                     image
//                         .resizable()
//                         .aspectRatio(contentMode: .fill)
//                 } placeholder: {
//                     Circle()
//                         .fill(Color(hex: "FFA040"))
//                         .overlay(
//                             Text(conversation.otherUserName.prefix(1))
//                                 .font(.system(size: 16, weight: .semibold))
//                                 .foregroundColor(.white)
//                         )
//                 }
//                 .frame(width: 36, height: 36)
//                 .clipShape(Circle())
//             } else {
//                 Circle()
//                     .fill(Color(hex: "FFA040"))
//                     .frame(width: 36, height: 36)
//                     .overlay(
//                         Text(conversation.otherUserName.prefix(1))
//                             .font(.system(size: 16, weight: .semibold))
//                             .foregroundColor(.white)
//                     )
//             }
// 
//             VStack(alignment: .leading, spacing: 2) {
//                 Text(conversation.otherUserName)
//                     .font(.system(size: 16, weight: .semibold))
//                     .foregroundColor(Color(hex: "111827"))
// 
//                 if viewModel.isOtherUserTyping {
//                     Text("En train d'écrire...")
//                         .font(.system(size: 12))
//                         .foregroundColor(Color(hex: "FFA040"))
//                 } else if let propertyTitle = conversation.propertyTitle {
//                     Text(propertyTitle)
//                         .font(.system(size: 12))
//                         .foregroundColor(Color(hex: "6B7280"))
//                         .lineLimit(1)
//                 }
//             }
//         }
//     }
// 
    // MARK: - Messages Scroll View
// 
//     private var messagesScrollView: some View {
//         ScrollViewReader { proxy in
//             ScrollView {
//                 LazyVStack(spacing: 16) {
//                     ForEach(viewModel.messages) { message in
//                         MessageBubble(message: message)
//                             .id(message.id)
//                     }
//                 }
//                 .padding(16)
//                 .onChange(of: viewModel.messages.count) { _ in
//                     if let lastMessage = viewModel.messages.last {
//                         withAnimation {
//                             proxy.scrollTo(lastMessage.id, anchor: .bottom)
//                         }
//                     }
//                 }
//             }
//         }
//     }
// 
    // MARK: - Message Input Bar
// 
//     private var messageInputBar: some View {
//         VStack(spacing: 0) {
//             Divider()
// 
//             HStack(spacing: 12) {
                // Attach button
//                 Button(action: { showImagePicker = true }) {
//                     Image(systemName: "photo")
//                         .font(.system(size: 20))
//                         .foregroundColor(Color(hex: "6B7280"))
//                 }
// 
                // Text field
//                 HStack(spacing: 8) {
//                     TextField("Message...", text: $messageText, axis: .vertical)
//                         .font(.system(size: 15))
//                         .lineLimit(1...5)
//                         .focused($isInputFocused)
//                 }
//                 .padding(.horizontal, 12)
//                 .padding(.vertical, 8)
//                 .background(Color(hex: "F3F4F6"))
//                 .cornerRadius(20)
// 
                // Send button
//                 Button(action: sendMessage) {
//                     Image(systemName: "arrow.up.circle.fill")
//                         .font(.system(size: 32))
//                         .foregroundColor(messageText.isEmpty ? Color(hex: "D1D5DB") : Color(hex: "FFA040"))
//                 }
//                 .disabled(messageText.isEmpty)
//             }
//             .padding(.horizontal, 16)
//             .padding(.vertical, 12)
//             .background(Color.white)
//         }
//     }
// 
    // MARK: - Actions
// 
//     private func sendMessage() {
//         guard !messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
// 
//         _Concurrency.Task {
//             await viewModel.sendMessage(messageText)
//             messageText = ""
//         }
//     }
// }

// MARK: - Message Bubble

// struct MessageBubble: View {
//     let message: Message
// 
//     var body: some View {
//         HStack(alignment: .bottom, spacing: 8) {
//             if message.isSentByCurrentUser {
//                 Spacer(minLength: 50)
//             }
// 
//             VStack(alignment: message.isSentByCurrentUser ? .trailing : .leading, spacing: 4) {
                // Message bubble
//                 Text(message.content)
//                     .font(.system(size: 15))
//                     .foregroundColor(message.isSentByCurrentUser ? .white : Color(hex: "111827"))
//                     .padding(.horizontal, 14)
//                     .padding(.vertical, 10)
//                     .background(
//                         message.isSentByCurrentUser ?
//                         LinearGradient(
//                             colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
//                             startPoint: .leading,
//                             endPoint: .trailing
//                         )
//                         .any :
//                         Color(hex: "F3F4F6").any
//                     )
//                     .cornerRadius(18, corners: message.isSentByCurrentUser ?
//                         [.topLeft, .topRight, .bottomLeft] :
//                         [.topLeft, .topRight, .bottomRight]
//                     )
// 
                // Timestamp
//                 Text(formatMessageTime(message.createdAt))
//                     .font(.system(size: 11))
//                     .foregroundColor(Color(hex: "9CA3AF"))
//             }
// 
//             if !message.isSentByCurrentUser {
//                 Spacer(minLength: 50)
//             }
//         }
//     }
// 
//     private func formatMessageTime(_ date: Date) -> String {
//         let formatter = DateFormatter()
//         formatter.dateFormat = "HH:mm"
//         return formatter.string(from: date)
//     }
// }

// MARK: - Helper Extensions

extension ShapeStyle where Self == AnyShapeStyle {
    static var any: AnyShapeStyle { AnyShapeStyle(Color.clear) }
}

extension LinearGradient {
    var any: AnyShapeStyle { AnyShapeStyle(self) }
}

extension Color {
    var any: AnyShapeStyle { AnyShapeStyle(self) }
}

// MARK: - Preview

struct ChatView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            ChatView(conversation: Conversation.mockConversations[0])
        }
    }
}
