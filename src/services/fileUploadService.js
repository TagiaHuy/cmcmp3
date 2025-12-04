import API_BASE_URL from "../config";
import { safeJson } from "../utils/http";
import { authHeader } from "../utils/auth";

export async function uploadFile(token, file) {
    const formData = new FormData();
    formData.append('file', file); // Assuming the backend expects 'file' as the field name

    const res = await fetch(`${API_BASE_URL}/api/files/upload`, { // Using the suggested endpoint
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type header here for FormData. The browser sets it automatically with the correct boundary.
      },
      body: formData,
    });
  
    if (!res.ok) {
      const data = await safeJson(res);
      const msg = data?.message || data?.error || `HTTP ${res.status}`;
      throw new Error(msg);
    }
  
    return await safeJson(res); // Assuming the response contains the URL of the uploaded file
}
