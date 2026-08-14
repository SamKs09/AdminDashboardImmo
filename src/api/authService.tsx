import axios from "axios";

const API_URL = "${process.env.NEXT_PUBLIC_BASE_URL}/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    userId: string;
    role: string;
  };
}

export interface User {
  userId: string;
  role: string;
  [key: string]: unknown; // For any additional properties
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Replace with your actual login endpoint
      const response = await axios.post(`${API_URL}/auth/login`, credentials);

      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Authentication failed"
        );
      }
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr) as User;
    }
    return null;
  },

  getToken(): string | null {
    return localStorage.getItem("authToken");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export default authService;
