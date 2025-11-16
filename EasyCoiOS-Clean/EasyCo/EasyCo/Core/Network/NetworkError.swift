import Foundation

// MARK: - Network Error

enum NetworkError: LocalizedError {
    case invalidURL
    case noData
    case decodingError(Error)
    case encodingError(Error)
    case httpError(statusCode: Int, data: Data?)
    case unauthorized
    case forbidden
    case notFound
    case serverError
    case networkUnavailable
    case timeout
    case unknown(Error)

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "URL invalide"
        case .noData:
            return "Aucune donnée reçue du serveur"
        case .decodingError(let error):
            return "Erreur de décodage: \(error.localizedDescription)"
        case .encodingError(let error):
            return "Erreur d'encodage: \(error.localizedDescription)"
        case .httpError(let statusCode, _):
            return "Erreur HTTP: \(statusCode)"
        case .unauthorized:
            return "Non autorisé. Veuillez vous reconnecter."
        case .forbidden:
            return "Accès refusé"
        case .notFound:
            return "Ressource introuvable"
        case .serverError:
            return "Erreur serveur. Réessayez plus tard."
        case .networkUnavailable:
            return "Pas de connexion internet"
        case .timeout:
            return "Délai d'attente dépassé"
        case .unknown(let error):
            return "Erreur inconnue: \(error.localizedDescription)"
        }
    }

    var userMessage: String {
        switch self {
        case .networkUnavailable:
            return "Vérifiez votre connexion internet et réessayez."
        case .unauthorized:
            return "Votre session a expiré. Veuillez vous reconnecter."
        case .serverError, .timeout:
            return "Le serveur rencontre des difficultés. Réessayez dans quelques instants."
        default:
            return errorDescription ?? "Une erreur est survenue"
        }
    }

    var isRecoverable: Bool {
        switch self {
        case .networkUnavailable, .timeout, .serverError:
            return true
        case .unauthorized:
            return false
        default:
            return false
        }
    }
}

// MARK: - API Error Response

struct APIErrorResponse: Codable {
    let error: String
    let message: String?
    let statusCode: Int?

    enum CodingKeys: String, CodingKey {
        case error
        case message
        case statusCode = "status_code"
    }
}
