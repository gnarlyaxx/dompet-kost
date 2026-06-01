import { useLocation } from 'react-router-dom';

export default function Header({ budgetPercent = 67 }) {
  const location = useLocation();
  const today = new Date();
  const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const dateStr = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;

  const titles = { '/history': 'Riwayat', '/calendar': 'Kalender', '/calculator': 'Kalkulator', '/ai': 'AI Assistant' };
  const pageTitle = titles[location.pathname];

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] md:max-w-full z-50 bg-gradient-to-r from-amber-600 via-[#F59E0B] to-amber-500 px-4 py-4 md:px-8 md:py-5 rounded-b-2xl md:rounded-b-3xl shadow-lg">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <img src="/DKWhite.png" alt="Logo DompetKost" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
          <div>
            <h1 className="text-white font-bold text-base md:text-xl">{pageTitle || 'DompetKost'}</h1>
            <p className="text-white/70 text-xs md:text-sm">{dateStr}</p>
          </div>
        </div>
        <div className="bg-white/15 backdrop-blur-md rounded-xl px-3 py-1.5 md:px-5 md:py-2 text-center">
          <span className="text-white text-[11px] md:text-sm font-semibold">{budgetPercent}% anggaran</span>
          <div className="mt-1 h-[3px] w-16 md:w-24 bg-white/25 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(budgetPercent, 100)}%` }} />
          </div>
        </div>
      </div>
    </header>
  );
}
