import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";
import { FundamentalDataType } from "@/lib/mock-data";
import { Stock, StockDetail, StockListResponse, StockDetailResponse, StockSearchParams } from "@/types/stock";
import { StockDataParams, StockDataResponse } from '@/types/stockData';

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

export interface FScoreAnalysisRaw {
  id: string;
  symbol: string;
  year: number;
  quarter: number;
  roa: number;
  deltaRoa: number;
  cfo: number;
  cfoMinusNetProfit: number;
  deltaLongTermDebt: number;
  deltaCurrentRatio: number;
  newlyIssuedShares: number;
  deltaGrossMargin: number;
  deltaAssetTurnover: number;
  roaPositive: boolean;
  cfoPositive: boolean;
  deltaRoaPositive: boolean;
  cfoGreaterThanNetProfit: boolean;
  deltaLongTermDebtNegative: boolean;
  deltaCurrentRatioPositive: boolean;
  noNewSharesIssued: boolean;
  deltaGrossMarginPositive: boolean;
  deltaAssetTurnoverPositive: boolean;
  fScore: number;
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
 * Stock service module
 */
export const stockService = {
  /**
   * Lấy danh sách chứng khoán với phân trang và tìm kiếm
   */
  async getStocks(params: StockSearchParams = {}): Promise<StockListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.exchange) searchParams.append("exchange", params.exchange);
    if (params.industry) searchParams.append("industry", params.industry);
    
    const url = `${API_BASE_URL}/api/stocks?${searchParams.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  },
  
  /**
   * Tìm kiếm cổ phiếu theo từ khóa
   */
  async searchStocks(query: string, limit: number = 5): Promise<Stock[]> {
    try {
      const response = await this.getStocks({
        search: query,
        limit: limit,
        page: 1
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm cổ phiếu:", error);
      return [];
    }
  },
  
  /**
   * Lấy thông tin chi tiết của một mã chứng khoán
   */
  async getStockBySymbol(symbol: string): Promise<StockDetail> {
    const response = await fetch(`${API_BASE_URL}/api/stocks/${symbol}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data: StockDetailResponse = await response.json();
    return data.stock;
  },

  /**
   * Fetches stock price data with indicators
   */
  async fetchStockPrices({
    symbol,
    startDate = '2023-01-01',
    endDate = '2090-01-31',
    page = 1,
    limit = 99999
  }: StockDataParams): Promise<StockDataResponse> {
    // Using API_BASE_URL from config
    const url = new URL(`${API_BASE_URL}/api/stock-prices/${symbol}`);
    
    // Add query parameters
    url.searchParams.append('startDate', startDate);
    url.searchParams.append('endDate', endDate);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stock data: ${response.statusText}`);
    }
    
    return response.json();
  }
};

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