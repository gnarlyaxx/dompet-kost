import { Trash2 } from 'lucide-react';
import { formatRupiah, CATEGORIES } from '../utils/formatCurrency';

export default function HistoryPage({ transactions = [], onDelete }) {
  const grouped = {};
  [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(t => {
    const key = new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  });

  return (
    <div className="pt-[82px] md:pt-[96px] pb-[100px] px-4 md:px-8 min-h-screen animate-fade-in max-w-4xl mx-auto">
      <h2 className="text-lg md:text-xl font-bold mb-4">Riwayat Transaksi</h2>
      {Object.keys(grouped).length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl block mb-3">📋</span>
          <p className="text-sm md:text-base">Belum ada transaksi</p>
        </div>
      )}
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date} className="mb-5">
          <p className="text-xs md:text-sm font-semibold text-gray-400 mb-2">{date}</p>
          <div className="flex flex-col gap-2">
            {items.map(t => {
              const cat = CATEGORIES.find(c => c.name === t.category);
              return (
                <div key={t.id} className="flex items-center gap-3 bg-white p-3 md:p-4 rounded-xl shadow-sm hover:translate-x-1 transition-transform">
                  <div className="w-9 h-9 md:w-11 md:h-11 rounded-lg flex items-center justify-center text-lg shrink-0" style={{ background: `${cat?.color || '#6b7280'}15` }}>
                    {cat?.icon || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-semibold truncate">{t.description || t.category}</p>
                    <p className="text-[10px] md:text-xs text-gray-400">{t.category}</p>
                  </div>
                  <span className={`text-xs md:text-sm font-bold whitespace-nowrap ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatRupiah(t.amount)}
                  </span>
                  <button onClick={() => onDelete(t.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
