import { LatestNews } from "@/components/sections/LatestNews";
import QindexVNIndex from "@/components/sections/QindexVNIndex";
import MarketNews from "@/components/sections/MarketNews";
import { BestStocks } from "@/components/sections/BestStocks";

export default function Home() {
  return (
    <div className="min-h-screen">
      <LatestNews />
      <div className="my-8 container mx-auto p-4">
        <div className="grid grid-cols-12 gap-4 min-h-[500px]">
          <div className="col-span-12 md:col-span-6 lg:col-span-8">
            <QindexVNIndex />
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