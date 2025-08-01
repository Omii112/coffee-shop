import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isAdmin: boolean;
  rewardPoints: number;
  memberSince: Date;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    is_admin: boolean;
    reward_points: number;
    member_since: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>;
  register: (userData: Omit<User, 'id' | 'isAdmin' | 'rewardPoints' | 'memberSince'> & { password: string; password_confirmation: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  addRewardPoints: (points: number) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = apiService.getToken();
    if (token) {
      loadCurrentUser();
    }
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await apiService.getCurrentUser() as any;
      setUser({
        id: userData.id.toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        isAdmin: userData.is_admin,
        rewardPoints: userData.reward_points,
        memberSince: new Date(userData.member_since)
      });
    } catch (error) {
      console.error('Failed to load user:', error);
      apiService.clearToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
    try {
      const response = await apiService.login(email, password) as AuthResponse;
      apiService.setToken(response.token);
      
      const userData = {
        id: response.user.id.toString(),
        name: response.user.name,
        email: response.user.email,
        phone: response.user.phone,
        address: response.user.address,
        isAdmin: response.user.is_admin,
        rewardPoints: response.user.reward_points,
        memberSince: new Date(response.user.member_since)
      };
      
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false };
    }
  };

  const register = async (userData: Omit<User, 'id' | 'isAdmin' | 'rewardPoints' | 'memberSince'> & { password: string; password_confirmation: string }): Promise<boolean> => {
    try {
      const response = await apiService.register({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        password: userData.password,
        password_confirmation: userData.password_confirmation
      }) as AuthResponse;
      
      apiService.setToken(response.token);
      
      setUser({
        id: response.user.id.toString(),
        name: response.user.name,
        email: response.user.email,
        phone: response.user.phone,
        address: response.user.address,
        isAdmin: response.user.is_admin,
        rewardPoints: response.user.reward_points,
        memberSince: new Date(response.user.member_since)
      });
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    apiService.clearToken();
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await apiService.updateUser({
        name: userData.name,
        phone: userData.phone,
        address: userData.address
      });
      
      setUser(prev => prev ? {
        ...prev,
        name: response.name,
        phone: response.phone,
        address: response.address
      } : null);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const addRewardPoints = async (points: number) => {
    try {
      const response = await apiService.addRewardPoints(points);
      setUser(prev => prev ? {
        ...prev,
        rewardPoints: response.reward_points
      } : null);
    } catch (error) {
      console.error('Failed to add reward points:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      addRewardPoints,
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin || false
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};