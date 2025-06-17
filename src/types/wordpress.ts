// Types for WordPress API

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  thumbnail: string;
  categories: string[];
  url: string; // URL that contains the slug
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    total_posts: number;
    total_pages: number;
    current_page: number;
    per_page: number;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface CategoriesResponse {
  categories: Category[];
  pagination: {
    total_categories: number;
    total_pages: number;
    current_page: number;
    per_page: number;
  };
}

export interface PostAuthor {
  id: number;
  name: string;
}

export interface PostCategory {
  term_id: number;
  name: string;
  slug: string;
  term_group: number;
  term_taxonomy_id: number;
  taxonomy: string;
  description: string;
  parent: number;
  count: number;
  filter: string;
  cat_ID: number;
  category_count: number;
  category_description: string;
  cat_name: string;
  category_nicename: string;
  category_parent: number;
}

export interface PostTag {
  term_id: number;
  name: string;
  slug: string;
  term_group: number;
  term_taxonomy_id: number;
  taxonomy: string;
  description: string;
  parent: number;
  count: number;
  filter: string;
}

export interface PostDetail {
  id: number;
  title: string;
  content: string;
  author: PostAuthor;
  date: string;
  modified_date: string;
  thumbnail: string;
  categories: PostCategory[];
  tags: PostTag[];
  url?: string; // URL that contains the slug
  slug?: string; // Direct slug if available
} 