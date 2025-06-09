/**
 * Configuration file for API endpoints
 */

// Base API URL from environment variable or default to localhost in development
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3030';

// API Endpoints
export const API_ENDPOINTS = {
  stockProfile: (symbol: string) => `${API_BASE_URL}/api/stock-profiles/${symbol}`,
  financialMetrics: (symbol: string) => `${API_BASE_URL}/api/financial-metrics/${symbol}`,
  tradingRecommendation: (symbol: string) => `${API_BASE_URL}/api/chatgpt-analyses/${symbol}`,
  fscoreAnalysis: (symbol: string) => `${API_BASE_URL}/api/fscore-analyses/${symbol}`,
  stockPrices: (symbol: string) => `${API_BASE_URL}/api/stock-prices/${symbol}`,
}; 