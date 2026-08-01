import React, { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { authApi } from '../api/authApi';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      authApi.getMe()
        .then((res) => {
          const userData = res.data?.data?.user || res.data?.user || res.data;
          setUser(userData);
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (data) => {
    const accessToken = data.accessToken || data.token;
    const userData = data.user || data;
    localStorage.setItem('token', accessToken);
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axiosClient.defaults.headers.common['Authorization'];
    setToken('');
    setUser(null);
  };

  const updateUserState = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUserState, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
