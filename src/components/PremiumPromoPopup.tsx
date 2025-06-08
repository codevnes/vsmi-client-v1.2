"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Clock, 
  Brain, 
  LineChart, 
  AlertTriangle, 
  BarChart3, 
  TrendingUp, 
  BadgeCheck,
  XIcon,
  Check
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

interface PremiumPromoPopupProps {
  delay?: number; // Delay in milliseconds before showing the popup
  showOnce?: boolean; // Whether to show the popup only once per session
}

const MotionDialogContent = motion(DialogContent);

// Animated check mark component
const AnimatedCheck = () => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 0.1
    }}
    className="rounded-full bg-green-100 p-1"
  >
    <Check className="h-3 w-3 text-green-600" />
  </motion.div>
);

export function PremiumPromoPopup({
  delay = 5000,
  showOnce = true,
}: PremiumPromoPopupProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Check if user is premium by role (assuming premium users have a "premium" role)
  const isPremiumUser = user?.role === "premium";

  useEffect(() => {
    // Don't show popup if user is not authenticated or is already premium
    if (!isAuthenticated || isPremiumUser) {
      return;
    }

    // Check if popup has been shown this session
    const hasShownPopup = sessionStorage.getItem("premium_popup_shown");
    
    // Check if popup is snoozed for 1 hour
    const snoozedUntil = localStorage.getItem("premium_popup_snoozed_until");
    const isSnoozed = snoozedUntil && Number(snoozedUntil) > Date.now();
    
    if ((showOnce && hasShownPopup) || isSnoozed) {
      return;
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      setOpen(true);
      if (showOnce) {
        sessionStorage.setItem("premium_popup_shown", "true");
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, showOnce, isAuthenticated, isPremiumUser]);

  const handleUpgrade = () => {
    setOpen(false);
    router.push("/premium");
  };
  
  const handleSnooze = () => {
    setOpen(false);
    // Set snooze for 1 hour (1 hour = 3600000 milliseconds)
    const snoozeUntil = Date.now() + 3600000;
    localStorage.setItem("premium_popup_snoozed_until", snoozeUntil.toString());
  };

  // Don't render anything if user is not authenticated or is already premium
  if (!isAuthenticated || isPremiumUser) {
    return null;
  }

  const featureItems = [
    {
      icon: <Brain className="h-5 w-5 text-blue-500" />,
      title: "Phân tích AI chuyên sâu",
      description: "Tự động phân tích dữ liệu từ nhiều nguồn",
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      title: "Dự báo xu hướng",
      description: "Dự báo biến động giá theo thời gian thực",
    },
    {
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      title: "Cảnh báo sớm",
      description: "Cảnh báo các biến động bất thường",
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-indigo-500" />,
      title: "Báo cáo độc quyền",
      description: "Phân tích độc quyền từ các chuyên gia hàng đầu",
    },
  ];

  // Animated number count for discount display
  const DiscountCounter = () => {
    return (
      <motion.div
        className="flex items-center justify-center space-x-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">
          -75%
        </div>
        <div className="flex flex-col items-start">
          <div className="line-through text-white/50 text-sm">399.000đ</div>
          <div className="text-2xl font-bold text-white">99.000đ</div>
        </div>
      </motion.div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        {open && (
          <MotionDialogContent
            className="sm:max-w-md md:max-w-lg p-0 overflow-hidden border-0 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-1 text-gray-400 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-gray-50"
            >
              <XIcon className="h-4 w-4" />
            </button>

            <div className="relative">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 overflow-hidden">
                {/* Animated shapes */}
                <motion.div 
                  className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/5"
                  animate={{ 
                    x: [0, 10, 0], 
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 5,
                    ease: "easeInOut" 
                  }}
                />
                <motion.div 
                  className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white/5"
                  animate={{ 
                    x: [0, -20, 0], 
                    y: [0, 20, 0],
                    scale: [1, 1.15, 1] 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 7,
                    ease: "easeInOut" 
                  }}
                />
              </div>
              
              {/* Premium badge and sparkles */}
              <div className="relative py-8 px-6 text-center text-white">
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                >
                  <Sparkles className="h-7 w-7 text-yellow-300" />
                </motion.div>
                
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl font-bold tracking-tight">Nâng cấp lên Premium</h2>
                  <p className="mt-1 text-sm text-white/80">Mở khóa đầy đủ tính năng cho nhà đầu tư</p>
                </motion.div>
                
                <motion.div 
                  className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <div className="inline-block px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 font-medium text-xs mb-2">
                    Ưu đãi đặc biệt
                  </div>
                  
                  <DiscountCounter />
                  
                  <div className="mt-3 text-xs flex items-center justify-center gap-1.5 text-white/70">
                    <BadgeCheck className="h-3.5 w-3.5 text-blue-300" />
                    <span>Chỉ áp dụng trong thời gian giới hạn</span>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Features grid */}
            <div className="bg-white p-6">
              <div className="grid grid-cols-2 gap-5">
                {featureItems.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="rounded-full bg-gray-50 p-1.5 shadow-sm border border-gray-100">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{feature.title}</h3>
                      <p className="text-xs text-gray-500">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                className="mt-4 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="text-sm font-medium text-gray-600 mb-1.5">Premium bao gồm:</div>
                <div className="grid grid-cols-2 gap-y-1.5">
                  {["Phân tích toàn diện", "Dự báo xu hướng", "Báo cáo độc quyền", "Cảnh báo kịp thời"].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <AnimatedCheck />
                      <span className="text-xs text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                className="mt-5 space-y-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Button
                  onClick={handleUpgrade}
                  className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 h-11 overflow-hidden group"
                >
                  <motion.span 
                    className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ 
                      repeat: Infinity, 
                      repeatType: "loop",
                      duration: 1.5,
                      ease: "linear"
                    }}
                  />
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span>Nâng cấp Premium ngay</span>
                </Button>
                
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    onClick={handleSnooze}
                    className="w-1/2 border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">Nhắc lại sau 1h</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    className="w-1/2 text-gray-500 hover:bg-gray-50"
                  >
                    <span className="text-sm">Để sau</span>
                  </Button>
                </div>
              </motion.div>
            </div>
          </MotionDialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

export default PremiumPromoPopup; 