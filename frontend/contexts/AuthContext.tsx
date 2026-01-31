import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  username: string;
  display_name: string;
  avatar: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // 初回ロード時にトークンから復元
  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await axios.get(`${apiUrl}/api/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          // トークンが無効な場合は削除
          Cookies.remove('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [apiUrl]);

  // ログイン
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        email,
        password,
      });

      const { token, user: userData } = response.data;

      // トークンをCookieに保存（7日間有効）
      Cookies.set('token', token, { expires: 7 });

      setUser(userData);

      // ダッシュボードにリダイレクト
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.error || 'ログインに失敗しました';
      throw new Error(message);
    }
  };

  // ユーザー登録
  const register = async (email: string, username: string, password: string) => {
    try {
      const response = await axios.post(`${apiUrl}/api/auth/register`, {
        email,
        username,
        password,
      });

      const { token, user: userData } = response.data;

      // トークンをCookieに保存
      Cookies.set('token', token, { expires: 7 });

      setUser(userData);

      // ウェルカムページにリダイレクト
      router.push('/welcome');
    } catch (error: any) {
      const message = error.response?.data?.error || '登録に失敗しました';
      throw new Error(message);
    }
  };

  // ログアウト
  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// カスタムフック
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Axios インターセプター（全てのリクエストにトークン付与）
export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = Cookies.get('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // 401エラー（認証切れ）の場合はログアウト
      if (error.response?.status === 401) {
        Cookies.remove('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};
