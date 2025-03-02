
import { useState } from 'react';
import { TransactionType, categories } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import Card3D from '@/components/ui/Card3D';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionFormProps {
  onAdd: (transaction: {
    type: TransactionType;
    amount: number;
    category: string;
    description: string;
  }) => void;
  className?: string;
}

const TransactionForm = ({ onAdd, className = '' }: TransactionFormProps) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    onAdd({
      type,
      amount: amountValue,
      category,
      description: description || 'N/A',
    });
    
    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    
    toast.success(`${type === 'income' ? 'Income' : 'Expense'} added successfully`);
  };
  
  return (
    <Card3D className={`p-6 rounded-xl bg-gradient-card ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Add Transaction</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={type === 'income' ? 'default' : 'outline'}
            className={cn(
              "flex-1 gap-2 transition-all",
              type === 'income' ? 'shadow-md scale-105' : ''
            )}
            onClick={() => setType('income')}
          >
            <PlusCircle className="w-4 h-4" />
            Income
          </Button>
          
          <Button
            type="button"
            variant={type === 'expense' ? 'default' : 'outline'}
            className={cn(
              "flex-1 gap-2 transition-all",
              type === 'expense' ? 'shadow-md scale-105' : ''
            )}
            onClick={() => setType('expense')}
          >
            <MinusCircle className="w-4 h-4" />
            Expense
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (₹)</label>
            <Input
              type="number"
              min="0"
              step="1"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white/70 backdrop-blur-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger className="bg-white/70 backdrop-blur-sm">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories[type].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/70 backdrop-blur-sm"
            />
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full"
        >
          Add Transaction
        </Button>
      </form>
    </Card3D>
  );
};

export default TransactionForm;
