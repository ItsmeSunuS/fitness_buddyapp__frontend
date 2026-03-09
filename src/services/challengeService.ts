import api from "./api";

export const getChallenges = async () => {
  const res = await api.get("/api/challenges");
  return res.data;
};

export const createChallenge = async (data:any) => {
  const res = await api.post("/api/challenges/create", data);
  return res.data;
};

export const joinChallenge = async (id:string) => {
  const res = await api.post(`/api/challenges/join/${id}`);
  return res.data;
};