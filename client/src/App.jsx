import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from './services/supabase';
import api from './services/api';
import Header from './components/Layout/Header';
import BottomNav from './components/Layout/BottomNav';
import AuthPage from './components/Auth/AuthPage';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import CalendarPage from './pages/CalendarPage';
import CalculatorPage from './pages/CalculatorPage';
import AIPage from './pages/AIPage';
import './styles/index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState({ used: 0, total: 1500000 });
  const [txLoading, setTxLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  // narik data dari backend cuy ──────────────────────────────────────────────
  const fetchTransactions = async () => {
    try {
      setTxLoading(true);
      const res = await api.get('/transactions');
      setTransactions(res.data || []);
    } catch (err) {
      console.error('Gagal fetch transaksi:', err);
    } finally {
      setTxLoading(false);
    }
  };

  const fetchBudget = async () => {
    try {
      const res = await api.get('/budget');
      if (res.data?.amount) setBudget(b => ({ ...b, total: res.data.amount }));
    } catch (err) {
      console.error('Gagal fetch budget:', err);
    }
  };

  // ngecek user login pake supabase atau mode demo doang ─────────────────────────────────────────────
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setUser(session.user);
          localStorage.setItem('access_token', session.access_token);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
        setUser(session?.user || null);
        if (session) {
          localStorage.setItem('access_token', session.access_token);
        } else {
          localStorage.removeItem('access_token');
          setTransactions([]);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // mode demo buat ngetes doang
      setUser({ id: 'demo', email: 'demo@dompetkost.app' });
      setLoading(false);
    }
  }, []);

  // narik data pas user udah berhasil login ────────────────────────────────────────
  useEffect(() => {
    if (user && isSupabaseConfigured) {
      fetchTransactions();
      fetchBudget();
    }
  }, [user]);

  // fitur CRUD buat transaksi, tambah hapus dkk ───────────────────────────────────────────────────────
  const handleAddTransaction = async (t) => {
    if (!isSupabaseConfigured) {
      // kalo demo mode, simpen di state aja biar gak error
      setTransactions(prev => [{ ...t, id: Date.now().toString() }, ...prev]);
      return;
    }
    try {
      const res = await api.post('/transactions', t);
      setTransactions(prev => [res.data, ...prev]);
      showToast('Transaksi berhasil ditambahkan', 'success');
    } catch (err) {
      console.error('Gagal tambah transaksi:', err);
      showToast('Gagal menyimpan transaksi. Coba lagi.');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!isSupabaseConfigured) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      return;
    }
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions(prev => prev.filter(t => t.id !== id));
      showToast('Transaksi berhasil dihapus', 'success');
    } catch (err) {
      console.error('Gagal hapus transaksi:', err);
      showToast('Gagal menghapus transaksi. Coba lagi.');
    }
  };

  const handleEditBudget = async (newAmount) => {
    if (!isSupabaseConfigured) {
      setBudget(b => ({ ...b, total: newAmount }));
      return;
    }
    try {
      await api.put('/budget', { amount: newAmount });
      setBudget(b => ({ ...b, total: newAmount }));
      showToast('Anggaran berhasil diperbarui', 'success');
    } catch (err) {
      console.error('Gagal update budget:', err);
      showToast('Gagal menyimpan anggaran. Coba lagi.');
    }
  };

  // ngitung total pengeluaran sama persentase budget ──────────────────────────────────────────────
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const budgetPercent = budget.total > 0 ? Math.round((expense / budget.total) * 100) : 0;

  // logout: bersihkan sesi dan state ──────────────────────────────────────────
  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('access_token');
    setUser(null);
    setTransactions([]);
    setBudget({ used: 0, total: 1500000 });
  };

  // tampilan loading pas nungguin data dateng ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f0f4ff' }}>
        <p style={{ color: '#F59E0B', fontWeight: 600 }}>Loading...</p>
      </div>
    );
  }

  if (!user) return <AuthPage onAuth={setUser} />;

  return (
    <BrowserRouter>
      <Header budgetPercent={budgetPercent} user={user} onLogout={handleLogout} />
      
      {/* Custom Toast Notification */}
      {toast.show && (
        <div className={`fixed top-[88px] left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full text-xs md:text-sm font-bold text-white shadow-lg z-[100] animate-slide-up transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.message}
        </div>
      )}

      <Routes>
        <Route path="/" element={
          <HomePage
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onEditBudget={handleEditBudget}
            budget={{ ...budget, used: expense }}
            loading={txLoading}
          />}
        />
        <Route path="/history" element={
          <HistoryPage
            transactions={transactions}
            onDelete={handleDeleteTransaction}
          />}
        />
        <Route path="/calendar" element={<CalendarPage transactions={transactions} />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/ai" element={<AIPage />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}

export default App;
