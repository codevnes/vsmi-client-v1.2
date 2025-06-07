"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { containerVariants, itemVariants, fadeInVariants } from "../utils/animation";
import { PremiumPlan } from "../types";

interface PricingPlansProps {
  plans: PremiumPlan[];
}

export function PricingPlans({ plans }: PricingPlansProps) {
  // Format price to VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <section className="w-full py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInVariants}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Chọn gói Premium phù hợp với bạn</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Lựa chọn gói dịch vụ phù hợp với nhu cầu của bạn và bắt đầu hành trình đầu tư thành công
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {plans.map((plan, index) => (
            <motion.div key={plan.id} variants={itemVariants} custom={index}>
              <Card 
                className={`border-2 h-full flex flex-col ${
                  plan.highlight 
                    ? "border-indigo-500 shadow-lg shadow-indigo-100 relative overflow-hidden" 
                    : "border-neutral-200 hover:border-indigo-200 transition-colors"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -right-12 top-6 bg-indigo-600 text-white py-1 px-10 transform rotate-45 text-xs font-medium">
                    Hot Deal
                  </div>
                )}
                <CardHeader className="pb-6">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                    {plan.tag && (
                      <Badge 
                        className={`${
                          plan.id === "trial" 
                            ? "bg-green-100 text-green-800 hover:bg-green-100" 
                            : "bg-indigo-100 text-indigo-800 hover:bg-indigo-100"
                        }`}
                      >
                        {plan.tag}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="pt-1">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-4">
                    {plan.originalPrice && (
                      <div className="flex items-center">
                        <span className="text-sm text-neutral-500 line-through mr-2">
                          {formatPrice(plan.originalPrice)}
                        </span>
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                          -{plan.savings}
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-neutral-900">
                        {plan.price === 0 ? "Miễn phí" : formatPrice(plan.price)}
                      </span>
                      <span className="text-sm text-neutral-500 ml-2">
                        /{plan.period}
                      </span>
                    </div>
                    {plan.pricePerMonth && plan.id !== "monthly" && (
                      <div className="text-sm text-neutral-600">
                        ~ {formatPrice(plan.pricePerMonth)}/tháng
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${
                      plan.highlight
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : ""
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 