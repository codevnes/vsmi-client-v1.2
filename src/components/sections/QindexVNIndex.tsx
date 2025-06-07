'use client';

import React, { useEffect, useState } from 'react';
import QindexChart from '../charts/QindexChart';

interface QindexData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trendQ: number;
  fq: number;
}

// Generate sample data with more realistic patterns for different timeframes
function generateSampleData(timeframe: string): QindexData[] {
  const now = new Date();
  const data: QindexData[] = [];
  let startPrice = 1000;
  let startDate: Date;
  let points: number;

  switch (timeframe) {
    case '1M':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      points = 30; // ~30 days
      break;
    case '1Y':
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      points = 52; // ~52 weeks
      break;
    case '5Y':
    default:
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 5);
      points = 60; // 60 months (5 years)
      break;
  }

  for (let i = 0; i < points; i++) {
    const date = new Date(startDate);
    if (timeframe === '1M') {
      date.setDate(date.getDate() + i);
    } else if (timeframe === '1Y') {
      date.setDate(date.getDate() + i * 7); // Weekly data
    } else {
      date.setMonth(date.getMonth() + i); // Monthly data
    }

    const volatility = Math.random() * 3;
    const change = (Math.random() - 0.5) * volatility * 20;
    const open = startPrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 10;
    const low = Math.min(open, close) - Math.random() * 10;
    const volume = 500000 + Math.random() * 1500000;
    const trendQ = 0.4 + Math.random() * 0.6;
    const fq = -0.5 + Math.random();

    data.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume,
      trendQ,
      fq
    });

    startPrice = close; // For next iteration
  }

  return data;
}

const QindexVNIndex: React.FC = () => {
  // State for timeframe selection
  const [timeframe, setTimeframe] = useState<string>('1Y');
  const [qindexData, setQindexData] = useState<QindexData[]>([]);

  // Update data when timeframe changes
  useEffect(() => {
    setQindexData(generateSampleData(timeframe));
  }, [timeframe]);

  // Get the latest data point
  const latestData = qindexData.length > 0 ? qindexData[qindexData.length - 1] : null;
  
  // Calculate price change percentage
  const priceChangePercent = latestData 
    ? ((latestData.close / latestData.open - 1) * 100).toFixed(2) 
    : '0.00';
  
  // Determine if price is positive or negative
  const isPricePositive = latestData ? latestData.close > latestData.open : false;

  return (
    <div className="w-full">
      {/* Compact header especially for mobile */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        {/* Title kept as requested but slightly more compact */}
        <h2 className="text-xl sm:text-2xl font-bold flex items-center">
          <span className="w-1 h-4 sm:w-1.5 sm:h-5 bg-primary mr-2 sm:mr-2.5 inline-block rounded-sm"></span>
          Chỉ số Qindex - VNINDEX
        </h2>
        
        {/* Timeframe selector - more compact */}
        <div className="flex rounded-lg overflow-hidden border border-neutral-200 text-xs">
          {['1M', '1Y', '5Y'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 font-medium transition-all ${
                timeframe === tf
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

      {/* Modernized price summary - more compact for mobile */}
      {latestData && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">Giá</div>
              <div className="text-right">
                <div className="font-semibold">{latestData.close.toLocaleString()}</div>
                <div className={`text-xs font-medium ${isPricePositive ? 'text-green-600' : 'text-red-600'}`}>
                  {priceChangePercent}%
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-100">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-gray-500">TrendQ</div>
                <div className="text-blue-600 font-semibold">{latestData.trendQ.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">FQ</div>
                <div className={`font-semibold flex items-center ${latestData.fq >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {latestData.fq.toFixed(2)}
                  <span className={`ml-1 inline-block w-1.5 h-1.5 rounded-full ${latestData.fq >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart component - unchanged */}
      {qindexData.length > 0 && <QindexChart data={qindexData} />}
    </div>
  );
};

export default QindexVNIndex;