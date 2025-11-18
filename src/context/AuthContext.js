// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import { register as apiRegister, login as apiLogin, getUserMe } from "../services/authService";

const AuthContext = createContext(null);

// helper: loại bỏ tiền tố "Bearer " nếu có
const cleanToken = (t) => (t || "").replace(/^Bearer\s+/i, "").trim();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem("token");
    return stored ? cleanToken(stored) : null;
  });

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  // Đồng bộ user từ /api/user/me khi có token
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      if (!token) { setLoading(false); return; }
      setError(null);
      try {
        const me = await getUserMe(token, ac.signal); // token đã sạch
        const userToSet = me?.user ?? me;
        if (userToSet && Object.keys(userToSet).length > 0) {
          setUser(userToSet);
          localStorage.setItem("user", JSON.stringify(userToSet));
        }
      } catch (e) {
        if (e.name !== "AbortError") {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setError(e?.message || "Phiên đăng nhập đã hết hạn");
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    const ac = new AbortController();
    try {
      const loginData = await apiLogin(email, password, ac.signal);
      if (!loginData?.token) throw new Error("Phản hồi đăng nhập không có token");

      const raw   = loginData.token;
      const clean = cleanToken(raw);               // ← làm sạch

      const me = await getUserMe(clean, ac.signal);
      const userToSet = me?.user ?? me;
      if (!userToSet || Object.keys(userToSet).length === 0) {
        throw new Error("Không thể lấy thông tin người dùng sau khi đăng nhập");
      }

      setToken(clean);
      setUser(userToSet);
      localStorage.setItem("token", clean);        // ← lưu token sạch
      localStorage.setItem("user", JSON.stringify(userToSet));

      return { token: clean, user: userToSet };
    } catch (e) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setError(e?.message || "Đăng nhập thất bại");
      throw e;
    }
  };

  const register = async (displayName, email, password, otp) => {
    setError(null);
    const ac = new AbortController();
    try {
      return await apiRegister(displayName, email, password, otp, ac.signal);
    } catch (e) {
      setError(e?.message || "Đăng ký thất bại");
      throw e;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setError(null);
  };

  // ==== TÍNH isAdmin MẠNH MẼ ====
  const isAdmin = useMemo(() => {
    if (!user) return false;
    const roleCandidates = [
      ...(Array.isArray(user.roles) ? user.roles : []),
      ...(Array.isArray(user.authorities) ? user.authorities : []),
      ...(Array.isArray(user.roleList) ? user.roleList : []),
    ];

    const roleStrs = roleCandidates
      .map(r => (typeof r === "string" ? r : (r?.authority || r?.name || r?.role || r?.code || "")))
      .map(s => String(s).toUpperCase());

    if (roleStrs.some(s => s.includes("ADMIN"))) return true;

    const uname = (user.username || user.email || "").toString().toLowerCase();
    if (uname.startsWith("admin")) return true;

    if (user.isAdmin === true) return true;

    return false;
  }, [user]);

  const value = useMemo(() => ({
    user, token, loading, error,
    isAuthenticated: !!token,
    isAdmin,
    login, register, logout,
    handleSocialLogin: (rawToken) => {
      const clean = cleanToken(rawToken);          // ← sạch khi social login
      setToken(clean);
      localStorage.setItem("token", clean);
    },
    setUser,
  }), [user, token, loading, error, isAdmin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
