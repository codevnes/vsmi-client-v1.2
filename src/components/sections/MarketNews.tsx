"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, ChevronRight, Circle, CircleDot } from "lucide-react";
import { type NewsItem, type NewsResponse, fetchNewsItems } from "@/services/newsService";
import { NewsDialog } from "@/components/dialogs/NewsDialog";

// Custom autoplay plugin
const AutoplayPlugin = (interval = 3000) => {
    return (slider: any) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;

        function clearNextTimeout() {
            clearTimeout(timeout);
        }

        function nextTimeout() {
            clearTimeout(timeout);
            if (mouseOver) return;
            timeout = setTimeout(() => {
                slider.next();
            }, interval);
        }

        slider.on("created", () => {
            slider.container.addEventListener("mouseover", () => {
                mouseOver = true;
                clearNextTimeout();
            });
            slider.container.addEventListener("mouseout", () => {
                mouseOver = false;
                nextTimeout();
            });
            nextTimeout();
        });

        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);

        // Make sure to clear the timeout when the component unmounts to avoid memory leaks
        return () => {
            clearNextTimeout();
        };
    };
};

export default function MarketNews() {
    const [isMobile, setIsMobile] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [newsData, setNewsData] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<NewsResponse['meta'] | null>(null);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Fetch news data from API
    useEffect(() => {
        const getNews = async () => {
            try {
                // Set appropriate loading state based on whether this is initial load or loading more
                if (page === 1) {
                    setLoading(true);
                } else {
                    setLoadingMore(true);
                }
                
                const response = await fetchNewsItems(page, 10);
                
                // If it's the first page, replace the data
                // Otherwise append to existing data
                if (page === 1) {
                    setNewsData(response.data);
                } else {
                    setNewsData(prev => [...prev, ...response.data]);
                }
                
                setMeta(response.meta);
                setError(null);
            } catch (err) {
                console.error('Error fetching news:', err);
                setError('Failed to load news data');
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };

        getNews();
    }, [page]);

    // Handle opening the news dialog
    const handleOpenNewsDialog = useCallback((news: NewsItem) => {
        setSelectedNews(news);
        setIsDialogOpen(true);
    }, []);

    // Handle closing the news dialog
    const handleCloseNewsDialog = useCallback(() => {
        setIsDialogOpen(false);
        // Give some time for animation to complete before removing the news data
        setTimeout(() => setSelectedNews(null), 300);
    }, []);

    // Function to load more news
    const handleLoadMore = useCallback(() => {
        if (meta && page < meta.totalPages) {
            setPage(prev => prev + 1);
        }
    }, [meta, page]);

    // Use callback to memoize the resize handler
    const checkScreenSize = useCallback(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    useEffect(() => {
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, [checkScreenSize]);

    // Memoize slider options to prevent unnecessary recalculations
    const sliderOptions = useMemo(() => ({
        vertical: true, // Always vertical for both mobile and desktop
        slides: { perView: isMobile ? 2 : 3, spacing: 12 },
        loop: true,
        defaultAnimation: {
            duration: isMobile ? 1000 : 2000,
        },
        dragSpeed: 0.8,
        slideChanged(s: any) {
            setCurrentSlide(s.track.details.rel);
        },
    }), [isMobile]);

    const [sliderRef, instanceRef] = useKeenSlider(
        sliderOptions,
        [AutoplayPlugin(3000)]
    );

    // If there's no data after loading, show a message
    if (!loading && !error && newsData.length === 0) {
        return (
            <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <span className="w-1.5 h-6 bg-primary mr-3 inline-block rounded-sm"></span>
                        Tin tức Thị trường
                    </h2>
                </div>
                <div className="bg-white p-8 text-center">
                    <p className="text-gray-500">Không có tin tức nào.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <span className="w-1.5 h-6 bg-primary mr-3 inline-block rounded-sm"></span>
                    Tin tức Thị trường
                </h2>
                <div className="flex space-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            instanceRef.current?.prev();
                        }}
                        className="p-1 rounded-full hover:bg-neutral-200 transition-colors"
                        aria-label="Previous news"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            instanceRef.current?.next();
                        }}
                        className="p-1 rounded-full hover:bg-neutral-200 transition-colors"
                        aria-label="Next news"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
            <div className="bg-white overflow-hidden">
                {loading && (
                    <div className="h-[400px] flex items-center justify-center">
                        <p className="text-gray-500">Loading news...</p>
                    </div>
                )}
                
                {error && (
                    <div className="h-[400px] flex items-center justify-center">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}
                
                {!loading && !error && newsData.length > 0 && (
                    <div
                        ref={sliderRef}
                        className={`keen-slider ${isMobile ? 'h-[400px]' : 'h-[800px]'}`}
                        aria-label="Market News Slider"
                    >
                        {newsData.map((news) => (
                            <div key={news.id} className="keen-slider__slide">
                                <NewsItem news={news} onSelect={handleOpenNewsDialog} />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && newsData.length > 0 && instanceRef.current && (
                    <div className="flex justify-center mt-4 space-x-2">
                        {[...Array(newsData.length).keys()].map((idx) => {
                            const isActive = currentSlide === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        instanceRef.current?.moveToIdx(idx);
                                    }}
                                    aria-label={`Go to slide ${idx + 1}`}
                                    className="focus:outline-none"
                                >
                                    {isActive ? (
                                        <CircleDot className="h-3 w-3 text-blue-600" />
                                    ) : (
                                        <Circle className="h-3 w-3 text-gray-300" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
                
                {!loading && !error && meta && page < meta.totalPages && (
                    <div className="flex justify-center mt-6">
                        <button 
                            onClick={handleLoadMore}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                            disabled={loadingMore}
                        >
                            {loadingMore ? 'Đang tải...' : 'Xem thêm tin tức'}
                        </button>
                    </div>
                )}
            </div>

            {/* News Dialog */}
            <NewsDialog 
                news={selectedNews} 
                isOpen={isDialogOpen} 
                onClose={handleCloseNewsDialog} 
            />
        </div>
    );
}

interface NewsItemProps {
    news: NewsItem;
    onSelect: (news: NewsItem) => void;
}

function NewsItem({ news, onSelect }: NewsItemProps) {
    const handleClick = () => {
        onSelect(news);
    };

    return (
        <div 
            className="bg-neutral-50 p-4 rounded h-full hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={handleClick}
        >
            <p className="text-sm font-medium mb-2">{news.title}</p>
            <p className="text-sm text-gray-800 mb-3">{news.summarizedContent}</p>
            <div className="flex justify-between text-xs text-gray-500 mt-auto">
                <span>{news.sourceWebsite}</span>
                <span>{formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })}</span>
            </div>
        </div>
    );
} 