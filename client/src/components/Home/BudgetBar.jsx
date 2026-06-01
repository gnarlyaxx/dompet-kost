import { useState } from 'react';
import { formatRupiah } from '../../utils/formatCurrency';
import { X, Check } from 'lucide-react';

export default function BudgetBar({ used = 0, total = 0, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [saving, setSaving] = useState(false);

  const percent = total > 0 ? Math.round((used / total) * 100) : 0;
  const isOver = percent > 90;

  const handleOpen = () => {
    setInputVal(String(total));
    setEditing(true);
  };

  const handleSave = async () => {
    const val = Number(inputVal);
    if (!val || val <= 0) return;
    setSaving(true);
    await onEdit?.(val);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => setEditing(false);

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm mt-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 font-semibold text-sm md:text-base">
          <span className="text-lg">📊</span>
          <span>Anggaran Bulanan</span>
        </div>
        {!editing && (
          <button
            onClick={handleOpen}
            className="bg-gray-100 hover:bg-[#F59E0B] hover:text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-200"
          >
            Ubah
          </button>
        )}
      </div>

      {/* Form edit anggaran */}
      {editing && (
        <div className="flex gap-2 mb-3 animate-fade-in">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">Rp</span>
            <input
              type="number"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
              autoFocus
              className="w-full bg-gray-50 pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#F59E0B] outline-none"
              placeholder="1500000"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-10 h-10 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center hover:bg-amber-600 transition-colors disabled:opacity-60"
          >
            <Check size={16} />
          </button>
          <button
            onClick={handleCancel}
            className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Progress bar */}
      <div className="h-2 md:h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${isOver ? 'bg-red-500' : 'bg-gradient-to-r from-[#F59E0B] to-amber-400'}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-[11px] md:text-xs mt-1.5">
        <span className={isOver ? 'text-red-500 font-semibold' : 'text-gray-500'}>{formatRupiah(used)} terpakai</span>
        <span className="text-gray-500">{percent}% dari {formatRupiah(total)}</span>
      </div>
    </div>
  );
}
