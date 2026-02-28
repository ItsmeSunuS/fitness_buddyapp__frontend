// src/services/buddyService.ts
import api from "./api";

export const getSuggestedBuddies = async () => {
  const res = await api.get("/api/users/matches");
  return res.data;
};

export const getMyBuddies = async () => {
  const res = await api.get("/api/users/my-buddies");
  return res.data;
};

export const addBuddy = async (id: string) => {
  const res = await api.post(`/api/users/add-buddy/${id}`);
  return res.data;
};