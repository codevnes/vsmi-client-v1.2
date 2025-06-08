"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";

const marketData = [
  { name: "VN-Index", value: "1,245.68", change: "+2.45%" },
  { name: "HNX-Index", value: "235.78", change: "+1.25%" },
];

export function MarketInfoBar() {
  return (
    <div className="w-full bg-neutral-50 border-b border-neutral-100">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="h-8 flex items-center justify-between">
          {/* Market indices - desktop */}
          <div className="hidden sm:flex items-center space-x-4 text-xs">
            {marketData.map((item) => (
              <div key={item.name} className="flex items-center gap-1">
                <span className="text-neutral-600">{item.name}</span>
                <span className="font-medium">{item.value}</span>
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                  {item.change}
                </span>
              </div>
            ))}
          </div>
          
          {/* Market indices - mobile */}
          <div className="flex sm:hidden items-center text-xs">
            <div className="flex items-center gap-1">
              <span className="text-neutral-600">VN-Index</span>
              <span className="font-medium">1,245.68</span>
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                +2.45%
              </span>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="flex items-center space-x-3 text-xs">
            <Link href="/premium" className="text-blue-600 hover:text-blue-700">
              Premium
            </Link>
            <span className="hidden sm:inline text-neutral-300">|</span>
            <Link href="/support" className="text-neutral-600 hover:text-blue-600">
              Hỗ trợ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 