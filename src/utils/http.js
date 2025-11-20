// src/utils/http.js
import { authHeader } from "./auth";

/**
 * Safely parses a Fetch Response body as JSON.
 * Returns null if the body is empty or parsing fails.
 * @param {Response} res The Fetch Response object.
 * @returns {Promise<any|null>}
 */
export async function safeJson(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

const http = {
    get: async (url) => {
        const response = await fetch(url, {
            method: 'GET',
            headers: authHeader()
        });
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    post: async (url, body) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...authHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    put: async (url, body) => {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                ...authHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    },
    delete: async (url) => {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: authHeader()
        });
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
};

export default http;
