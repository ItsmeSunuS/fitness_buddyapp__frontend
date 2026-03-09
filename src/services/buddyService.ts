//  src/services/buddyService.ts
 import api from "./api";


// export const getSuggestedBuddies = async () => {
//   const res = await api.get("/api/users/matches");
//   return res.data;
// };


export const getSuggestedBuddies = async () => {
  const res = await api.get("/api/users/matches");

  return res.data.map((b: any) => ({
    id: b.id,
    name: b.name,
    fitnessGoals: b.fitness_goals,
    preferredWorkouts: b.preferred_workouts,
    location: b.location,
    isBuddy: false
  }));
};
// export const getMyBuddies = async () => {
//   const res = await api.get("/api/users/my-buddies");
//   return res.data;
// };

export const getMyBuddies = async () => {
  const res = await api.get("/api/users/my-buddies");

  return res.data.map((b: any) => ({
    id: b.id,
    name: b.name,
    fitnessGoals: b.fitness_goals,
    preferredWorkouts: b.preferred_workouts,
    location: b.location,
    isBuddy: true
  }));
};

export const addBuddy = async (id: string) => {
  const res = await api.post(`/api/users/add-buddy/${id}`);
  return res.data;
};
export const removeBuddy = async (id: string) => {
  const res = await api.post(`/api/users/removeBuddy/${id}`);
  return res.data;
};


