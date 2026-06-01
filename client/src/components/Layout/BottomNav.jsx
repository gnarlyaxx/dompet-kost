import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Clock, Calendar, Calculator, Bot } from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/history', icon: Clock, label: 'Riwayat' },
  { path: '/calendar', icon: Calendar, label: 'Kalender' },
  { path: '/calculator', icon: Calculator, label: 'Kalkulator' },
  { path: '/ai', icon: Bot, label: 'AI' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] md:max-w-full h-[68px] md:h-[72px] bg-white/95 backdrop-blur-xl border-t border-amber-100/50 flex justify-around items-center z-50 shadow-[0_-2px_16px_rgba(0,0,0,0.04)]">
      <div className="flex justify-around items-center w-full max-w-6xl mx-auto px-2 md:px-8">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] md:text-xs font-medium px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive ? 'text-[#F59E0B] bg-amber-50' : 'text-gray-400 hover:text-amber-400'
              }`
            }
          >
            <Icon size={20} strokeWidth={2} className="md:w-6 md:h-6" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
