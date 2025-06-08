export interface FScoreIndicator {
  label: string;
  value: boolean;
  description: string;
}

export interface FScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  indicators: FScoreIndicator[];
}

export interface FScoreRawData {
  id: string;
  symbol: string;
  analysisDate: string;
  inputData: {
    fScore: Record<string, any>;
    symbol: string;
    zScore?: Record<string, any>;
    cashFlow?: Record<string, any>;
    data_2023?: Record<string, any>;
    data_2024?: Record<string, any>;
    balanceSheet?: Record<string, any>;
    incomeStatement?: Record<string, any>;
    [key: string]: any;
  };
  analysisResult: string;
  tradingRecommendation?: string;
  suggestedBuyRange?: string;
  stopLossLevel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FScoreAnalysisData {
  symbol: string;
  analysisDate: string;
  totalScore: number;
  pe: number;
  peIndustry: number;
  categories: FScoreCategory[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  fullAnalysis?: string;
  tradingRecommendation?: string;
  suggestedBuyRange?: string;
  stopLossLevel?: string;
}

export interface FScoreAnalysisResponse {
  message: string;
  data: FScoreRawData;
} 