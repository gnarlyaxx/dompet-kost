import { useState } from 'react';
import { Plus } from 'lucide-react';
import BalanceCard from '../components/Home/BalanceCard';
import BudgetBar from '../components/Home/BudgetBar';
import CategoryGrid from '../components/Home/CategoryGrid';
import PieChartSection from '../components/Home/PieChartSection';
import WeeklyChart from '../components/Home/WeeklyChart';
import AddTransactionModal from '../components/Transaction/AddTransactionModal';

export default function HomePage({ transactions = [], onAddTransaction, onEditBudget, budget = { used: 0, total: 1500000 }, loading }) {
  const [showModal, setShowModal] = useState(false);

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const categoryTotals = {};
  transactions.filter(t => t.type === 'expense').forEach(t => { categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount; });

  const getWeeklyData = () => {
    const now = new Date();
    const weeks = [0, 0, 0, 0];
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const d = new Date(t.date);
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        weeks[Math.min(Math.floor((d.getDate() - 1) / 7), 3)] += t.amount;
      }
    });
    return weeks.map((amount, i) => ({ name: `Minggu ${i + 1}`, amount }));
  };

  return (
    <div className="pt-[82px] md:pt-[96px] pb-[100px] px-4 md:px-8 min-h-screen animate-fade-in max-w-6xl mx-auto">
      {/* Desktop: 2 column layout */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        <div>
          <BalanceCard balance={income - expense} income={income} expense={expense} />
          <BudgetBar used={expense} total={budget.total} onEdit={onEditBudget} />
          <CategoryGrid categoryTotals={categoryTotals} />
        </div>
        <div>
          <PieChartSection categoryTotals={categoryTotals} />
          <WeeklyChart weeklyData={getWeeklyData()} />
        </div>
      </div>

      <button onClick={() => setShowModal(true)} className="fixed bottom-24 right-4 md:right-8 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-[#F59E0B] to-amber-400 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(245,158,11,0.35)] z-50 hover:scale-110 active:scale-95 transition-transform">
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <AddTransactionModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={onAddTransaction} />
    </div>
  );
}
