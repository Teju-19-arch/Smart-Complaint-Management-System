import axios from "axios";

// Dev:  set REACT_APP_API_URL in frontend/.env (see .env.example), defaults to http://localhost:5000
// Prod: set REACT_APP_API_URL to your deployed backend URL in the Vercel project settings
const API = (
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5000")
).replace(/\/+$/, "");

if (!API && process.env.NODE_ENV === "production") {
  console.error("REACT_APP_API_URL is not set - API calls will fail.");
}

const TOKEN_KEY = "campus_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Attach the JWT to every request when logged in
axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token && String(config.url).startsWith(API)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------- Auth ---------- */

export const registerUser = (data) => axios.post(`${API}/api/auth/register`, data);

export const loginUser = (data) => axios.post(`${API}/api/auth/login`, data);

export const getMe = () => axios.get(`${API}/api/auth/me`);

// Turns an axios error into a readable message
export const errorMessage = (err) =>
  err?.response?.data?.message ||
  (err?.request ? "Cannot reach the server. Please try again." : "Something went wrong.");

/* ---------- Complaints (backend routes) ---------- */

export const submitComplaint = async (formData) => {

  return axios.post(`${API}/api/complaints/add`, formData, {

    headers: {
      "Content-Type": "multipart/form-data"
    }

  });

};

export const getComplaints = async () => {

  return axios.get(`${API}/api/complaints`);

};

export const updateStatus = async (id) => {

  return axios.put(`${API}/api/complaints/resolve/${id}`);

};
