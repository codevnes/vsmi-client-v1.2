"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery, breakpoints } from "@/hooks/useMediaQuery";

// Mocked news data
const newsData = [
  {
    id: 1,
    title: "VN-Index lấy lại mốc 1,200 điểm nhờ lực kéo từ cổ phiếu ngân hàng",
    description: "Thị trường chứng khoán ngày hôm nay ghi nhận sự tăng điểm ấn tượng khi nhóm cổ phiếu ngân hàng đồng loạt bứt phá mạnh mẽ.",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop",
    category: "Thị trường",
    date: "12/5/2025",
    time: "15:30",
    url: "/news/1"
  },
  {
    id: 2,
    title: "Nhà đầu tư cần lưu ý gì trước thềm báo cáo tài chính quý II/2023?",
    description: "Mùa báo cáo tài chính đang đến gần, nhiều doanh nghiệp dự kiến công bố kết quả kinh doanh trong tuần tới.",
    image: "https://images.unsplash.com/photo-1579225663317-c0251b4369bc?q=80&w=800&auto=format&fit=crop",
    category: "Phân tích",
    date: "11/5/2025",
    time: "09:45",
    url: "/news/2"
  },
  {
    id: 3,
    title: "Dòng tiền ngoại tiếp tục rút ròng khỏi thị trường chứng khoán Việt Nam",
    description: "Tuần qua, khối ngoại bán ròng hơn 1,200 tỷ đồng trên 3 sàn chứng khoán, tập trung chủ yếu vào các cổ phiếu vốn hóa lớn.",
    image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=800&auto=format&fit=crop",
    category: "Khối ngoại",
    date: "10/5/2025",
    time: "14:15",
    url: "/news/3"
  },
  {
    id: 4,
    title: "Giá vàng lập đỉnh mới, nhà đầu tư chứng khoán chuyển dịch dòng tiền",
    description: "Vàng tiếp tục xu hướng tăng giá khi căng thẳng địa chính trị leo thang, tạo ra áp lực lên thị trường chứng khoán.",
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=800&auto=format&fit=crop",
    category: "Thị trường",
    date: "09/5/2025",
    time: "10:20",
    url: "/news/4"
  },
  {
    id: 5,
    title: "Kinh tế Việt Nam quý II/2023 tăng trưởng 6.7%, vượt dự báo",
    description: "Số liệu mới công bố từ Tổng cục Thống kê cho thấy nền kinh tế Việt Nam đang phục hồi tốt hơn dự kiến, hỗ trợ tích cực cho thị trường chứng khoán.",
    image: "https://images.unsplash.com/photo-1604594849809-dfedbc827105?q=80&w=800&auto=format&fit=crop",
    category: "Kinh tế vĩ mô",
    date: "08/5/2025",
    time: "16:45",
    url: "/news/5"
  },
  {
    id: 6,
    title: "Định giá cổ phiếu ngành bán lẻ Việt Nam thấp nhất trong 3 năm",
    description: "Các chuyên gia phân tích cho rằng đây có thể là thời điểm tốt để tích lũy cổ phiếu bán lẻ chất lượng với định giá hấp dẫn.",
    image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?q=80&w=800&auto=format&fit=crop",
    category: "Phân tích",
    date: "07/5/2025",
    time: "11:30",
    url: "/news/6"
  },
  {
    id: 7,
    title: "Thị trường mở đầu tuần mới trong sắc xanh, khối lượng cải thiện",
    description: "Sự trở lại của dòng tiền đã giúp VN-Index tăng điểm tích cực với thanh khoản tăng hơn 15% so với phiên trước.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    category: "Thị trường",
    date: "15/5/2025",
    time: "16:30",
    url: "/news/7"
  },
  {
    id: 8,
    title: "Làm thế nào để xây dựng danh mục đầu tư hiệu quả trong năm 2023?",
    description: "Các chuyên gia chia sẻ chiến lược phân bổ tài sản và lựa chọn cổ phiếu trong môi trường lãi suất thay đổi.",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop",
    category: "Phân tích",
    date: "14/5/2025",
    time: "10:15",
    url: "/news/8"
  }
];

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

  // Callbacks
  const getSlidesPerView = useCallback(() => {
    if (isMobile) return 2;
    if (isTablet) return 3;
    return 4; // Desktop default
  }, [isMobile, isTablet]);
  
  const updatePagesCount = useCallback(() => {
    const count = Math.ceil(newsData.length / Math.max(1, slidesPerView));
    setPagesCount(count);
  }, [slidesPerView]);

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
  
  const handlePageChange = (page: number) => {
    if (!instanceRef.current) return;
    
    const targetSlide = page * slidesPerView;
    instanceRef.current.moveToIdx(targetSlide);
  };

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
            {newsData.map((news) => (
              <div key={news.id} className="keen-slider__slide">
                <div className="block h-full group">
                  <div className="h-full bg-white border border-neutral-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-600 text-white rounded-sm">
                          {news.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center space-x-3 text-[10px] text-neutral-500 mb-1.5">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-0.5" />
                          <span>{news.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-0.5" />
                          <span>{news.time}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-base mb-1.5 line-clamp-2 h-[2.75rem] group-hover:text-blue-600 transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-neutral-600 text-xs mb-1 line-clamp-2 h-[2rem]">
                        {news.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination - page dots */}
        {loaded && pagesCount > 1 && (
          <div className="flex justify-center items-center mt-4">
            {[...Array(pagesCount)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx)}
                className={cn("w-6 h-1.5 mx-0.5 rounded-sm transition-colors", {
                  "bg-blue-600": currentPage === idx,
                  "bg-neutral-200": currentPage !== idx,
                })}
                aria-label={`Go to page ${idx + 1}`}
                aria-current={currentPage === idx ? "page" : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 