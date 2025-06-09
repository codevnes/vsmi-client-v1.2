// News API types and service
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  originalContent: string;
  summarizedContent: string;
  sourceWebsite: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsResponse {
  data: NewsItem[];
  meta: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}

const BASE_URL = API_BASE_URL;

export const fetchNewsItems = async (page: number = 1, limit: number = 10, sourceWebsite?: string) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (sourceWebsite) {
      queryParams.append('sourceWebsite', sourceWebsite);
    }
    
    const response = await fetch(`${BASE_URL}/api/news?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status}`);
    }
    
    return await response.json() as NewsResponse;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}; 