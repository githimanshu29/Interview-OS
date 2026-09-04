import api from "../utils/axios";

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/api/me");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response?.data || error.message);
    return null;
  }
};
