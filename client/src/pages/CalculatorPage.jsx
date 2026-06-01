import { useState } from 'react';
import { formatRupiah } from '../utils/formatCurrency';

// settingan default buat pilihan tabungan per minggu ──────────────────────────────────────────
const WEEKLY_PRESETS = [
  { label: '1 Bulan', weeks: 4 },
  { label: '3 Bulan', weeks: 13 },
  { label: '6 Bulan', weeks: 26 },
  { label: '1 Tahun', weeks: 52 },
];

export default function CalculatorPage() {
  const [tab, setTab] = useState('calc');

  // fitur kalkulator standar aja nih ──────────────────────────────────────────────────────
  const [display, setDisplay] = useState('0');

  // logika buat ngitung tabungan per bulan ──────────────────────────────────────────────────────
  const [savingsMode, setSavingsMode] = useState('monthly'); // 'monthly' | 'weekly'
  const [monthlyForm, setMonthlyForm] = useState({ deposit: '', rate: '', duration: '' });
  const [monthlyResult, setMonthlyResult] = useState(null);

  // logika buat ngitung tabungan per minggu ─────────────────────────────────────────────────────
  // set bunga 4% pertahun, masuk akal lah buat celengan mahasiswa
  // durasi defaultnya kita set 13 minggu (kurang lebih 3 bulan)
  const [weeklyForm, setWeeklyForm] = useState({ deposit: '', rate: '4', duration: '13' });
  const [weeklyResult, setWeeklyResult] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(1); // nangkep index tombol preset yg diklik

  // fitur nge-split duit/anggaran ─────────────────────────────────────────────────────────
  const [budgetForm, setBudgetForm] = useState({ income: '', needs: 50, wants: 30 });

  // ─────────────────────────────────────────────────────────────────────────
  const handleCalc = (v) => {
    if (v === 'C') return setDisplay('0');
    if (v === '⌫') return setDisplay(d => d.length <= 1 ? '0' : d.slice(0, -1));
    if (v === '=') { try { setDisplay(String(eval(display))); } catch { setDisplay('Error'); } return; }
    setDisplay(d => d === '0' && !['.','+','-','*','/'].includes(v) ? v : d + v);
  };
  const calcBtns = ['C','⌫','%','/', '7','8','9','*', '4','5','6','-', '1','2','3','+', '0','.','00','='];

  // rumus ngitung bunga majemuk bulanan (compound interest)
  const calcMonthly = () => {
    const m = Number(monthlyForm.deposit);
    const r = Number(monthlyForm.rate) / 100 / 12;
    const n = Number(monthlyForm.duration);
    if (!m || !n) return;
    setMonthlyResult(r > 0 ? m * ((Math.pow(1 + r, n) - 1) / r) : m * n);
  };

  // rumus ngitung bunga majemuk mingguan (compound interest)
  const calcWeekly = () => {
    const w = Number(weeklyForm.deposit);
    const r = Number(weeklyForm.rate) / 100 / 52; // suku bunga per minggu
    const n = Number(weeklyForm.duration);          // jumlah minggu
    if (!w || !n) return;
    const total = r > 0 ? w * ((Math.pow(1 + r, n) - 1) / r) : w * n;
    const totalDeposit = w * n;
    const interest = total - totalDeposit;
    setWeeklyResult({ total, totalDeposit, interest });
  };

  const handlePreset = (idx) => {
    setSelectedPreset(idx);
    setWeeklyForm(f => ({ ...f, duration: String(WEEKLY_PRESETS[idx].weeks) }));
    setWeeklyResult(null);
  };

  const savings = 100 - Number(budgetForm.needs) - Number(budgetForm.wants);
  const bIncome = Number(budgetForm.income) || 0;
  const tabs = [['calc', 'Kalkulator'], ['savings', 'Tabungan'], ['budget', 'Bagi Anggaran']];
  const inputCls = "bg-gray-50 px-4 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-[#F59E0B] outline-none w-full transition-shadow";

  return (
    <div className="pt-[82px] md:pt-[96px] pb-[100px] px-4 md:px-8 min-h-screen animate-fade-in max-w-3xl mx-auto">
      {/* Tab navigasi */}
      <div className="flex gap-1 bg-white rounded-full p-1 mb-4 shadow-sm">
        {tabs.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex-1 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all ${tab === k ? 'bg-[#F59E0B] text-white' : 'text-gray-500 hover:text-gray-700'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* ── Kalkulator Biasa ────────────────────────────────────────────── */}
      {tab === 'calc' && (
        <div className="bg-white rounded-2xl p-5 md:p-8 shadow-sm">
          <div className="bg-gray-50 rounded-xl px-4 py-5 text-right text-3xl md:text-4xl font-bold mb-4 overflow-x-auto min-h-[60px]">{display}</div>
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {calcBtns.map(b => (
              <button key={b} onClick={() => handleCalc(b)}
                className={`py-4 md:py-5 rounded-xl text-base md:text-lg font-semibold transition-all active:scale-95 ${
                  b === '=' ? 'bg-[#F59E0B] text-white hover:bg-amber-600' :
                  ['/','+','-','*','%'].includes(b) ? 'bg-amber-50 text-[#F59E0B] hover:bg-amber-100' :
                  ['C','⌫'].includes(b) ? 'bg-red-50 text-red-500 hover:bg-red-100' :
                  'bg-gray-50 text-gray-800 hover:bg-gray-100'}`}>
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Tabungan ────────────────────────────────────────────────────── */}
      {tab === 'savings' && (
        <div className="flex flex-col gap-4">
          {/* Sub-tab: Bulanan / Mingguan */}
          <div className="flex gap-1 bg-white rounded-full p-1 shadow-sm">
            <button onClick={() => setSavingsMode('monthly')}
              className={`flex-1 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all ${savingsMode === 'monthly' ? 'bg-[#F59E0B] text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              📅 Per Bulan
            </button>
            <button onClick={() => setSavingsMode('weekly')}
              className={`flex-1 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all ${savingsMode === 'weekly' ? 'bg-[#F59E0B] text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              📆 Per Minggu
            </button>
          </div>

          {/* Tabungan Bulanan */}
          {savingsMode === 'monthly' && (
            <div className="bg-white rounded-2xl p-5 md:p-8 shadow-sm animate-fade-in">
              <h3 className="font-bold text-sm md:text-base mb-1">Kalkulator Tabungan Bulanan</h3>
              <p className="text-xs text-gray-400 mb-4">Hitung proyeksi tabungan dengan bunga majemuk per bulan</p>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold text-gray-500">Tabungan / bulan (Rp)</label>
                <input type="number" value={monthlyForm.deposit} onChange={e => setMonthlyForm(p => ({ ...p, deposit: e.target.value }))} className={inputCls} placeholder="500.000" />
                <label className="text-xs font-semibold text-gray-500">Suku Bunga per Tahun (%)</label>
                <input type="number" value={monthlyForm.rate} onChange={e => setMonthlyForm(p => ({ ...p, rate: e.target.value }))} className={inputCls} placeholder="4 – 6% (tabungan bank)" />
                <label className="text-xs font-semibold text-gray-500">Durasi (bulan)</label>
                <input type="number" value={monthlyForm.duration} onChange={e => setMonthlyForm(p => ({ ...p, duration: e.target.value }))} className={inputCls} placeholder="12" />
                <button onClick={calcMonthly} className="bg-gradient-to-r from-[#F59E0B] to-amber-400 text-white py-3.5 rounded-full font-bold text-sm hover:-translate-y-0.5 transition-all">
                  Hitung Tabungan
                </button>
                {monthlyResult !== null && (
                  <div className="bg-amber-50 p-4 rounded-xl flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">Total Tabungan:</span>
                    <strong className="text-[#F59E0B] text-lg">{formatRupiah(Math.round(monthlyResult))}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tabungan Mingguan */}
          {savingsMode === 'weekly' && (
            <div className="bg-white rounded-2xl p-5 md:p-8 shadow-sm animate-fade-in">
              <h3 className="font-bold text-sm md:text-base mb-1">Kalkulator Tabungan Mingguan</h3>
              <p className="text-xs text-gray-400 mb-4">Cocok untuk menabung rutin dari uang saku mingguan 💪</p>

              {/* Preset durasi */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {WEEKLY_PRESETS.map((p, i) => (
                  <button key={i} onClick={() => handlePreset(i)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all ${selectedPreset === i ? 'bg-[#F59E0B] text-white' : 'bg-gray-50 text-gray-600 hover:bg-amber-50 hover:text-[#F59E0B]'}`}>
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold text-gray-500">Tabungan / minggu (Rp)</label>
                <input type="number" value={weeklyForm.deposit}
                  onChange={e => { setWeeklyForm(p => ({ ...p, deposit: e.target.value })); setWeeklyResult(null); }}
                  className={inputCls} placeholder="50.000 – 100.000" />

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">
                      Suku Bunga / Tahun (%)
                      <span className="text-[#F59E0B] ml-1">— disarankan 4%</span>
                    </label>
                    <input type="number" value={weeklyForm.rate}
                      onChange={e => { setWeeklyForm(p => ({ ...p, rate: e.target.value })); setWeeklyResult(null); }}
                      className={inputCls} />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">
                      Durasi (minggu)
                      <span className="text-[#F59E0B] ml-1">— pilih preset ↑</span>
                    </label>
                    <input type="number" value={weeklyForm.duration}
                      onChange={e => { setWeeklyForm(p => ({ ...p, duration: e.target.value })); setSelectedPreset(null); setWeeklyResult(null); }}
                      className={inputCls} />
                  </div>
                </div>

                {/* Info suku bunga */}
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 text-xs text-yellow-700 leading-relaxed">
                  💡 <strong>Panduan suku bunga:</strong> 2–3% untuk tabungan biasa bank, 4–6% untuk deposito/reksa dana pasar uang.
                  Jika menabung tanpa bunga (celengan), isi 0.
                </div>

                <button onClick={calcWeekly}
                  className="bg-gradient-to-r from-[#F59E0B] to-amber-400 text-white py-3.5 rounded-full font-bold text-sm hover:-translate-y-0.5 transition-all">
                  Hitung Tabungan Mingguan
                </button>

                {weeklyResult !== null && (
                  <div className="flex flex-col gap-2 mt-1 animate-fade-in">
                    <div className="bg-amber-50 p-4 rounded-xl flex justify-between items-center">
                      <span className="text-sm text-gray-600">💰 Total Tabungan</span>
                      <strong className="text-[#F59E0B] text-lg">{formatRupiah(Math.round(weeklyResult.total))}</strong>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gray-50 p-3 rounded-xl">
                        <p className="text-[11px] text-gray-400 mb-0.5">Modal Ditabung</p>
                        <p className="text-sm font-bold text-gray-700">{formatRupiah(Math.round(weeklyResult.totalDeposit))}</p>
                      </div>
                      <div className="flex-1 bg-green-50 p-3 rounded-xl">
                        <p className="text-[11px] text-green-600 mb-0.5">Keuntungan Bunga</p>
                        <p className="text-sm font-bold text-green-600">+{formatRupiah(Math.round(weeklyResult.interest))}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Bagi Anggaran ───────────────────────────────────────────────── */}
      {tab === 'budget' && (
        <div className="bg-white rounded-2xl p-5 md:p-8 shadow-sm">
          <h3 className="font-bold text-sm md:text-base mb-1">Bagi Anggaran (50/30/20)</h3>
          <p className="text-xs text-gray-400 mb-4">Atur proporsi kebutuhan, keinginan & tabungan dari pemasukanmu</p>
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-gray-500">Total Pemasukan (Rp)</label>
            <input type="number" value={budgetForm.income} onChange={e => setBudgetForm(p => ({ ...p, income: e.target.value }))} className={inputCls} placeholder="3.000.000" />
            <label className="text-xs font-semibold text-gray-500">Kebutuhan (%)</label>
            <input type="number" value={budgetForm.needs} onChange={e => setBudgetForm(p => ({ ...p, needs: e.target.value }))} className={inputCls} />
            <label className="text-xs font-semibold text-gray-500">Keinginan (%)</label>
            <input type="number" value={budgetForm.wants} onChange={e => setBudgetForm(p => ({ ...p, wants: e.target.value }))} className={inputCls} />
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl text-sm"><span>🏠 Kebutuhan ({budgetForm.needs}%)</span><strong className="text-[#F59E0B]">{formatRupiah(Math.round(bIncome * budgetForm.needs / 100))}</strong></div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl text-sm"><span>🎯 Keinginan ({budgetForm.wants}%)</span><strong className="text-[#F59E0B]">{formatRupiah(Math.round(bIncome * budgetForm.wants / 100))}</strong></div>
              <div className="flex justify-between p-3 bg-amber-50 rounded-xl text-sm"><span>💰 Tabungan ({savings}%)</span><strong className="text-[#F59E0B]">{formatRupiah(Math.round(bIncome * savings / 100))}</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
