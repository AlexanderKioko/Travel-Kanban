"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/store/useSession";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Loader } from "@/components/common/Loader";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Show message for 2 seconds before redirecting
      setShowRedirectMessage(true);
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loader while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Show redirect message if not authenticated
  if (!isAuthenticated && showRedirectMessage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Access Denied</h2>
          <p className="text-slate-600 mb-6">
            You need to be logged in to access this page. Redirecting to login...
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Go to Login Now
          </button>
        </div>
      </div>
    );
  }

  // Render app shell for authenticated users
  if (isAuthenticated) {
    return <AppShell>{children}</AppShell>;
  }

  // Fallback (shouldn't reach here)
  return null;
}