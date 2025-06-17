'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Post } from '@/types/wordpress';
import { fetchPosts } from '@/services/wordpressService';

export function LatestNewsSection() {
  // Media query breakpoints
  const breakpoints = {
    sm: '(min-width: 640px)',
    lg: '(min-width: 1024px)',
  };
  
  // Use media queries
  const isSmScreen = useMediaQuery(breakpoints.sm);
  const isLgScreen = useMediaQuery(breakpoints.lg);
  
  // Calculate responsive states from the media query results
  const isMobile = !isSmScreen;
  const isTablet = isSmScreen && !isLgScreen;
  const isDesktop = isLgScreen;
  
  // State
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [pagesCount, setPagesCount] = useState(0);

  // Fetch data
  useEffect(() => {
    const getPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetchPosts(1, 10); // Get latest 10 posts
        setPosts(response.posts);
        setError(null);
      } catch (err) {
        console.error('Error fetching latest posts:', err);
        setError('Không thể tải tin tức. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    getPosts();
  }, []);

  // Callbacks
  const getSlidesPerView = useCallback(() => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 4; // Desktop default
  }, [isMobile, isTablet]);
  
  const updatePagesCount = useCallback(() => {
    const count = Math.ceil(posts.length / Math.max(1, slidesPerView));
    setPagesCount(count);
  }, [posts.length, slidesPerView]);

  // Effects
  useEffect(() => {
    setSlidesPerView(getSlidesPerView());
  }, [getSlidesPerView]);
  
  useEffect(() => {
    if (loaded && posts.length > 0) {
      updatePagesCount();
    }
  }, [slidesPerView, updatePagesCount, loaded, posts.length]);
  
  // Calculate current page
  const currentPage = Math.floor(currentSlide / Math.max(1, slidesPerView));
  
  // Initialize slider with keen-slider
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: slidesPerView,
      spacing: 16,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });
  
  // Event handlers
  const handlePrevPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    if (!instanceRef.current || currentPage <= 0) return;
    
    const targetSlide = (currentPage - 1) * slidesPerView;
    instanceRef.current.moveToIdx(targetSlide);
  };
  
  const handleNextPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    if (!instanceRef.current || currentPage >= pagesCount - 1) return;
    
    const targetSlide = (currentPage + 1) * slidesPerView;
    instanceRef.current.moveToIdx(targetSlide);
  };
  
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

  // Parse HTML content if needed
  const parseHTML = (htmlString: string) => {
    try {
      return htmlString.replace(/<\/?[^>]+(>|$)/g, '');
    } catch (error) {
      return htmlString;
    }
  };

  if (isLoading) {
    return (
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="w-1.5 h-5 bg-primary mr-2.5 inline-block rounded-sm"></span>
              Tin tức mới nhất
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-full bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="w-1.5 h-5 bg-primary mr-2.5 inline-block rounded-sm"></span>
              Tin tức mới nhất
            </h2>
          </div>
          <div className="bg-red-50 p-4 rounded-md text-red-500 text-center">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="w-1.5 h-5 bg-primary mr-2.5 inline-block rounded-sm"></span>
              Tin tức mới nhất
            </h2>
          </div>
          <div className="bg-gray-50 p-4 rounded-md text-gray-500 text-center">
            Không có tin tức mới.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="w-1.5 h-5 bg-primary mr-2.5 inline-block rounded-sm"></span>
            Tin tức mới nhất
          </h2>
          
          {loaded && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-md h-9 w-9 border-gray-300"
                onClick={handlePrevPage}
                disabled={currentPage <= 0}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Trang trước</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-md h-9 w-9 border-gray-300"
                onClick={handleNextPage}
                disabled={currentPage >= pagesCount - 1}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Trang tiếp</span>
              </Button>
            </div>
          )}
        </div>
        
        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {posts.map((post) => (
              <div key={post.id} className="keen-slider__slide">
                <Link href={`/tin-tuc/${post.id}`} className="group block h-full">
                  <div className="h-full bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="relative h-48 overflow-hidden">
                      {post.thumbnail ? (
                        <Image
                          src={post.thumbnail}
                          alt={parseHTML(post.title)}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                          <span>{formatDate(post.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatTime(post.date)}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 h-[3.5rem] group-hover:text-blue-600 transition-colors">
                        {parseHTML(post.title)}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-2 line-clamp-3 h-[4.5rem]">
                        {parseHTML(post.excerpt)}
                      </p>
                      
                      <div className="text-blue-600 text-xs font-medium group-hover:underline">
                        Đọc tiếp
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 