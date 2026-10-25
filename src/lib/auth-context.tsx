'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  workspaces?: any[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  activeWorkspace: any | null;
  setActiveWorkspace: (ws: any) => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('notion_token');
    if (savedToken) {
      setToken(savedToken);
      api
        .me()
        .then((res) => {
          setUser(res.user);
          if (res.user.workspaces && res.user.workspaces.length > 0) {
            setActiveWorkspace(res.user.workspaces[0]);
          }
        })
        .catch(() => {
          localStorage.removeItem('notion_token');
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await api.login(credentials);
      localStorage.setItem('notion_token', res.token);
      setToken(res.token);
      setUser(res.user);
      if (res.user.workspaces && res.user.workspaces.length > 0) {
        setActiveWorkspace(res.user.workspaces[0]);
      }
      router.push('/app');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await api.register(payload);
      localStorage.setItem('notion_token', res.token);
      setToken(res.token);
      setUser(res.user);
      router.push('/app');
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async () => {
    setIsLoading(true);
    try {
      const res = await api.demoLogin();
      localStorage.setItem('notion_token', res.token);
      setToken(res.token);
      setUser(res.user);
      if (res.user.workspaces && res.user.workspaces.length > 0) {
        setActiveWorkspace(res.user.workspaces[0]);
      }
      router.push('/app');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('notion_token');
    setToken(null);
    setUser(null);
    setActiveWorkspace(null);
    router.push('/login');
  };

  const refreshUser = async () => {
    try {
      const res = await api.me();
      setUser(res.user);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        activeWorkspace,
        setActiveWorkspace,
        login,
        register,
        loginAsDemo,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
