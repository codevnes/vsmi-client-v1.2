'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  createChart, 
  CrosshairMode, 
  IChartApi, 
  CandlestickData, 
  LineData, 
  HistogramData,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  UTCTimestamp
} from 'lightweight-charts';
import { stockService } from '@/services/stockService';
import { StockData } from '@/types/stockData';
import { TimeRangeSelector } from './TimeRangeSelector';

// Helper function to convert date string to UTC timestamp
function parseDate(dateStr: string): UTCTimestamp {
  try {
    // Handle ISO date strings (2025-04-25T00:00:00.000Z)
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return Math.floor(new Date().getTime() / 1000) as UTCTimestamp;
    }
    return Math.floor(date.getTime() / 1000) as UTCTimestamp;
  } catch (error) {
    return Math.floor(new Date().getTime() / 1000) as UTCTimestamp;
  }
}

// Format date for display
function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  return date.getDate().toString().padStart(2, '0') + '/' + 
         (date.getMonth() + 1).toString().padStart(2, '0') + '/' + 
         date.getFullYear().toString().substr(2, 2);
}

// Helper to format dates to YYYY-MM-DD
function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Helper to get a date in the past based on the current date
function getStartDateFromTimeRange(timeRange: string): string {
  const today = new Date();
  
  switch (timeRange) {
    case '1d':
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return formatDateToISO(yesterday);
    
    case '1w':
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return formatDateToISO(oneWeekAgo);
    
    case '1m':
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return formatDateToISO(oneMonthAgo);
    
    case '3m':
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return formatDateToISO(threeMonthsAgo);
    
    case '6m':
      const sixMonthsAgo = new Date(today);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return formatDateToISO(sixMonthsAgo);
    
    case '1y':
      const oneYearAgo = new Date(today);
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return formatDateToISO(oneYearAgo);
    
    case 'all':
    default:
      return '2010-01-01'; // A sensible default for "all" data
  }
}

interface QindexChartProps {
  symbol: string;
  startDate?: string;
  endDate?: string;
}

// New time range prop type
export type TimeRangeOption = '1d' | '1w' | '1m' | '3m' | '6m' | '1y' | 'all';

// Helper to get UI label based on timeRange
function getSelectedTimeframeLabel(range: TimeRangeOption): string {
  switch (range) {
    case '1m': return '1T'; // 1M in Vietnamese (1 Tháng)
    case '1y': return '1N'; // 1Y in Vietnamese (1 Năm)
    case 'all': return '5N'; // 5Y in Vietnamese (5 Năm)
    default: return '5N';
  }
}

// Map UI timeframes to actual time ranges
function mapTimeframeToRange(timeframe: string): TimeRangeOption {
  switch (timeframe) {
    case '1M': return '1m';
    case '1Y': return '1y';
    case '5Y': return 'all';
    default: return 'all'; // Default to 'all'
  }
}

// Wrapper component with time range selection
export interface QindexChartWithTimeRangeProps {
  symbol: string;
  timeRange?: TimeRangeOption;
}

export const QindexChartWithTimeRange: React.FC<QindexChartWithTimeRangeProps> = ({
  symbol = 'VNINDEX',
  timeRange = 'all'
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeOption>(timeRange);
  
  // Calculate the start date based on the time range
  let startDate = '';
  let endDate = '';
  
  try {
    startDate = getStartDateFromTimeRange(selectedTimeRange);
    // End date is always today
    endDate = formatDateToISO(new Date());
    
    // Validate dates
    if (!startDate || !new Date(startDate).getTime()) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      startDate = formatDateToISO(oneMonthAgo);
    }
    
    if (!endDate || !new Date(endDate).getTime()) {
      endDate = formatDateToISO(new Date());
    }
  } catch (error) {
    // Fallback to default values if there's an error
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    startDate = formatDateToISO(oneMonthAgo);
    endDate = formatDateToISO(new Date());
  }
  
  // Handle timeframe change
  const handleTimeframeChange = (tf: string) => {
    setSelectedTimeRange(mapTimeframeToRange(tf));
  };
  
  return (
    <div className="w-full">
      {/* Compact header especially for mobile */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        {/* Title kept as requested but slightly more compact */}
        <h2 className="text-xl sm:text-2xl font-bold flex items-center">
          <span className="w-1 h-4 sm:w-1.5 sm:h-5 bg-primary mr-2 sm:mr-2.5 inline-block rounded-sm"></span>
          Chỉ số Qindex - {symbol}
        </h2>
        
        {/* Timeframe selector - more compact */}
        <div className="flex rounded-lg overflow-hidden border border-neutral-200 text-xs">
          {['1M', '1Y', '5Y'].map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
              className={`px-3 py-1 font-medium transition-all ${
                tf === getSelectedTimeframeLabel(selectedTimeRange).replace('T', 'M').replace('N', 'Y')
                  ? 'bg-blue-600 text-white shadow-inner'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tf === '1M' ? '1T' : tf === '1Y' ? '1N' : '5N'}
            </button>
          ))}
        </div>
      </div>

      {/* Ultra-compact update time on mobile */}
      <div className="text-xs text-gray-400 mb-4">
        Cập nhật: {new Date().toLocaleString('vi-VN', {hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'})}
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-4">
          <QindexChart
            symbol={symbol}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
    </div>
  );
};

const QindexChart: React.FC<QindexChartProps> = ({ 
  symbol = 'VNINDEX',
  startDate,
  endDate
}) => {
  const [chartData, setChartData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // References for chart containers
  const candlestickRef = useRef<HTMLDivElement>(null);
  const indicatorsRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  
  // References to chart instances
  const chartRefs = useRef<{
    candlestickChart: IChartApi | null;
    indicatorsChart: IChartApi | null;
    volumeChart: IChartApi | null;
    candlestickSeries?: any;
    trendQSeries?: any;
    fqSeries?: any;
    volumeSeries?: any;
  }>({
    candlestickChart: null,
    indicatorsChart: null,
    volumeChart: null
  });

  // Fetch data on component mount or when symbol/date range changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await stockService.fetchStockPrices({
          symbol,
          startDate,
          endDate,
          page: 1,
          limit: 99999
        });
        
        if (!response.data || response.data.length === 0) {
          setError('Không có dữ liệu cho khoảng thời gian này.');
        } else {
          setChartData(response.data);
        }
      } catch (err) {
        setError('Failed to load stock data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (symbol && startDate && endDate) {
      loadData();
    } else {
      setError('Thiếu thông tin cần thiết để hiển thị biểu đồ.');
    }
  }, [symbol, startDate, endDate]);

  // Component cleanup function
  useEffect(() => {
    return () => {
      cleanupCharts();
    };
  }, []);

  // Safe cleanup function for charts
  const cleanupCharts = () => {
    // Safe removal of chart instances with null checks
    if (chartRefs.current.candlestickChart) {
      try {
        chartRefs.current.candlestickChart.remove();
      } catch (e) {
        console.log('Error removing candlestick chart:', e);
      }
      chartRefs.current.candlestickChart = null;
    }
    
    if (chartRefs.current.indicatorsChart) {
      try {
        chartRefs.current.indicatorsChart.remove();
      } catch (e) {
        console.log('Error removing indicators chart:', e);
      }
      chartRefs.current.indicatorsChart = null;
    }
    
    if (chartRefs.current.volumeChart) {
      try {
        chartRefs.current.volumeChart.remove();
      } catch (e) {
        console.log('Error removing volume chart:', e);
      }
      chartRefs.current.volumeChart = null;
    }
  };

  // Initialize and update charts when data changes
  useEffect(() => {
    if (!candlestickRef.current || !indicatorsRef.current || !volumeRef.current) {
      return;
    }
    
    if (chartData.length === 0) {
      return;
    }

    try {
      // Clean up previous charts
      cleanupCharts();

      // Common options for all charts
      const chartOptions = {
        layout: {
          background: { color: '#fafafa' },
          textColor: '#334155',
          fontFamily: 'Inter, sans-serif',
        },
        grid: {
          vertLines: { color: 'rgba(203, 213, 225, 0.5)' },
          horzLines: { color: 'rgba(203, 213, 225, 0.5)' },
        },
        rightPriceScale: {
          borderColor: 'rgba(203, 213, 225, 0.5)',
          autoSize: false,
          width: 50,
          entireTextOnly: true,
          ticksVisible: false,
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          horzLine: {
            visible: true,
            labelVisible: true,
            color: 'rgba(71, 85, 105, 0.8)',
            labelBackgroundColor: '#e2e8f0',
          },
          vertLine: {
            visible: true,
            labelVisible: true,
            color: 'rgba(71, 85, 105, 0.8)',
            labelBackgroundColor: '#e2e8f0',
          },
        },
        // Remove TradingView logo - ensure it's completely disabled
        watermark: {
          visible: false,
          color: 'transparent',
          text: '',
        },
        attributionLogo: false,
        branding: { 
          enabled: false,
          visible: false,
        },
        hasAttributionLogo: false,
        showLogo: false,
      };

      // Sort data in ascending order by time (oldest to newest)
      const sortedData = [...chartData].sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      
      // Format data for each chart
      const candleData = sortedData.map((d): CandlestickData => {
        const time = parseDate(d.date);
        return {
          time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        };
      });

      // Filter out null/undefined values or replace them with default values
      const trendQData = sortedData
        .filter(d => d.trendQ !== null && d.trendQ !== undefined)
        .map((d): LineData => ({
          time: parseDate(d.date),
          value: d.trendQ,
        }));

      const fqData = sortedData
        .filter(d => d.fq !== null && d.fq !== undefined)
        .map((d): HistogramData => ({
          time: parseDate(d.date),
          value: d.fq,
          color: d.fq >= 0 ? '#10b981' : '#ef4444',
        }));

      const volumeData = sortedData
        .filter(d => d.volume !== null && d.volume !== undefined)
        .map((d): HistogramData => ({
          time: parseDate(d.date),
          value: d.volume,
          color: d.close >= d.open ? '#10b981' : '#ef4444',
        }));

      // Check if we have valid data
      if (candleData.length === 0) {
        console.error("No valid data for charts after formatting");
        return;
      }

      // 1. Create candlestick chart (top) - hide the time axis
      const candlestickChart = createChart(candlestickRef.current, {
        ...chartOptions,
        height: 300,
        handleScale: true,
        handleScroll: true,
        timeScale: {
          visible: false, // Hide time scale on top chart
          borderColor: 'rgba(203, 213, 225, 0.5)',
        },
        rightPriceScale: {
          ...chartOptions.rightPriceScale,
          minimumWidth: 50,
        },
      });
      chartRefs.current.candlestickChart = candlestickChart;

      // Add candlestick series
      const candlestickSeries = candlestickChart.addSeries(CandlestickSeries, {
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });
      chartRefs.current.candlestickSeries = candlestickSeries;

      // Add price line for current price
      candlestickSeries.applyOptions({
        priceLineVisible: true,
        priceLineWidth: 2,
        priceLineColor: '#3b82f6',
        lastValueVisible: false,
      });

      // 2. Create indicators chart (middle) - hide the time axis
      const indicatorsChart = createChart(indicatorsRef.current, {
        ...chartOptions,
        height: 200,
        handleScale: true,
        handleScroll: true,
        timeScale: {
          visible: false, // Hide time scale on middle chart
          borderColor: 'rgba(203, 213, 225, 0.5)',
        },
        rightPriceScale: {
          ...chartOptions.rightPriceScale,
          minimumWidth: 50,
        },
      });
      chartRefs.current.indicatorsChart = indicatorsChart;

      // Add TrendQ line series
      const trendQSeries = indicatorsChart.addSeries(LineSeries, {
        color: '#3b82f6',
        lineWidth: 2,
        priceScaleId: 'right',
        lastValueVisible: false,
      });
      chartRefs.current.trendQSeries = trendQSeries;

      // Add FQ histogram series
      const fqSeries = indicatorsChart.addSeries(HistogramSeries, {
        color: '#10b981',
        priceScaleId: 'right',
        priceFormat: {
          type: 'price',
          precision: 2,
          minMove: 0.01,
        },
        lastValueVisible: false,
      });
      chartRefs.current.fqSeries = fqSeries;

      // 3. Create volume chart (bottom) - show the time axis
      const volumeChart = createChart(volumeRef.current, {
        ...chartOptions,
        height: 150,
        handleScale: true,
        handleScroll: true,
        timeScale: {
          visible: true, // Show time scale on bottom chart only
          borderColor: 'rgba(203, 213, 225, 0.5)',
          tickMarkFormatter: (time: number) => formatDate(time),
        },
        rightPriceScale: {
          ...chartOptions.rightPriceScale,
          minimumWidth: 50,
        },
      });
      chartRefs.current.volumeChart = volumeChart;

      // Add volume series
      const volumeSeries = volumeChart.addSeries(HistogramSeries, {
        color: '#10b981',
        priceScaleId: 'right',
        priceFormat: {
          type: 'volume',
          precision: 0,
        },
        lastValueVisible: false,
      });
      chartRefs.current.volumeSeries = volumeSeries;

      // Customize volume format with compact labels
      volumeChart.priceScale('right').applyOptions({
        autoScale: true,
        scaleMargins: {
          top: 0.1, 
          bottom: 0.2,
        },
      });

      // Set data to each series
      candlestickSeries.setData(candleData);
      trendQSeries.setData(trendQData);
      fqSeries.setData(fqData);
      volumeSeries.setData(volumeData);

      // Fit content to container
      candlestickChart.timeScale().fitContent();
      indicatorsChart.timeScale().fitContent();
      volumeChart.timeScale().fitContent();

      // Create synchronized crosshair and scales
      function synchronizeCharts(charts: IChartApi[]) {
        // Handle sync for the timeScale
        const syncTimeScale = (sourceChart: IChartApi, targetCharts: IChartApi[]) => {
          sourceChart.timeScale().subscribeVisibleTimeRangeChange((timeRange) => {
            if (!timeRange) return;
            
            targetCharts.forEach(chart => {
              chart.timeScale().setVisibleRange(timeRange);
            });
          });

          // Sync scroll
          sourceChart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
            if (!range) return;
            
            targetCharts.forEach(chart => {
              chart.timeScale().setVisibleLogicalRange(range);
            });
          });
        }

        // Apply sync to all chart combinations
        for (let i = 0; i < charts.length; i++) {
          const otherCharts = charts.filter((_, index) => index !== i);
          syncTimeScale(charts[i], otherCharts);
        }
      }

      // Set up synchronization for all charts
      setTimeout(() => {
        try {
          synchronizeCharts([candlestickChart, indicatorsChart, volumeChart]);
        } catch (error) {
          console.error('Error setting up chart synchronization:', error);
        }
      }, 100);

      // Handle resize
      const handleResize = () => {
        requestAnimationFrame(() => {
          if (chartRefs.current.candlestickChart && candlestickRef.current) {
            chartRefs.current.candlestickChart.applyOptions({ width: candlestickRef.current.clientWidth });
          }
          if (chartRefs.current.indicatorsChart && indicatorsRef.current) {
            chartRefs.current.indicatorsChart.applyOptions({ width: indicatorsRef.current.clientWidth });
          }
          if (chartRefs.current.volumeChart && volumeRef.current) {
            chartRefs.current.volumeChart.applyOptions({ width: volumeRef.current.clientWidth });
          }
        });
      };

      window.addEventListener('resize', handleResize);

      // Initial sizing
      handleResize();

      // Enhanced TradingView logo hiding with CSS and DOM manipulation
      const removeTradingViewLogo = () => {
        // Target all possible logo elements with more specific selectors
        const logoSelectors = [
          '.tv-watermark',
          '[class*="watermark"]',
          '[class*="trademark"]',
          '.trading-view-brand',
          '.tv-lightweight-charts-bottom-elem',
          '[class*="tv-logo"]',
          '[class*="trading"]',
          'a[href*="tradingview.com"]',
          '.tv-chart-attribution',
          '.track-logo',
          '[class*="logo"]',
          'div[style*="z-index: 2"]',
          'div[style*="right: 5px"]',
          'div[style*="bottom: 5px"]'
        ];
        
        document.querySelectorAll(logoSelectors.join(', ')).forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.opacity = '0';
            el.style.height = '0';
            el.style.width = '0';
            el.style.position = 'absolute';
            el.style.zIndex = '-999';
            el.style.pointerEvents = 'none';
            el.style.overflow = 'hidden';
            el.style.clip = 'rect(0 0 0 0)';
            el.remove(); // Try to completely remove it
          }
        });
      };
      
      // Apply logo hiding function multiple times to catch any delayed renderings
      removeTradingViewLogo();
      setTimeout(removeTradingViewLogo, 100);
      setTimeout(removeTradingViewLogo, 500);
      setTimeout(removeTradingViewLogo, 1000);
      
      // Continuously monitor and remove logos with MutationObserver
      const observer = new MutationObserver((mutations) => {
        removeTradingViewLogo();
      });
      
      // Start observing the document with the configured parameters
      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });

      // Add CSS to hide watermark (as backup method)
      const style = document.createElement('style');
      style.innerHTML = `
        .tv-watermark, [class*="watermark"], [class*="trademark"], .trading-view-brand, .tv-lightweight-charts-bottom-elem,
        [class*="tv-logo"], [class*="trading"], a[href*="tradingview.com"], .tv-chart-attribution, .track-logo, [class*="logo"],
        div[style*="z-index: 2"][style*="right: 5px"][style*="bottom: 5px"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
          position: absolute !important;
          z-index: -999 !important;
          pointer-events: none !important;
          overflow: hidden !important;
          clip: rect(0 0 0 0) !important;
        }
        
        /* Target any canvas or element that might contain the logo */
        #trading-view-logo, #tradingview-copyright, #tv-logo-container,
        .chart-container > div:last-child, .chart-container > a:last-child {
          display: none !important;
        }
        
        /* Hide any absolutely positioned elements in the bottom right */
        div[style*="position: absolute"][style*="right:"][style*="bottom:"] {
          display: none !important;
        }
      `;
      document.head.appendChild(style);

      // Force-remove any iframe or external content that might contain the logo
      document.querySelectorAll('iframe, script[src*="tradingview"], link[href*="tradingview"]').forEach(el => {
        el.remove();
      });

      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
        observer.disconnect();
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      };
    } catch (error) {
      console.error("Error creating charts:", error);
      cleanupCharts();
      return undefined;
    }
  }, [chartData]); // Only re-create charts when chartData changes

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 bg-neutral-50 p-4 rounded-lg">
        <div className="flex justify-center items-center p-8 h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu biểu đồ...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-1 bg-neutral-50 p-4 rounded-lg">
        <div className="flex justify-center items-center p-8 h-64">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-2">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <p className="text-red-500 font-medium">{error}</p>
            <p className="mt-1 text-sm text-gray-500">Vui lòng thử lại sau hoặc chọn một khoảng thời gian khác.</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex flex-col gap-1 bg-neutral-50 p-4 rounded-lg">
        <div className="flex justify-center items-center p-8 h-64">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-2">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <p className="text-gray-700 font-medium">Không có dữ liệu</p>
            <p className="mt-1 text-sm text-gray-500">Không tìm thấy dữ liệu cho khoảng thời gian này.</p>
          </div>
        </div>
      </div>
    );
  }

  // Regular rendering with charts
  return (
    <div className="flex flex-col gap-1 bg-neutral-50 p-4 rounded-lg">
      <div className="font-medium text-sm text-gray-700 px-2 py-1">Biểu đồ giá</div>
      <div ref={candlestickRef} className="w-full bg-white h-[300px]" />
      <div className="font-medium text-sm text-gray-700 px-2 py-1">Biểu đồ chỉ báo</div>
      <div ref={indicatorsRef} className="w-full bg-white h-[200px]" />
      <div className="font-medium text-sm text-gray-700 px-2 py-1">Biểu đồ khối lượng</div>
      <div ref={volumeRef} className="w-full bg-white h-[150px]" />
      
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500 px-2">
        <div>
          {symbol}: <span className="font-medium text-gray-700">{chartData.length} dữ liệu</span>
        </div>
        <div className="flex gap-6">
          <div>TrendQ: <span className="text-blue-600 font-medium">Xu hướng thị trường</span></div>
          <div>FQ: <span className="text-green-600 font-medium">Lực cầu - bán</span></div>
        </div>
      </div>
    </div>
  );
};

export { QindexChart };
export default QindexChartWithTimeRange; 