import { Suspense } from 'react';
import { fetchPosts, fetchCategories } from '@/services/wordpressService';
import { PostsList } from '@/components/news/PostsList';
import { CategoryFilter } from '@/components/news/CategoryFilter';
import { Pagination } from '@/components/ui/pagination';
import { LatestNews } from '@/components/sections/LatestNews';

// Number of posts per page
const POSTS_PER_PAGE = 9;

export const revalidate = 3600; // Revalidate at most once per hour

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string };
}) {
  // Get current page from URL query parameters
  const currentPage = Number(searchParams.page) || 1;
  const categoryId = searchParams.category ? Number(searchParams.category) : undefined;
  
  // Fetch posts and categories
  const postsData = await fetchPosts(currentPage, POSTS_PER_PAGE, categoryId);
  const categoriesData = await fetchCategories(1, 50); // Get up to 50 categories
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tin tức</h1>
      
      {/* Latest News Section */}
      <section className="mb-10">
        <LatestNews />
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar with Categories */}
        <div className="lg:col-span-1">
          <Suspense fallback={<div>Đang tải danh mục...</div>}>
            <CategoryFilter 
              categories={categoriesData.categories} 
              selectedCategoryId={categoryId} 
            />
          </Suspense>
        </div>
        
        {/* Main Content - Posts List */}
        <div className="lg:col-span-3">
          <Suspense fallback={<div>Đang tải bài viết...</div>}>
            <PostsList posts={postsData.posts} />
            
            {/* Pagination */}
            {postsData.pagination.total_pages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={postsData.pagination.total_pages}
                  baseUrl={categoryId ? `/tin-tuc?category=${categoryId}&` : '/tin-tuc?'}
                />
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
} 