import Foundation

// MARK: - String Extensions

extension String {
    /// Check if string is a valid email
    var isValidEmail: Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format:"SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: self)
    }

    /// Check if string is a valid password (min 8 chars)
    var isValidPassword: Bool {
        return self.count >= AppConfig.Validation.minPasswordLength
    }

    /// Remove whitespace and newlines
    var trimmed: String {
        self.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    /// Check if string is empty or only whitespace
    var isBlank: Bool {
        self.trimmed.isEmpty
    }

    /// Capitalize first letter
    var capitalizedFirst: String {
        guard !isEmpty else { return self }
        return prefix(1).uppercased() + dropFirst()
    }

    /// Format phone number
    var formattedPhoneNumber: String {
        let cleaned = self.components(separatedBy: CharacterSet.decimalDigits.inverted).joined()

        guard cleaned.count >= 9 else { return self }

        var formatted = ""
        for (index, char) in cleaned.enumerated() {
            if index > 0 && index % 3 == 0 {
                formatted += " "
            }
            formatted.append(char)
        }
        return formatted
    }

    /// Truncate to length with ellipsis
    func truncated(to length: Int, addEllipsis: Bool = true) -> String {
        guard self.count > length else { return self }
        let truncated = String(self.prefix(length))
        return addEllipsis ? truncated + "..." : truncated
    }
}

// MARK: - Optional String Extensions

extension Optional where Wrapped == String {
    var isNilOrEmpty: Bool {
        return self?.isEmpty ?? true
    }
}
