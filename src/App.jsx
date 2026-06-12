import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";

// Helper component to guard pages from unauthenticated access
const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem("auth") === "true";
  return isAuth ? children : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Landing Path displays your brand new animated Login Page */}
        <Route path="/" element={<Login />} />

        {/* 2. Protected Inner App Views */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* 3. Fallback redirect safety layer */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}