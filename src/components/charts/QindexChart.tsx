'use client';

import React, { useEffect, useRef } from 'react';
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

// Helper function to convert date string to UTC timestamp
function parseDate(dateStr: string): UTCTimestamp {
  const date = new Date(dateStr);
  return Math.floor(date.getTime() / 1000) as UTCTimestamp;
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

interface ChartData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trendQ: number;
  fq: number;
}

interface QindexChartProps {
  data: ChartData[];
}

const QindexChart: React.FC<QindexChartProps> = ({ data }) => {
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
    if (!candlestickRef.current || !indicatorsRef.current || !volumeRef.current || data.length === 0) return;

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

    // Format data for each chart
    const candleData = data.map((d): CandlestickData => ({
      time: parseDate(d.date),
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    const trendQData = data.map((d): LineData => ({
      time: parseDate(d.date),
      value: d.trendQ,
    }));

    const fqData = data.map((d): HistogramData => ({
      time: parseDate(d.date),
      value: d.fq,
      color: d.fq >= 0 ? '#10b981' : '#ef4444',
    }));

    const volumeData = data.map((d): HistogramData => ({
      time: parseDate(d.date),
      value: d.volume,
      color: d.close >= d.open ? '#10b981' : '#ef4444',
    }));

    // Check if we have valid data
    if (candleData.length === 0) {
      console.error("No valid data for charts");
      return;
    }

    try {
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
  }, [data]); // Only re-create charts when data changes

  return (
    <div className="flex flex-col gap-1 bg-neutral-50 p-4 rounded-lg">
      <div className="font-medium text-sm text-gray-700 px-2 py-1">Biểu đồ giá</div>
      <div ref={candlestickRef} className="w-full bg-white" />
      <div className="font-medium text-sm text-gray-700 px-2 py-1">Biểu đồ chỉ báo</div>
      <div ref={indicatorsRef} className="w-full bg-white" />
      <div className="font-medium text-sm text-gray-700 px-2 py-1">Biểu đồ khối lượng</div>
      <div ref={volumeRef} className="w-full bg-white" />
      
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500 px-2">
        <div>
          VNINDEX: <span className="font-medium text-gray-700">Dữ liệu mẫu</span>
        </div>
        <div className="flex gap-6">
          <div>TrendQ: <span className="text-blue-600 font-medium">Xu hướng thị trường</span></div>
          <div>FQ: <span className="text-green-600 font-medium">Lực cầu - bán</span></div>
        </div>
      </div>
    </div>
  );
};

export default QindexChart; 