// Real authentication service interacting with backend
import apiRequest from "../axiosInstance";
import { BACKEND_URL } from '../services/helpURL';

export const authService = {
  login: async (email, password) => {
    try {
      const data={email,password}
      const response = await apiRequest(`${BACKEND_URL}/api/auth/login`,'POST', data);
      return response.data;
    } catch (err) {
      throw new Error(err.message || "Failed to authenticate")
    }
  },
}
