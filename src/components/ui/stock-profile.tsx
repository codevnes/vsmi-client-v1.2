import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown,
  Info,
  BarChart3,
  DollarSign
} from "lucide-react";

interface StockProfileProps {
  symbol: string;
  price: number;
  profit: number;
  volume: number;
  pe: number;
  eps: number;
  roa: number;
  roe: number;
  stock: {
    name: string;
    exchange: string;
    industry: string;
  };
  className?: string;
}

export function StockProfile({
  symbol,
  price,
  profit,
  volume,
  pe,
  eps,
  roa,
  roe,
  stock,
  className,
}: StockProfileProps) {
  // Format numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  // Format percentage
  const formatPercent = (num: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num / 100);
  };

  const isProfitPositive = profit > 0;
  const profitColor = isProfitPositive ? "text-emerald-500" : "text-rose-500";
  const profitIcon = isProfitPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;

  return (
    <Card className={cn("w-full overflow-hidden shadow-none bg-white/80 backdrop-blur-sm", className)}>
      <CardHeader className="pb-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-primary">{symbol}</span>
            <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-sm", isProfitPositive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>
              {profitIcon}
              <span className="font-medium">{Math.abs(profit / price * 100).toFixed(2)}%</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="font-medium">{stock.exchange}</span>
            <span className="mx-1">•</span>
            <span>{stock.industry}</span>
          </div>
        </div>
        <h2 className="text-xl font-semibold tracking-tight">{stock.name}</h2>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="mb-6 flex items-end gap-3 border-b pb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Giá hiện tại</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold">{formatNumber(price)}</span>
              <span className="text-sm text-muted-foreground">VND</span>
            </div>
          </div>
          <div className={cn("flex items-center gap-1 px-3 py-1 rounded-md mb-1", profitColor)}>
            {profitIcon}
            <span className="font-medium">{isProfitPositive ? "+" : ""}{formatNumber(profit)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trading Metrics */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary mb-2">
              <BarChart3 className="h-5 w-5" />
              <h3 className="font-semibold">Thông tin giao dịch</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Khối lượng</p>
                <div className="flex flex-col">
                  <span className="text-xl font-semibold">{formatNumber(volume)}</span>
                  <span className="text-xs text-muted-foreground">Cổ phiếu</span>
                </div>
              </div>
              <div className="bg-neutral-50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">P/E</p>
                <div className="flex flex-col">
                  <span className="text-xl font-semibold">{pe.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">Giá/thu nhập</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Financial Indicators */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary mb-2">
              <DollarSign className="h-5 w-5" />
              <h3 className="font-semibold">Chỉ số tài chính</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-neutral-50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">EPS</p>
                <div className="flex flex-col">
                  <span className="text-xl font-semibold">{formatNumber(eps)}</span>
                  <span className="text-xs text-muted-foreground">VND</span>
                </div>
              </div>
              <div className="bg-neutral-50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">ROE</p>
                <div className="flex flex-col">
                  <span className="text-xl font-semibold">{formatPercent(roe)}</span>
                  <span className="text-xs text-muted-foreground">LNST/vốn CSH</span>
                </div>
              </div>
              <div className="bg-neutral-50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">ROA</p>
                <div className="flex flex-col">
                  <span className="text-xl font-semibold">{formatPercent(roa)}</span>
                  <span className="text-xs text-muted-foreground">LNST/tổng TS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 