// src/services/dashboardService.ts

import api from "@/services/api";
import axios from "axios";

// const API = axios.create({
//   // baseURL: "http://localhost:5050",
//    baseURL: "https://buddy-backend-8tfx.onrender.com",
// });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDashboardSummary = async () => {
  const res = await api.get("/api/dashboard/summary");
  return res.data;
};