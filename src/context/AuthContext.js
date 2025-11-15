// src/context/AuthContext.js
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import {
  register as apiRegister,
  login as apiLogin,
  getUserMe,
} from "../services/authService";

const AuthContext = createContext(null);

// Xóa tiền tố "Bearer "
const cleanToken = (t) => (t || "").replace(/^Bearer\s+/i, "").trim();

export const AuthProvider = ({ children }) => {
  // =============================
  // 🔐 TOKEN
  // =============================
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem("token");
    return saved ? cleanToken(saved) : null;
  });

  // =============================
  // 👤 USER
  // =============================
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =============================
  // 🔄 Đồng bộ user → localStorage
  // =============================
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // =============================
  // 🔄 Lấy user từ token khi reload
  // =============================
  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const me = await getUserMe(token, ac.signal);

        // BE có thể trả { user: {...} } hoặc {...}
        const userToSet = me?.user ?? me;

        if (userToSet) {
          setUser(userToSet);
        } else {
          setUser(null);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("getUserMe failed:", err);
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [token]);

  // =============================
  // 🔑 LOGIN
  // =============================
  const login = async (email, password) => {
    setError(null);
    const ac = new AbortController();

    try {
      const data = await apiLogin(email, password, ac.signal);
      if (!data?.token) throw new Error("Login response missing token");

      const rawToken = data.token;
      const cleanedToken = cleanToken(rawToken);

      // Lưu token trước
      setToken(cleanedToken);
      localStorage.setItem("token", cleanedToken);

      // Lấy thông tin user hiện tại
      const me = await getUserMe(cleanedToken, ac.signal);
      const userToSet = me?.user ?? me;

      setUser(userToSet || null);

      return { token: cleanedToken, user: userToSet };
    } catch (err) {
      console.error("Login error:", err);
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setError(err.message || "Đăng nhập thất bại");
      throw err;
    }
  };

  // =============================
  // 📝 REGISTER
  // =============================
  const register = async (displayName, email, password, otp) => {
    setError(null);
    const ac = new AbortController();

    try {
      return await apiRegister(displayName, email, password, otp, ac.signal);
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Đăng ký thất bại");
      throw err;
    }
  };

  // =============================
  // 🚪 LOGOUT
  // =============================
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // =============================
  // 🛠 Hàm tiện ích: cập nhật một phần user
  // (avatar, displayName, phoneNumber, ...)
  // =============================
  const updateUser = (partial) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  };

  // =============================
  // 👑 Tính isAdmin
  // =============================
  const isAdmin = useMemo(() => {
    if (!user) return false;

    const roleSource = [
      ...(user.roles || []),
      ...(user.authorities || []),
      ...(user.roleList || []),
    ];

    const roleStrings = roleSource
      .map((r) =>
        typeof r === "string"
          ? r
          : r?.authority || r?.name || r?.role || r?.code || ""
      )
      .map((s) => String(s).toUpperCase());

    if (roleStrings.some((s) => s.includes("ADMIN"))) return true;

    if ((user.username || "").toLowerCase().startsWith("admin")) return true;

    return user.isAdmin === true;
  }, [user]);

  // =============================
  // 📦 Giá trị context
  // =============================
  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      isAuthenticated: !!token,
      isAdmin,

      // actions
      login,
      register,
      logout,

      // Social login (nếu dùng)
      handleSocialLogin: async (rawToken) => {
        const cleanedToken = cleanToken(rawToken);
        setToken(cleanedToken);
        localStorage.setItem("token", cleanedToken);

        try {
          const me = await getUserMe(cleanedToken);
          const userToSet = me?.user ?? me;
          if (userToSet) setUser(userToSet);
        } catch (e) {
          console.error("Social login getUserMe failed:", e);
        }
      },

      // Cập nhật từng phần user
      updateUser,

      // Giữ lại setUser để các chỗ khác (ProfilePage, v.v.) vẫn dùng được
      setUser,
    }),
    [user, token, loading, error, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
