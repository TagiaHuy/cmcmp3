// services/tagService.js
import { authHeader } from '../utils/auth';
import { safeJson } from '../utils/http';
import API_BASE_URL from '../config';

/**
 * =========================
 * PUBLIC APIs (không cần login)
 * =========================
 */

// ✅ Lấy danh sách thể loại (ai cũng xem được)
export const getAllTags = async (signal) => {
  const res = await fetch(`${API_BASE_URL}/api/tags`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data; // Page<TagDTO>
};

// ✅ Lấy chi tiết thể loại theo id (ai cũng xem được)
export const getTagById = async (tagId, signal) => {
  const res = await fetch(`${API_BASE_URL}/api/tags/${tagId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
};

/**
 * =========================
 * ADMIN APIs (cần ROLE_ADMIN)
 * =========================
 */

// 🔒 Tạo thể loại (CreateTagDTO: name, description)
export const createTag = async (payload, signal) => {
  const res = await fetch(`${API_BASE_URL}/api/tags`, {
    method: 'POST',
    headers: {
      ...authHeader(), // ⚠️ chỉ ADMIN mới có token hợp lệ
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
};
