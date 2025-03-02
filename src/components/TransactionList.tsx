
import { useState, useEffect } from 'react';
import { Transaction } from '@/hooks/useTransactions';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import Card3D from '@/components/ui/Card3D';
import { cn } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  className?: string;
}

const TransactionList = ({ transactions, onDelete, className = '' }: TransactionListProps) => {
  const [animationStates, setAnimationStates] = useState<{ [key: string]: boolean }>({});
  
  useEffect(() => {
    // Set animation states for new transactions
    const newAnimationStates = { ...animationStates };
    transactions.forEach((transaction, index) => {
      if (newAnimationStates[transaction.id] === undefined) {
        // Stagger animation start time
        setTimeout(() => {
          setAnimationStates(prev => ({
            ...prev,
            [transaction.id]: true
          }));
        }, index * 50);
        
        newAnimationStates[transaction.id] = false;
      }
    });
    setAnimationStates(newAnimationStates);
  }, [transactions]);
  
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Animate out
    setAnimationStates(prev => ({
      ...prev,
      [id]: false
    }));
    
    // Delete after animation
    setTimeout(() => {
      onDelete(id);
    }, 300);
  };
  
  if (transactions.length === 0) {
    return (
      <div className={`p-6 text-center text-muted-foreground ${className}`}>
        No transactions found.
      </div>
    );
  }
  
  return (
    <div className={`space-y-3 ${className}`}>
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className={cn(
            "transition-all duration-300 transform",
            animationStates[transaction.id]
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          )}
        >
          <Card3D className="p-4 rounded-xl bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    transaction.type === 'income' 
                      ? "bg-blue-100 text-primary" 
                      : "bg-orange-100 text-orange-500"
                  )}
                >
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="w-5 h-5" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5" />
                  )}
                </div>
                
                <div>
                  <p className="font-medium">{transaction.category}</p>
                  <p className="text-xs text-muted-foreground">{transaction.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p 
                    className={cn(
                      "font-semibold",
                      transaction.type === 'income' ? "text-primary" : "text-destructive"
                    )}
                  >
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                </div>
                
                <button 
                  onClick={(e) => handleDelete(transaction.id, e)}
                  className="p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-full transition-all"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </Card3D>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
