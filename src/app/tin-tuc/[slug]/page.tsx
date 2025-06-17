import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import { fetchPostBySlug, fetchPostById } from '@/services/wordpressService';
import newsContentStyles from '@/styles/news-content.module.css';

export const revalidate = 3600; // Revalidate at most once per hour

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = params;
  
  try {
    // Check if slug is actually a numeric ID
    const isNumericId = /^\d+$/.test(slug);
    
    // Fetch post either by slug or ID depending on the format
    const post = isNumericId 
      ? await fetchPostById(parseInt(slug, 10))
      : await fetchPostBySlug(slug);
    
    // Log the fetched post for debugging
    console.log(`Fetched post with ${isNumericId ? 'ID' : 'slug'} ${slug}:`, { 
      title: post.title, 
      id: post.id,
      url: post.url,
      slug: post.slug
    });

    // Format date
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    };

    // Format time
    const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/tin-tuc"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Quay lại danh sách tin tức</span>
          </Link>
        </div>
        
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Post Header */}
          <div className="p-6 pb-4 border-b border-gray-100">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span>{formatDate(post.date)}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5" />
                <span>{formatTime(post.date)}</span>
              </div>
              
              {post.author && (
                <div>
                  <span className="font-medium text-gray-600">
                    {post.author.name}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Featured Image */}
          {post.thumbnail && (
            <div className="relative hidden">
              <Image
                src={post.thumbnail}
                alt={post.title}
                width={1000}
                height={1000}
                priority
              />
            </div>
          )}
          
          {/* Post Content */}
          <div className="p-6">
            {/* Render the HTML content with our comprehensive styles */}
            <div 
              className={newsContentStyles.newsContent}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-start">
                  <Tag className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <Link
                        key={tag.term_id}
                        href={`/tin-tuc?tag=${tag.term_id}`}
                        className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="mt-4">
                <div className="flex items-start">
                  <span className="text-gray-500 mr-2">Danh mục:</span>
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map(category => (
                      <Link
                        key={category.term_id}
                        href={`/tin-tuc?category=${category.term_id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    );
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error);
    notFound();
  }
} 