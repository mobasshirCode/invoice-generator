import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.PROD 
    ? "/api" // when deployed on Vercel
    : "http://localhost:5000/api", // when running locally
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
