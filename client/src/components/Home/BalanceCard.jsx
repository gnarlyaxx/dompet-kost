import { ArrowUpRight, ArrowDownRight, Receipt } from 'lucide-react';
import { formatRupiah } from '../../utils/formatCurrency';

export default function BalanceCard({ balance = 0, income = 0, expense = 0 }) {
  return (
    <div className="bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-300 rounded-2xl md:rounded-3xl p-5 md:p-8 text-white shadow-[0_8px_32px_rgba(245,158,11,0.25)] animate-slide-up">
      <div className="flex justify-between items-center">
        <span className="text-xs md:text-sm opacity-85">Saldo Bersih Bulan Ini</span>
        <Receipt size={18} className="opacity-60 md:w-6 md:h-6" />
      </div>
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold my-2 md:my-4 tracking-tight">{formatRupiah(balance)}</h2>
      <div className="flex gap-3 md:gap-4">
        <div className="flex-1 flex items-center gap-2 bg-emerald-500/20 rounded-xl p-2.5 md:p-4">
          <ArrowUpRight size={14} className="md:w-5 md:h-5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] md:text-xs opacity-80">Pemasukan</span>
            <span className="text-xs md:text-base font-semibold">{formatRupiah(income)}</span>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-2 bg-red-500/20 rounded-xl p-2.5 md:p-4">
          <ArrowDownRight size={14} className="md:w-5 md:h-5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] md:text-xs opacity-80">Pengeluaran</span>
            <span className="text-xs md:text-base font-semibold">{formatRupiah(expense)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
