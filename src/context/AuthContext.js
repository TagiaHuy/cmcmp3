import React, { createContext, useState, useEffect, useContext } from 'react';
import { register as apiRegister, login as apiLogin, getUserMe } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await getUserMe(token);
          setUser(userData);
        } catch (error) {
          console.error(error);
          // Token không hợp lệ hoặc hết hạn
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    // User sẽ được fetch tự động bởi useEffect
  };

  const register = async (displayName, email, password) => {
    // API đăng ký của bạn trả về token, nên chúng ta có thể xử lý tương tự login
    const data = await apiRegister(displayName, email, password);
    // Không tự động đăng nhập sau khi đăng ký, yêu cầu người dùng đăng nhập lại
    // Hoặc có thể tự động đăng nhập nếu muốn:
    // setToken(data.token);
    // localStorage.setItem('token', data.token);
    return data; // Trả về data để thông báo cho người dùng
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
