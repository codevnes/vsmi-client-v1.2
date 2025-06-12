export interface StockInfo {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  industry: string;
}

export interface StockPrice {
  date: string;
  close: number;
}

export interface SelectedStock {
  id: string;
  symbol: string;
  close: number;
  return: number;
  volume: number;
  createdAt: string;
  updatedAt: string;
  stockInfo: StockInfo;
  stockPrices: StockPrice[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SelectedStocksResponse {
  message: string;
  data: SelectedStock[];
  pagination: PaginationInfo;
}

export interface SelectedStocksQueryParams {
  page?: number;
  limit?: number;
  sort?: 'symbol' | 'close' | 'return' | 'volume';
  order?: 'asc' | 'desc';
} 