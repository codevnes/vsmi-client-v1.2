'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
import { Post } from '@/types/wordpress';

// Extract slug from URL
const getSlugFromUrl = (url: string) => {
  try {
    // Extract the last part of the URL (the slug)
    const urlParts = url.split('/');
    // Remove empty strings and get the last part
    return urlParts.filter(part => part.length > 0).pop() || '';
  } catch (error) {
    console.error('Error extracting slug from URL:', error);
    return '';
  }
};

// Helper to create post URL using slug or ID
const getPostUrl = (post: Post) => {
  // First try to get slug from the url field
  if (post.url) {
    const extractedSlug = getSlugFromUrl(post.url);
    if (extractedSlug) {
      return `/tin-tuc/${extractedSlug}`;
    }
  }
  
  // Fallback to using the ID as the slug
  return `/tin-tuc/${post.id}`;
};

interface PostsListProps {
  posts: Post[];
}

export function PostsList({ posts }: PostsListProps) {
  if (posts.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500">Không có bài viết nào.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => {
        return <PostCard key={post.id} post={post} />;
      })}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  // Get thumbnail or use placeholder
  const thumbnail = post.thumbnail || '/images/placeholder.jpg';
  
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

  // Parse title from HTML if needed
  const parseTitle = (title: string) => {
    try {
      // If title contains HTML, remove tags
      return title.replace(/<\/?[^>]+(>|$)/g, '');
    } catch (error) {
      return title;
    }
  };

  // Parse excerpt from HTML if needed
  const parseExcerpt = (excerpt: string) => {
    try {
      // If excerpt contains HTML, remove tags
      return excerpt.replace(/<\/?[^>]+(>|$)/g, '');
    } catch (error) {
      return excerpt;
    }
  };

  const formattedDate = formatDate(post.date);
  const formattedTime = formatTime(post.date);
  const title = parseTitle(post.title);
  const excerpt = parseExcerpt(post.excerpt);

  return (
    <Link href={getPostUrl(post)} className="group block h-full">
      <div className="h-full bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Không có ảnh</span>
            </div>
          )}
          {post.categories && post.categories.length > 0 && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-600 text-white rounded-sm">
                {post.categories[0]}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formattedTime}</span>
            </div>
          </div>
          
          <h3 className="font-bold text-lg mb-2 line-clamp-2 h-[3.5rem] group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-2 line-clamp-3 h-[4.5rem]">
            {excerpt}
          </p>
          
          <div className="text-blue-600 text-xs font-medium group-hover:underline">
            Đọc tiếp
          </div>
        </div>
      </div>
    </Link>
  );
} 