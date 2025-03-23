import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart2, AlertTriangle } from "lucide-react";
import { StockData } from "@/services/stockApi";

interface Investment {
  symbol: string;
  name: string;
  shares: number;
  purchasePrice: number;
  purchaseDate: string;
}

interface RiskAssessmentProps {
  investments: Investment[];
  stockData: Record<string, StockData>;
}

const RiskAssessment = ({ investments, stockData }: RiskAssessmentProps) => {
  // Calculate portfolio risk score based on volatility
  const calculateRiskScore = () => {
    if (investments.length === 0) return 50;

    const totalValue = investments.reduce((total, investment) => {
      const currentPrice = stockData[investment.symbol]?.price || 0;
      return total + (currentPrice * investment.shares);
    }, 0);

    // Calculate weighted average volatility
    const weightedVolatility = investments.reduce((total, investment) => {
      const currentPrice = stockData[investment.symbol]?.price || 0;
      const positionValue = currentPrice * investment.shares;
      const weight = positionValue / totalValue;
      
      // Use price change as a proxy for volatility
      const priceChange = Math.abs(stockData[investment.symbol]?.changePercent || 0);
      return total + (weight * priceChange);
    }, 0);

    // Convert volatility to risk score (0-100)
    // Higher volatility = higher risk score
    const riskScore = Math.min(Math.max(weightedVolatility * 2, 0), 100);
    return Math.round(riskScore);
  };

  // Determine risk level based on score
  const getRiskLevel = (score: number): 'Low' | 'Moderate' | 'High' => {
    if (score < 40) return 'Low';
    if (score < 70) return 'Moderate';
    return 'High';
  };

  // Calculate diversification score
  const calculateDiversificationScore = () => {
    if (investments.length === 0) return 0;
    
    // More holdings = better diversification
    const holdingsScore = Math.min(investments.length * 10, 50);
    
    // Calculate sector concentration
    const sectors = investments.reduce((acc, investment) => {
      const sector = stockData[investment.symbol]?.sector || 'Unknown';
      acc[sector] = (acc[sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sectorCount = Object.keys(sectors).length;
    const sectorScore = Math.min(sectorCount * 10, 50);

    return Math.round(holdingsScore + sectorScore);
  };

  const riskScore = calculateRiskScore();
  const riskLevel = getRiskLevel(riskScore);
  const diversificationScore = calculateDiversificationScore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart2 className="mr-2 h-5 w-5 text-finance-teal" />
          Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Risk Level</span>
            <span className={`text-sm px-2 py-1 rounded-full ${
              riskLevel === 'Low' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {riskLevel} ({riskScore}/100)
            </span>
          </div>
          <Progress
            value={riskScore}
            className="h-2"
            indicatorClassName={
              riskLevel === 'Low' ? 'bg-finance-positive' :
              riskLevel === 'Moderate' ? 'bg-yellow-500' :
              'bg-finance-negative'
            }
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Diversification</span>
            <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {diversificationScore}/100
            </span>
          </div>
          <Progress 
            value={diversificationScore} 
            className="h-2"
            indicatorClassName="bg-finance-teal"
          />
        </div>

        {riskLevel === 'High' && (
          <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700 dark:text-red-300">
              Your portfolio has a high risk level. Consider diversifying your investments to reduce risk.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskAssessment;