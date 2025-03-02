
import { useState, useEffect } from 'react';
import { generateId, generateRandomAmount } from '@/lib/utils';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categories: {
    [key: string]: number;
  };
}

// Sample categories
export const categories = {
  income: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other'],
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other']
};

// Generate sample data
const generateSampleTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  // Generate transactions for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add one income
    if (i % 15 === 0) {
      transactions.push({
        id: generateId(),
        type: 'income',
        amount: generateRandomAmount(50000, 80000),
        category: categories.income[Math.floor(Math.random() * categories.income.length)],
        description: 'Monthly salary',
        date: date
      });
    }
    
    // Add 1-3 expenses per day
    const expenseCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < expenseCount; j++) {
      transactions.push({
        id: generateId(),
        type: 'expense',
        amount: generateRandomAmount(100, 5000),
        category: categories.expense[Math.floor(Math.random() * categories.expense.length)],
        description: 'Daily expense',
        date: date
      });
    }
  }
  
  return transactions;
};

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setTransactions(generateSampleTransactions());
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction = {
      ...transaction,
      id: generateId(),
      date: new Date()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const getSummary = (): TransactionSummary => {
    const summary: TransactionSummary = {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      categories: {}
    };
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        summary.totalIncome += transaction.amount;
      } else {
        summary.totalExpenses += transaction.amount;
        
        // Add to category total
        if (!summary.categories[transaction.category]) {
          summary.categories[transaction.category] = 0;
        }
        summary.categories[transaction.category] += transaction.amount;
      }
    });
    
    summary.balance = summary.totalIncome - summary.totalExpenses;
    
    return summary;
  };

  return {
    transactions,
    isLoading,
    addTransaction,
    deleteTransaction,
    getSummary
  };
};
