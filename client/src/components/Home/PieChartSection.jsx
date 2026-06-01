import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatRupiah, CATEGORIES } from '../../utils/formatCurrency';

export default function PieChartSection({ categoryTotals = {} }) {
  const data = CATEGORIES.filter(c => (categoryTotals[c.name] || 0) > 0)
    .map(c => ({ name: c.name, value: categoryTotals[c.name] || 0, color: c.color }));
  if (data.length === 0) data.push({ name: 'Belum ada data', value: 1, color: '#e5e7eb' });

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm mt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8">
        <div className="shrink-0">
          <ResponsiveContainer width={140} height={140}>
            <RechartsPie data={data} cx="50%" cy="50%" startAngle={90} endAngle={450}>
              <Pie data={data} innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value" stroke="none">
                {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </RechartsPie>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2 w-full">
          {CATEGORIES.slice(0, 5).map(c => (
            <div key={c.name} className="flex items-center gap-2 text-xs md:text-sm">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
              <span className="flex-1 text-gray-500">{c.name}</span>
              <span className="font-semibold">{formatRupiah(categoryTotals[c.name] || 0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
