// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import {
  register as apiRegister,
  login as apiLogin,
  getUserMe,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Đọc token từ localStorage (nếu không có thì null)
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);     // chặn render khi đang lấy user
  const [error, setError] = useState(null);         // lưu message lỗi (nếu cần show)

  // Khi token thay đổi -> fetch /api/user/me
  useEffect(() => {
    const ac = new AbortController();

    const run = async () => {
      setLoading(true);
      setError(null);

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const me = await getUserMe(token, ac.signal);
        // BE có thể trả { id, email, ... } hoặc { user: {...} }
        setUser(me?.user ?? me ?? null);
      } catch (e) {
        console.error("[Auth] getUserMe failed:", e);
        setUser(null);
        setToken(null);
        localStorage.removeItem("token"); // token hết hạn/không hợp lệ
        setError(e?.message || "Phiên đăng nhập đã hết hạn");
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => ac.abort();
  }, [token]);

  // Đăng nhập
  const login = async (email, password) => {
    setError(null);
    const ac = new AbortController();
    try {
      const data = await apiLogin(email, password, ac.signal);
      // data có thể là {token, user} hoặc chỉ {token}
      if (!data?.token) throw new Error("Phản hồi đăng nhập không có token");
      setToken(data.token);
      localStorage.setItem("token", data.token);

      // Nếu BE trả user kèm theo, set luôn để UI mượt hơn
      if (data.user) setUser(data.user);
      // Nếu không, effect ở trên sẽ tự gọi /me để lấy
      return data;
    } catch (e) {
      setError(e?.message || "Đăng nhập thất bại");
      throw e;
    }
  };

  // Đăng ký (không tự đăng nhập sau khi đăng ký; tùy bạn bật/tắt)
  const register = async (displayName, email, password) => {
    setError(null);
    const ac = new AbortController();
    try {
      const data = await apiRegister(displayName, email, password, ac.signal);
      // Nếu muốn tự đăng nhập sau khi đăng ký, bật 3 dòng dưới:
      // if (data?.token) {
      //   setToken(data.token);
      //   localStorage.setItem("token", data.token);
      // }
      return data;
    } catch (e) {
      setError(e?.message || "Đăng ký thất bại");
      throw e;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    setError(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      isAuthenticated: !!token,
      login,
      register,
      logout,
      handleSocialLogin: (token) => {
        setToken(token);
        localStorage.setItem("token", token);
      },
      // Optional: cho phép chỗ khác cập nhật user sau khi edit profile
      setUser,
    }),
    [user, token, loading, error]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
