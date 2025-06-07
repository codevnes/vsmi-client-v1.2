"use client";

import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../utils/animation";
import { PremiumBenefit } from "../types";

interface BenefitsSectionProps {
  benefits: PremiumBenefit[];
}

export function BenefitsSection({ benefits }: BenefitsSectionProps) {
  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Lợi ích khi nâng cấp Premium
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index} 
              className="flex space-x-4 p-4 rounded-lg border border-neutral-200 hover:border-indigo-200 hover:shadow-sm transition-all"
              variants={itemVariants}
            >
              <div className="flex-shrink-0 mt-1">
                {benefit.icon}
              </div>
              <div>
                <h3 className="font-medium text-lg">{benefit.title}</h3>
                <p className="text-neutral-600 mt-1">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 