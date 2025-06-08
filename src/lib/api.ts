import AuthService from "@/services/auth.service";
import { API_BASE_URL } from "@/config/api";

const API_URL = `${API_BASE_URL}/api`;

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
  withAuth?: boolean;
}

export const api = async <T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  const {
    method = "GET",
    body,
    headers = {},
    withAuth = true,
  } = options;

  // Get authentication token if withAuth is true
  let authHeaders = {};
  if (withAuth) {
    const auth = AuthService.getCurrentUser();
    if (auth?.token) {
      authHeaders = {
        Authorization: `Bearer ${auth.token}`,
      };
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || "Đã xảy ra lỗi";
    
    if (response.status === 401) {
      // Handle unauthorized - clear auth data
      AuthService.logout();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
};

export default api; 