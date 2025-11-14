import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Parse JWT token to extract user information
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

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
      
      // Extract roles from token - try both formats
      let roles: string[] = [];
      const roleData = decoded['role'] || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      if (roleData) {
        roles = Array.isArray(roleData) ? roleData : [roleData];
      }
      
      setUser({
          email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
          firstName: decoded.given_name || '',
          lastName: decoded.family_name || '',
          roles: roles,
        });
        setIsLoggedIn(true);
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const decoded = parseJwt(token);
    if (decoded) {
            let roles: string[] = [];
      const roleData = decoded['role'] || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      if (roleData) {
        roles = Array.isArray(roleData) ? roleData : [roleData];
      }
      
      setUser({
        email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
        firstName: decoded.given_name || '',
        lastName: decoded.family_name || '',
        roles: roles,
      });
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
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
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};
