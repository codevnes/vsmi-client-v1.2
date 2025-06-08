"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, XIcon } from "lucide-react";
import useAuth from "@/hooks/useAuth";

interface PremiumPromoBannerProps {
  className?: string;
}

export function PremiumPromoBanner({ className = "" }: PremiumPromoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Check if user is premium by role (assuming premium users have a "premium" role)
  const isPremiumUser = user?.role === "premium";

  // Don't render anything if user is not authenticated or is already premium
  if (!isAuthenticated || isPremiumUser || !isVisible) {
    return null;
  }

  return (
    <div className={`relative rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-md ${className}`}>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-2 rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
        aria-label="Đóng thông báo"
      >
        <XIcon className="h-4 w-4" />
      </button>
      
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-300" />
            <h3 className="font-medium">Nâng cấp lên Premium để mở khóa tất cả tính năng!</h3>
          </div>
          <p className="text-sm text-white/90">
            Phân tích chuyên sâu, khuyến nghị real-time và nhiều tính năng độc quyền khác
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="rounded bg-white/10 px-2 py-1 text-xs font-medium text-yellow-300">
            Giảm 75%
          </div>
          <Button
            onClick={() => router.push("/premium")}
            className="bg-white text-blue-700 hover:bg-white/90"
            size="sm"
          >
            Xem gói Premium
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PremiumPromoBanner; 