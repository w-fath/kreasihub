import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: AuthUser;
}

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const verifyAuthentication = async () => {
      const token = localStorage.getItem("kreasihub_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = (await response.json()) as AuthResponse;

        if (!response.ok || !result.success || !result.data) {
          localStorage.removeItem("kreasihub_token");
          localStorage.removeItem("kreasihub_user");
          setAuthenticated(false);
          return;
        }

        localStorage.setItem("kreasihub_user", JSON.stringify(result.data));

        setUser(result.data);
        setAuthenticated(true);
      } catch (error) {
        console.error("Verify authentication error:", error);

        localStorage.removeItem("kreasihub_token");
        localStorage.removeItem("kreasihub_user");

        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuthentication();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm font-medium text-gray-500">Memeriksa sesi...</p>
      </div>
    );
  }

  if (!authenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to="/dashboard/admin" replace />;
    }

    if (user.role === "creator") {
      return <Navigate to="/dashboard/creator" replace />;
    }

    localStorage.removeItem("kreasihub_token");
    localStorage.removeItem("kreasihub_user");

    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
