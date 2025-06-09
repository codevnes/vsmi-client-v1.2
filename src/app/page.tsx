import { LatestNews } from "@/components/sections/LatestNews";
import QindexChartWithTimeRange from "@/components/charts/QindexChart";
import MarketNews from "@/components/sections/MarketNews";
import { BestStocks } from "@/components/sections/BestStocks";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Development Notification */}
      <div className="container mx-auto px-4 pt-6">
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 font-medium">Hệ thống đang phát triển</AlertTitle>
          <AlertDescription className="text-amber-700">
            VSMI đang trong giai đoạn phát triển. Một số tính năng có thể chưa hoạt động đầy đủ.
            Hiện tại bạn có thể truy cập thông tin chi tiết cổ phiếu tại trang /ma-chung-khoan/[mã cổ phiếu].
          </AlertDescription>
        </Alert>
      </div>
      
      <LatestNews />
      <div className="my-8 container mx-auto p-4">
        <div className="grid grid-cols-12 gap-4 min-h-[500px]">
          <div className="col-span-12 md:col-span-6 lg:col-span-8">
            <QindexChartWithTimeRange symbol="VNINDEX" timeRange="all" />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <MarketNews />
          </div>
        </div>
      </div>

      <div className="my-8 container mx-auto p-4">
        <BestStocks />
      </div>
    </div>
  );
}