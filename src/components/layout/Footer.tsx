"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Youtube, 
  Linkedin, 
  TrendingUp, 
  BarChart2, 
  FileText, 
  Shield, 
  BookOpen, 
  Briefcase, 
  HelpCircle, 
  ChevronRight,
  Clock,
  DollarSign,
  Award,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted (client-side only)
    setIsMounted(true);
    // Set initial time
    setCurrentTime(new Date().toLocaleTimeString('vi-VN'));
    
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('vi-VN'));
    }, 1000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-white border-t border-neutral-200">
      {/* Market Data Strip */}
      <div className="bg-neutral-50 py-3 border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-neutral-500" />
              <span className="text-xs font-medium">Cập nhật: {isMounted ? currentTime : "Đang tải..."}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium whitespace-nowrap">VN-Index</span>
                <span className="font-medium text-sm">1,245.68</span>
                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-100 text-xs font-medium px-1.5 py-0 h-5">+2.45%</Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium whitespace-nowrap">HNX-Index</span>
                <span className="font-medium text-sm">235.78</span>
                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-100 text-xs font-medium px-1.5 py-0 h-5">+1.25%</Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium whitespace-nowrap">UPCOM-Index</span>
                <span className="font-medium text-sm">89.63</span>
                <Badge variant="outline" className="text-red-600 bg-red-50 border-red-100 text-xs font-medium px-1.5 py-0 h-5">-0.37%</Badge>
              </div>
            </div>
            <Link href="/market" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center">
              Xem thêm <ChevronRight className="h-3 w-3 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-3 space-y-4">
            <Link href="/" className="inline-block mb-4">
              <span className="font-bold text-2xl">VSMI</span>
            </Link>
            <p className="text-neutral-600 text-sm">
              Nền tảng thông tin chứng khoán hàng đầu Việt Nam, cung cấp dữ liệu thị trường, công cụ phân tích chuyên sâu và tin tức tài chính kịp thời.
            </p>
            <div className="flex items-center space-x-3 pt-4">
              <Link href="https://facebook.com" target="_blank" className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center hover:bg-blue-100 transition-colors">
                <Facebook className="h-4 w-4 text-neutral-700" />
              </Link>
              <Link href="https://twitter.com" target="_blank" className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center hover:bg-blue-100 transition-colors">
                <Twitter className="h-4 w-4 text-neutral-700" />
              </Link>
              <Link href="https://youtube.com" target="_blank" className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center hover:bg-blue-100 transition-colors">
                <Youtube className="h-4 w-4 text-neutral-700" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center hover:bg-blue-100 transition-colors">
                <Linkedin className="h-4 w-4 text-neutral-700" />
              </Link>
            </div>
            
            <div className="pt-4">
              <Badge variant="outline" className="mr-2 mb-2 border-blue-200 bg-blue-50 text-xs">
                <TrendingUp className="h-3 w-3 mr-1" /> Dữ liệu thời gian thực
              </Badge>
              <Badge variant="outline" className="mr-2 mb-2 border-blue-200 bg-blue-50 text-xs">
                <Shield className="h-3 w-3 mr-1" /> Bảo mật cao
              </Badge>
              <Badge variant="outline" className="mr-2 mb-2 border-blue-200 bg-blue-50 text-xs">
                <FileText className="h-3 w-3 mr-1" /> Báo cáo chuyên sâu
              </Badge>
            </div>
          </div>

          {/* Main Links */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-lg">Thị trường</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/market/overview" className="text-neutral-600 hover:text-blue-600 text-sm flex items-center">
                <ChevronRight className="h-3 w-3 mr-1.5 text-neutral-400" /> Tổng quan
              </Link>
              <Link href="/market/stocks" className="text-neutral-600 hover:text-blue-600 text-sm flex items-center">
                <ChevronRight className="h-3 w-3 mr-1.5 text-neutral-400" /> Cổ phiếu
              </Link>
              <Link href="/market/industries" className="text-neutral-600 hover:text-blue-600 text-sm flex items-center">
                <ChevronRight className="h-3 w-3 mr-1.5 text-neutral-400" /> Ngành
              </Link>
              <Link href="/market/foreign" className="text-neutral-600 hover:text-blue-600 text-sm flex items-center">
                <ChevronRight className="h-3 w-3 mr-1.5 text-neutral-400" /> Khối ngoại
              </Link>
              <Link href="/market/derivatives" className="text-neutral-600 hover:text-blue-600 text-sm flex items-center">
                <ChevronRight className="h-3 w-3 mr-1.5 text-neutral-400" /> Phái sinh
              </Link>
              <Link href="/market/bonds" className="text-neutral-600 hover:text-blue-600 text-sm flex items-center">
                <ChevronRight className="h-3 w-3 mr-1.5 text-neutral-400" /> Trái phiếu
              </Link>
            </nav>
          </div>

          {/* Tools */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-lg">Công cụ</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/tools/screener" className="text-neutral-600 hover:text-blue-600 text-sm flex items-center">
                <ChevronRight className="h-3 w-3 mr-1.5 text-neutral-400" /> Lọc cổ phiếu
              </Link>
              <Link href="/tools/technical" className="text-neutral-600 hover:text-blue-600 text-sm flex items-center">
                <ChevronRight className="h-3 w-3 mr-1.5 text-neutral-400" /> Phân tích kỹ thuật
              </Link>
              <Link href="/tools/fundamental" className="text-neutral-600 hover:text-blue-600 text-sm flex items-center">
                <ChevronRight className="h-3 w-3 mr-1.5 text-neutral-400" /> Phân tích cơ bản
              </Link>
              <Link href="/tools/portfolio" className="text-neutral-600 hover:text-blue-600 text-sm flex items-center">
                <ChevronRight className="h-3 w-3 mr-1.5 text-neutral-400" /> Quản lý danh mục
              </Link>
              <Link href="/tools/alerts" className="text-neutral-600 hover:text-blue-600 text-sm flex items-center">
                <ChevronRight className="h-3 w-3 mr-1.5 text-neutral-400" /> Cảnh báo giá
              </Link>
              <Link href="/tools/calendar" className="text-neutral-600 hover:text-blue-600 text-sm flex items-center">
                <ChevronRight className="h-3 w-3 mr-1.5 text-neutral-400" /> Lịch sự kiện
              </Link>
            </nav>
          </div>

          {/* Education */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-lg">Kiến thức</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/education/basics" className="text-neutral-600 hover:text-blue-600 text-sm flex items-center">
                <ChevronRight className="h-3 w-3 mr-1.5 text-neutral-400" /> Kiến thức cơ bản
              </Link>
              <Link href="/education/technical" className="text-neutral-600 hover:text-blue-600 text-sm flex items-center">
                <ChevronRight className="h-3 w-3 mr-1.5 text-neutral-400" /> Phân tích kỹ thuật
              </Link>
              <Link href="/education/fundamental" className="text-neutral-600 hover:text-blue-600 text-sm flex items-center">
                <ChevronRight className="h-3 w-3 mr-1.5 text-neutral-400" /> Phân tích cơ bản
              </Link>
              <Link href="/education/strategies" className="text-neutral-600 hover:text-blue-600 text-sm flex items-center">
                <ChevronRight className="h-3 w-3 mr-1.5 text-neutral-400" /> Chiến lược đầu tư
              </Link>
              <Link href="/education/videos" className="text-neutral-600 hover:text-blue-600 text-sm flex items-center">
                <ChevronRight className="h-3 w-3 mr-1.5 text-neutral-400" /> Video hướng dẫn
              </Link>
              <Link href="/education/glossary" className="text-neutral-600 hover:text-blue-600 text-sm flex items-center">
                <ChevronRight className="h-3 w-3 mr-1.5 text-neutral-400" /> Thuật ngữ
              </Link>
            </nav>
          </div>

          {/* Newsletter & Contact */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-blue-600" />
                Nhận bản tin MarketPulse
              </h3>
              <p className="text-neutral-600 text-sm mb-3">
                Nhận báo cáo thị trường, phân tích cổ phiếu tiềm năng và cập nhật tin tức tài chính từ các chuyên gia hàng đầu.
              </p>
              <div className="flex mt-2">
                <Input 
                  type="email"
                  placeholder="Email của bạn"
                  className="rounded-r-none border-r-0 bg-white"
                />
                <Button className="rounded-l-none bg-blue-600 hover:bg-blue-700">
                  Đăng ký
                </Button>
              </div>
              <p className="text-neutral-500 text-xs mt-2">
                Chúng tôi sẽ không gửi spam. Bạn có thể hủy đăng ký bất cứ lúc nào.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">Liên hệ</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 text-sm">
                  <MapPin className="h-4 w-4 text-neutral-500 mt-0.5" />
                  <span className="text-neutral-600">Tầng 18, Tòa nhà Vietcombank Tower, 198 Trần Quang Khải, Hoàn Kiếm, Hà Nội</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-neutral-500" />
                  <a href="tel:+84123456789" className="text-neutral-600 hover:text-blue-600">+84 123 456 789</a>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-neutral-500" />
                  <a href="mailto:info@vsmi.vn" className="text-neutral-600 hover:text-blue-600">info@vsmi.vn</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About & Awards */}
        <div className="mt-12 pt-8 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
              Về VSMI
            </h3>
            <p className="text-neutral-600 text-sm mb-4">
              VSMI là nền tảng thông tin tài chính trực tuyến hàng đầu tại Việt Nam, cung cấp dữ liệu thị trường, công cụ phân tích chuyên sâu và giải pháp đầu tư cho nhà đầu tư cá nhân và tổ chức. Với 10+ năm kinh nghiệm trong ngành tài chính, chúng tôi cam kết mang đến những thông tin nhanh chóng, chính xác và đáng tin cậy.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link href="/about" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Về chúng tôi
              </Link>
              <span className="text-neutral-300">|</span>
              <Link href="/careers" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Tuyển dụng
              </Link>
              <span className="text-neutral-300">|</span>
              <Link href="/press" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Báo chí
              </Link>
              <span className="text-neutral-300">|</span>
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Liên hệ
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Award className="h-4 w-4 mr-2 text-blue-600" />
              Giải thưởng & Chứng nhận
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Top 10 Fintech</p>
                  <p className="text-xs text-neutral-500">2023 - Vietnam Fintech Awards</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <BarChart2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Best Trading Platform</p>
                  <p className="text-xs text-neutral-500">2022 - Finance Asia</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="mt-12 pt-6 border-t border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-500">
              <Link href="/privacy" className="hover:text-blue-600">
                Chính sách riêng tư
              </Link>
              <Link href="/terms" className="hover:text-blue-600">
                Điều khoản sử dụng
              </Link>
              <Link href="/disclaimer" className="hover:text-blue-600">
                Tuyên bố miễn trách
              </Link>
              <Link href="/security" className="hover:text-blue-600">
                Bảo mật
              </Link>
              <Link href="/sitemap" className="hover:text-blue-600">
                Sitemap
              </Link>
            </div>
            <div>
              <p className="text-neutral-500 text-sm md:text-right">
                © {new Date().getFullYear()} VSMI Securities JSC. 
                Giấy phép UBCK số 45/GPHĐKD. 
                Tất cả các quyền được bảo lưu.
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="text-xs text-neutral-500 opacity-80">
            <p>
              <strong>Tuyên bố miễn trừ trách nhiệm:</strong> Thông tin trên website này chỉ mang tính chất tham khảo và không cấu thành lời khuyên đầu tư. VSMI không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng thông tin này. Đầu tư chứng khoán luôn tiềm ẩn rủi ro, giá trị đầu tư có thể tăng hoặc giảm và nhà đầu tư có thể không lấy lại được toàn bộ số tiền đã đầu tư.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Missing icon definitions
function Trophy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
} 