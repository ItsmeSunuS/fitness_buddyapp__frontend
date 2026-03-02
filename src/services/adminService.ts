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



// src/services/adminService.ts

import api from "@/services/api";
import React, { useEffect, useState } from "react";

  const [users, setUsers] = useState<any[]>([]);
  const [gyms, setGyms] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [signupData, setSignupData] = useState<any[]>([]);

  // ===============================
  // FETCH FUNCTIONS
  // ===============================

  const fetchUsers = async () => {
    const res = await api.get("/api/admin/users");
    setUsers(res.data);
  };

  const fetchGyms = async () => {
    const res = await api.get("/api/admin/gyms");
    setGyms(res.data);
  };

  const fetchChallenges = async () => {
    const res = await api.get("/api/admin/challenges");
    setChallenges(res.data);
  };

  const fetchGroups = async () => {
    const res = await api.get("/api/admin/groups");
    setGroups(res.data);
  };

  const fetchActivityLogs = async () => {
    const res = await api.get("/api/admin/activity-logs");
    setActivityLogs(res.data);
  };

  const fetchSignupAnalytics = async () => {
    const res = await api.get("/api/admin/analytics/signup");
    setSignupData(res.data);
  };

  // ===============================
  // DELETE FUNCTIONS
  // ===============================

  const deleteUser = async (id: string) => {
    await api.delete(`/api/admin/users/${id}`);
    fetchUsers();
  };

  const deleteGym = async (id: string) => {
    await api.delete(`/api/admin/gyms/${id}`);
    fetchGyms();
  };

  const deleteChallenge = async (id: string) => {
    await api.delete(`/api/admin/challenges/${id}`);
    fetchChallenges();
  };

  const deleteGroup = async (id: string) => {
    await api.delete(`/api/admin/groups/${id}`);
    fetchGroups();
  };
  
  
  // import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5050/",
// });

// // Add token automatically
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("fitness-token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // ===============================
// // DASHBOARD SUMMARY
// // ===============================
// export const getAdminDashboardSummary = async () => {
//   const res = await API.get("/admin");
//   return res.data;
// };

// // ===============================
// // USERS
// // ===============================
// export const getAllUsers = async () => {
//   const res = await API.get("/api/admin/users");
//   return res.data;
// };

// export const updateUserRole = async (id: string, role: string) => {
//   const res = await API.put(`/api/admin/users/${id}/role`, { role });
//   return res.data;
// };

// export const deleteUser = async (id: string) => {
//   const res = await API.delete(`/api/admin/users/${id}`);
//   return res.data;
// };


 
