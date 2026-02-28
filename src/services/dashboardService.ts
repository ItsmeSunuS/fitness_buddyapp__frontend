// src/services/dashboardService.ts

import api from "@/services/api";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5050/api/dashboard",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDashboardSummary = async () => {
  const res = await API.get("/summary");
  return res.data;
};