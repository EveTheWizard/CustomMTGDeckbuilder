import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Fake function to check if the user is authenticated
// Replace it with your actual logic (e.g., token validation or API check)
const isAuthenticated = () => {
    const token = localStorage.getItem("jwt");
    return token !== null; // Add validation logic here if needed
};

const ProtectedRoute = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;