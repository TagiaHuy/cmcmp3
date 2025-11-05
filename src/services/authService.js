
import API_BASE_URL from '../config';

const API_URL = `${API_BASE_URL}/api/auth`;

/**
 * Gọi API để đăng ký người dùng mới.
 * @param {string} displayName Tên hiển thị của người dùng.
 * @param {string} email Email của người dùng.
 * @param {string} password Mật khẩu của người dùng.
 * @returns {Promise<any>} Dữ liệu trả về từ API.
 */
export const register = async (displayName, email, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ displayName, email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Đăng ký thất bại');
  }
  return response.json();
};

/**
 * Gọi API để đăng nhập.
 * @param {string} email Email của người dùng.
 * @param {string} password Mật khẩu của người dùng.
 * @returns {Promise<any>} Dữ liệu trả về từ API.
 */
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Đăng nhập thất bại');
  }
  return response.json();
};

/**
 * Gọi API để lấy thông tin người dùng hiện tại.
 * @param {string} token JWT token.
 * @returns {Promise<any>} Dữ liệu trả về từ API.
 */
export const getUserMe = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/user/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Không thể lấy thông tin người dùng');
  }
  return response.json();
};
