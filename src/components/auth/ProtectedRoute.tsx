"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Define paths that don't require authentication
const publicPaths = ["/", "/dang-nhap", "/dang-ky"];

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check if the current path is public
  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    // Only redirect if not authenticated, not on a public path, and not loading
    if (!isLoading && !isAuthenticated && !isPublicPath) {
      router.push("/dang-nhap");
    }
  }, [isAuthenticated, isLoading, router, pathname, isPublicPath]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Allow rendering for public paths regardless of authentication status
  if (!isAuthenticated && !isPublicPath) {
    return null;
  }

  return <>{children}</>;
} 