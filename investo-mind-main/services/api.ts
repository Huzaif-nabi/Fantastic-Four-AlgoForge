const API_BASE_URL = "http://localhost:5000/api";

export const fetchSentiment = async (ticker: string) => {
    const response = await fetch(`${API_BASE_URL}/sentiment/${ticker}`);
    return response.json();
};
