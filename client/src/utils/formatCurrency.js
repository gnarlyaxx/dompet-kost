export const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('IDR', 'Rp');
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num);
};

export const CATEGORIES = [
  { name: 'Makan & Minum', icon: '🍔', color: '#f97316' },
  { name: 'Transportasi', icon: '🚌', color: '#3b82f6' },
  { name: 'Pendidikan', icon: '📚', color: '#8b5cf6' },
  { name: 'Hiburan', icon: '🎮', color: '#ec4899' },
  { name: 'Belanja', icon: '🛒', color: '#f59e0b' },
  { name: 'Lainnya', icon: '📦', color: '#6b7280' },
];

export const MONTHS = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
];

export const DAYS = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
