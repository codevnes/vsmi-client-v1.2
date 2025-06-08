import { API_ENDPOINTS } from "@/config/api";
import { FundamentalDataType } from "@/lib/mock-data";

// Stock Profile Types
export interface StockProfile {
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
}

// Financial Indicator Types
export interface FinancialIndicator {
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

// Trading Recommendation Types
export interface TradingRecommendation {
  id: string;
  symbol: string;
  analysisDate: string;
  inputData: {
    data: any[];
    symbol: string;
  };
  analysisResult: string;
  tradingRecommendation: string;
  suggestedBuyRange: string;
  stopLossLevel: string;
  createdAt: string;
  updatedAt: string;
}

// F-Score Analysis Types
export interface FScoreAnalysisRaw {
  id: string;
  symbol: string;
  analysisDate: string;
  inputData: any;
  analysisResult: string;
  tradingRecommendation: string;
  suggestedBuyRange: string;
  stopLossLevel: string;
  createdAt: string;
  updatedAt: string;
}

// Combined Stock Data Type
export interface StockData {
  message: string;
  data: {
    id: string;
    symbol: string;
    price: number;
    profit: number;
    volume: number;
    pe: number;
    eps: number;
    roa: number;
    roe: number;
    createdAt: string;
    updatedAt: string;
    stock: {
      symbol: string;
      name: string;
      exchange: string;
      industry: string;
    };
    chatGptAnalysis: TradingRecommendation[];
    fscoreAnalysis: FScoreAnalysisRaw[];
    financialMetrics: FinancialIndicator[];
    fscore: any[];
    technicalAnalysis: any[];
  }
}

/**
 * Fetches all stock data for a given stock symbol from a single API endpoint
 * @param symbol The stock symbol to fetch data for
 * @returns Promise with all the stock data
 */
export async function fetchStockData(symbol: string): Promise<StockData> {
  try {
    const response = await fetch(API_ENDPOINTS.stockProfile(symbol), { 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stock data: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    throw error;
  }
}

/**
 * Extract stock profile from the combined stock data
 */
export function extractStockProfile(stockData: StockData): StockProfile {
  const { data } = stockData;
  return {
    symbol: data.symbol,
    price: data.price,
    profit: data.profit,
    volume: data.volume,
    pe: data.pe,
    eps: data.eps,
    roa: data.roa,
    roe: data.roe,
    stock: {
      name: data.stock.name,
      exchange: data.stock.exchange,
      industry: data.stock.industry,
    }
  };
}

/**
 * Extract financial indicators from the combined stock data
 */
export function extractFinancialIndicators(stockData: StockData): FinancialIndicator[] {
  return stockData.data.financialMetrics;
}

/**
 * Extract trading recommendation from the combined stock data
 */
export function extractTradingRecommendation(stockData: StockData): TradingRecommendation | null {
  const { chatGptAnalysis } = stockData.data;
  return chatGptAnalysis && chatGptAnalysis.length > 0 ? chatGptAnalysis[0] : null;
}

/**
 * Extract F-Score analysis from the combined stock data
 */
export function extractFScoreAnalysis(stockData: StockData): FScoreAnalysisRaw | null {
  const { fscoreAnalysis } = stockData.data;
  return fscoreAnalysis && fscoreAnalysis.length > 0 ? fscoreAnalysis[0] : null;
}

/**
 * Extract fundamental data from the fscore data in the combined stock data
 */
export function extractFundamentalData(stockData: StockData): FundamentalDataType {
  const { data } = stockData;
  const { symbol } = data;
  
  // If there's no fscore data, return a default object
  if (!data.fscore || data.fscore.length === 0) {
    return {
      symbol,
      roa: 0,
      cfo: 0,
      deltaRoa: 0,
      cfoMinusNetProfit: 0,
      deltaLongTermDebt: 0,
      deltaCurrentRatio: 0,
      newlyIssuedShares: 0,
      deltaGrossMargin: 0,
      deltaAssetTurnover: 0,
      roaPositive: false,
      cfoPositive: false,
      deltaRoaPositive: false,
      cfoGreaterThanNetProfit: false,
      deltaLongTermDebtNegative: false,
      deltaCurrentRatioPositive: false,
      noNewSharesIssued: false,
      deltaGrossMarginPositive: false,
      deltaAssetTurnoverPositive: false
    };
  }
  
  // Extract from the first fscore entry
  const fscore = data.fscore[0];
  
  return {
    symbol: data.symbol,
    roa: fscore.roa || 0,
    cfo: fscore.cfo || 0,
    deltaRoa: fscore.deltaRoa || 0,
    cfoMinusNetProfit: fscore.cfoMinusNetProfit || 0,
    deltaLongTermDebt: fscore.deltaLongTermDebt || 0,
    deltaCurrentRatio: fscore.deltaCurrentRatio || 0,
    newlyIssuedShares: fscore.newlyIssuedShares || 0,
    deltaGrossMargin: fscore.deltaGrossMargin || 0,
    deltaAssetTurnover: fscore.deltaAssetTurnover || 0,
    roaPositive: fscore.roaPositive || false,
    cfoPositive: fscore.cfoPositive || false,
    deltaRoaPositive: fscore.deltaRoaPositive || false,
    cfoGreaterThanNetProfit: fscore.cfoGreaterThanNetProfit || false,
    deltaLongTermDebtNegative: fscore.deltaLongTermDebtNegative || false,
    deltaCurrentRatioPositive: fscore.deltaCurrentRatioPositive || false,
    noNewSharesIssued: fscore.noNewSharesIssued || false,
    deltaGrossMarginPositive: fscore.deltaGrossMarginPositive || false,
    deltaAssetTurnoverPositive: fscore.deltaAssetTurnoverPositive || false
  };
} 