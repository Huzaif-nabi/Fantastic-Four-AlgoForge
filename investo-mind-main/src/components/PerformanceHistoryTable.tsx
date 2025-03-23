import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Transaction {
  date: string;
  description: string;
  change: number;
  previousValue: number;
  newValue: number;
}

const PerformanceHistoryTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(5);
  
  // Sample performance history data
  const performanceHistory: Transaction[] = [
    {
      date: '2024-07-12',
      description: 'Market movement',
      change: 2.3,
      previousValue: 124653.25,
      newValue: 127532.87
    },
    {
      date: '2024-07-05',
      description: 'Apple (AAPL) earnings report',
      change: 3.8,
      previousValue: 120087.91,
      newValue: 124653.25
    },
    {
      date: '2024-06-28',
      description: 'Portfolio rebalancing',
      change: 1.4,
      previousValue: 118429.89,
      newValue: 120087.91
    },
    {
      date: '2024-06-21',
      description: 'Federal Reserve announcement',
      change: -0.8,
      previousValue: 119383.96,
      newValue: 118429.89
    },
    {
      date: '2024-06-14',
      description: 'Microsoft (MSFT) dividend payment',
      change: 0.6,
      previousValue: 118672.92,
      newValue: 119383.96
    },
    {
      date: '2024-06-07',
      description: 'Market volatility',
      change: -1.2,
      previousValue: 120114.29,
      newValue: 118672.92
    },
    {
      date: '2024-05-31',
      description: 'Tesla (TSLA) price increase',
      change: 4.2,
      previousValue: 115272.82,
      newValue: 120114.29
    },
    {
      date: '2024-05-24',
      description: 'Market movement',
      change: 1.1,
      previousValue: 114017.63,
      newValue: 115272.82
    }
  ];
  
  // Calculate pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = performanceHistory.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(performanceHistory.length / entriesPerPage);
  
  // Format date to more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  return (
    <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Performance History</CardTitle>
          <CardDescription>Track changes in your portfolio value over time</CardDescription>
        </div>
        
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Change</TableHead>
              <TableHead className="hidden md:table-cell">Previous Value</TableHead>
              <TableHead className="text-right">New Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEntries.map((entry, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{formatDate(entry.date)}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell>
                  <span className={`flex items-center ${entry.change >= 0 ? 'text-finance-positive' : 'text-finance-negative'}`}>
                    {entry.change >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(entry.change)}%
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  ${entry.previousValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${entry.newValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, performanceHistory.length)} of {performanceHistory.length} entries
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceHistoryTable;