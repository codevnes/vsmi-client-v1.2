"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SparklineChart } from "../charts/SparklineChart";
import { bestStocks } from "@/data/bestStocks";
import { cn } from "@/lib/utils";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/solid";

export function BestStocks() {
  return (
    <section className="py-4 sm:py-6">
      <div className="container">
        <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center">
          <span className="w-1 h-5 bg-primary mr-2 inline-block rounded-sm"></span>
          Cổ phiếu chọn lọc
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
          {bestStocks.map((stock) => {
            const isPositive = stock.change > 0;
            const isSparklinePositive = stock.sparkline[stock.sparkline.length - 1] > stock.sparkline[0];
            const trendColor = isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500";
            const trendBgColor = isPositive ? "bg-green-50 dark:bg-green-950/40" : "bg-red-50 dark:bg-red-950/40";
            
            return (
              <Card key={stock.symbol} className="overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-sm hover:shadow transition-all duration-300 rounded-lg">
                <CardContent className="p-2 sm:p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className={cn("w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-md mr-1.5", trendBgColor)}>
                        {isPositive ? (
                          <ArrowTrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-500" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold leading-tight">{stock.symbol}</h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[80px] sm:max-w-[110px] leading-tight">{stock.name}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "text-xs font-semibold rounded-md px-1.5 py-0.5",
                      trendBgColor
                    )}>
                      <span className={trendColor}>
                        {isPositive ? "+" : ""}{stock.change}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="my-1">
                    <SparklineChart 
                      data={stock.sparkline} 
                      isPositive={isSparklinePositive} 
                      width={280}
                      height={40}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm sm:text-base font-bold">{stock.price.toLocaleString('en-US')} <span className="text-[8px] sm:text-[10px] text-muted-foreground font-normal">VND</span></p>
                    
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                      <div>
                        <span className="text-[8px] sm:text-[10px] text-muted-foreground block leading-tight">P/E</span>
                        <p className="text-[10px] sm:text-xs font-medium">{stock.pe}</p>
                      </div>
                      <div>
                        <span className="text-[8px] sm:text-[10px] text-muted-foreground block leading-tight">EPS</span>
                        <p className="text-[10px] sm:text-xs font-medium">{(stock.eps/1000).toFixed(1)}k</p>
                      </div>
                      <div>
                        <span className="text-[8px] sm:text-[10px] text-muted-foreground block leading-tight">ROE</span>
                        <p className="text-[10px] sm:text-xs font-medium">{stock.roe}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}