
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
}

const AnimatedNumber = ({ value, duration = 1000, className = '' }: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [prevValue, setPrevValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Skip animation for initial render with 0
    if (prevValue === 0 && value !== 0) {
      setDisplayValue(value);
      setPrevValue(value);
      return;
    }

    if (value !== prevValue) {
      setIsAnimating(true);
      
      const startValue = prevValue;
      const diff = value - startValue;
      const startTime = performance.now();
      
      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function: cubic-bezier(0.34, 1.56, 0.64, 1)
        const easeOutBack = (t: number) => {
          const c1 = 1.70158;
          const c3 = c1 + 1;
          return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        };
        
        const easedProgress = progress < 1 ? easeOutBack(progress) : 1;
        const currentValue = startValue + diff * easedProgress;
        
        setDisplayValue(Math.round(currentValue));
        
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(step);
      setPrevValue(value);
    }
  }, [value, prevValue, duration]);

  return (
    <div className={`transition-all duration-300 ${className}`}>
      <span className={`number-animation ${isAnimating ? 'entering' : ''}`}>
        {formatCurrency(displayValue)}
      </span>
    </div>
  );
};

export default AnimatedNumber;
