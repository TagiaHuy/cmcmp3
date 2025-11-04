const API_BASE_URL = 'http://localhost:8080'; // Assuming your backend runs on port 3001

export const getAllSongs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/songs`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
};
