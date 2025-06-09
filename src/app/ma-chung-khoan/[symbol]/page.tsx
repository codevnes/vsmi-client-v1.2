import { StockProfile } from "@/components/ui/stock-profile";
import { FundamentalAnalysis } from "@/components/ui/fundamental-analysis";
import { TechnicalAnalysis } from "@/components/ui/technical-analysis";
import { FinancialAnalysis } from "@/components/ui/financial-analysis";
import { TradingRecommendation } from "@/components/ui/trading-recommendation";
import { FScoreAnalysisContainer } from "@/components/FScoreAnalysisContainer";
import { QindexChartWithTimeRange } from "@/components/charts/QindexChart";
import { TECHNICAL_DATA } from "@/lib/mock-data";
import { fetchStockData, extractStockProfile, extractFinancialIndicators, extractTradingRecommendation, extractFundamentalData } from "@/services/stockService";

export default async function SymbolPage({ params }: { params: { symbol: string } }) {
  // Ensure params is properly awaited in Next.js App Router
  const { symbol } = await Promise.resolve(params);
  const symbolUpperCase = symbol.toUpperCase();
  
  // Fetch all stock data from a single API endpoint
  const stockData = await fetchStockData(symbolUpperCase);
  
  // Extract stock profile data
  const stockProfileData = extractStockProfile(stockData);

  // Extract financial indicators data
  const financialData = extractFinancialIndicators(stockData);

  // Extract trading recommendation data
  const tradingRecommendationData = extractTradingRecommendation(stockData);

  // Extract fundamental data from F-Score
  const fundamentalData = extractFundamentalData(stockData);
  
  // Get technical data for this symbol or use a default if not found
  const technicalData = TECHNICAL_DATA[symbolUpperCase] || TECHNICAL_DATA["VNM"];

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Profile */}
      <StockProfile {...stockProfileData} />

      {/* Stock Chart */}
      <QindexChartWithTimeRange symbol={symbolUpperCase} timeRange="1y" />

      {/* Trading Recommendation */}
      {tradingRecommendationData && <TradingRecommendation {...tradingRecommendationData} />}

      {/* F-Score Analysis - The FScoreAnalysisContainer will now receive data from the context */}
      <FScoreAnalysisContainer symbol={symbolUpperCase} />

     
      {/* Fundamental Analysis */}
      <FundamentalAnalysis {...fundamentalData} />

      {/* Technical Analysis */}
      <TechnicalAnalysis {...technicalData} />

       {/* Financial Analysis */}
       <FinancialAnalysis data={financialData} symbol={symbolUpperCase} />

    </div>
  );
}