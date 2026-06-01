import { useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../../utils/formatCurrency';

export default function AddTransactionModal({ isOpen, onClose, onSave }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!amount || Number(amount) <= 0) return;
    onSave({ type, amount: Number(amount), description: description || category, category, date: new Date().toISOString().split('T')[0] });
    setAmount(''); setDescription(''); onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-end md:items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="bg-white w-full max-w-[430px] md:max-w-lg rounded-t-3xl md:rounded-3xl p-6 md:p-8 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg md:text-xl font-bold">Tambah Transaksi</h2>
          <button onClick={onClose} className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex gap-2 mb-5">
          <button onClick={() => setType('expense')} className={`flex-1 py-3 rounded-full font-semibold text-sm transition-all ${type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
            Pengeluaran
          </button>
          <button onClick={() => setType('income')} className={`flex-1 py-3 rounded-full font-semibold text-sm transition-all ${type === 'income' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
            Pemasukan
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <input type="number" placeholder="Jumlah (Rp)" value={amount} onChange={e => setAmount(e.target.value)} className="bg-gray-50 px-4 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-[#F59E0B] outline-none transition-shadow" />
          <input type="text" placeholder="Keterangan" value={description} onChange={e => setDescription(e.target.value)} className="bg-gray-50 px-4 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-[#F59E0B] outline-none transition-shadow" />
          <div className="flex items-center bg-gray-50 rounded-xl px-4">
            <span className="text-xl mr-2">{CATEGORIES.find(c => c.name === category)?.icon}</span>
            <select value={category} onChange={e => setCategory(e.target.value)} className="flex-1 bg-transparent py-3.5 text-sm cursor-pointer outline-none appearance-none">
              {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <button onClick={handleSave} className="bg-gradient-to-r from-[#F59E0B] to-amber-400 text-white py-3.5 rounded-full font-bold text-sm mt-1 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(245,158,11,0.35)] transition-all">
            Simpan Transaksi
          </button>
        </div>
      </div>
    </div>
  );
}
