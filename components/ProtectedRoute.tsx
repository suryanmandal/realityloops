"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated by looking for token in localStorage
    const token = localStorage.getItem("restaurantToken") || localStorage.getItem("adminToken");
    
    if (!token) {
      // User is not authenticated, redirect to login
      router.push("/restaurant/auth/login");
      return;
    }

    // If roles are specified, you could add role-based checks here
    // For now, just checking if user has a valid token
  }, [router]);

  // Show loading state while checking auth
  const token = localStorage.getItem("restaurantToken") || localStorage.getItem("adminToken");
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Redirecting to login...</div>
      </div>
    );
  }

  // Render children if user is authenticated
  return <>{children}</>;
}