
import { useRef, useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card3D from '@/components/ui/Card3D';
import { formatCurrency } from '@/lib/utils';

interface ExpenseData {
  name: string;
  value: number;
}

interface ExpenseChartProps {
  data: ExpenseData[];
  className?: string;
}

const COLORS = [
  '#3b82f6', '#f97316', '#8b5cf6', '#10b981', 
  '#06b6d4', '#f59e0b', '#ec4899', '#6366f1'
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white shadow-lg rounded-lg border border-border">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-primary">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const ExpenseChart = ({ data, className = '' }: ExpenseChartProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
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
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };
  
  return (
    <div 
      ref={chartRef}
      className={`animate-on-scroll ${isVisible ? 'animate' : ''} ${className}`}
    >
      <Card3D className="p-6 rounded-xl bg-gradient-card">
        <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                animationDuration={1500}
                animationBegin={isVisible ? 0 : 9999}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="none"
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.7}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-3">
          {data.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs truncate">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </Card3D>
    </div>
  );
};

export default ExpenseChart;
