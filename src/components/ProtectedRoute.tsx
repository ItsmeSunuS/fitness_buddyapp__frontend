import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {  useLocation } from "react-router-dom";



interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
//   const { isAuthenticated, isAdmin, user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-background">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//       </div>
//     );
//   }

//   if (!isAuthenticated) return <Navigate to="/login" replace />;
//   if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;

//   // Redirect to profile completion if not completed (except when already on that page)
//   if (user && !user.profileCompleted) {
//     return <Navigate to="/complete-profile" replace />;
//   }

//   return <>{children}</>;
// };

// const ProtectedRoute = ({ children, adminOnly = false }) => {
//   const { isAuthenticated, isAdmin, user } = useAuth();
//   const location = useLocation();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (adminOnly && !isAdmin) {
//     return <Navigate to="/AdminDashboard" replace />;
//   }

//   // Only redirect if NOT already on complete-profile
//   if (
//     user &&
//     !user.profileCompleted &&
//     location.pathname !== "/complete-profile"
//   ) {
//     return <Navigate to="/complete-profile" replace />;
//   }

//   return <>{children}</>;
// };
// export default ProtectedRoute;



const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const location = useLocation();

  // Not logged in
if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}

// Admin-only protection
if (adminOnly && !isAdmin) {
  return <Navigate to="/dashboard" replace />;
}

// Profile completion for normal users only
if (
  !isAdmin &&
  user &&
  !user.profileCompleted &&
  location.pathname !== "/complete-profile"
) {
  return <Navigate to="/complete-profile" replace />;
}

// Prevent admin accessing normal dashboard
if (isAdmin && location.pathname === "/dashboard") {
  return <Navigate to="/admin" replace />;
}
return <>{children}</>;
};
 export default ProtectedRoute;
