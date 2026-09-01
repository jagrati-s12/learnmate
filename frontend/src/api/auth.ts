import apiClient from './client';

export interface User {
  id: number;
  email: string;
  full_name: string;
  roll_number?: string;
  phone?: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authAPI = {
  // Register new user
  async register(data: RegisterData): Promise<User> {
    const response = await apiClient.post<User>('/auth/register', data);
    return response.data;
  },

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // FastAPI's OAuth2PasswordRequestForm expects form-data
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await apiClient.post<AuthResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Store token and user data
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Logout
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('user_data');
    if (!userData) return null;
    try {
      return JSON.parse(userData) as User;
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },
};