
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface NewsCardProps {
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
}

const NewsCard = ({ title, source, date, summary, url, sentiment, impact }: NewsCardProps) => {
  const getSentimentColor = () => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'negative':
        return 'bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'neutral':
      default:
        return 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };
  
  const getImpactColor = () => {
    switch (impact) {
      case 'high':
        return 'bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'medium':
        return 'bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'low':
      default:
        return 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };
  
  const getSentimentIcon = () => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-3 w-3" />;
      case 'negative':
        return <TrendingDown className="h-3 w-3" />;
      case 'neutral':
      default:
        return <Minus className="h-3 w-3" />;
    }
  };
  
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300 hover-lift">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            {source} • {date}
          </CardDescription>
        </div>
        <CardTitle className="text-lg line-clamp-2 h-12">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 h-14 mb-4">
          {summary}
        </p>
        <div className="flex space-x-2">
          <Badge variant="outline" className={`flex items-center space-x-1 ${getSentimentColor()}`}>
            {getSentimentIcon()}
            <span className="capitalize">{sentiment}</span>
          </Badge>
          <Badge variant="outline" className={getImpactColor()}>
            {impact} impact
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-finance-teal flex items-center hover:underline"
        >
          Read Full Article
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
