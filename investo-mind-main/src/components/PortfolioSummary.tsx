import { Card } from "@/components/ui/card";
import { StockData } from '@/services/stockApi';

interface Investment {
  symbol: string;
  name: string;
  shares: number;
  purchasePrice: number;
}

interface PortfolioSummaryProps {
  totalValue: number;
  performance: {
    change: number;
    changePercent: number;
  };
  investments: Investment[];
  stockData: Record<string, StockData>;
}

const PortfolioSummary = ({ totalValue, performance, investments, stockData }: PortfolioSummaryProps) => {
  // Calculate total holdings
  const totalHoldings = investments.length;

  // Find best performing stock
  const getBestPerformer = () => {
    if (investments.length === 0) return null;

    return investments.reduce((best, current) => {
      const currentStockData = stockData[current.symbol];
      const currentPerformance = currentStockData?.changePercent || 0;
      const bestStockData = best ? stockData[best.symbol] : null;
      const bestPerformance = bestStockData?.changePercent || 0;

      return currentPerformance > bestPerformance ? current : best;
    }, investments[0]);
  };

  const bestPerformer = getBestPerformer();
  const bestPerformerData = bestPerformer ? stockData[bestPerformer.symbol] : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">Total Portfolio Value</div>
        <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
      </Card>

      <Card className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">Portfolio Performance</div>
        <div className={`text-2xl font-bold flex items-center ${performance.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {performance.changePercent >= 0 ? '+' : ''}{performance.changePercent}%
          <span className="text-sm ml-2">${performance.change.toLocaleString()}</span>
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">Total Holdings</div>
        <div className="text-2xl font-bold">{totalHoldings}</div>
        <div className="text-sm text-gray-500">Across {investments.length} sectors</div>
      </Card>

      <Card className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">Best Performer</div>
        {bestPerformer && bestPerformerData ? (
          <>
            <div className="text-2xl font-bold">{bestPerformer.symbol}</div>
            <div className={`text-sm ${bestPerformerData.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {bestPerformerData.changePercent >= 0 ? '+' : ''}{bestPerformerData.changePercent}%
            </div>
          </>
        ) : (
          <div className="text-2xl font-bold">-</div>
        )}
      </Card>
    </div>
  );
};

export default PortfolioSummary;