import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Home, Settings, Trophy } from 'lucide-react';
import StudySession from './components/StudySession';
import Quiz from './components/Quiz';
import ProgressView from './components/ProgressView';
import SettingsPanel from './components/SettingsPanel';
import { getDueIds, loadData, saveData } from './components/storage';

function TabButton({ icon: Icon, active, children, onClick }){
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
    >
      <Icon className="w-4 h-4" /> {children}
    </button>
  );
}

export default function App(){
  const [tab, setTab] = useState('home');
  const [data, setData] = useState(loadData());
  const [deck, setDeck] = useState(data.settings.deck || 'hiragana');

  useEffect(()=>{ const nd={...data}; nd.settings.deck = deck; saveData(nd); setData(nd); }, [deck]);

  const dueCount = useMemo(()=> getDueIds(data, deck).length, [data, deck]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kana Tracer + Audio</h1>
            <p className="text-sm text-gray-600">Belajar Hiragana & Katakana — visual, audio, dan pengulangan.</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={deck} onChange={(e)=>setDeck(e.target.value)} className="px-3 py-2 rounded-lg border bg-white">
              <option value="hiragana">Hiragana</option>
              <option value="katakana">Katakana</option>
              <option value="semua">Semua</option>
            </select>
          </div>
        </header>

        <nav className="flex gap-3 mb-6">
          <TabButton icon={Home} active={tab==='home'} onClick={()=>setTab('home')}>Beranda</TabButton>
          <TabButton icon={BookOpen} active={tab==='study'} onClick={()=>setTab('study')}>Belajar</TabButton>
          <TabButton icon={Trophy} active={tab==='quiz'} onClick={()=>setTab('quiz')}>Kuis</TabButton>
          <TabButton icon={Settings} active={tab==='settings'} onClick={()=>setTab('settings')}>Pengaturan</TabButton>
        </nav>

        {tab==='home' && (
          <section className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-xl font-semibold">Belajar Hari Ini (5 menit)</div>
                  <div className="text-gray-600">Huruf yang perlu diulang: <span className="font-semibold text-indigo-700">{dueCount}</span></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={()=>setTab('study')} className="px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">Mulai Belajar</button>
                  <button onClick={()=>setTab('quiz')} className="px-5 py-3 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Kuis 5 Soal</button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-indigo-50 text-indigo-900">
                <div className="font-semibold mb-1">Tips</div>
                <p>Bagus! Sedikit tiap hari lebih baik daripada banyak sekaligus.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border">
                <div className="font-semibold mb-2">Progres singkat</div>
                <ProgressView />
              </div>
            </div>
          </section>
        )}

        {tab==='study' && (
          <section className="p-5 rounded-2xl bg-white border shadow-sm">
            <StudySession />
          </section>
        )}

        {tab==='quiz' && (
          <section className="p-5 rounded-2xl bg-white border shadow-sm">
            <Quiz deck={deck} onDone={(score, answers)=>{
              alert(`Skor kamu: ${score}/5`);
              setTab('home');
            }} />
          </section>
        )}

        {tab==='settings' && (
          <section className="p-5 rounded-2xl bg-white border shadow-sm">
            <SettingsPanel />
          </section>
        )}

        <footer className="mt-8 text-center text-xs text-gray-500">© {new Date().getFullYear()} Kana Tracer — Belajar dengan menyenangkan</footer>
      </div>
    </div>
  );
}
