// // import api from "./api";

// //    //USERS

// // export const getAllUsers = async () => {
// //   const res = await api.get("/api/admin/users");
// //   return res.data;
// // };

// // export const updateUserRole = async (id: string, role: string) => {
// //   const res = await api.put(`/api/admin/users/${id}/role`, { role });
// //   return res.data;
// // };

// // export const deleteUser = async (id: string) => {
// //   const res = await api.delete(`/api/admin/users/${id}`);
// //   return res.data;
// // };

// //   // ANALYTICS

// // export const getSignupAnalytics = async () => {
// //   const res = await api.get("/api/admin/analytics/signups");
// //   return res.data;
// // };

// // export const getEngagementAnalytics = async () => {
// //   const res = await api.get("/api/admin/analytics/engagement");
// //   return res.data;
// // };


// //    //ACTIVITY LOGS

// // export const getActivityLogs = async () => {
// //   const res = await api.get("/api/admin/activity-logs");
// //   return res.data;
// // };



// // src/services/adminService.ts

// import api from "@/services/api";

// // USERS
// export const getAllUsers = async () => {
//   const res = await api.get("/api/admin/users");
//   return res.data;
// };

// export const updateUserRole = async (id: string, role: string) => {
//   const res = await api.patch(`/api/admin/users/${id}`, { role });
//   return res.data;
// };

// export const deleteUser = async (id: string) => {
//   const res = await api.delete(`/api/admin/users/${id}`);
//   return res.data;
// };

// // ANALYTICS
// export const getSignupAnalytics = async () => {
//   const res = await api.get("/api/admin/analytics/signups");
//   return res.data;
// };

// export const getEngagementAnalytics = async () => {
//   const res = await api.get("/api/admin/analytics/engagement");
//   return res.data;
// };

// export const getActivityLogs = async () => {
//   const res = await api.get("/api/admin/activity-logs ");
//   return res.data;
// };

// export const getAdminDashboardSummary = async () => {
//   const res = await api.get("/dashboard-summary");
//   return res.data;
// };

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5050/api/admin",
});

// Add token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===============================
// DASHBOARD SUMMARY
// ===============================
export const getAdminDashboardSummary = async () => {
  const res = await API.get("/admin/dashboard-summary");
  return res.data;
};

// ===============================
// USERS
// ===============================
export const getAllUsers = async () => {
  const res = await API.get("/users");
  return res.data;
};

export const updateUserRole = async (id: string, role: string) => {
  const res = await API.put(`/users/${id}/role`, { role });
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await API.delete(`/users/${id}`);
  return res.data;
};

