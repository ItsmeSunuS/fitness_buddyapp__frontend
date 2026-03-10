import axios from "axios";

// Base API instance — point this to your Express backend
// const api = axios.create({
//   baseURL: "http://localhost:5050",
//   headers: { "Content-Type": "application/json" },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("fitness-token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;

// });

const api = axios.create({
  // baseURL: "http://localhost:5050",
   baseURL: "https://buddy-backend-8tfx.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fitness-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fitness-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally (expired token, etc.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("fitness-token");
      localStorage.removeItem("fitness-user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
