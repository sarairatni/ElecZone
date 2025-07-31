"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CustomerGuardProps {
  children: React.ReactNode;
}

export default function CustomerGuard({ children }: CustomerGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !user) {
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(user);
      if (userData.role === "ADMIN") {
        router.push("/gestion-produits");
        return;
      }
      setIsAuthorized(true);
    } catch (error) {
      router.push("/login");
      return;
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; 
  }

  return <>{children}</>;
} 