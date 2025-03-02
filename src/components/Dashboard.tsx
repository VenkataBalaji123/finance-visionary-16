
import { useState, useEffect } from 'react';
import { useTransactions, Transaction } from '@/hooks/useTransactions';
import AnimatedNumber from '@/components/AnimatedNumber';
import BudgetCard from '@/components/BudgetCard';
import ExpenseChart from '@/components/ExpenseChart';
import IncomeChart from '@/components/IncomeChart';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import Card3D from '@/components/ui/Card3D';
import { WalletCards, ArrowUpRight, ArrowDownRight, BadgeIndianRupee } from 'lucide-react';

const Dashboard = () => {
  const { transactions, isLoading, addTransaction, deleteTransaction, getSummary } = useTransactions();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  
  // Get summary data
  const summary = getSummary();
  
  // Prepare chart data
  const expenseData = Object.entries(summary.categories).map(([name, value]) => ({
    name,
    value
  }));
  
  // Process transactions to get monthly data (last 6 months)
  const processMonthlyData = () => {
    const now = new Date();
    const monthlyData = [];
    
    // Create data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      
      let monthlyIncome = 0;
      let monthlyExpenses = 0;
      
      // Sum transactions for this month
      transactions.forEach(transaction => {
        const transactionMonth = transaction.date.getMonth();
        const transactionYear = transaction.date.getFullYear();
        
        if (transactionMonth === month.getMonth() && transactionYear === month.getFullYear()) {
          if (transaction.type === 'income') {
            monthlyIncome += transaction.amount;
          } else {
            monthlyExpenses += transaction.amount;
          }
        }
      });
      
      monthlyData.push({
        name: monthName,
        income: monthlyIncome,
        expenses: monthlyExpenses
      });
    }
    
    return monthlyData;
  };
  
  // Update the list of recent transactions
  useEffect(() => {
    if (!isLoading) {
      // Sort by date (newest first) and take first 10
      const sorted = [...transactions]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 10);
      
      setRecentTransactions(sorted);
    }
  }, [transactions, isLoading]);
  
  // Budget data (sample)
  const budgetData = [
    { category: 'Food', spent: 15000, budget: 20000, trend: 'down' as const },
    { category: 'Transport', spent: 8000, budget: 10000, trend: 'neutral' as const },
    { category: 'Shopping', spent: 12000, budget: 15000, trend: 'up' as const },
    { category: 'Bills', spent: 18000, budget: 20000, trend: 'up' as const },
  ];
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <WalletCards className="w-12 h-12 mx-auto text-primary animate-float" />
          <p className="text-lg text-muted-foreground">Loading your finances...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Balance Summary */}
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold">Personal Finance</h1>
        <p className="text-muted-foreground">Track your income, expenses, and savings</p>
      </div>
      
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card3D className="p-6 rounded-xl bg-gradient-blue">
          <div className="space-y-2">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <BadgeIndianRupee className="w-4 h-4" />
              Current Balance
            </span>
            <AnimatedNumber
              value={summary.balance}
              className="text-3xl font-bold"
            />
          </div>
        </Card3D>
        
        <Card3D className="p-6 rounded-xl bg-gradient-card">
          <div className="space-y-2">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowUpRight className="w-4 h-4 text-primary" />
              Total Income
            </span>
            <AnimatedNumber
              value={summary.totalIncome}
              className="text-3xl font-bold text-primary"
            />
          </div>
        </Card3D>
        
        <Card3D className="p-6 rounded-xl bg-gradient-card">
          <div className="space-y-2">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowDownRight className="w-4 h-4 text-destructive" />
              Total Expenses
            </span>
            <AnimatedNumber
              value={summary.totalExpenses}
              className="text-3xl font-bold text-destructive"
            />
          </div>
        </Card3D>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Expense Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExpenseChart data={expenseData} />
            <IncomeChart data={processMonthlyData()} />
          </div>
          
          {/* Budget Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {budgetData.map((item, index) => (
              <BudgetCard
                key={item.category}
                {...item}
              />
            ))}
          </div>
          
          {/* Recent Transactions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <TransactionList
              transactions={recentTransactions}
              onDelete={deleteTransaction}
            />
          </div>
        </div>
        
        {/* Right Column - Add Transaction Form */}
        <div>
          <TransactionForm onAdd={addTransaction} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
