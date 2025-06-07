"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { containerVariants, itemVariants, fadeInVariants } from "../utils/animation";
import { AIFeature } from "../types";

interface AIFeaturesProps {
  features: AIFeature[];
}

export function AIFeatures({ features }: AIFeaturesProps) {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-indigo-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInVariants}
        >
          <Badge className="mb-4 bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Công nghệ tiên tiến</Badge>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Sức mạnh AI trong tầm tay bạn</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Các công cụ AI của chúng tôi được phát triển và huấn luyện bởi đội ngũ chuyên gia phân tích 
            với nhiều năm kinh nghiệm trên thị trường chứng khoán Việt Nam
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-shadow"
              variants={itemVariants}
            >
              <div className="rounded-full bg-indigo-50 w-16 h-16 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-neutral-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 