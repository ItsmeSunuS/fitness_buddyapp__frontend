import api from "./api";

export const getWorkouts = async () => {
  const res = await api.get("/api/workouts");
  return res.data;
};

export const createWorkout = async (data: any) => {
  const res = await api.post("/api/workouts/add", data);
  return res.data;
};