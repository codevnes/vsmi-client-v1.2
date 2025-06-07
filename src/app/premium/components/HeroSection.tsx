"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { containerVariants, itemVariants } from "../utils/animation";

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="flex flex-col items-center text-center space-y-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100 px-3 py-1 text-sm">
              Nâng tầm đầu tư của bạn
            </Badge>
          </motion.div>
          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-blue-900 leading-tight"
            variants={itemVariants}
          >
            Nâng cấp tài khoản <span className="text-indigo-600">Premium</span>
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-blue-700 max-w-[700px]"
            variants={itemVariants}
          >
            Truy cập toàn bộ tính năng phân tích nâng cao, khuyến nghị & dữ liệu kỹ thuật real-time
            được hỗ trợ bởi công nghệ AI tiên tiến.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button size="lg" className="mt-2 bg-indigo-600 hover:bg-indigo-700">
              Khám phá ngay
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 