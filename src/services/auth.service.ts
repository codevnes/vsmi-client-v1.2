import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030/api";

export const AuthService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to login");
    }

    return response.json();
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to register");
    }

    return response.json();
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  },

  getCurrentUser: (): { user: any; token: string } | null => {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("auth_token");
    const userString = localStorage.getItem("auth_user");

    if (!token || !userString) return null;

    try {
      const user = JSON.parse(userString);
      return { user, token };
    } catch (error) {
      return null;
    }
  },

  setCredentials: (user: any, token: string): void => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
  },
};

export default AuthService; 