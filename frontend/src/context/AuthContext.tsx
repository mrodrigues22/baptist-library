import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from '../shared/types';
import { getToken, setToken as saveToken, clearToken } from '../shared/apiUtils';

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Parse JWT token to extract user information (centralized helper)
const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

// Extract user from decoded token (centralized helper)
const extractUserFromToken = (decoded: any): AuthUser | null => {
  if (!decoded) return null;

  // Extract roles from token - try both formats
  let roles: string[] = [];
  const roleData = decoded['role'] || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  if (roleData) {
    roles = Array.isArray(roleData) ? roleData : [roleData];
  }

  return {
    email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
    firstName: decoded.given_name || '',
    lastName: decoded.family_name || '',
    roles: roles,
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user from token on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = parseJwt(token);
      const userData = extractUserFromToken(decoded);
      if (userData) {
        setUser(userData);
        setIsLoggedIn(true);
      }
    }
    setIsLoading(false);
  }, []);

  // Listen for unauthorized events from apiUtils
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  const login = (token: string) => {
    saveToken(token);
    const decoded = parseJwt(token);
    const userData = extractUserFromToken(decoded);
    if (userData) {
      setUser(userData);
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setIsLoggedIn(false);
  };

  const hasRole = (roles: string[]): boolean => {
    if (!user || !user.roles || user.roles.length === 0) {
      return false;
    }
    return roles.some((role) => user.roles.includes(role));
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};
