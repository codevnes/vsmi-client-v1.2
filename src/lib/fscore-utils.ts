import { FScoreAnalysisData, FScoreRawData } from "@/types/fscore";

// Function to prepare F-Score data for the component
export function prepareFScoreData(data: FScoreRawData): FScoreAnalysisData | null {
  const fScore = data?.inputData?.fScore;
  
  if (!fScore) {
    return null;
  }

  // Extract total score
  const totalScore = fScore.Tong_diem || fScore["Tong diem"] || 0;
  
  // Extract PE and industry PE
  const pe = fScore.PE || 0;
  const peIndustry = fScore["PE nganh"] || 0;
  
  // Prepare categories
  const categories = [
    {
      name: "Sinh lợi",
      score: fScore.Sinh_loi || fScore["Sinh loi"] || 0,
      maxScore: 4,
      indicators: [
        {
          label: "ROA > 0",
          value: Boolean(fScore["ROA>0"]),
          description: "Tỷ suất sinh lời trên tài sản dương, cho thấy doanh nghiệp đang hoạt động có lãi."
        },
        {
          label: "CFO > 0",
          value: Boolean(fScore["CFO>0"]),
          description: "Dòng tiền từ hoạt động kinh doanh dương, cho thấy khả năng tạo tiền từ hoạt động kinh doanh."
        },
        {
          label: "CFO > LNST",
          value: Boolean(fScore["CFO>LNST"]),
          description: "Dòng tiền từ hoạt động kinh doanh lớn hơn lợi nhuận sau thuế, cho thấy chất lượng lợi nhuận tốt."
        },
        {
          label: "ΔROA > 0",
          value: Boolean(fScore["ΔROA>0"]),
          description: "Tỷ suất sinh lời trên tài sản tăng so với kỳ trước, cho thấy xu hướng cải thiện về hiệu quả sử dụng tài sản."
        }
      ]
    },
    {
      name: "Đòn bẩy",
      score: 0, // Calculate based on indicators
      maxScore: 2,
      indicators: [
        {
          label: "ΔNợ dài hạn < 0",
          value: Boolean(fScore["ΔNợ dài hạn<0"]),
          description: "Nợ dài hạn giảm so với kỳ trước, cho thấy khả năng giảm gánh nặng nợ nần và rủi ro tài chính."
        },
        {
          label: "Không phát hành CP",
          value: Boolean(fScore["Không phát hành CP"]),
          description: "Không phát hành thêm cổ phiếu, tránh pha loãng quyền sở hữu của cổ đông hiện hữu."
        }
      ]
    },
    {
      name: "Hiệu quả",
      score: 0, // Calculate based on indicators
      maxScore: 3,
      indicators: [
        {
          label: "ΔGross Margin > 0",
          value: Boolean(fScore["ΔGross Margin>0"]),
          description: "Biên lợi nhuận gộp tăng so với kỳ trước, cho thấy khả năng cải thiện hiệu quả hoạt động."
        },
        {
          label: "ΔCurrent Ratio > 0",
          value: Boolean(fScore["ΔCurrent Ratio>0"]),
          description: "Tỷ lệ thanh toán hiện hành tăng, cho thấy khả năng thanh toán ngắn hạn được cải thiện."
        },
        {
          label: "ΔAsset Turnover > 0",
          value: Boolean(fScore["ΔAsset Turnover>0"]),
          description: "Vòng quay tài sản tăng, cho thấy hiệu quả sử dụng tài sản được cải thiện."
        }
      ]
    }
  ];
  
  // Calculate scores for Đòn bẩy and Hiệu quả
  categories[1].score = categories[1].indicators.filter(i => i.value).length;
  categories[2].score = categories[2].indicators.filter(i => i.value).length;
  
  // Extract SWOT analysis from the analysis result
  const analysisResult = data.analysisResult || '';
  
  // Attempt to extract SWOT from analysis result
  const strengths = extractSWOTSection(analysisResult, "Điểm mạnh");
  const weaknesses = extractSWOTSection(analysisResult, "Điểm yếu");
  const opportunities = extractSWOTSection(analysisResult, "Cơ hội");
  const threats = extractSWOTSection(analysisResult, "Rủi ro");
  
  const swot = {
    strengths: strengths.length ? strengths : ["ROA cao", "Dòng tiền từ hoạt động kinh doanh mạnh mẽ", "Không phát hành thêm cổ phiếu"],
    weaknesses: weaknesses.length ? weaknesses : ["Giảm trong hệ số thanh toán ngắn hạn", "Giảm vòng quay tài sản"],
    opportunities: opportunities.length ? opportunities : ["Tăng trưởng lợi nhuận gộp", "Duy trì dòng tiền từ hoạt động kinh doanh cao hơn lợi nhuận sau thuế"],
    threats: threats.length ? threats : ["Sự giảm của hệ số thanh toán ngắn hạn và vòng quay tài sản có thể ảnh hưởng đến khả năng thanh khoản và hiệu quả vận hành"]
  };
  
  return {
    symbol: data.symbol,
    analysisDate: data.analysisDate,
    totalScore,
    pe,
    peIndustry,
    categories,
    swot,
    fullAnalysis: analysisResult,
    tradingRecommendation: data.tradingRecommendation,
    suggestedBuyRange: data.suggestedBuyRange,
    stopLossLevel: data.stopLossLevel
  };
}

// Helper function to extract SWOT sections from analysis result
function extractSWOTSection(text: string, sectionName: string): string[] {
  // Look for patterns like "**Điểm mạnh**: Item1, Item2" or similar formats
  const patterns = [
    // Format: **Điểm mạnh**: Item1, Item2.
    new RegExp(`\\*\\*${sectionName}\\*\\*:([^\\*\\n]+?)(?=\\*\\*|\\n\\n|$)`, 's'),
    // Format: - **Điểm mạnh**: Item1, Item2.
    new RegExp(`- \\*\\*${sectionName}\\*\\*:([^\\*\\n]+?)(?=\\n\\s*-|\\n\\n|$)`, 's'),
    // Format in numbered list: - **Điểm mạnh**: Item1, Item2.
    new RegExp(`\\d+\\.\\s*\\*\\*${sectionName}\\*\\*:([^\\*\\n]+?)(?=\\d+\\.|\\n\\n|$)`, 's')
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Split by bullet points, commas or periods and clean up
      return match[1]
        .split(/[,.;]/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
  }
  
  return [];
} 