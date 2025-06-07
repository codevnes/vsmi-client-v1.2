"use client";

import { motion } from "framer-motion";
import { fadeInVariants } from "../utils/animation";

export function AIBanner() {
  return (
    <section className="w-full py-12 bg-gradient-to-r from-indigo-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInVariants}
        >
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Công nghệ AI tiên tiến</h2>
            <p className="text-indigo-100">
              Hệ thống AI của VSMI được huấn luyện bởi các nhà phân tích với hơn 15 năm kinh nghiệm
              trong lĩnh vực tài chính chứng khoán. Mô hình này phân tích hàng triệu dữ liệu
              mỗi ngày để đưa ra các khuyến nghị chính xác và kịp thời.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-indigo-800 p-4 rounded-lg flex flex-col items-center text-center w-32">
              <h3 className="font-bold text-3xl">95%</h3>
              <p className="text-indigo-200 text-sm">Độ chính xác</p>
            </div>
            <div className="bg-indigo-800 p-4 rounded-lg flex flex-col items-center text-center w-32">
              <h3 className="font-bold text-3xl">10TB+</h3>
              <p className="text-indigo-200 text-sm">Dữ liệu học</p>
            </div>
            <div className="bg-indigo-800 p-4 rounded-lg flex flex-col items-center text-center w-32">
              <h3 className="font-bold text-3xl">24/7</h3>
              <p className="text-indigo-200 text-sm">Hoạt động</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 