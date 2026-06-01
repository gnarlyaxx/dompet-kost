import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Send, Menu, PlusCircle, MessageSquare, X, Trash2 } from 'lucide-react';
import api from '../services/api';

const suggestions = ['Analisis kondisi keuanganku', 'Tips hemat uang makan', 'Rekomendasi budgeting'];

const DEFAULT_MESSAGE = { 
  role: 'assistant', 
  content: 'Halo! Saya AI asisten keuanganmu. Mau tanya soal pengelolaan keuangan? Atau kamu bisa cek tab Rekomendasi untuk analisis otomatis keuanganmu bulan ini! 💡' 
};

export default function AIPage() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const chatEndRef = useRef(null);

  // tarik data chat history dari lokal pas pertama buka halaman
  useEffect(() => {
    const savedSessions = localStorage.getItem('ai_chat_sessions');
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed);
      if (parsed.length > 0) {
        setActiveSessionId(parsed[0].id);
      } else {
        createNewSession();
      }
    } else {
      createNewSession();
    }
  }, []);

  // simpen chat ke lokal tiap ada pesan baru
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('ai_chat_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || { messages: [DEFAULT_MESSAGE] };
  const messages = activeSession.messages || [DEFAULT_MESSAGE];

  useEffect(() => { 
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages, showHistory]);

  const createNewSession = () => {
    const newSession = {
      id: Date.now().toString(),
      title: 'Percakapan Baru',
      updatedAt: Date.now(),
      messages: [DEFAULT_MESSAGE]
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setShowHistory(false);
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    if (activeSessionId === id) {
      setActiveSessionId(updated.length > 0 ? updated[0].id : null);
      if (updated.length === 0) {
        createNewSession();
      }
    }
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    
    setInput('');
    setLoading(true);

    // update UI duluan biar keliatan cepet (optimistic update)
    const userMessage = { role: 'user', content: msg };
    let currentHistory = [...messages, userMessage];

    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return { 
          ...s, 
          title: s.messages.length <= 1 ? msg.substring(0, 30) + '...' : s.title,
          updatedAt: Date.now(),
          messages: currentHistory 
        };
      }
      return s;
    }));

    try {
      // lempar history chat ke backend biar si AI nya gak pikun
      const res = await api.post('/chat', { history: currentHistory });
      
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, { role: 'assistant', content: res.data.reply }]
          };
        }
        return s;
      }));
    } catch {
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, { role: 'assistant', content: 'Maaf, terjadi kesalahan. Coba lagi nanti.' }]
          };
        }
        return s;
      }));
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="pt-[82px] md:pt-[96px] pb-[72px] px-4 md:px-8 min-h-screen flex flex-col animate-fade-in max-w-4xl mx-auto relative">
      
      {/* Tombol Menu Header */}
      <div className="flex justify-between items-center mb-3">
        <button className="px-4 py-2 rounded-full text-xs md:text-sm font-semibold bg-[#F59E0B] text-white shadow-sm flex items-center gap-2">
          👾 Groq AI
        </button>
        <button 
          onClick={() => setShowHistory(true)}
          className="p-2 rounded-full bg-white text-gray-600 shadow-sm hover:bg-gray-50 hover:text-[#F59E0B] transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* History Drawer Overlay via Portal agar tidak kena masalah stacking context (relative) */}
      {showHistory && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm animate-fade-in" onClick={() => setShowHistory(false)}>
          <div 
            className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col animate-slide-left"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <MessageSquare size={18} className="text-[#F59E0B]"/> Riwayat Chat
              </h3>
              <button onClick={() => setShowHistory(false)} className="p-1 text-gray-400 hover:text-gray-800">
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-3">
              <button 
                onClick={createNewSession}
                className="w-full flex items-center gap-2 justify-center py-2.5 rounded-xl bg-[#F59E0B] text-white font-semibold text-sm hover:bg-amber-600 transition-colors shadow-sm"
              >
                <PlusCircle size={18} /> Chat Baru
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {sessions.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => { setActiveSessionId(s.id); setShowHistory(false); }}
                  className={`group flex justify-between items-center p-3 rounded-xl cursor-pointer transition-all ${activeSessionId === s.id ? 'bg-amber-100 border border-amber-200' : 'hover:bg-gray-50 border border-transparent'}`}
                >
                  <div className="flex-1 truncate pr-2">
                    <p className={`text-sm truncate font-medium ${activeSessionId === s.id ? 'text-[#F59E0B]' : 'text-gray-700'}`}>
                      {s.title}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(s.updatedAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => deleteSession(e, s.id)}
                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-32 md:pb-28">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 max-w-[85%] md:max-w-[70%] animate-fade-in ${m.role === 'user' ? 'self-end flex-row-reverse' : ''}`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-amber-400 flex items-center justify-center text-sm shrink-0">👾</div>
            )}
            <div className={`px-4 py-3 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-[#F59E0B] text-white' : 'bg-white'}`}>
              <p className="whitespace-pre-wrap">{m.content}</p>
              {m.role === 'assistant' && <span className="block mt-1.5 text-[10px] text-gray-400 font-semibold">Groq</span>}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F59E0B] to-amber-400 flex items-center justify-center text-sm shrink-0">👾</div>
            <div className="bg-white px-5 py-3.5 rounded-2xl shadow-sm flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 typing-dot" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 typing-dot" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 typing-dot" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="fixed bottom-[128px] md:bottom-[132px] left-1/2 -translate-x-1/2 max-w-[calc(100%-32px)] md:max-w-3xl w-full flex gap-2 overflow-x-auto pb-1 px-1">
          {suggestions.map(s => (
            <button key={s} onClick={() => sendMessage(s)} className="shrink-0 px-4 py-2 rounded-full text-[11px] md:text-xs font-medium bg-white text-[#F59E0B] border border-amber-200 whitespace-nowrap hover:bg-[#F59E0B] hover:text-white hover:border-[#F59E0B] transition-all">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 max-w-[calc(100%-32px)] md:max-w-3xl w-full flex gap-2 py-2 bg-gradient-to-t from-amber-50/80 via-amber-50/60 to-transparent px-1 backdrop-blur-sm z-40">
        <input type="text" placeholder="Tanya seputar keuanganmu..." value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-1 bg-white px-4 py-3 rounded-full text-sm shadow-sm focus:ring-2 focus:ring-[#F59E0B] outline-none" />
        <button onClick={() => sendMessage()} disabled={loading} className="w-11 h-11 rounded-full bg-[#F59E0B] text-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-60">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
