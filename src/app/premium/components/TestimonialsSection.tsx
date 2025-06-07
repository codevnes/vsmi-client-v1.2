"use client";

import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../utils/animation";
import { Testimonial } from "../types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="w-full py-16 bg-indigo-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Khách hàng nói gì về chúng tôi</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Hàng ngàn nhà đầu tư đã cải thiện hiệu quả đầu tư với VSMI Premium
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm"
              variants={itemVariants}
            >
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <span className="font-medium text-indigo-700">{testimonial.initials}</span>
                </div>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-neutral-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-neutral-600">
                {testimonial.content}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 