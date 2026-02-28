import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/services/api";

export interface User {
  id: string; // Supabase uses id (not _id)
  name: string;
  email: string;
  role: "user" | "admin";
  profileCompleted: boolean;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  targetWeight?: number;
  location?: string;
  fitnessGoals?: string[];
  preferredWorkouts?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  //  Safe localStorage parser
  const getStoredUser = (): User | null => {
    const stored = localStorage.getItem("fitness-user");
    if (!stored || stored === "undefined") return null;

    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Corrupted user in localStorage. Clearing...");
      localStorage.removeItem("fitness-user");
      return null;
    }
  };

  //  Load saved auth on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("fitness-token");
    const savedUser = getStoredUser();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    } else {
      localStorage.removeItem("fitness-token");
      localStorage.removeItem("fitness-user");
    }

    setLoading(false);
  }, []);

  //  LOGIN
  // const login = async (email: string, password: string) => {
  //   try {
  //     const res = await api.post("/api/auth/login", { email, password });

  //     const { token: newToken, user: newUser } = res.data;

  //     if (!newToken || !newUser) {
  //       throw new Error("Invalid login response");
  //     }

  //     setToken(newToken);
  //     setUser(newUser);

  //     localStorage.setItem("fitness-token", newToken);
  //     localStorage.setItem("fitness-user", JSON.stringify(newUser));
  //   } catch (error: any) {
  //     throw new Error(error.response?.data?.message || "Login failed");
  //   }
  // };

  //Login 
  const login = async (email: string, password: string) => {
  const res = await api.post("/api/auth/login", { email, password });

  const { token, user } = res.data;

  const formattedUser = {
    ...user,
    profileCompleted: user.profile_completed ?? user.profileCompleted,
  };
//console.log("Logged in user:", user);
  setToken(token);
  setUser(formattedUser);

  localStorage.setItem("fitness-token", token);
  localStorage.setItem("fitness-user", JSON.stringify(formattedUser));
};

  // REGISTER
//   const register = async (name: string, email: string, password: string) => {
//     try {
//       const res = await api.post("/api/auth/register", { name, email, password });

//       const { token: newToken, user: newUser } = res.data;

//       if (!newToken || !newUser) {
//         throw new Error("Invalid registration response");
//       }

//       setToken(newToken);
//       setUser(newUser);

//       localStorage.setItem("fitness-token", newToken);
//       localStorage.setItem("fitness-user", JSON.stringify(newUser));
//     } catch (error: any) {
//   throw new Error(
//     error.response?.data?.message ||
//     error.response?.data?.error ||
//     "Registrationn failed"
//   );
// }
//   };

//  const register = async (name: string, email: string, password: string) => {
//   try {
//     const res = await api.post("/api/auth/register", {
//       name,
//       email,
//       password,
//     });

//     const { token, user } = res.data;

//     if (!token || !user) {
//       throw new Error("Invalid registration response");
//     }

//     setToken(token);
//     setUser(user);

//     localStorage.setItem("fitness-token", token);
//     localStorage.setItem("fitness-user", JSON.stringify(user));

//   } catch (error: any) {
//     console.error("Registration error:", error);
//     throw new Error(
//       error?.response?.data?.error || "Registration failed"
//     );
//   }
// };
const register = async (name: string, email: string, password: string) => {
  try {
    const res = await api.post("/api/auth/register", {
      name,
      email,
      password,
    });

//console.log("FULL BACKEND RESPONSE:", res.data);
    const { token, user } = res.data;

    if (!token || !user) {
      throw new Error("Invalid registration response");
    }

    setToken(token);
    setUser(user);

    localStorage.setItem("fitness-token", token);
    localStorage.setItem("fitness-user", JSON.stringify(user));

  } catch (error: any) {
    console.error("Registration error:", error);
    throw new Error(
      error?.response?.data?.error || "Registration failed"
    );
  }
};

  // LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("fitness-token");
    localStorage.removeItem("fitness-user");
  };

  // UPDATE USER (safe merge)
  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updated = { ...prev, ...data };
      localStorage.setItem("fitness-user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.role === "admin",
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//  Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};