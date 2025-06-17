import { 
  PostsResponse, 
  CategoriesResponse, 
  PostDetail
} from '@/types/wordpress';

// Base URL for the WordPress API
const API_BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://news.vsmi.vn/wp-json';
const API_NAMESPACE = 'vsmi/v1';

/**
 * Fetch posts with pagination and optional category filter
 */
export const fetchPosts = async (
  page: number = 1, 
  perPage: number = 10, 
  categoryId?: number
): Promise<PostsResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    
    if (categoryId) {
      queryParams.append('category', categoryId.toString());
    }
    
    const url = `${API_BASE_URL}/${API_NAMESPACE}/posts?${queryParams.toString()}`;
    console.log('Fetching posts from:', url);
    
    const response = await fetch(url, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }
    
    return await response.json() as PostsResponse;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

/**
 * Fetch post details by ID
 */
export const fetchPostById = async (postId: number): Promise<PostDetail> => {
  try {
    const url = `${API_BASE_URL}/${API_NAMESPACE}/posts/${postId}`;
    console.log('Fetching post detail from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }
    
    return await response.json() as PostDetail;
  } catch (error) {
    console.error(`Error fetching post with ID ${postId}:`, error);
    throw error;
  }
};

/**
 * Fetch post details by slug
 */
export const fetchPostBySlug = async (slug: string): Promise<PostDetail> => {
  try {
    const url = `${API_BASE_URL}/${API_NAMESPACE}/posts/slug/${slug}`;
    console.log('Fetching post by slug from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });
    
    // Log the response status for debugging
    console.log(`Fetch response for slug "${slug}":`, {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    if (!response.ok) {
      // Try to get more detailed error information if possible
      let errorDetails = '';
      try {
        const errorResponse = await response.text();
        errorDetails = errorResponse;
      } catch (parseError) {
        errorDetails = 'Could not parse error response';
      }
      
      throw new Error(`Failed to fetch post by slug: ${response.status} ${response.statusText}. Details: ${errorDetails}`);
    }
    
    const data = await response.json() as PostDetail;
    
    // Log successful data retrieval
    console.log(`Successfully fetched post by slug "${slug}"`, {
      postId: data.id,
      title: data.title.substring(0, 30) + (data.title.length > 30 ? '...' : '')
    });
    
    return data;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    throw error;
  }
};

/**
 * Fetch categories with pagination
 */
export const fetchCategories = async (
  page: number = 1, 
  perPage: number = 10
): Promise<CategoriesResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    
    const url = `${API_BASE_URL}/${API_NAMESPACE}/categories?${queryParams.toString()}`;
    console.log('Fetching categories from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }
    
    return await response.json() as CategoriesResponse;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}; 