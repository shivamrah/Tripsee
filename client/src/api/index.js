import axios from "axios";


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token from localStorage (if present) to every request
API.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem("userInfo");
      if (raw) {
        const user = JSON.parse(raw);
        if (user && user.token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (e) {
      // ignore JSON parse errors
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Global response handler for auth failures
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const msg = err.response?.data?.message || err.message;
    if (status === 401 || /token failed/i.test(msg) || /not authorized/i.test(msg)) {
      try {
        localStorage.removeItem("userInfo");
      } catch (e) { }
      // notify other tabs/components
      window.dispatchEvent(new Event("authLogout"));
      // redirect to login so user can re-authenticate
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default API;
