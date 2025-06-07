"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthState, LoginRequest, RegisterRequest, User } from "@/types/auth";
import AuthService from "@/services/auth.service";
import { useRouter } from "next/navigation";

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  useEffect(() => {
    const loadUserFromStorage = () => {
      const auth = AuthService.getCurrentUser();
      
      if (auth) {
        setState({
          user: auth.user,
          token: auth.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setState({
          ...initialState,
          isLoading: false,
        });
      }
    };

    loadUserFromStorage();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      setState({ ...state, isLoading: true, error: null });
      const response = await AuthService.login(data);
      
      AuthService.setCredentials(response.user, response.token);
      
      setState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      router.push("/");
    } catch (error: any) {
      setState({
        ...state,
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setState({ ...state, isLoading: true, error: null });
      const response = await AuthService.register(data);
      
      AuthService.setCredentials(response.user, response.token);
      
      setState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      router.push("/");
    } catch (error: any) {
      setState({
        ...state,
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      router.push("/login");
    } catch (error: any) {
      setState({
        ...state,
        error: error.message,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default useAuth; 