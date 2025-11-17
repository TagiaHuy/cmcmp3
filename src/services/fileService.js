// src/services/fileService.js
import API_BASE_URL from '../config';
import { authHeader } from '../utils/auth';
import { safeJson } from '../utils/http';

export const uploadImage = async (file, signal) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/files/upload/image`, {
    method: 'POST',
    headers: {
      ...authHeader(), // Important for authorization
      // 'Content-Type' is automatically set by the browser for FormData
    },
    body: formData,
    signal,
  });

  const data = await safeJson(response);

  if (!response.ok) {
    const message = data?.message || `Lỗi tải ảnh lên: ${response.status}`;
    throw new Error(message);
  }

  return data; // Should return { imageUrl: "..." }
};
