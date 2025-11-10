// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import {
  register as apiRegister,
  login as apiLogin,
  getUserMe,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Đọc token và user từ localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Khi token thay đổi -> fetch /api/user/me để xác thực và cập nhật
  useEffect(() => {
    const ac = new AbortController();

    const run = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      // Không cần setLoading(true) ở đây nữa để tránh màn hình trắng
      // Nếu cần có thể set ở đầu hàm, nhưng sẽ gây "nháy"
      setError(null);

      try {
        const me = await getUserMe(token, ac.signal);
        const userToSet = me?.user ?? me;

        // Chỉ cập nhật nếu BE trả về một object user có nội dung
        if (userToSet && Object.keys(userToSet).length > 0) {
          setUser(userToSet);
          localStorage.setItem("user", JSON.stringify(userToSet));
        }
        // Nếu BE trả về rỗng hoặc không hợp lệ, không làm gì cả,
        // giữ lại user từ localStorage để không bị "nháy" UI.
      } catch (e) {
        // Bỏ qua lỗi AbortError do StrictMode gây ra trong môi trường dev
        if (e.name === 'AbortError') {
          console.warn('[Auth] Fetch to getUserMe was aborted. This is expected in StrictMode.');
          return;
        }

        // Chỉ xóa khi có lỗi thực sự (vd: token hết hạn -> 401)
        console.error("[Auth] getUserMe failed, logging out:", e);
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setError(e?.message || "Phiên đăng nhập đã hết hạn");
      } finally {
        setLoading(false); // Luôn tắt loading ở cuối
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
      // 1. Lấy token
      const loginData = await apiLogin(email, password, ac.signal);
      if (!loginData?.token) throw new Error("Phản hồi đăng nhập không có token");
      const { token } = loginData;

      // 2. Dùng token để lấy thông tin user ngay lập tức
      const me = await getUserMe(token, ac.signal);
      const userToSet = me?.user ?? me;

      if (!userToSet || Object.keys(userToSet).length === 0) {
        throw new Error("Không thể lấy thông tin người dùng sau khi đăng nhập");
      }

      // 3. Cập nhật state
      setToken(token);
      setUser(userToSet);

      // 4. Lưu vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userToSet));

      return { token, user: userToSet };
    } catch (e) {
      // Dọn dẹp nếu có lỗi ở bất kỳ bước nào
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setError(e?.message || "Đăng nhập thất bại");
      throw e;
    }
  };

  // Đăng ký
  const register = async (displayName, email, password) => {
    setError(null);
    const ac = new AbortController();
    try {
      return await apiRegister(displayName, email, password, ac.signal);
    } catch (e) {
      setError(e?.message || "Đăng ký thất bại");
      throw e;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Dọn dẹp user
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
        // Note: Social login might need to fetch user data separately
      },
      setUser,
    }),
    [user, token, loading, error]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
