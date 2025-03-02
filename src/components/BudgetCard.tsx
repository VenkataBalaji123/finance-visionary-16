
import { useRef, useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import Card3D from '@/components/ui/Card3D';
import { formatCurrency, calculatePercentage } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface BudgetCardProps {
  category: string;
  spent: number;
  budget: number;
  trend: 'up' | 'down' | 'neutral';
  className?: string;
}

const BudgetCard = ({
  category,
  spent,
  budget,
  trend,
  className = ''
}: BudgetCardProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const percentage = calculatePercentage(spent, budget);
  
  // Get appropriate color based on budget percentage
  const getColorClass = () => {
    if (percentage >= 90) return 'text-destructive';
    if (percentage >= 70) return 'text-amber-500';
    return 'text-emerald-500';
  };
  
  const getTrendIcon = () => {
    if (trend === 'up') {
      return <ArrowUpRight className="w-4 h-4 text-destructive" />;
    }
    if (trend === 'down') {
      return <ArrowDownRight className="w-4 h-4 text-emerald-500" />;
    }
    return null;
  };
  
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimatedProgress(percentage);
      }, 300);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [percentage, isVisible]);
  
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
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={cardRef} className={`animate-on-scroll ${isVisible ? 'animate' : ''} ${className}`}>
      <Card3D className="p-5 rounded-xl bg-gradient-card">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">{category}</span>
            <div className="flex items-center gap-1">
              {getTrendIcon()}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className={`text-xl font-semibold ${getColorClass()}`}>
                {formatCurrency(spent)}
              </span>
              <span className="text-xs text-muted-foreground">
                of {formatCurrency(budget)}
              </span>
            </div>
            
            <Progress
              value={animatedProgress}
              className="h-2"
              indicatorClassName={
                percentage >= 90
                  ? 'bg-destructive'
                  : percentage >= 70
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }
            />
            
            <div className="text-xs text-right text-muted-foreground">
              {percentage.toFixed(0)}% used
            </div>
          </div>
        </div>
      </Card3D>
    </div>
  );
};

export default BudgetCard;
