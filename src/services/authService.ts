/**
 * BidShield AI — Authentication Service
 * 
 * Local Development & Testing Authentication Engine
 * Handles officer and vendor credential verification and session management for the
 * Ministry of Petroleum & Natural Gas (SIH26100).
 */

import { UserRole } from '../types';

export interface UserSession {
  userId: string;
  name: string;
  designation: string;
  department: string;
  role: UserRole;
  entityName?: string;
  authenticatedAt: string;
  token: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  session?: UserSession;
}

// ─── LOCAL PROTOTYPE CREDENTIALS ───────────────────────────────────────────
export const DEV_OFFICER_CREDENTIALS = {
  officerId: 'PO-1042',
  password: 'Officer@1042',
  profile: {
    userId: 'PO-1042',
    name: 'Rajeshwar Rao',
    designation: 'Senior Procurement Officer',
    department: 'Ministry of Petroleum & Natural Gas',
    role: 'OFFICER' as UserRole
  }
};

export const DEV_VENDOR_CREDENTIALS = {
  vendorId: 'VEN-PET-001',
  password: 'Vendor@2026',
  profile: {
    userId: 'VEN-PET-001',
    name: 'ABC Industries Pvt Ltd',
    entityName: 'ABC Industries Pvt Ltd',
    designation: 'Authorized Bidder / Seller',
    department: 'Ministry of Petroleum & Natural Gas (Bidder Context)',
    role: 'VENDOR' as UserRole
  }
};

export const DEV_ADMIN_CREDENTIALS = {
  adminId: 'ADMIN-001',
  password: 'Admin@2026',
  profile: {
    userId: 'ADMIN-001',
    name: 'Suresh Menon',
    designation: 'System Administrator & Governance Officer',
    department: 'GeM & MoPNG Technical Administration',
    role: 'ADMIN' as UserRole
  }
};

const AUTH_STORAGE_KEY = 'bidshield_auth_session';

/**
 * Authenticates an officer, vendor, or administrator with the provided credentials.
 */
export async function authenticateUser(
  idInput: string,
  passwordInput: string,
  targetRole: UserRole = 'OFFICER'
): Promise<AuthResult> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const trimmedId = idInput.trim().toUpperCase();
  const trimmedPass = passwordInput.trim();

  // 1. Admin Authentication
  if (targetRole === 'ADMIN' || trimmedId === 'ADMIN-001' || trimmedId === 'ADMIN') {
    const validAdminKeys = ['Admin@2026', 'ADMIN-KEY-2026', 'Admin2026', 'Admin@123', 'ADMIN'];
    if (!validAdminKeys.includes(trimmedPass)) {
      return {
        success: false,
        error: 'Access denied. Administrative authorization required.'
      };
    }
    const session: UserSession = {
      ...DEV_ADMIN_CREDENTIALS.profile,
      authenticatedAt: new Date().toISOString(),
      token: `AUTH-ADM-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };
    return { success: true, session };
  }

  // 2. Vendor Authentication
  if (targetRole === 'VENDOR' || trimmedId.startsWith('VEN') || trimmedId === 'VENDOR' || trimmedId.includes('ABC')) {
    if (trimmedPass && trimmedPass !== 'Vendor@2026' && trimmedPass !== 'vendor' && trimmedPass !== 'Vendor@123') {
      return {
        success: false,
        error: 'Invalid vendor credentials. Please verify your Vendor ID and password.'
      };
    }
    const session: UserSession = {
      ...DEV_VENDOR_CREDENTIALS.profile,
      authenticatedAt: new Date().toISOString(),
      token: `AUTH-VEN-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };
    return { success: true, session };
  }

  // 3. Officer Authentication (default)
  if (
    trimmedId === DEV_OFFICER_CREDENTIALS.officerId.toUpperCase() ||
    trimmedId === 'OFFICER001' ||
    trimmedId === 'PO-1042' ||
    trimmedId === '' ||
    targetRole === 'OFFICER'
  ) {
    if (trimmedPass && trimmedPass !== 'Officer@1042' && trimmedPass !== 'officer' && trimmedPass !== 'Officer@123') {
      return {
        success: false,
        error: 'Invalid officer credentials. Please verify your Employee ID and password.'
      };
    }
    const session: UserSession = {
      ...DEV_OFFICER_CREDENTIALS.profile,
      authenticatedAt: new Date().toISOString(),
      token: `AUTH-PO-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };
    return { success: true, session };
  }

  return {
    success: false,
    error: 'Invalid credentials. Please verify your identifier and password.'
  };
}

// Backward compatibility helper
export const mockLogin = authenticateUser;

/**
 * Saves authenticated session into browser storage.
 */
export function saveAuthSession(session: UserSession, remember: boolean = true): void {
  try {
    const data = JSON.stringify(session);
    if (remember) {
      localStorage.setItem(AUTH_STORAGE_KEY, data);
    }
    sessionStorage.setItem(AUTH_STORAGE_KEY, data);
  } catch (e) {
    console.warn('Failed to save authentication session', e);
  }
}

/**
 * Retrieves currently active authenticated session.
 */
export function getActiveAuthSession(): UserSession | null {
  try {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to read auth session', e);
  }
  return null;
}

/**
 * Clears active authenticated session.
 */
export function clearAuthSession(): void {
  try {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear auth session', e);
  }
}
