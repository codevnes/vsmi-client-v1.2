"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bestStocks, StockData } from "@/data/bestStocks";
import { generateStocksData, CompanyData, generateMarketIndicesData } from "@/data/marketData";
import { ArrowUpIcon, ArrowDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import { Separator } from "@/components/ui/separator";

export default function SymbolsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({
    key: "symbol",
    direction: "asc"
  });
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  
  // Generate some sample stock data
  const stocksData = useMemo(() => {
    return generateStocksData(50);
  }, []);

  // Generate market indices data
  const marketIndices = useMemo(() => {
    return generateMarketIndicesData();
  }, []);

  const sectors = useMemo(() => {
    const uniqueSectors = [...new Set(stocksData.map(stock => stock.sector))];
    return ["all", ...uniqueSectors];
  }, [stocksData]);

  // Filter and sort stocks
  const filteredStocks = useMemo(() => {
    return stocksData.filter(stock => {
      const matchesSearch = 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
        stock.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSector = sectorFilter === "all" || stock.sector === sectorFilter;
      
      return matchesSearch && matchesSector;
    });
  }, [stocksData, searchTerm, sectorFilter]);

  const sortedStocks = useMemo(() => {
    const sortableStocks = [...filteredStocks];
    
    if (sortConfig.key && sortConfig.direction) {
      sortableStocks.sort((a: any, b: any) => {
        if (sortConfig.key === "change") {
          // For change, compare the last day's change percent
          const aChange = a.yearlyData[a.yearlyData.length - 1].changePercent;
          const bChange = b.yearlyData[b.yearlyData.length - 1].changePercent;
          if (aChange < bChange) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aChange > bChange) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        } else if (sortConfig.key === "price") {
          // For price, compare the last day's close price
          const aPrice = a.yearlyData[a.yearlyData.length - 1].close;
          const bPrice = b.yearlyData[b.yearlyData.length - 1].close;
          if (aPrice < bPrice) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aPrice > bPrice) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        } else {
          // For other fields, compare directly
          if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
          if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        }
      });
    }
    
    return sortableStocks;
  }, [filteredStocks, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ key, direction });
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ArrowUpIcon className="h-4 w-4 inline ml-1" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 inline ml-1" />
    );
  };

  // Function to create a simple sparkline component
  const SimpleSparkline = ({ data, color }: { data: number[], color: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <svg width="100" height="30" className="inline-block">
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 30 - ((value - min) / range) * 30;
          
          if (index === 0) {
            return (
              <path
                key="sparkline"
                d={`M ${x} ${y} ${data.slice(1).map((v, i) => {
                  const nextX = ((i + 1) / (data.length - 1)) * 100;
                  const nextY = 30 - ((v - min) / range) * 30;
                  return `L ${nextX} ${nextY}`;
                }).join(' ')}`}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
              />
            );
          }
          return null;
        })}
      </svg>
    );
  };

  // Last 7 days data for indices
  const vnIndexLast7Days = marketIndices.vnIndex.slice(-7).map(d => d.value);
  const hnxIndexLast7Days = marketIndices.hnxIndex.slice(-7).map(d => d.value);
  const upcomIndexLast7Days = marketIndices.upcomIndex.slice(-7).map(d => d.value);

  // Get latest market data
  const latestVnIndex = marketIndices.vnIndex[marketIndices.vnIndex.length - 1];
  const latestHnxIndex = marketIndices.hnxIndex[marketIndices.hnxIndex.length - 1];
  const latestUpcomIndex = marketIndices.upcomIndex[marketIndices.upcomIndex.length - 1];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Danh sách mã chứng khoán</h1>
      
      {/* Market Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>VN-Index</span>
              <Badge 
                variant={latestVnIndex.changePercent >= 0 ? "outline" : "destructive"}
                className={`font-medium ${latestVnIndex.changePercent >= 0 ? 'text-green-600 border-green-600' : ''}`}
              >
                {latestVnIndex.changePercent >= 0 ? (
                  <ArrowTrendingUpIcon className="h-3.5 w-3.5 mr-1 inline" />
                ) : (
                  <ArrowTrendingDownIcon className="h-3.5 w-3.5 mr-1 inline" />
                )}
                {latestVnIndex.changePercent.toFixed(2)}%
              </Badge>
            </CardTitle>
            <CardDescription className="flex justify-between items-center">
              <span className="text-xl font-bold">{formatNumber(latestVnIndex.value)}</span>
              <span className={latestVnIndex.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                {latestVnIndex.change >= 0 ? '+' : ''}{formatNumber(latestVnIndex.change)}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-center">
              <SimpleSparkline 
                data={vnIndexLast7Days} 
                color={latestVnIndex.changePercent >= 0 ? "#16a34a" : "#dc2626"} 
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <div>
                <span className="inline-block w-3 h-3 bg-green-600 rounded-full mr-1"></span>
                {latestVnIndex.advancers}
              </div>
              <div>
                <span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-1"></span>
                {latestVnIndex.decliners}
              </div>
              <div>
                <span className="inline-block w-3 h-3 bg-yellow-600 rounded-full mr-1"></span>
                {latestVnIndex.unchanged}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>HNX-Index</span>
              <Badge 
                variant={latestHnxIndex.changePercent >= 0 ? "outline" : "destructive"}
                className={`font-medium ${latestHnxIndex.changePercent >= 0 ? 'text-green-600 border-green-600' : ''}`}
              >
                {latestHnxIndex.changePercent >= 0 ? (
                  <ArrowTrendingUpIcon className="h-3.5 w-3.5 mr-1 inline" />
                ) : (
                  <ArrowTrendingDownIcon className="h-3.5 w-3.5 mr-1 inline" />
                )}
                {latestHnxIndex.changePercent.toFixed(2)}%
              </Badge>
            </CardTitle>
            <CardDescription className="flex justify-between items-center">
              <span className="text-xl font-bold">{formatNumber(latestHnxIndex.value)}</span>
              <span className={latestHnxIndex.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                {latestHnxIndex.change >= 0 ? '+' : ''}{formatNumber(latestHnxIndex.change)}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-center">
              <SimpleSparkline 
                data={hnxIndexLast7Days} 
                color={latestHnxIndex.changePercent >= 0 ? "#16a34a" : "#dc2626"} 
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <div>
                <span className="inline-block w-3 h-3 bg-green-600 rounded-full mr-1"></span>
                {latestHnxIndex.advancers}
              </div>
              <div>
                <span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-1"></span>
                {latestHnxIndex.decliners}
              </div>
              <div>
                <span className="inline-block w-3 h-3 bg-yellow-600 rounded-full mr-1"></span>
                {latestHnxIndex.unchanged}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>UPCOM-Index</span>
              <Badge 
                variant={latestUpcomIndex.changePercent >= 0 ? "outline" : "destructive"}
                className={`font-medium ${latestUpcomIndex.changePercent >= 0 ? 'text-green-600 border-green-600' : ''}`}
              >
                {latestUpcomIndex.changePercent >= 0 ? (
                  <ArrowTrendingUpIcon className="h-3.5 w-3.5 mr-1 inline" />
                ) : (
                  <ArrowTrendingDownIcon className="h-3.5 w-3.5 mr-1 inline" />
                )}
                {latestUpcomIndex.changePercent.toFixed(2)}%
              </Badge>
            </CardTitle>
            <CardDescription className="flex justify-between items-center">
              <span className="text-xl font-bold">{formatNumber(latestUpcomIndex.value)}</span>
              <span className={latestUpcomIndex.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                {latestUpcomIndex.change >= 0 ? '+' : ''}{formatNumber(latestUpcomIndex.change)}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-center">
              <SimpleSparkline 
                data={upcomIndexLast7Days} 
                color={latestUpcomIndex.changePercent >= 0 ? "#16a34a" : "#dc2626"} 
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <div>
                <span className="inline-block w-3 h-3 bg-green-600 rounded-full mr-1"></span>
                {latestUpcomIndex.advancers}
              </div>
              <div>
                <span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-1"></span>
                {latestUpcomIndex.decliners}
              </div>
              <div>
                <span className="inline-block w-3 h-3 bg-yellow-600 rounded-full mr-1"></span>
                {latestUpcomIndex.unchanged}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center mb-8">
        <ChartBarIcon className="h-6 w-6 text-primary mr-2" />
        <h2 className="text-2xl font-semibold">Danh mục mã chứng khoán</h2>
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="vn30">VN30</TabsTrigger>
          <TabsTrigger value="hnx30">HNX30</TabsTrigger>
          <TabsTrigger value="favorites">Yêu thích</TabsTrigger>
        </TabsList>
        
        <Card>
          <CardHeader>
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2 items-center">
                <div className="relative w-64">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Tìm kiếm mã hoặc tên..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select 
                  value={sectorFilter} 
                  onValueChange={setSectorFilter}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Nhóm ngành" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector === "all" ? "Tất cả ngành" : sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Hiển thị {sortedStocks.length} mã
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-20 cursor-pointer" onClick={() => requestSort('symbol')}>
                      Mã {getSortIcon('symbol')}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => requestSort('name')}>
                      Tên công ty {getSortIcon('name')}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => requestSort('sector')}>
                      Ngành {getSortIcon('sector')}
                    </TableHead>
                    <TableHead className="text-right cursor-pointer" onClick={() => requestSort('price')}>
                      Giá {getSortIcon('price')}
                    </TableHead>
                    <TableHead className="text-right cursor-pointer" onClick={() => requestSort('change')}>
                      Thay đổi {getSortIcon('change')}
                    </TableHead>
                    <TableHead className="text-right cursor-pointer" onClick={() => requestSort('marketCap')}>
                      Vốn hóa {getSortIcon('marketCap')}
                    </TableHead>
                    <TableHead className="text-right cursor-pointer" onClick={() => requestSort('peRatio')}>
                      P/E {getSortIcon('peRatio')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStocks.length > 0 ? (
                    sortedStocks.map((stock) => {
                      const lastData = stock.yearlyData[stock.yearlyData.length - 1];
                      const changePercent = lastData.changePercent;
                      const price = lastData.close;
                      
                      return (
                        <TableRow key={stock.symbol} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <Link href={`/ma-chung-khoan/${stock.symbol}`} className="hover:underline text-primary">
                              {stock.symbol}
                            </Link>
                          </TableCell>
                          <TableCell>{stock.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{stock.sector}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatNumber(price)}
                          </TableCell>
                          <TableCell className={`text-right font-medium ${changePercent > 0 ? 'text-green-600' : changePercent < 0 ? 'text-red-600' : ''}`}>
                            {changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-right">
                            {formatNumber(Math.round(stock.marketCap / 1000000000))} tỷ
                          </TableCell>
                          <TableCell className="text-right">
                            {stock.peRatio.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        Không tìm thấy mã chứng khoán phù hợp.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </Tabs>
      
      {/* Top Gainers and Losers Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-600 mr-2" />
              <CardTitle>Top tăng giá</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="w-20">Mã</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead className="text-right">Thay đổi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocksData
                  .sort((a, b) => {
                    const aChange = a.yearlyData[a.yearlyData.length - 1].changePercent;
                    const bChange = b.yearlyData[b.yearlyData.length - 1].changePercent;
                    return bChange - aChange;
                  })
                  .slice(0, 5)
                  .map(stock => {
                    const lastData = stock.yearlyData[stock.yearlyData.length - 1];
                    const changePercent = lastData.changePercent;
                    const price = lastData.close;
                    
                    return (
                      <TableRow key={`gain-${stock.symbol}`} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <Link href={`/ma-chung-khoan/${stock.symbol}`} className="hover:underline text-primary">
                            {stock.symbol}
                          </Link>
                        </TableCell>
                        <TableCell>{formatNumber(price)}</TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          +{changePercent.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <ArrowTrendingDownIcon className="h-5 w-5 text-red-600 mr-2" />
              <CardTitle>Top giảm giá</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="w-20">Mã</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead className="text-right">Thay đổi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocksData
                  .sort((a, b) => {
                    const aChange = a.yearlyData[a.yearlyData.length - 1].changePercent;
                    const bChange = b.yearlyData[b.yearlyData.length - 1].changePercent;
                    return aChange - bChange;
                  })
                  .slice(0, 5)
                  .map(stock => {
                    const lastData = stock.yearlyData[stock.yearlyData.length - 1];
                    const changePercent = lastData.changePercent;
                    const price = lastData.close;
                    
                    return (
                      <TableRow key={`loss-${stock.symbol}`} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <Link href={`/ma-chung-khoan/${stock.symbol}`} className="hover:underline text-primary">
                            {stock.symbol}
                          </Link>
                        </TableCell>
                        <TableCell>{formatNumber(price)}</TableCell>
                        <TableCell className="text-right font-medium text-red-600">
                          {changePercent.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
