import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CompleteProfile from "./pages/CompleteProfile";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Buddies from "./pages/Buddies";
import Challenges from "./pages/Challenges";
import Groups from "./pages/Groups";
import GymFinder from "./pages/GymFinder";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Messages from "./pages/Messages";
import RoleRedirect from "./pages/RoleRedirect";


const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/RoleRedirect"element={<ProtectedRoute> <RoleRedirect /></ProtectedRoute>}/>
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/complete-profile" element={<CompleteProfile />} />
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
<Route path="/buddies" element={<ProtectedRoute><Buddies /></ProtectedRoute>} />
<Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
<Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
<Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
<Route path="/gym-finder" element={<ProtectedRoute><GymFinder /></ProtectedRoute>} />

<Route
  path="/admin"
  element={
    <ProtectedRoute adminOnly>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

          {/* Protected routes */}
         
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
