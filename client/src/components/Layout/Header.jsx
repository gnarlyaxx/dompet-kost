import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User, LogOut, Mail, Shield } from 'lucide-react';

export default function Header({ budgetPercent = 67, user, onLogout }) {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const today = new Date();
  const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const dateStr = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;

  const titles = { '/history': 'Riwayat', '/calendar': 'Kalender', '/calculator': 'Kalkulator', '/ai': 'AI Assistant' };
  const pageTitle = titles[location.pathname];

  // ambil nama user dari metadata supabase
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  // tutup dropdown kalo klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        <div className="flex items-center gap-2.5">
          {/* Badge anggaran */}
          <div className="bg-white/15 backdrop-blur-md rounded-xl px-3 py-1.5 md:px-5 md:py-2 text-center">
            <span className="text-white text-[11px] md:text-sm font-semibold">{budgetPercent}% anggaran</span>
            <div className="mt-1 h-[3px] w-16 md:w-24 bg-white/25 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(budgetPercent, 100)}%` }} />
            </div>
          </div>

          {/* Profile Avatar Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="profile-avatar-btn"
              onClick={() => setProfileOpen(prev => !prev)}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-white font-bold text-sm md:text-base hover:bg-white/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              title="Profil"
            >
              {initials}
            </button>

            {/* Dropdown Profile */}
            {profileOpen && (
              <div className="profile-dropdown absolute right-0 top-[calc(100%+8px)] w-64 md:w-72 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] border border-gray-100 overflow-hidden z-[60]">
                {/* Header dropdown */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-white/25 backdrop-blur-md border-2 border-white/50 flex items-center justify-center text-white font-bold text-lg">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{displayName}</p>
                      <p className="text-white/70 text-xs truncate">{user?.email || 'demo@dompetkost.app'}</p>
                    </div>
                  </div>
                </div>

                {/* Info items */}
                <div className="px-2 py-2">
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500">
                    <Mail size={16} strokeWidth={2} className="text-amber-500 shrink-0" />
                    <span className="text-xs truncate">{user?.email || 'demo@dompetkost.app'}</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500">
                    <Shield size={16} strokeWidth={2} className="text-amber-500 shrink-0" />
                    <span className="text-xs">{user?.id === 'demo' ? 'Mode Demo' : 'Akun Terverifikasi'}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 mx-4" />

                {/* Logout button */}
                <div className="p-2">
                  <button
                    id="logout-btn"
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout?.();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer group"
                  >
                    <LogOut size={16} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
                    <span className="text-sm font-medium">Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
