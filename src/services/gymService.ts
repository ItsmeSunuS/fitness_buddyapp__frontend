import api from "./api";

export const getNearbyGyms = async (city: string) => {
  const res = await api.get(`/api/gyms?city=${city}`);
  return res.data;
};