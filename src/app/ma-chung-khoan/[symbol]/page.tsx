import { StockProfile } from "@/components/ui/stock-profile";
import { FundamentalAnalysis } from "@/components/ui/fundamental-analysis";
import { TechnicalAnalysis } from "@/components/ui/technical-analysis";
import { FinancialAnalysis } from "@/components/ui/financial-analysis";
import { TradingRecommendation } from "@/components/ui/trading-recommendation";
import { FUNDAMENTAL_DATA, TECHNICAL_DATA } from "@/lib/mock-data";

// Define the financial indicator type
interface FinancialIndicator {
  id: string;
  symbol: string;
  year: number;
  quarter: number | null;
  eps: number;
  epsIndustry: number | null;
  pe: number | null;
  peIndustry: number | null;
  roa: number;
  roe: number;
  roaIndustry: number | null;
  roeIndustry: number | null;
  revenue: number | null;
  margin: number | null;
  totalDebtToEquity: number;
  totalAssetsToEquity: number;
  createdAt: string;
  updatedAt: string;
  stock: {
    name: string;
    exchange: string;
  };
}

// Sample financial indicators data for testing
const FINANCIAL_INDICATORS: Record<string, FinancialIndicator[]> = {
  "VNM": [
    {
      "id": "8ffbb42f-fdf1-49b5-8460-8f2c8ccfb343",
      "symbol": "VNM",
      "year": 2024,
      "quarter": null,
      "eps": 4022.01,
      "epsIndustry": 3091.09,
      "pe": 13.8,
      "peIndustry": 15.56,
      "roa": 0.1527,
      "roe": 0.2323,
      "roaIndustry": 0.0958,
      "roeIndustry": 0.1571,
      "revenue": null,
      "margin": null,
      "totalDebtToEquity": 0.42,
      "totalAssetsToEquity": 1.42,
      "createdAt": "2025-06-06T09:59:01.181Z",
      "updatedAt": "2025-06-06T09:59:01.181Z",
      "stock": {
        "name": "Vietnam Dairy Products JSC",
        "exchange": "HOSE"
      }
    },
    {
      "id": "f9989ee6-c511-44c6-a0c0-2c2b3b3f5cdb",
      "symbol": "VNM",
      "year": 2024,
      "quarter": 4,
      "eps": 1010.96,
      "epsIndustry": null,
      "pe": null,
      "peIndustry": null,
      "roa": 0.0423,
      "roe": 0.0622,
      "roaIndustry": null,
      "roeIndustry": null,
      "revenue": 15917727490,
      "margin": 0.0976,
      "totalDebtToEquity": 0.42,
      "totalAssetsToEquity": 1.42,
      "createdAt": "2025-06-06T09:59:06.932Z",
      "updatedAt": "2025-06-06T09:59:06.932Z",
      "stock": {
        "name": "Vietnam Dairy Products JSC",
        "exchange": "HOSE"
      }
    },
    {
      "id": "ff1b2062-a3cd-4078-aea9-514c81179d42",
      "symbol": "VNM",
      "year": 2024,
      "quarter": 3,
      "eps": 991.85,
      "epsIndustry": null,
      "pe": null,
      "peIndustry": null,
      "roa": 0.0364,
      "roe": 0.0596,
      "roaIndustry": null,
      "roeIndustry": null,
      "revenue": 14130799223,
      "margin": 0.0803,
      "totalDebtToEquity": 0.43,
      "totalAssetsToEquity": 1.43,
      "createdAt": "2025-06-06T09:59:06.932Z",
      "updatedAt": "2025-06-06T09:59:06.932Z",
      "stock": {
        "name": "Vietnam Dairy Products JSC",
        "exchange": "HOSE"
      }
    },
    {
      "id": "9a599634-2a47-4b0c-a719-596f5494254d",
      "symbol": "VNM",
      "year": 2024,
      "quarter": 2,
      "eps": 1039.25,
      "epsIndustry": null,
      "pe": null,
      "peIndustry": null,
      "roa": 0.0347,
      "roe": 0.0548,
      "roaIndustry": null,
      "roeIndustry": null,
      "revenue": 14259361907,
      "margin": 0.0869,
      "totalDebtToEquity": 0.45,
      "totalAssetsToEquity": 1.45,
      "createdAt": "2025-06-06T09:59:06.932Z",
      "updatedAt": "2025-06-06T09:59:06.932Z",
      "stock": {
        "name": "Vietnam Dairy Products JSC",
        "exchange": "HOSE"
      }
    },
    {
      "id": "0cdac06e-3ba0-4e81-9601-1b857bc5155e",
      "symbol": "VNM",
      "year": 2024,
      "quarter": 1,
      "eps": 979.95,
      "epsIndustry": null,
      "pe": null,
      "peIndustry": null,
      "roa": 0.0371,
      "roe": 0.0557,
      "roaIndustry": null,
      "roeIndustry": null,
      "revenue": 13646824549,
      "margin": 0.0901,
      "totalDebtToEquity": 0.46,
      "totalAssetsToEquity": 1.46,
      "createdAt": "2025-06-06T09:59:06.932Z",
      "updatedAt": "2025-06-06T09:59:06.932Z",
      "stock": {
        "name": "Vietnam Dairy Products JSC",
        "exchange": "HOSE"
      }
    },
    {
      "id": "5c61e221-23f6-44f6-b99f-1cea152e80e8",
      "symbol": "VNM",
      "year": 2023,
      "quarter": null,
      "eps": 3860.88,
      "epsIndustry": 3038.19,
      "pe": 14.15,
      "peIndustry": 14.97,
      "roa": 0.1478,
      "roe": 0.2173,
      "roaIndustry": 0.0856,
      "roeIndustry": 0.1495,
      "revenue": null,
      "margin": null,
      "totalDebtToEquity": 0.47,
      "totalAssetsToEquity": 1.47,
      "createdAt": "2025-06-06T09:59:01.181Z",
      "updatedAt": "2025-06-06T09:59:01.181Z",
      "stock": {
        "name": "Vietnam Dairy Products JSC",
        "exchange": "HOSE"
      }
    },
    {
      "id": "a0695742-2b0c-4ae2-80f8-9840d51af27d",
      "symbol": "VNM",
      "year": 2022,
      "quarter": null,
      "eps": 3711.21,
      "epsIndustry": 2928.43,
      "pe": 14.21,
      "peIndustry": 13.06,
      "roa": 0.1387,
      "roe": 0.2079,
      "roaIndustry": 0.0839,
      "roeIndustry": 0.1483,
      "revenue": null,
      "margin": null,
      "totalDebtToEquity": 0.49,
      "totalAssetsToEquity": 1.49,
      "createdAt": "2025-06-06T09:59:01.181Z",
      "updatedAt": "2025-06-06T09:59:01.181Z",
      "stock": {
        "name": "Vietnam Dairy Products JSC",
        "exchange": "HOSE"
      }
    },
    {
      "id": "5eb596d6-33f6-4445-8e2f-52d5a04b8a3a",
      "symbol": "VNM",
      "year": 2021,
      "quarter": null,
      "eps": 3763.82,
      "epsIndustry": 3140.16,
      "pe": 15.02,
      "peIndustry": 16.61,
      "roa": 0.1495,
      "roe": 0.2148,
      "roaIndustry": 0.0872,
      "roeIndustry": 0.1511,
      "revenue": null,
      "margin": null,
      "totalDebtToEquity": 0.44,
      "totalAssetsToEquity": 1.44,
      "createdAt": "2025-06-06T09:59:01.181Z",
      "updatedAt": "2025-06-06T09:59:01.181Z",
      "stock": {
        "name": "Vietnam Dairy Products JSC",
        "exchange": "HOSE"
      }
    },
    {
      "id": "8cd6be89-03c3-4814-8d08-39fd9468f697",
      "symbol": "VNM",
      "year": 2020,
      "quarter": null,
      "eps": 3636.22,
      "epsIndustry": 3014.08,
      "pe": 16.45,
      "peIndustry": 17.48,
      "roa": 0.1426,
      "roe": 0.2057,
      "roaIndustry": 0.0848,
      "roeIndustry": 0.1416,
      "revenue": null,
      "margin": null,
      "totalDebtToEquity": 0.44,
      "totalAssetsToEquity": 1.44,
      "createdAt": "2025-06-06T09:59:01.181Z",
      "updatedAt": "2025-06-06T09:59:01.181Z",
      "stock": {
        "name": "Vietnam Dairy Products JSC",
        "exchange": "HOSE"
      }
    }
  ],
  "DXG": [
    {
      "id": "8ffbb42f-fdf1-49b5-8460-8f2c8ccfb343",
      "symbol": "DXG",
      "year": 2024,
      "quarter": null,
      "eps": 338.1638,
      "epsIndustry": 1091.097992592593,
      "pe": 42.13934194020768,
      "peIndustry": 25.56390580413624,
      "roa": 0.008510261029432573,
      "roe": 0.01633689887487541,
      "roaIndustry": 0.02958308439923411,
      "roeIndustry": 0.05971488834644063,
      "revenue": null,
      "margin": null,
      "totalDebtToEquity": 0.9196707149609816,
      "totalAssetsToEquity": 1.919670714960982,
      "createdAt": "2025-06-06T09:59:01.181Z",
      "updatedAt": "2025-06-06T09:59:01.181Z",
      "stock": {
        "name": "Dat Xanh Group JSC",
        "exchange": "HOSE"
      }
    },
    {
      "id": "f9989ee6-c511-44c6-a0c0-2c2b3b3f5cdb",
      "symbol": "DXG",
      "year": 2024,
      "quarter": 4,
      "eps": 210.96775,
      "epsIndustry": null,
      "pe": null,
      "peIndustry": null,
      "roa": 0.005323863084631709,
      "roe": 0.01022006405402933,
      "roaIndustry": null,
      "roeIndustry": null,
      "revenue": 1591772749790,
      "margin": 0.09760707895112382,
      "totalDebtToEquity": 0.9196707149609816,
      "totalAssetsToEquity": 1.919670714960982,
      "createdAt": "2025-06-06T09:59:06.932Z",
      "updatedAt": "2025-06-06T09:59:06.932Z",
      "stock": {
        "name": "Dat Xanh Group JSC",
        "exchange": "HOSE"
      }
    },
    {
      "id": "ff1b2062-a3cd-4078-aea9-514c81179d42",
      "symbol": "DXG",
      "year": 2024,
      "quarter": 3,
      "eps": 41.85765,
      "epsIndustry": null,
      "pe": null,
      "peIndustry": null,
      "roa": 0.001064551838767258,
      "roe": 0.001964422897819628,
      "roaIndustry": null,
      "roeIndustry": null,
      "revenue": 1013079922357,
      "margin": 0.03031679695570643,
      "totalDebtToEquity": 0.8453050629215136,
      "totalAssetsToEquity": 1.845305062921514,
      "createdAt": "2025-06-06T09:59:06.932Z",
      "updatedAt": "2025-06-06T09:59:06.932Z",
      "stock": {
        "name": "Dat Xanh Group JSC",
        "exchange": "HOSE"
      }
    },
    {
      "id": "9a599634-2a47-4b0c-a719-596f5494254d",
      "symbol": "DXG",
      "year": 2023,
      "quarter": null,
      "eps": 260.88897,
      "epsIndustry": 1038.192668363637,
      "pe": 71.15575430421609,
      "peIndustry": 28.97168059750159,
      "roa": 0.005785495902666412,
      "roe": 0.01173970932512591,
      "roaIndustry": 0.02562748626190002,
      "roeIndustry": 0.05950406100260954,
      "revenue": null,
      "margin": null,
      "totalDebtToEquity": 1.02916215353559,
      "totalAssetsToEquity": 2.02916215353559,
      "createdAt": "2025-06-06T09:59:01.181Z",
      "updatedAt": "2025-06-06T09:59:01.181Z",
      "stock": {
        "name": "Dat Xanh Group JSC",
        "exchange": "HOSE"
      }
    },
    {
      "id": "3edab648-9fa6-4fb7-8672-11903e954cf2",
      "symbol": "DXG",
      "year": 2023,
      "quarter": 4,
      "eps": 67.53599,
      "epsIndustry": null,
      "pe": null,
      "peIndustry": null,
      "roa": 0.001226337800412929,
      "roe": 0.002488438252047999,
      "roaIndustry": null,
      "roeIndustry": null,
      "revenue": 1419029798132,
      "margin": 0.02487749066684234,
      "totalDebtToEquity": 1.02916215353559,
      "totalAssetsToEquity": 2.02916215353559,
      "createdAt": "2025-06-06T09:59:06.932Z",
      "updatedAt": "2025-06-06T09:59:06.932Z",
      "stock": {
        "name": "Dat Xanh Group JSC",
        "exchange": "HOSE"
      }
    }
  ]
};

export default async function SymbolPage({ params }: { params: { symbol: string } }) {
  // Ensure params is properly awaited in Next.js App Router
  const { symbol } = await Promise.resolve(params);
  const symbolUpperCase = symbol.toUpperCase();
  
  // Sample data - in a real application, this would come from an API
  const stockData = {
    symbol: symbolUpperCase,
    price: 55500,
    profit: 800,
    volume: 4311900,
    pe: 13.8,
    eps: 4022.01,
    roa: 15.27,
    roe: 23.23,
    stock: {
      name: "Vietnam Dairy Products JSC",
      exchange: "HOSE",
      industry: "Food & Tobacco"
    }
  };

  // Get fundamental data for this symbol or use a default if not found
  const fundamentalData = FUNDAMENTAL_DATA[symbolUpperCase] || FUNDAMENTAL_DATA["VNM"];
  
  // Get technical data for this symbol or use a default if not found
  const technicalData = TECHNICAL_DATA[symbolUpperCase] || TECHNICAL_DATA["VNM"];

  // Get financial indicators data for this symbol or use a default if not found
  const financialData = FINANCIAL_INDICATORS[symbolUpperCase] || FINANCIAL_INDICATORS["VNM"];

  // Sample trading recommendation data
  const tradingRecommendationData = {
    id: "5bbe0774-45d1-498e-a7b1-d74c86b88ca9",
    symbol: symbolUpperCase,
    analysisDate: "2025-05-06T00:00:00.000Z",
    inputData: {
      data: [
        {
          low: 37600,
          date: "2025-05-04",
          high: 38150,
          hma9: 38240,
          open: 38150,
          adx14: 15.27665914557726,
          cci20: 1.118738876176096,
          close: 37900,
          ema10: 38231.94845366481,
          ema20: 38319.2167822355,
          ema50: 38966.9680786074,
          rsi14: 45.10219550130468,
          sma10: 38345,
          sma20: 37845,
          sma50: 39252,
          ema100: 39574.51058109685,
          ema200: 40342.54836007114,
          sma100: 40278.47242,
          sma200: 39871.332734,
          volume: 12100,
          macdLine: -204.5501450631127,
          plusDi14: 24,
          minusDi14: 18.8,
          stochRsiD: 88.5613767276369,
          stochRsiK: 70.98448353980112,
          williamsR: -67.85714285714286,
          macdSignal: -288.8687102766049,
          momentum10: -700,
          bearPower13: -639.6538584584196,
          bullPower13: -89.65385845841956,
          stochasticD: 65.83820662768034,
          stochasticK: 50.52910052910054,
          macdHistogram: 84.3185652134922,
          awesomeOscillator: -290.8823529411748,
          ichimokuBaseLine26: 36775,
          ultimateOscillator: 47.28703592532023
        },
        {
          low: 37800,
          date: "2025-05-05",
          high: 38300,
          hma9: 38122.40740740741,
          open: 37900,
          adx14: 18.54696600089226,
          cci20: 20.48066875653118,
          close: 38300,
          ema10: 38244.32146208939,
          ema20: 38317.38661249878,
          ema50: 38940.81246768162,
          rsi14: 48.6748885759609,
          sma10: 38310,
          sma20: 37810,
          sma50: 39199,
          ema100: 39549.27274780781,
          ema200: 40322.22449579183,
          sma100: 40256.2959,
          sma200: 39855.1797675,
          volume: 12600,
          macdLine: -184.2763401411648,
          plusDi14: 7.51173708920188,
          minusDi14: 22.06572769953052,
          stochRsiD: 67.77842679645948,
          stochRsiK: 37.65115020646779,
          williamsR: -52.72727272727272,
          macdSignal: -267.9502362495169,
          momentum10: -350,
          bearPower13: -448.2747358215056,
          bullPower13: 51.7252641784944,
          stochasticD: 52.32622802798243,
          stochasticK: 39.56709956709958,
          macdHistogram: 83.6738961083521,
          awesomeOscillator: -307.6470588235316,
          ichimokuBaseLine26: 36550,
          ultimateOscillator: 49.18673057169151
        },
        {
          low: 37750,
          date: "2025-05-06",
          high: 38500,
          hma9: 38022.96296296296,
          open: 38400,
          adx14: 21.18099844594564,
          cci20: 14.62573684795895,
          close: 38000,
          ema10: 38199.89937807313,
          ema20: 38287.15931607033,
          ema50: 38903.91786110587,
          rsi14: 46.24412220788733,
          sma10: 38255,
          sma20: 37885,
          sma50: 39126,
          ema100: 39518.59407953438,
          ema200: 40299.11778439092,
          sma100: 40233.531145,
          sma200: 39835.115036,
          volume: 34500,
          macdLine: -190.223913605274,
          plusDi14: 9.708737864077671,
          minusDi14: 22.81553398058253,
          stochRsiD: 41.03284149106275,
          stochRsiK: 14.46289072691934,
          williamsR: -60,
          macdSignal: -252.4049717206684,
          momentum10: -550,
          bearPower13: -462.8069164184344,
          bullPower13: 287.1930835815656,
          stochasticD: 43.30046496713165,
          stochasticK: 39.80519480519482,
          macdHistogram: 62.18105811539436,
          awesomeOscillator: -314.7058823529442,
          ichimokuBaseLine26: 36550,
          ultimateOscillator: 50.13842744085517
        }
      ],
      symbol: symbolUpperCase
    },
    analysisResult: "1. **Khuyến nghị giao dịch:**\n   - **Khuyến nghị:** Quan sát/chờ mua\n   - **Lý do:** Các chỉ số MACD và Stochastic cho thấy sự phục hồi nhẹ nhưng RSI vẫn dưới 50, cho thấy sức mạnh tăng giá chưa rõ ràng. ADX dưới 25 cho thấy xu hướng không mạnh.\n   - **Vùng giá mua:** Khoảng 38000, gần SMA20 và EMA20 hiện tại.\n   - **Cắt lỗ:** Dưới 37750, mức thấp nhất gần đây.\n   - **Cảnh báo rủi ro:** MACD Histogram đang thu hẹp, cho thấy động lượng tăng có thể không bền vững.\n\n2. **Kết luận tổng hợp:**\n   - **Vùng giá & khối lượng:** Giá đóng cửa dao động từ 37900 đến 38300 trong các phiên gần nhất với khối lượng tăng dần, cho thấy sự quan tâm nhất định từ thị trường nhưng chưa đủ mạnh.\n   - **Động lượng:** MACD và Stochastic cho thấy sự phục hồi nhẹ nhưng RSI vẫn dưới 50, cho thấy sức mạnh tăng giá chưa rõ ràng. ADX dưới 25 cho thấy xu hướng không mạnh.\n   - **Xu hướng:** ADX thấp cho thấy xu hướng yếu, Plus DI và Minus DI không cho thấy sự ưu thế rõ ràng của phe mua hoặc bán.\n   - **Đường trung bình:** Giá hiện tại gần SMA20 và EMA20, cho thấy mức hỗ trợ ngắn hạn. Giá dưới SMA50 và SMA100 cho thấy xu hướng trung và dài hạn vẫn còn yếu.\n   - **Ichimoku:** Giá dưới BaseLine cho thấy xu hướng hiện tại không mạnh.\n   - **Tổng hợp chung:** Cổ phiếu DHA hiện tại trong trạng thái không rõ ràng với xu hướng yếu và động lượng không mạnh mẽ, cần quan sát thêm trước khi đưa ra quyết định mua mạnh.",
    tradingRecommendation: "**",
    suggestedBuyRange: "** Khoảng 38000, gần SMA20 và EMA20 hiện tại.",
    stopLossLevel: "** Dưới 37750, mức thấp nhất gần đây.",
    createdAt: "2025-06-07T07:23:28.011Z",
    updatedAt: "2025-06-07T07:23:28.011Z"
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Profile */}
      <StockProfile {...stockData} />

      {/* Trading Recommendation */}
      <TradingRecommendation {...tradingRecommendationData} />

      {/* Financial Analysis */}
      <FinancialAnalysis data={financialData} symbol={symbolUpperCase} />

      {/* Fundamental Analysis */}
      <FundamentalAnalysis {...fundamentalData} />

      {/* Technical Analysis */}
      <TechnicalAnalysis {...technicalData} />
    </div>
  );
}