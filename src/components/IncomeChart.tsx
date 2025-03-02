
import { useRef, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Card3D from '@/components/ui/Card3D';
import { formatCurrency } from '@/lib/utils';

interface IncomeData {
  name: string;
  income: number;
  expenses: number;
}

interface IncomeChartProps {
  data: IncomeData[];
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white shadow-lg rounded-lg border border-border">
        <p className="font-medium">{label}</p>
        <p className="text-primary">{`Income: ${formatCurrency(payload[0].value)}`}</p>
        <p className="text-destructive">{`Expenses: ${formatCurrency(payload[1].value)}`}</p>
      </div>
    );
  }
  return null;
};

const IncomeChart = ({ data, className = '' }: IncomeChartProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (chartRef.current) {
      observer.observe(chartRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div 
      ref={chartRef}
      className={`animate-on-scroll ${isVisible ? 'animate' : ''} ${className}`}
    >
      <Card3D className="p-6 rounded-xl bg-gradient-card">
        <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
              barGap={0}
              barSize={24}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) => `${value/1000}K`}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="income"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={isVisible ? 0 : 9999}
              />
              <Bar
                dataKey="expenses"
                fill="#f97316"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={isVisible ? 300 : 9999}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-xs">Expenses</span>
          </div>
        </div>
      </Card3D>
    </div>
  );
};

export default IncomeChart;
