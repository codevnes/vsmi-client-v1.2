"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="w-full py-16 bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Sẵn sàng nâng cấp trải nghiệm đầu tư?
          </h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
            Tham gia cùng hàng ngàn nhà đầu tư khác đang sử dụng VSMI Premium để đưa ra quyết định đầu tư sáng suốt hơn.
            Bắt đầu với 7 ngày dùng thử miễn phí ngay hôm nay.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">
              Nâng cấp ngay hôm nay
            </Button>
          </motion.div>
          <p className="text-indigo-200 mt-4 text-sm">
            Không cần thẻ tín dụng cho gói dùng thử. Hủy bất kỳ lúc nào.
          </p>
        </motion.div>
      </div>
    </section>
  );
} 