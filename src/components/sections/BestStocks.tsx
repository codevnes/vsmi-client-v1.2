"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SparklineChart } from "../charts/SparklineChart";
import { cn } from "@/lib/utils";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/solid";
import { SelectedStock } from "@/types/selectedStocks";
import { getSelectedStocks } from "@/services/selectedStocks.service";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";

export function BestStocks() {
  const [stocks, setStocks] = useState<SelectedStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setIsLoading(true);
        const response = await getSelectedStocks({ 
          limit: 20,
          sort: 'return',
          order: 'desc'
        });
        setStocks(response.data);
      } catch (err) {
        setError("Không thể tải dữ liệu cổ phiếu. Vui lòng thử lại sau.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStocks();
  }, []);

  // Generate sparkline data from historical prices
  const getSparklineData = (stockPrices: SelectedStock['stockPrices']) => {
    // Sắp xếp theo thứ tự thời gian từ cũ đến mới để biểu đồ hiển thị đúng
    const sortedPrices = [...stockPrices].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sortedPrices.map(price => price.close);
  };

  const handleStockClick = (symbol: string) => {
    router.push(`/ma-chung-khoan/${symbol}`);
  };

  if (isLoading) {
    return (
      <section className="py-4 sm:py-6">
        <div className="container">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center">
            <span className="w-1 h-5 bg-primary mr-2 inline-block rounded-sm"></span>
            Cổ phiếu chọn lọc
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-sm rounded-lg">
                <CardContent className="p-2 sm:p-3">
                  <div className="animate-pulse flex flex-col space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-4 sm:py-6">
        <div className="container">
          <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center">
            <span className="w-1 h-5 bg-primary mr-2 inline-block rounded-sm"></span>
            Cổ phiếu chọn lọc
          </h2>
          <div className="p-4 text-center text-red-600 dark:text-red-500">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 sm:py-6">
      <div className="container">
        <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center">
          <span className="w-1 h-5 bg-primary mr-2 inline-block rounded-sm"></span>
          Cổ phiếu chọn lọc
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
          {stocks.map((stock) => {
            const isPositive = stock.return > 0;
            const sparklineData = getSparklineData(stock.stockPrices);
            const isSparklinePositive = sparklineData.length > 1 && 
              sparklineData[sparklineData.length - 1] > sparklineData[sparklineData.length - 2];
            const trendColor = isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500";
            const trendBgColor = isPositive ? "bg-green-50 dark:bg-green-950/40" : "bg-red-50 dark:bg-red-950/40";
            
            // Lấy giá đóng cửa gần nhất và cũ nhất để tính % thay đổi
            const latestPrice = stock.stockPrices[0]?.close || 0;
            const oldestPrice = stock.stockPrices[stock.stockPrices.length - 1]?.close || 0;
            const priceChange = latestPrice - oldestPrice;
            const priceChangePercent = oldestPrice ? (priceChange / oldestPrice) * 100 : 0;
            
            return (
              <Tooltip key={stock.id}>
                <TooltipTrigger asChild>
                  <Card 
                    className="overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-sm hover:shadow transition-all duration-300 rounded-lg cursor-pointer"
                    onClick={() => handleStockClick(stock.symbol)}
                  >
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
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[80px] sm:max-w-[110px] leading-tight">{stock.stockInfo.name}</p>
                          </div>
                        </div>
                        <div className={cn(
                          "text-xs font-semibold rounded-md px-1.5 py-0.5",
                          trendBgColor
                        )}>
                          <span className={trendColor}>
                            {(stock.return > 0 ? "+" : "") + stock.return.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="my-1">
                        <SparklineChart 
                          data={sparklineData} 
                          isPositive={isSparklinePositive} 
                          width={280}
                          height={40}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm sm:text-base font-bold">{stock.close.toLocaleString('en-US')} <span className="text-[8px] sm:text-[10px] text-muted-foreground font-normal">VND</span></p>
                        
                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-center">
                          <div>
                            <span className="text-[8px] sm:text-[10px] text-muted-foreground block leading-tight">Khối lượng</span>
                            <p className="text-[10px] sm:text-xs font-medium">{(stock.volume/1000).toFixed(1)}k</p>
                          </div>
                          <div>
                            <span className="text-[8px] sm:text-[10px] text-muted-foreground block leading-tight">Sàn</span>
                            <p className="text-[10px] sm:text-xs font-medium">{stock.stockInfo.exchange}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent className="p-0 overflow-hidden w-64" onClick={(e) => e.stopPropagation()}>
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-bold">{stock.symbol}</h3>
                        <p className="text-xs text-muted-foreground">{stock.stockInfo.name}</p>
                      </div>
                      <div className={cn(
                        "text-xs font-semibold rounded-md px-2 py-1",
                        trendBgColor
                      )}>
                        <span className={trendColor}>
                          {(stock.return > 0 ? "+" : "") + stock.return.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div>
                        <span className="text-muted-foreground">Giá hiện tại:</span>
                        <p className="font-medium">{stock.close.toLocaleString('en-US')} VND</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Khối lượng:</span>
                        <p className="font-medium">{stock.volume.toLocaleString('en-US')}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ngành:</span>
                        <p className="font-medium">{stock.stockInfo.industry}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sàn:</span>
                        <p className="font-medium">{stock.stockInfo.exchange}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-border pt-2 mt-1">
                      <h4 className="text-xs font-medium mb-1">Biến động giá 3 tháng gần đây</h4>
                      <div className="flex justify-between text-xs">
                        <div>
                          <span className="text-muted-foreground">Thấp nhất:</span>
                          <p className="font-medium">
                            {Math.min(...sparklineData).toLocaleString('en-US')} VND
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cao nhất:</span>
                          <p className="font-medium">
                            {Math.max(...sparklineData).toLocaleString('en-US')} VND
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Thay đổi:</span>
                          <p className={cn("font-medium", priceChange >= 0 ? "text-green-600" : "text-red-600")}>
                            {priceChangePercent >= 0 ? "+" : ""}{priceChangePercent.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {stock.stockPrices.length > 0 && (
                      <div className="border-t border-border pt-2 mt-2">
                        <h4 className="text-xs font-medium mb-1">Giá gần đây</h4>
                        <div className="space-y-1">
                          {stock.stockPrices.slice(0, 5).map((price, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className="text-muted-foreground">
                                {format(new Date(price.date), "dd/MM/yyyy", { locale: vi })}:
                              </span>
                              <span className="font-medium">{price.close.toLocaleString('en-US')} VND</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </section>
  );
}