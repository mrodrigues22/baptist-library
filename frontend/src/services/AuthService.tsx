const API_BASE_URL = process.env.REACT_APP_API_BASE;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface UserResponse {
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/account/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    const data = await response.json();
    
    // Store token in localStorage
    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/account/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Registration failed');
    }

    const data = await response.json();
    
    // Store token in localStorage
    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  /**
   * Logout user and clear token
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Set token in localStorage
   */
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired (basic JWT check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expiry;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current user data from localStorage
   */
  getCurrentUser(): UserResponse | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Set current user data in localStorage
   */
  setCurrentUser(user: UserResponse): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Get authorization header for API requests
   */
  getAuthHeader(): HeadersInit {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export default new AuthService();