import axios from "axios";

const httpAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true
});

export default httpAPI;
