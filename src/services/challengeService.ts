import api from "./api";

export const getChallenges = async () => {
  const res = await api.get("/api/challenges");
  return res.data;
};

export const createChallenge = async (data: any) => {
  const res = await api.post("/api/challenges", data);
  return res.data;
};

export const joinChallenge = async (id: string) => {
  const res = await api.put(`/api/challenges/${id}/join`);
  return res.data;
};