import api from "./api";

export const getNearbyGyms = async (lat: number, lng: number) => {
  const res = await api.get(`/api/gyms?lat=${lat}&lng=${lng}`);
  return res.data;
};