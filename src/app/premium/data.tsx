import React from "react";
import { Sparkles, Clock, HeadphonesIcon, Brain, Bot, BarChart3, LineChart, Lightbulb, Cpu, Star, AlertTriangle } from "lucide-react";
import { PremiumPlan, PremiumBenefit, AIFeature, Testimonial } from "./types";

export const premiumPlans: PremiumPlan[] = [
  {
    id: "trial",
    name: "Dùng thử Premium",
    originalPrice: null,
    price: 0,
    period: "7 ngày",
    description: "Trải nghiệm đầy đủ tính năng Premium trong 7 ngày miễn phí",
    buttonText: "Bắt đầu dùng thử",
    tag: "Miễn phí",
    highlight: false,
    savings: null,
    pricePerMonth: null,
  },
  {
    id: "monthly",
    name: "Gói 1 tháng",
    originalPrice: 399000,
    price: 99000,
    period: "1 tháng",
    description: "Truy cập đầy đủ tính năng Premium trong 1 tháng với giá ưu đãi",
    buttonText: "Nâng cấp ngay",
    tag: "Ưu đãi ra mắt",
    highlight: true,
    savings: "75%",
    pricePerMonth: 99000,
  },
  {
    id: "half-year",
    name: "Gói 6 tháng",
    originalPrice: null,
    price: 499000,
    period: "6 tháng",
    description: "Tiết kiệm chi phí với gói 6 tháng",
    buttonText: "Nâng cấp",
    tag: null,
    highlight: false,
    savings: null,
    pricePerMonth: 83000,
  },
  {
    id: "annual",
    name: "Gói 12 tháng",
    originalPrice: null,
    price: 799000,
    period: "12 tháng",
    description: "Lựa chọn tiết kiệm nhất cho nhà đầu tư dài hạn",
    buttonText: "Tiết kiệm nhất",
    tag: null,
    highlight: false,
    savings: null,
    pricePerMonth: 66000,
  },
];

export const premiumBenefits: PremiumBenefit[] = [
  {
    icon: <Sparkles className="h-5 w-5 text-blue-500" />,
    title: "Phân tích chuyên sâu",
    description: "Xem toàn bộ phân tích kỹ thuật, định giá cổ phiếu từ chuyên gia",
  },
  {
    icon: <Brain className="h-5 w-5 text-blue-500" />,
    title: "Công cụ AI mạnh mẽ",
    description: "Được training bởi các nhà phân tích với nhiều năm kinh nghiệm",
  },
  {
    icon: <Clock className="h-5 w-5 text-blue-500" />,
    title: "Khuyến nghị real-time",
    description: "Nhận khuyến nghị mua/bán từ các chuyên gia hàng đầu",
  },
  {
    icon: <AlertTriangle className="h-5 w-5 text-blue-500" />,
    title: "Cảnh báo biến động",
    description: "Cảnh báo kịp thời về các biến động bất thường của cổ phiếu",
  },
  {
    icon: <HeadphonesIcon className="h-5 w-5 text-blue-500" />,
    title: "Hỗ trợ ưu tiên",
    description: "Được ưu tiên hỗ trợ kỹ thuật và giải đáp thắc mắc",
  },
];

export const aiFeatures: AIFeature[] = [
  {
    icon: <Bot className="h-10 w-10 text-indigo-500" />,
    title: "AI Phân tích tự động",
    description: "Phân tích kỹ thuật tự động dựa trên 50+ chỉ báo và mô hình nến"
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-indigo-500" />,
    title: "Dự báo xu hướng",
    description: "Dự báo xu hướng thị trường dựa trên mô hình AI học từ dữ liệu lịch sử"
  },
  {
    icon: <LineChart className="h-10 w-10 text-indigo-500" />,
    title: "Phát hiện mẫu hình",
    description: "Nhận diện các mẫu hình biểu đồ với độ chính xác cao"
  },
  {
    icon: <Lightbulb className="h-10 w-10 text-indigo-500" />,
    title: "Khuyến nghị thông minh",
    description: "Đề xuất giao dịch dựa trên phân tích đa chiều và đặc điểm nhà đầu tư"
  },
  {
    icon: <Cpu className="h-10 w-10 text-indigo-500" />,
    title: "Xử lý dữ liệu đa nguồn",
    description: "Tổng hợp và phân tích dữ liệu từ nhiều nguồn tin khác nhau"
  },
  {
    icon: <Star className="h-10 w-10 text-indigo-500" />,
    title: "Tùy chỉnh cá nhân hóa",
    description: "Tự động điều chỉnh theo phong cách đầu tư và mục tiêu của bạn"
  },
];

export const testimonials: Testimonial[] = [
  {
    initials: "NT",
    name: "Nguyễn Thành",
    role: "Nhà đầu tư cá nhân",
    content: "Tính năng phân tích AI của VSMI giúp tôi tiết kiệm rất nhiều thời gian nghiên cứu. Các khuyến nghị rất chính xác và kịp thời."
  },
  {
    initials: "TL",
    name: "Trần Linh",
    role: "Chuyên viên tài chính",
    content: "Hệ thống cảnh báo biến động giúp tôi nắm bắt cơ hội và tránh rủi ro hiệu quả. Đây là công cụ không thể thiếu cho nhà đầu tư nghiêm túc."
  },
  {
    initials: "HM",
    name: "Hoàng Minh",
    role: "Quỹ đầu tư tư nhân",
    content: "Đội ngũ hỗ trợ của VSMI rất chuyên nghiệp và nhiệt tình. Tính năng AI phân tích tự động giúp tôi có cái nhìn đa chiều về thị trường."
  }
]; 