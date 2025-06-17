"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery, breakpoints } from "@/hooks/useMediaQuery";
import { Post } from "@/types/wordpress";
import { fetchPosts } from "@/services/wordpressService";

export function LatestNews() {
  // Use media queries first - these hooks must be called unconditionally
  const isSmScreen = useMediaQuery(breakpoints.sm);
  const isLgScreen = useMediaQuery(breakpoints.lg);
  
  // Calculate responsive states from the media query results
  const isMobile = !isSmScreen;
  const isTablet = isSmScreen && !isLgScreen;
  const isDesktop = isLgScreen;
  
  // All state hooks
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const [pagesCount, setPagesCount] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from WordPress API
  useEffect(() => {
    const getLatestPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetchPosts(1, 8); // Get 8 latest posts
        setPosts(response.posts);
        setError(null);
      } catch (err) {
        console.error("Error fetching latest posts:", err);
        setError("Không thể tải tin tức. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    getLatestPosts();
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
  }, [slidesPerView, posts.length]);

  // Effects
  useEffect(() => {
    setSlidesPerView(getSlidesPerView());
  }, [getSlidesPerView]);
  
  useEffect(() => {
    if (loaded) {
      updatePagesCount();
    }
  }, [slidesPerView, updatePagesCount, loaded]);
  
  // Calculate current page
  const currentPage = Math.floor(currentSlide / Math.max(1, slidesPerView));
  
  // Initialize slider with keen-slider
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: slidesPerView,
      spacing: 12,
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

  // Helper functions
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

  // Add debug logging to help identify the issue
  useEffect(() => {
    if (posts.length > 0) {
      console.log('Debug - Post URLs:', posts.map(post => ({
        id: post.id,
        url: post.url,
        extractedSlug: post.url ? getSlugFromUrl(post.url) : post.id.toString()
      })));
    }
  }, [posts]);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="w-1.5 h-5 bg-primary mr-2.5 inline-block rounded-sm"></span>
              Tin tức mới nhất
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-full bg-white border border-neutral-200 rounded-md overflow-hidden shadow-sm">
                <div className="h-40 bg-neutral-200 animate-pulse"></div>
                <div className="p-3">
                  <div className="h-4 bg-neutral-200 rounded animate-pulse mb-4 w-1/3"></div>
                  <div className="h-5 bg-neutral-200 rounded animate-pulse mb-2"></div>
                  <div className="h-5 bg-neutral-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
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

  // Empty state
  if (posts.length === 0) {
    return (
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="w-1.5 h-5 bg-primary mr-2.5 inline-block rounded-sm"></span>
              Tin tức mới nhất
            </h2>
          </div>
          <div className="bg-neutral-50 p-4 rounded-md text-neutral-500 text-center">
            Không có tin tức mới.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="w-1.5 h-5 bg-primary mr-2.5 inline-block rounded-sm"></span>
            Tin tức mới nhất
          </h2>
          {loaded && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-md h-7 w-7 border-neutral-300"
                onClick={handlePrevPage}
                disabled={currentPage <= 0}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Trang trước</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-md h-7 w-7 border-neutral-300"
                onClick={handleNextPage}
                disabled={currentPage >= pagesCount - 1}
              >
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Trang tiếp</span>
              </Button>
            </div>
          )}
        </div>
        
        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {posts.map((post) => {
              // Get slug from URL or use ID as fallback
              const postSlug = post.url ? getSlugFromUrl(post.url) : post.id.toString();
              
              return (
                <div key={post.id} className="keen-slider__slide">
                  <Link href={getPostUrl(post)} className="block h-full group">
                    <div className="h-full bg-white border border-neutral-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="relative h-40 overflow-hidden">
                        {post.thumbnail ? (
                          <Image
                            src={post.thumbnail}
                            alt={parseHTML(post.title)}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                            <span className="text-neutral-400">Không có ảnh</span>
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
                      <div className="p-3">
                        <div className="flex items-center space-x-3 text-[10px] text-neutral-500 mb-1.5">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-0.5" />
                            <span>{formatDate(post.date)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-0.5" />
                            <span>{formatTime(post.date)}</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-base mb-1.5 line-clamp-2 h-[2.75rem] group-hover:text-blue-600 transition-colors">
                          {parseHTML(post.title)}
                        </h3>
                        <p className="text-neutral-600 text-xs mb-1 line-clamp-2 h-[2rem]">
                          {parseHTML(post.excerpt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
} 