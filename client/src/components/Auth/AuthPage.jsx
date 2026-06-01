import { useState } from 'react';
import { supabase } from '../../services/supabase';

export default function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (isLogin) {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        localStorage.setItem('access_token', data.session.access_token);
        onAuth(data.user);
      } else {
        const { data, error: err } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
        if (err) throw err;
        if (data.session) { localStorage.setItem('access_token', data.session.access_token); onAuth(data.user); }
        else { setError('Cek email untuk verifikasi akun.'); setIsLogin(true); }
      }
    } catch (err) { setError(err.message || 'Terjadi kesalahan'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10 bg-gradient-to-br from-amber-600 via-[#F59E0B] to-amber-500">
      <div className="text-center text-white mb-8 animate-slide-up">
        <div className="flex items-center justify-center gap-3">
          <img src="/DKWhite.png" alt="Logo DompetKost" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Dompet Kost</h1>
        </div>
        <p className="text-sm md:text-base opacity-80 mt-2">Kelola keuanganmu dengan cerdas</p>
      </div>
      <div className="bg-white rounded-3xl p-7 md:p-10 w-full max-w-[380px] md:max-w-[440px] shadow-[0_16px_48px_rgba(0,0,0,0.2)] animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex gap-1 bg-gray-100 rounded-full p-1 mb-6">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-2.5 rounded-full font-semibold text-sm transition-all ${isLogin ? 'bg-[#F59E0B] text-white shadow-sm' : 'text-gray-500'}`}>Masuk</button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-2.5 rounded-full font-semibold text-sm transition-all ${!isLogin ? 'bg-[#F59E0B] text-white shadow-sm' : 'text-gray-500'}`}>Daftar</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {!isLogin && <input type="text" placeholder="Nama Lengkap" value={name} onChange={e => setName(e.target.value)} required className="bg-gray-50 px-4 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-[#F59E0B] outline-none" />}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-gray-50 px-4 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-[#F59E0B] outline-none" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="bg-gray-50 px-4 py-3.5 rounded-xl text-sm focus:ring-2 focus:ring-[#F59E0B] outline-none" />
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button type="submit" disabled={loading} className="bg-gradient-to-r from-[#F59E0B] to-amber-400 text-white py-3.5 rounded-full font-bold text-sm hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(245,158,11,0.35)] transition-all disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? 'Loading...' : isLogin ? 'Masuk' : 'Daftar'}
          </button>
        </form>
      </div>
    </div>
  );
}
