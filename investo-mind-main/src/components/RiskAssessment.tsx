
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Shield, AlertTriangle, Info } from 'lucide-react';

const RiskAssessment = () => {
  const [loading, setLoading] = useState(true);
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState<'risk' | 'return'>('risk');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      generateSimulationData();
      setLoading(false);
    }, 1800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const generateSimulationData = () => {
    // Generate risk simulation data
    // This represents probability distribution of potential returns
    const data = [];
    
    // Generate a somewhat normal distribution
    for (let i = -30; i <= 50; i += 5) {
      // Center the peak around 10% returns
      const probability = Math.exp(-Math.pow(i - 10, 2) / 450) * 100;
      
      data.push({
        return: i,
        probability: probability.toFixed(2),
      });
    }
    
    setSimulationData(data);
  };
  
  return (
    <Card className="border border-gray-200 dark:border-gray-800 h-full hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardDescription className="flex items-center">
              <Shield className="mr-2 h-4 w-4 text-gray-500" />
              Risk Assessment
            </CardDescription>
            <CardTitle className="flex items-center">
              Monte Carlo Simulation
              <Info className="ml-2 h-4 w-4 text-gray-400 cursor-help" />
            </CardTitle>
          </div>
          
          <div className="flex space-x-1">
            <Button
              variant={selectedTab === 'risk' ? "default" : "outline"}
              className={`h-8 px-3 text-xs ${
                selectedTab === 'risk' 
                  ? 'bg-finance-blue text-white dark:bg-finance-teal' 
                  : 'text-gray-500'
              }`}
              onClick={() => setSelectedTab('risk')}
            >
              Risk
            </Button>
            <Button
              variant={selectedTab === 'return' ? "default" : "outline"}
              className={`h-8 px-3 text-xs ${
                selectedTab === 'return' 
                  ? 'bg-finance-blue text-white dark:bg-finance-teal' 
                  : 'text-gray-500'
              }`}
              onClick={() => setSelectedTab('return')}
            >
              Expected Return
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        {loading ? (
          <div className="h-64 w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded"></div>
        ) : (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={simulationData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="return" 
                    tickFormatter={(value) => `${value}%`}
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value.toFixed(0)}%`}
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 'dataMax + 5']}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, "Probability"]}
                    labelFormatter={(value) => `Return: ${value}%`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: '1px solid #E5E7EB'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="probability" 
                    stroke="#0D9488" 
                    fill="url(#colorGradient)" 
                    fillOpacity={0.8}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Potential Loss (5%)</div>
                <div className="text-lg font-bold text-finance-negative">-8.2%</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Expected Return</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">+10.4%</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Potential Gain (95%)</div>
                <div className="text-lg font-bold text-finance-positive">+28.7%</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex items-center text-sm text-amber-600 dark:text-amber-400 mt-2">
          <AlertTriangle className="h-4 w-4 mr-1" />
          <span>Past performance is not indicative of future results.</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RiskAssessment;
