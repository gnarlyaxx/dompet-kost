import { formatRupiah, CATEGORIES } from '../../utils/formatCurrency';

export default function CategoryGrid({ categoryTotals = {} }) {
  const cats = CATEGORIES.slice(0, 4);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4 animate-slide-up" style={{ animationDelay: '0.15s' }}>
      {cats.map((cat) => (
        <div key={cat.name} className="bg-white rounded-2xl p-3.5 md:p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-default">
          <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center text-lg md:text-2xl" style={{ background: `${cat.color}15` }}>
            {cat.icon}
          </div>
          <p className="text-[11px] md:text-sm text-gray-500 mt-2">{cat.name}</p>
          <p className="text-sm md:text-lg font-bold mt-0.5">{formatRupiah(categoryTotals[cat.name] || 0)}</p>
        </div>
      ))}
    </div>
  );
}
