// Real link service with actual backend interaction

import apiRequest from "../axiosInstance";
import {BACKEND_URL} from "./helpURL";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // Or however you are storing the token
  if (token) {
    return {
      'Authorization': `Bearer ${token}`, // Ensure it follows the format 'Bearer <token>'
      'Content-Type': 'application/json',
    };
  }
  return {}; // Empty object if no token exists
};

export const linkService = {
  getLinks: async () => {
    try {
      const response = await apiRequest(`${BACKEND_URL}/api/dashboard/links`,'GET', {},getAuthHeaders());
      return response.data;
    } catch (err) {
      throw new Error(err.message || "Failed to authenticate")
    }
  },

  resolveLink: async (shortCode) => {
    try {
      const response = await apiRequest(`${BACKEND_URL}/${shortCode}`,'GET');
      console.log(shortCode)
      console.log(response)
      return response.data;
    } catch (err) {
      throw new Error(err.message || "Failed to authenticate")
    }
  },

  createLink:async(data)=>{
    try {
      const response = await apiRequest(`${BACKEND_URL}/api/shorten`,'POST', data, getAuthHeaders());
      return response;
    } catch (err) {
      throw new Error(err.message || "Failed to authenticate")
    }
  },
  getClickData :async (linkId) => {
    const response = await axios.get(`${BASE_URL}/chart/clicks?linkId=${linkId}`, {headers: getAuthHeaders()
    });
    return response.data;
  },
  
  getDeviceData : async (linkId) => {
    const response = await axios.get(`${BASE_URL}/chart/devices?linkId=${linkId}`, {headers:getAuthHeaders()
    });
    return response.data;
  }
}
