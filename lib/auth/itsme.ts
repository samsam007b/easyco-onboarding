/**
 * ITSME Integration (Belgian Digital Identity)
 *
 * Implements OpenID Connect flow for ITSME identity verification.
 * Supports identification level (name, DOB, nationality) and authentication.
 *
 * Prerequisites:
 * 1. Register at https://partners.itsme.be/
 * 2. Configure redirect URIs
 * 3. Set environment variables: ITSME_CLIENT_ID, ITSME_CLIENT_SECRET, etc.
 *
 * @see https://belgianmobileid.github.io/doc/
 */

import { createHash, randomBytes } from 'crypto';
import * as jose from 'jose';

// =============================================================================
// TYPES
// =============================================================================

export interface ItsmeConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  serviceCode: string;
  environment: 'e2e' | 'production';
}

export interface ItsmeUserClaims {
  /** ITSME unique subject identifier */
  sub: string;
  /** Given name(s) */
  given_name?: string;
  /** Family name */
  family_name?: string;
  /** Full name */
  name?: string;
  /** Date of birth (YYYY-MM-DD) */
  birthdate?: string;
  /** Nationality (ISO 3166-1 alpha-2) */
  nationality?: string;
  /** Gender */
  gender?: string;
  /** Address (structured) */
  address?: {
    street_address?: string;
    locality?: string;
    postal_code?: string;
    country?: string;
  };
  /** Belgian National Register Number (if eid scope requested) */
  eid?: string;
  /** Email (if email scope requested) */
  email?: string;
  /** Phone number (if phone scope requested) */
  phone_number?: string;
}

export interface ItsmeTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  id_token: string;
  refresh_token?: string;
}

export interface ItsmeAuthUrlResult {
  url: string;
  state: string;
  nonce: string;
  codeVerifier: string;
}

export interface ItsmeVerifyResult {
  success: boolean;
  claims?: ItsmeUserClaims;
  error?: string;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * ITSME endpoint URLs per environment
 */
const ITSME_ENDPOINTS = {
  e2e: {
    issuer: 'https://e2e.itsme.services/v2',
    authorization: 'https://e2e.itsme.services/v2/authorization',
    token: 'https://e2e.itsme.services/v2/token',
    userinfo: 'https://e2e.itsme.services/v2/userinfo',
    jwks: 'https://e2e.itsme.services/v2/.well-known/jwks.json',
  },
  production: {
    issuer: 'https://itsme.services/v2',
    authorization: 'https://itsme.services/v2/authorization',
    token: 'https://itsme.services/v2/token',
    userinfo: 'https://itsme.services/v2/userinfo',
    jwks: 'https://itsme.services/v2/.well-known/jwks.json',
  },
};

/**
 * Get ITSME configuration from environment variables
 */
export function getItsmeConfig(): ItsmeConfig {
  const clientId = process.env.ITSME_CLIENT_ID;
  const clientSecret = process.env.ITSME_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_ITSME_REDIRECT_URI;
  const serviceCode = process.env.ITSME_SERVICE_CODE;
  const environment = (process.env.ITSME_ENVIRONMENT || 'e2e') as 'e2e' | 'production';

  if (!clientId || !clientSecret || !redirectUri || !serviceCode) {
    throw new Error('Missing ITSME configuration. Check environment variables.');
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
    serviceCode,
    environment,
  };
}

/**
 * Get ITSME endpoints for current environment
 */
export function getItsmeEndpoints() {
  const config = getItsmeConfig();
  return ITSME_ENDPOINTS[config.environment];
}

// =============================================================================
// PKCE & STATE HELPERS
// =============================================================================

/**
 * Generate cryptographically secure random string
 */
function generateRandomString(length: number = 32): string {
  return randomBytes(length).toString('base64url');
}

/**
 * Generate PKCE code verifier (43-128 characters)
 */
export function generateCodeVerifier(): string {
  return generateRandomString(32);
}

/**
 * Generate PKCE code challenge from verifier (SHA256)
 */
export function generateCodeChallenge(verifier: string): string {
  return createHash('sha256')
    .update(verifier)
    .digest('base64url');
}

/**
 * Generate state parameter for CSRF protection
 */
export function generateState(): string {
  return generateRandomString(16);
}

/**
 * Generate nonce for replay attack protection
 */
export function generateNonce(): string {
  return generateRandomString(16);
}

// =============================================================================
// AUTHORIZATION
// =============================================================================

/**
 * Scopes for ITSME identification (KYC)
 * - openid: Required for OIDC
 * - profile: name, family_name, given_name
 * - eid: Belgian National Register Number
 * - birthdate: Date of birth
 * - address: Physical address (optional)
 */
const IDENTIFICATION_SCOPES = [
  'openid',
  'service:YOURSERVICECODE',  // Will be replaced with actual service code
  'profile',
  'eid',
  'birthdate',
];

/**
 * Generate ITSME authorization URL
 *
 * @param userId - Current user ID (stored in state for callback)
 * @param returnUrl - URL to redirect after ITSME flow completes
 */
export function generateItsmeAuthUrl(
  userId: string,
  returnUrl: string = '/settings/verification'
): ItsmeAuthUrlResult {
  const config = getItsmeConfig();
  const endpoints = getItsmeEndpoints();

  // Generate security tokens
  const state = generateState();
  const nonce = generateNonce();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Build scopes with service code
  const scopes = IDENTIFICATION_SCOPES.map(scope =>
    scope === 'service:YOURSERVICECODE'
      ? `service:${config.serviceCode}`
      : scope
  );

  // Build authorization URL
  const params = new URLSearchParams({
    client_id: config.clientId,
    response_type: 'code',
    redirect_uri: config.redirectUri,
    scope: scopes.join(' '),
    state: JSON.stringify({ state, userId, returnUrl }),
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    // ITSME-specific parameters
    claims: JSON.stringify({
      userinfo: {
        'tag:sixdots.be,2016-06:claim_nationality': null,
        'tag:sixdots.be,2016-06:claim_city_of_birth': null,
        'tag:sixdots.be,2017-05:claim_idcard_ssin': null, // NRN
      },
    }),
  });

  const url = `${endpoints.authorization}?${params.toString()}`;

  return {
    url,
    state,
    nonce,
    codeVerifier,
  };
}

// =============================================================================
// TOKEN EXCHANGE
// =============================================================================

/**
 * Exchange authorization code for tokens
 *
 * @param code - Authorization code from ITSME callback
 * @param codeVerifier - PKCE code verifier used in auth request
 */
export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string
): Promise<ItsmeTokenResponse> {
  const config = getItsmeConfig();
  const endpoints = getItsmeEndpoints();

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.redirectUri,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code_verifier: codeVerifier,
  });

  const response = await fetch(endpoints.token, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `ITSME token exchange failed: ${errorData.error_description || errorData.error || response.statusText}`
    );
  }

  return response.json();
}

// =============================================================================
// ID TOKEN VALIDATION
// =============================================================================

/**
 * Get ITSME JWKS (JSON Web Key Set) for token verification
 */
async function getItsmeJwks() {
  const endpoints = getItsmeEndpoints();
  return jose.createRemoteJWKSet(new URL(endpoints.jwks));
}

/**
 * Validate and decode ITSME ID token
 *
 * @param idToken - JWT ID token from ITSME
 * @param nonce - Nonce used in authorization request
 */
export async function validateIdToken(
  idToken: string,
  nonce: string
): Promise<ItsmeUserClaims> {
  const config = getItsmeConfig();
  const endpoints = getItsmeEndpoints();

  try {
    // Get JWKS for verification
    const jwks = await getItsmeJwks();

    // Verify and decode token
    const { payload } = await jose.jwtVerify(idToken, jwks, {
      issuer: endpoints.issuer,
      audience: config.clientId,
    });

    // Verify nonce
    if (payload.nonce !== nonce) {
      throw new Error('Nonce mismatch - possible replay attack');
    }

    // Verify token is not expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error('ID token has expired');
    }

    // Extract and return user claims
    return {
      sub: payload.sub as string,
      given_name: payload.given_name as string | undefined,
      family_name: payload.family_name as string | undefined,
      name: payload.name as string | undefined,
      birthdate: payload.birthdate as string | undefined,
      nationality: payload['tag:sixdots.be,2016-06:claim_nationality'] as string | undefined,
      gender: payload.gender as string | undefined,
      eid: payload['tag:sixdots.be,2017-05:claim_idcard_ssin'] as string | undefined,
      email: payload.email as string | undefined,
      phone_number: payload.phone_number as string | undefined,
    };
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      throw new Error('ID token has expired');
    }
    if (error instanceof jose.errors.JWTClaimValidationFailed) {
      throw new Error('ID token validation failed: ' + error.message);
    }
    throw error;
  }
}

// =============================================================================
// USERINFO ENDPOINT
// =============================================================================

/**
 * Fetch additional user claims from ITSME userinfo endpoint
 * Use this if you need claims not included in the ID token
 *
 * @param accessToken - Access token from token exchange
 */
export async function fetchUserInfo(accessToken: string): Promise<ItsmeUserClaims> {
  const endpoints = getItsmeEndpoints();

  const response = await fetch(endpoints.userinfo, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`ITSME userinfo request failed: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    sub: data.sub,
    given_name: data.given_name,
    family_name: data.family_name,
    name: data.name,
    birthdate: data.birthdate,
    nationality: data['tag:sixdots.be,2016-06:claim_nationality'],
    gender: data.gender,
    eid: data['tag:sixdots.be,2017-05:claim_idcard_ssin'],
    email: data.email,
    phone_number: data.phone_number,
    address: data.address,
  };
}

// =============================================================================
// HASH HELPERS (FOR NRN STORAGE)
// =============================================================================

/**
 * Hash National Register Number for secure storage
 * Never store the raw NRN!
 */
export function hashNationalRegisterNumber(nrn: string): string {
  // Add a salt for additional security
  const salt = process.env.ITSME_NRN_SALT || 'izzico-itsme-salt-2024';
  return createHash('sha256')
    .update(salt + nrn.replace(/[^0-9]/g, ''))
    .digest('hex');
}

// =============================================================================
// COMPLETE VERIFICATION FLOW
// =============================================================================

/**
 * Complete ITSME verification flow
 * Called from the callback route after receiving the authorization code
 *
 * @param code - Authorization code from callback
 * @param codeVerifier - PKCE code verifier (stored in session)
 * @param nonce - Nonce (stored in session)
 */
export async function completeItsmeVerification(
  code: string,
  codeVerifier: string,
  nonce: string
): Promise<ItsmeVerifyResult> {
  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, codeVerifier);

    // Validate ID token and extract claims
    const claims = await validateIdToken(tokens.id_token, nonce);

    // Optionally fetch more claims from userinfo
    // const additionalClaims = await fetchUserInfo(tokens.access_token);

    return {
      success: true,
      claims,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during ITSME verification',
    };
  }
}

// =============================================================================
// STATUS HELPERS
// =============================================================================

/**
 * Check if ITSME is properly configured
 */
export function isItsmeConfigured(): boolean {
  try {
    getItsmeConfig();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get current ITSME environment
 */
export function getItsmeEnvironment(): 'e2e' | 'production' | null {
  try {
    const config = getItsmeConfig();
    return config.environment;
  } catch {
    return null;
  }
}
