// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from "react";
import { register as apiRegister, login as apiLogin, getUserMe } from "../services/authService";

const AuthContext = createContext(null);

// helper: loại bỏ tiền tố "Bearer " nếu có
const cleanToken = (t) => (t || "").replace(/^Bearer\s+/i, "").trim();

// helper: normalize "ADMIN"/"ROLE_ADMIN"
const normalizeRole = (r) => String(r || "").toUpperCase().replace(/^ROLE_/, "");

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
  const [error, setError] = useState(null);

  // Đồng bộ user từ /api/users/me khi có token
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      setError(null);
      try {
        const me = await getUserMe(token, ac.signal);
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

      const clean = cleanToken(loginData.token);

      const me = await getUserMe(clean, ac.signal);
      const userToSet = me?.user ?? me;
      if (!userToSet || Object.keys(userToSet).length === 0) {
        throw new Error("Không thể lấy thông tin người dùng sau khi đăng nhập");
      }

      setToken(clean);
      setUser(userToSet);
      localStorage.setItem("token", clean);
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

  // ✅ FIX: hasRole hiểu cả "ADMIN" và "ROLE_ADMIN", ưu tiên user.role nếu có
  const hasRole = useCallback(
    (roleName) => {
      if (!user) return false;

      const target = normalizeRole(roleName);
      const targets = new Set([target]);

      // ưu tiên role đơn nếu BE trả (ADMIN/ARTIST/USER)
      if (user.role) {
        const r = normalizeRole(user.role);
        if (targets.has(r)) return true;
      }

      const roleCandidates = [
        ...(Array.isArray(user.roles) ? user.roles : []),
        ...(Array.isArray(user.authorities) ? user.authorities : []),
        ...(Array.isArray(user.roleList) ? user.roleList : []),
      ];

      const roleStrs = roleCandidates
        .map((r) => (typeof r === "string" ? r : r?.authority || r?.name || r?.role || r?.code || ""))
        .map((s) => normalizeRole(s));

      return roleStrs.some((r) => targets.has(r));
    },
    [user]
  );

  // ✅ NEW: isAdmin rõ ràng + dựa trên hasRole
  const isAdmin = useMemo(() => {
    return !!user && hasRole("ADMIN");
  }, [user, hasRole]);

  // ✅ NEW (HƯỚNG A): check nghệ sĩ đã duyệt
  const isVerifiedArtist = useMemo(() => {
    if (!user) return false;
    const status = String(user.artistVerificationStatus || "").toUpperCase();
    return hasRole("ARTIST") && status === "APPROVED";
  }, [user, hasRole]);

  // ✅ NEW: để component khác dùng cho đúng, khỏi check lung tung
  const canCreateAlbum = useMemo(() => {
    return !!user && (isAdmin || isVerifiedArtist);
  }, [user, isAdmin, isVerifiedArtist]);

  const completeLogin = (loginData) => {
    if (!loginData?.token) throw new Error("Phản hồi đăng nhập không có token");

    const clean = cleanToken(loginData.token);
    const userToSet = loginData?.user ?? loginData;

    if (!userToSet || Object.keys(userToSet).length === 0) {
      throw new Error("Không thể lấy thông tin người dùng sau khi đăng nhập");
    }

    setToken(clean);
    setUser(userToSet);
    localStorage.setItem("token", clean);
    localStorage.setItem("user", JSON.stringify(userToSet));
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      isAuthenticated: !!token,

      hasRole,
      isAdmin,
      isVerifiedArtist,
      canCreateAlbum,

      login,
      register,
      logout,
      completeLogin,

      handleSocialLogin: (rawToken) => {
        const clean = cleanToken(rawToken);
        setToken(clean);
        localStorage.setItem("token", clean);
      },

      setUser,
    }),
    [user, token, loading, error, hasRole, isAdmin, isVerifiedArtist, canCreateAlbum]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
