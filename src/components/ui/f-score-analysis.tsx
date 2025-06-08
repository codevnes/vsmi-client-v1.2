"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

// Fix JSX namespace error for TypeScript
declare namespace JSX {
  interface IntrinsicElements {
    div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
    button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
    h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
    ul: React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
    li: React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
  }
}

interface FScoreIndicator {
  label: string;
  value: boolean;
  description: string;
}

interface FScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  indicators: FScoreIndicator[];
}

interface FScoreAnalysisProps {
  symbol: string;
  analysisDate: string;
  totalScore: number;
  pe: number;
  peIndustry: number;
  categories: FScoreCategory[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  fullAnalysis?: string;
  tradingRecommendation?: string;
  suggestedBuyRange?: string;
  stopLossLevel?: string;
}

export function FScoreAnalysis({
  symbol,
  analysisDate,
  totalScore,
  pe,
  peIndustry,
  categories,
  swot,
  fullAnalysis = "",
  tradingRecommendation,
  suggestedBuyRange,
  stopLossLevel,
}: FScoreAnalysisProps) {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const formattedDate = format(new Date(analysisDate), 'dd/MM/yyyy');
  const healthStatus = totalScore >= 6 ? "TỐT" : totalScore >= 4 ? "TRUNG BÌNH" : "YẾU";
  const healthColor = totalScore >= 6 ? "text-green-600" : totalScore >= 4 ? "text-yellow-600" : "text-red-600";

  // Convert markdown to HTML (simple conversion for headings and lists)
  const formatMarkdown = (text: string) => {
    return text
      .replace(/### (.*)/g, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br /><br />')
      .replace(/\n- /g, '<br />• ');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">Phân tích F-Score: {symbol}</CardTitle>
            <CardDescription>Ngày phân tích: {formattedDate}</CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Tổng điểm:</span>
              <Badge variant="outline" className="text-lg font-bold">
                <span className={healthColor}>{totalScore}</span>
                <span className="text-gray-400 font-normal">/9</span>
              </Badge>
            </div>
            <span className={`text-sm font-semibold mt-1 ${healthColor}`}>
              Sức khỏe tài chính {healthStatus}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* PE Comparison */}
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-md">
          <div>
            <span className="text-sm font-medium">P/E hiện tại:</span>
            <span className="ml-2 font-bold">{pe.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-sm font-medium">P/E ngành:</span>
            <span className="ml-2 font-bold">{peIndustry.toFixed(2)}</span>
          </div>
          <Badge variant={pe < peIndustry ? "success" : "destructive"} className="ml-2">
            {pe < peIndustry ? "Hấp dẫn" : "Cao hơn ngành"}
          </Badge>
        </div>

        {/* Trading Recommendation */}
        {tradingRecommendation && (
          <div className="bg-slate-50 p-4 rounded-md border-l-4 border-blue-500">
            <h3 className="font-bold text-lg mb-2">Khuyến nghị đầu tư</h3>
            <p className="text-sm mb-3">{tradingRecommendation}</p>
            
            {(suggestedBuyRange || stopLossLevel) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {suggestedBuyRange && (
                  <div className="bg-green-50 p-2 rounded">
                    <span className="text-xs font-medium text-green-800">Vùng giá mua:</span>
                    <span className="text-sm ml-1">{suggestedBuyRange}</span>
                  </div>
                )}
                
                {stopLossLevel && (
                  <div className="bg-red-50 p-2 rounded">
                    <span className="text-xs font-medium text-red-800">Cắt lỗ:</span>
                    <span className="text-sm ml-1">{stopLossLevel}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* F-Score Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.name} className="border-t-4" style={{ borderTopColor: getCategoryColor(category.name) }}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-medium">{category.name}</CardTitle>
                  <Badge>
                    {category.score}/{category.maxScore}
                  </Badge>
                </div>
                <Progress value={(category.score / category.maxScore) * 100} className="h-1.5" />
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.indicators.map((indicator) => (
                    <TooltipProvider key={indicator.label}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <li className="flex items-center gap-2 text-sm">
                            {indicator.value ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span>{indicator.label}</span>
                          </li>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{indicator.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SWOT Analysis */}
        <Tabs defaultValue="strengths" className="mt-6">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="strengths">Điểm mạnh</TabsTrigger>
            <TabsTrigger value="weaknesses">Điểm yếu</TabsTrigger>
            <TabsTrigger value="opportunities">Cơ hội</TabsTrigger>
            <TabsTrigger value="threats">Rủi ro</TabsTrigger>
          </TabsList>
          <TabsContent value="strengths" className="p-4 bg-slate-50 rounded-md mt-2">
            <ul className="list-disc pl-5 space-y-1">
              {swot.strengths.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="weaknesses" className="p-4 bg-slate-50 rounded-md mt-2">
            <ul className="list-disc pl-5 space-y-1">
              {swot.weaknesses.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="opportunities" className="p-4 bg-slate-50 rounded-md mt-2">
            <ul className="list-disc pl-5 space-y-1">
              {swot.opportunities.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="threats" className="p-4 bg-slate-50 rounded-md mt-2">
            <ul className="list-disc pl-5 space-y-1">
              {swot.threats.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>

        {/* Full Analysis Section */}
        {fullAnalysis && (
          <div className="mt-6 border rounded-md overflow-hidden">
            <button
              onClick={() => setShowFullAnalysis(!showFullAnalysis)}
              className="w-full px-4 py-3 bg-slate-100 flex justify-between items-center hover:bg-slate-200 transition-colors"
            >
              <h3 className="font-semibold text-left">Phân tích chi tiết</h3>
              {showFullAnalysis ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {showFullAnalysis && (
              <div className="p-4 prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: formatMarkdown(fullAnalysis) }} />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to get category colors
function getCategoryColor(categoryName: string): string {
  switch (categoryName) {
    case "Sinh lợi":
      return "#22c55e"; // green
    case "Đòn bẩy":
      return "#3b82f6"; // blue
    case "Hiệu quả":
      return "#f59e0b"; // amber
    default:
      return "#6b7280"; // gray
  }
} 