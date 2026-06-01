import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

export default function WeeklyChart({ weeklyData = [] }) {
  const data = weeklyData.length > 0 ? weeklyData : [
    { name: 'Minggu 1', amount: 0 }, { name: 'Minggu 2', amount: 0 },
    { name: 'Minggu 3', amount: 0 }, { name: 'Minggu 4', amount: 0 },
  ];
  const fmtY = (v) => v >= 1000000 ? `${v/1000000}M` : v >= 1000 ? `${v/1000}K` : v;

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm mt-4 animate-slide-up" style={{ animationDelay: '0.25s' }}>
      <h3 className="font-bold text-sm md:text-base mb-3">Pengeluaran Mingguan</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmtY} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(v) => [`Rp ${new Intl.NumberFormat('id-ID').format(v)}`, 'Pengeluaran']} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          <Bar dataKey="amount" fill="url(#barGrad)" radius={[6,6,0,0]} barSize={36} />
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
