//
//  AppError.swift
//  EasyCo
//
//  Comprehensive error handling for the application
//

import Foundation

enum AppError: LocalizedError {
    case network(NetworkError)
    case authentication(String)
    case validation(String)
    case notFound(String)
    case serverError(Int, String)
    case unknown(Error)

    var errorDescription: String? {
        switch self {
        case .network(let networkError):
            return networkError.localizedDescription
        case .authentication(let message):
            return "Erreur d'authentification: \(message)"
        case .validation(let message):
            return "Erreur de validation: \(message)"
        case .notFound(let resource):
            return "\(resource) introuvable"
        case .serverError(let code, let message):
            return "Erreur serveur (\(code)): \(message)"
        case .unknown(let error):
            return "Erreur: \(error.localizedDescription)"
        }
    }

    var userMessage: String {
        errorDescription ?? "Une erreur est survenue"
    }
}

enum NetworkError: LocalizedError {
    case invalidURL
    case noData
    case decodingError(Error)
    case encodingError(Error)
    case serverError(Int)
    case httpError(statusCode: Int, data: Data?)
    case timeout
    case noInternetConnection
    case unauthorized
    case forbidden
    case notFound
    case invalidOTP
    case unknown(Error)

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "URL invalide"
        case .noData:
            return "Aucune donnée reçue"
        case .decodingError(let error):
            return "Erreur de décodage: \(error.localizedDescription)"
        case .encodingError(let error):
            return "Erreur d'encodage: \(error.localizedDescription)"
        case .serverError(let code):
            return "Erreur serveur (code \(code))"
        case .httpError(let statusCode, _):
            return "Erreur HTTP (code \(statusCode))"
        case .timeout:
            return "Délai d'attente dépassé"
        case .noInternetConnection:
            return "Pas de connexion internet"
        case .unauthorized:
            return "Non autorisé"
        case .forbidden:
            return "Accès refusé"
        case .notFound:
            return "Ressource introuvable"
        case .invalidOTP:
            return "Code OTP invalide"
        case .unknown(let error):
            return "Erreur réseau: \(error.localizedDescription)"
        }
    }

    var userMessage: String {
        errorDescription ?? "Une erreur réseau est survenue"
    }
}
