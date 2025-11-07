import React, { useEffect, useMemo, useState } from 'react';
import AudioButton from './AudioButton';
import TraceCanvas from './TraceCanvas';
import { byId, getDeck } from './kanaData';
import { getDueIds, loadData, saveData, updateSRS, setSetting, getSetting } from './storage';

export default function StudySession(){
  const [data, setData] = useState(loadData());
  const [deck, setDeck] = useState(data.settings.deck || 'hiragana');
  const [hideRomaji, setHideRomaji] = useState(getSetting(data, 'hideRomaji'));
  const [queue, setQueue] = useState(getDueIds(data, deck));
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(()=>{
    setQueue(getDueIds(data, deck));
  },[data, deck]);

  const currentId = queue[currentIdx];
  const current = useMemo(() => currentId ? byId(currentId) : null, [currentId]);

  function onAnswer(remembered){
    if (!current) return;
    const newData = updateSRS({ ...data, settings: { ...data.settings } }, current.id, remembered);
    setData(newData);
    if (currentIdx < queue.length - 1) setCurrentIdx(currentIdx + 1);
    else setCurrentIdx(0);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={deck}
            onChange={(e)=>{ setDeck(e.target.value); const nd = { ...data }; nd.settings.deck = e.target.value; saveData(nd); setData(nd); }}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white"
          >
            <option value="hiragana">Hiragana</option>
            <option value="katakana">Katakana</option>
            <option value="semua">Semua</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={hideRomaji} onChange={(e)=>{ setHideRomaji(e.target.checked); const nd={...data}; setSetting(nd,'hideRomaji', e.target.checked); setData(nd);} } />
            Sembunyikan Romaji
          </label>
        </div>
        <div className="text-sm text-gray-600">Due: {queue.length} huruf</div>
      </div>

      {!current && (
        <div className="p-6 rounded-xl bg-green-50 text-green-800 text-center">
          Tidak ada yang jatuh tempo. Bagus! Sedikit tiap hari lebih baik daripada banyak sekaligus.
        </div>
      )}

      {current && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-[96px] leading-none font-bold">{current.char}</div>
          {!hideRomaji && <div className="text-xl text-gray-700">{current.romaji}</div>}
          <AudioButton romaji={current.romaji} label="Dengar" />
          <p className="text-gray-700">Dengar dan tulis huruf ini.</p>
          <TraceCanvas />
          <p className="text-gray-700">Sudah ingat atau belum?</p>
          <div className="flex gap-3">
            <button onClick={()=>onAnswer(false)} className="px-4 py-2 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200">Belum</button>
            <button onClick={()=>onAnswer(true)} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Ingat</button>
          </div>
        </div>
      )}
    </div>
  );
}
