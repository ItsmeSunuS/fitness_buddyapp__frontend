import api from "./api";

export const getProfile = async () => {
  const res = await api.get("/api/users/profile");
  return res.data;
};

export const updateProfile = async (data: any) => {
  const res = await api.put("/api/users/profile", data);
  return res.data;
};