import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Bell, X } from 'lucide-react';
import { MONTHS, DAYS } from '../utils/formatCurrency';
import api from '../services/api';
import { isSupabaseConfigured } from '../services/supabase';

export default function CalendarPage({ transactions = [] }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null); // formatnya tahun-bulan-hari ya
  const [reminders, setReminders] = useState([]); // nyimpen semua pengingat bulan ini
  const [newText, setNewText] = useState('');
  const [adding, setAdding] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  // tarik data pengingat dari database tiap bulannya ganti ──────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetchReminders();
  }, [month, year]);

  const fetchReminders = async () => {
    try {
      const res = await api.get('/reminders', { params: { month: month + 1, year } });
      setReminders(res.data || []);
    } catch (err) {
      console.error('Gagal fetch reminders:', err);
    }
  };

  // fungsi buat nambahin sama ngehapus pengingat ────────────────────────────────────────────────────────
  const handleAddReminder = async () => {
    if (!newText.trim() || !selectedDate) return;
    setAdding(true);
    try {
      if (isSupabaseConfigured) {
        const res = await api.post('/reminders', { date: selectedDate, text: newText.trim() });
        setReminders(prev => [...prev, res.data]);
      } else {
        // pake localstorage aja kalo lg mode demo
        const id = Date.now().toString();
        const reminder = { id, date: selectedDate, text: newText.trim() };
        setReminders(prev => [...prev, reminder]);
      }
      setNewText('');
    } catch (err) {
      console.error('Gagal tambah reminder:', err);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      if (isSupabaseConfigured) {
        await api.delete(`/reminders/${id}`);
      }
      setReminders(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Gagal hapus reminder:', err);
    }
  };

  // logika buat ngerender kalendernya ────────────────────────────────────────────────────────
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const txDates = {};
  transactions.forEach(t => {
    const d = new Date(t.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!txDates[day]) txDates[day] = { income: false, expense: false };
      if (t.type === 'income') txDates[day].income = true;
      if (t.type === 'expense') txDates[day].expense = true;
    }
  });

  // nyimpen pengingat spesifik tanggalnya doang
  const reminderDates = {};
  reminders.forEach(r => {
    const day = new Date(r.date).getDate();
    reminderDates[day] = (reminderDates[day] || 0) + 1;
  });

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };
  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  const isSelected = (d) => selectedDate === `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const handleSelectDate = (d) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setShowPanel(true);
    setNewText('');
  };

  // nampilin pengingat buat tanggal yg diklik
  const selectedReminders = reminders.filter(r => r.date === selectedDate);

  // nampilin transaksi buat tanggal yg diklik
  const selectedTx = transactions.filter(t => t.date === selectedDate);

  // ngeformat tanggal biar enak diliat
  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const d = new Date(selectedDate + 'T00:00:00');
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} />);
  for (let d = 1; d <= daysInMonth; d++) {
    const info = txDates[d];
    const hasReminder = reminderDates[d] > 0;
    const sel = isSelected(d);
    cells.push(
      <div
        key={d}
        onClick={() => handleSelectDate(d)}
        className={`aspect-square flex flex-col items-center justify-center rounded-lg md:rounded-xl relative cursor-pointer transition-all select-none
          ${sel ? 'bg-[#F59E0B] text-white shadow-md scale-105' : isToday(d) ? 'bg-amber-100 ring-2 ring-[#F59E0B]' : 'hover:bg-amber-50'}`}
      >
        <span className="text-xs md:text-sm font-medium">{d}</span>
        <div className="flex gap-0.5 absolute bottom-1">
          {info?.expense && <span className={`w-1.5 h-1.5 rounded-full ${sel ? 'bg-red-300' : 'bg-red-500'}`} />}
          {info?.income && <span className={`w-1.5 h-1.5 rounded-full ${sel ? 'bg-green-300' : 'bg-emerald-500'}`} />}
          {hasReminder && <span className={`w-1.5 h-1.5 rounded-full ${sel ? 'bg-yellow-200' : 'bg-yellow-400'}`} />}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[82px] md:pt-[96px] pb-[100px] px-4 md:px-8 min-h-screen animate-fade-in max-w-3xl mx-auto">
      {/* Header navigasi bulan */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={prev} className="bg-white w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-base md:text-lg font-bold">{MONTHS[month]} {year}</h2>
        <button onClick={next} className="bg-white w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Grid kalender */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm mb-4">
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => <div key={d} className="text-center text-[10px] md:text-xs font-semibold text-gray-400 py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">{cells}</div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center mb-4 text-[11px] md:text-xs text-gray-500 flex-wrap">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Pengeluaran</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Pemasukan</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400" /> Pengingat</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Hari ini</span>
      </div>

      {/* Panel detail tanggal */}
      {showPanel && selectedDate && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-slide-up">
          {/* Header panel */}
          <div className="bg-gradient-to-r from-[#F59E0B] to-amber-400 px-5 py-4 flex justify-between items-center">
            <div>
              <p className="text-white text-xs opacity-80">Detail Tanggal</p>
              <h3 className="text-white font-bold text-sm md:text-base">{formatSelectedDate()}</h3>
            </div>
            <button onClick={() => setShowPanel(false)} className="text-white/70 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-5 flex flex-col gap-5">
            {/* Transaksi di tanggal ini */}
            {selectedTx.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Transaksi</p>
                <div className="flex flex-col gap-2">
                  {selectedTx.map(t => (
                    <div key={t.id} className="flex justify-between items-center bg-gray-50 px-3 py-2.5 rounded-xl text-sm">
                      <span className="text-gray-700">{t.description || t.category}</span>
                      <span className={`font-bold text-xs ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {t.type === 'income' ? '+' : '-'}Rp{t.amount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reminders */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Bell size={14} className="text-yellow-500" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Catatan Pengingat</p>
              </div>

              {/* List reminder */}
              {selectedReminders.length === 0 ? (
                <p className="text-xs text-gray-400 italic mb-3">Belum ada catatan pengingat</p>
              ) : (
                <div className="flex flex-col gap-2 mb-3">
                  {selectedReminders.map(r => (
                    <div key={r.id} className="flex items-center gap-3 bg-yellow-50 border border-yellow-100 px-3 py-2.5 rounded-xl group">
                      <Bell size={14} className="text-yellow-500 shrink-0" />
                      <span className="text-sm text-gray-700 flex-1">{r.text}</span>
                      <button
                        onClick={() => handleDeleteReminder(r.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input tambah reminder */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newText}
                  onChange={e => setNewText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddReminder()}
                  placeholder="Tambah pengingat... (misal: Bayar kost)"
                  className="flex-1 bg-gray-50 px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-[#F59E0B] outline-none transition-shadow"
                />
                <button
                  onClick={handleAddReminder}
                  disabled={!newText.trim() || adding}
                  className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#F59E0B] to-amber-400 text-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hint klik tanggal */}
      {!showPanel && (
        <p className="text-center text-xs text-gray-400 mt-2">Klik tanggal untuk melihat detail & tambah pengingat</p>
      )}
    </div>
  );
}
