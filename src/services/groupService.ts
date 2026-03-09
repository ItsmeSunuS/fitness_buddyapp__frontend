import api from "./api";

export const createGroup = async (data:any) => {
  const res = await api.post("/api/groups/create", data);
  return res.data;
};

export const joinGroup = async (id:string) => {
  const res = await api.post(`/api/groups/join/${id}`);
  return res.data;
};

export const getGroup = async (id:string) => {
  const res = await api.get(`/api/groups/${id}`);
  return res.data;
};

export const updateProgress = async (id:string, progress:number) => {
  const res = await api.post(`/api/groups/progress/${id}`, {
    progress
  });
  return res.data;
};
