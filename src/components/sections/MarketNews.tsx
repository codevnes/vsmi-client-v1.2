"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, ChevronRight, Circle, CircleDot } from "lucide-react";

// Mock data - should be moved to a separate file or API call in production
const marketNewsData = [
    {
        id: 1,
        content: "Thị trường chứng khoán Việt Nam tăng điểm mạnh phiên thứ 3 liên tiếp. Khối ngoại mua ròng hơn 500 tỷ đồng. Các cổ phiếu ngân hàng dẫn dắt đà tăng của thị trường.",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    },
    {
        id: 2,
        content: "FED giữ nguyên lãi suất trong cuộc họp mới nhất. Thị trường dự báo có thể giảm lãi suất vào cuối năm nay. Đồng USD suy yếu sau quyết định của FED.",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
    },
    {
        id: 3,
        content: "Giá dầu tăng mạnh do căng thẳng địa chính trị ở Trung Đông. Các cổ phiếu dầu khí ghi nhận mức tăng ấn tượng. Nhà đầu tư đang quan tâm đến nhóm cổ phiếu hưởng lợi từ giá dầu.",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8) // 8 hours ago
    },
    {
        id: 4,
        content: "TTCK Châu Á đồng loạt tăng điểm sau số liệu kinh tế tích cực từ Trung Quốc. Giá vàng tiếp tục neo ở mức cao kỷ lục. Nhà đầu tư kỳ vọng vào chính sách kích thích kinh tế mới.",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
    },
    {
        id: 5,
        content: "Khối ngoại bán ròng phiên thứ 2 liên tiếp trên HOSE. VN-Index giảm nhẹ do áp lực chốt lời. Thanh khoản thị trường duy trì ở mức trung bình so với 20 phiên gần nhất.",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
    },
    {
        id: 6,
        content: "Cổ phiếu công nghệ dẫn đầu đà tăng trên thị trường toàn cầu. Các nhà đầu tư lạc quan về triển vọng lợi nhuận trong quý tới. Chỉ số Nasdaq thiết lập đỉnh cao mới.",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 36) // 36 hours ago
    },
    {
        id: 7,
        content: "Thị trường Bitcoin ghi nhận biến động mạnh sau tin tức về quy định mới. Giá tiền ảo giảm hơn 5% trong 24 giờ qua. Nhà đầu tư thận trọng chờ đợi diễn biến tiếp theo.",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
    },
    {
        id: 8,
        content: "Ngân hàng Trung ương Châu Âu công bố chính sách tiền tệ mới. Euro tăng giá so với USD. Thị trường chứng khoán Châu Âu phản ứng tích cực với quyết định này.",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 60) // 2.5 days ago
    },
    {
        id: 9,
        content: "Lạm phát tại Mỹ có dấu hiệu giảm nhiệt. Nhà đầu tư kỳ vọng FED sẽ nới lỏng chính sách tiền tệ. Thị trường trái phiếu ghi nhận biến động lớn.",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 72) // 3 days ago
    },
    {
        id: 10,
        content: "Thị trường bất động sản Việt Nam có dấu hiệu hồi phục. Giao dịch tăng mạnh tại các đô thị lớn. Cổ phiếu nhóm bất động sản dẫn đầu thị trường chứng khoán.",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 96) // 4 days ago
    }
];

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
        slides: { perView: isMobile ? 3 : 6, spacing: 12 },
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
                <div
                    ref={sliderRef}
                    className={`keen-slider ${isMobile ? 'h-[400px]' : 'h-[800px]'}`}
                    aria-label="Market News Slider"
                >
                    {marketNewsData.map((news) => (
                        <div key={news.id} className="keen-slider__slide">
                            <NewsItem news={news} />
                        </div>
                    ))}
                </div>

                {instanceRef.current && (
                    <div className="flex justify-center mt-4 space-x-2">
                        {[...Array(marketNewsData.length).keys()].map((idx) => {
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
            </div>
        </div>
    );
}

function NewsItem({ news }: { news: { id: number; content: string; publishedAt: Date } }) {
    return (
        <div className="bg-neutral-50 p-4 rounded h-full hover:bg-gray-100 transition-colors">
            <p className="text-sm text-gray-800 mb-3">{news.content}</p>
            <p className="text-xs text-gray-500 mt-auto">
                {formatDistanceToNow(news.publishedAt, { addSuffix: true })}
            </p>
        </div>
    );
} 