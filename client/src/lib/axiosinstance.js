import axios from "axios";
import { getBackendBasePath } from "./backend";

const axiosInstance = axios.create({
  baseURL: getBackendBasePath(),
  withCredentials: true,
});

// Attach auth token to every request if present
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (_) {}
    }
  }
  return config;
});

export default axiosInstance;
