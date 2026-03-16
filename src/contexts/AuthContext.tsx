import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminSession {
  adminId: string;
  username: string;
  expiresAt: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  adminUsername: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
  getAdminId: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session duration: 8 hours
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

// Rate limiting constants
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_KEY = 'login_attempts';

// Secure session storage key
const SESSION_KEY = 'admin_session';

// Rate limiting state interface
interface RateLimitState {
  attempts: number;
  lockoutUntil: number;
}

// Get rate limit state from storage
const getRateLimitState = (): RateLimitState => {
  try {
    const stored = sessionStorage.getItem(RATE_LIMIT_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return { attempts: 0, lockoutUntil: 0 };
};

// Save rate limit state to storage
const saveRateLimitState = (state: RateLimitState) => {
  sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
};

// Check if currently locked out
const isLockedOut = (): { locked: boolean; remainingTime: number } => {
  const state = getRateLimitState();
  if (state.lockoutUntil > Date.now()) {
    return { 
      locked: true, 
      remainingTime: Math.ceil((state.lockoutUntil - Date.now()) / 1000 / 60) 
    };
  }
  return { locked: false, remainingTime: 0 };
};

// Record a failed login attempt
const recordFailedAttempt = () => {
  const state = getRateLimitState();
  state.attempts += 1;
  
  if (state.attempts >= MAX_LOGIN_ATTEMPTS) {
    state.lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
    state.attempts = 0; // Reset attempts after lockout
  }
  
  saveRateLimitState(state);
};

// Reset rate limit on successful login
const resetRateLimit = () => {
  sessionStorage.removeItem(RATE_LIMIT_KEY);
};

// Session encoding with timestamp validation
const encodeSession = (session: AdminSession): string => {
  return btoa(JSON.stringify(session));
};

const decodeSession = (encoded: string): AdminSession | null => {
  try {
    const session = JSON.parse(atob(encoded));
    // Validate session structure
    if (session && 
        typeof session.adminId === 'string' && 
        typeof session.username === 'string' && 
        typeof session.expiresAt === 'number') {
      return session;
    }
    return null;
  } catch {
    return null;
  }
};

// Get current valid session (internal helper)
const getCurrentSession = (): AdminSession | null => {
  const encodedSession = localStorage.getItem(SESSION_KEY);
  if (!encodedSession) return null;

  const session = decodeSession(encodedSession);
  if (!session || session.expiresAt <= Date.now()) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
  return session;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user has a valid session
    const checkSession = () => {
      const session = getCurrentSession();
      if (session) {
        setIsAuthenticated(true);
        setAdminUsername(session.username);
      }
      setIsLoading(false);
    };
    
    checkSession();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Check rate limiting
    const lockout = {locked:false,remainingTime:false};
    if (lockout.locked) {
      return { 
        success: false, 
        message: `Too many failed attempts. Please try again in ${lockout.remainingTime} minutes.` 
      };
    }
    try {
      // Call the secure database function to verify credentials
      // The password is sent over HTTPS and verified server-side with bcrypt
      const { data, error } = await supabase.rpc('verify_admin_credentials', {
        p_username: username.toLowerCase().trim(),
        p_password: password
      });

      if (error) {
        recordFailedAttempt();
        if (import.meta.env.DEV) {
          console.error('Auth error:', error.message);
        }
        return { success: false, message: 'Authentication failed. Please try again.' };
      }

      // Parse the JSON response from the database function
      const result = data as unknown as { success: boolean; message: string; admin_id?: string; username?: string };

      if (result.success && result.admin_id) {
        // Reset rate limiting on successful login
        resetRateLimit();
        
        // Create secure session
        const session: AdminSession = {
          adminId: result.admin_id,
          username: result.username || username,
          expiresAt: Date.now() + SESSION_DURATION_MS
        };
        
        localStorage.setItem(SESSION_KEY, encodeSession(session));
        setIsAuthenticated(true);
        setAdminUsername(session.username);
        
        return { success: true, message: 'Login successful' };
      }

      // Invalid credentials - record failed attempt
      recordFailedAttempt();
      return { success: false, message: result.message || 'Invalid credentials' };
    } catch (err) {
      recordFailedAttempt();
      if (import.meta.env.DEV) {
        console.error('Login error:', err);
      }
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminUsername(null);
    localStorage.removeItem(SESSION_KEY);
  };

  // Get admin ID for server-side verification in API calls
  const getAdminId = useCallback((): string | null => {
    const session = getCurrentSession();
    return session?.adminId || null;
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminUsername, login, logout, isLoading, getAdminId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
