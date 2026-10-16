import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:1700/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//REQUEST INTERCEPTORS

api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem("ptm-user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    console.log("API SUCCESS:", config.url, config.data);

    return config;
  },
  (error) => {
    console.error("API ERROR:", error.config || error);

    return Promise.reject(error);
  },
);

// RESPONSE INTERCEPTORS

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ptm-user");
    }
    return Promise.reject(error);
  },
);

export default api;
