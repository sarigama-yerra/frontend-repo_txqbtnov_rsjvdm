import React, { useMemo, useState } from 'react';
import { getDeck } from './kanaData';
import AudioButton from './AudioButton';

function shuffle(arr){
  const a = [...arr];
  for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

export default function Quiz({ deck='hiragana', onDone }){
  const pool = getDeck(deck);
  const [mode] = useState(Math.random() < 0.5 ? 'char→romaji' : 'audio→char');
  const questions = useMemo(()=> shuffle(pool).slice(0,5), [deck]);
  const [index,setIndex] = useState(0);
  const [score,setScore] = useState(0);
  const [answers,setAnswers] = useState([]);
  const [reflection, setReflection] = useState('');

  const q = questions[index];
  const choices = useMemo(()=> shuffle(pool).filter(k=>k.id!==q.id).slice(0,3).concat([q]).sort(()=>Math.random()-0.5), [index]);

  function submit(ans){
    const correct = (mode==='char→romaji') ? (ans===q.romaji) : (ans===q.char);
    setScore(s=> s + (correct?1:0));
    setAnswers(a=>[...a, { id:q.id, correct }]);
    if (index < 4) setIndex(index+1); else onDone?.(score + (correct?1:0), answers.concat([{id:q.id,correct}]), reflection);
  }

  if (!q) return null;

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">Kuis 5 soal — Mode: {mode}</div>
      <div className="p-4 rounded-xl bg-white border">
        {mode==='char→romaji' && (
          <>
            <div className="text-6xl font-bold text-center mb-4">{q.char}</div>
            <div className="grid grid-cols-2 gap-3">
              {choices.map(c => (
                <button key={c.id} onClick={()=>submit(c.romaji)} className="px-4 py-3 rounded-lg bg-indigo-50 hover:bg-indigo-100">
                  {c.romaji}
                </button>
              ))}
            </div>
          </>
        )}
        {mode==='audio→char' && (
          <>
            <div className="flex justify-center mb-4"><AudioButton romaji={q.romaji} label="▶ Dengar" /></div>
            <div className="grid grid-cols-2 gap-3">
              {choices.map(c => (
                <button key={c.id} onClick={()=>submit(c.char)} className="px-4 py-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-3xl">
                  {c.char}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {index===4 && (
        <div className="space-y-2">
          <label className="block text-sm text-gray-700">Refleksi singkat: Huruf tersulit hari ini?</label>
          <input value={reflection} onChange={e=>setReflection(e.target.value)} className="w-full px-3 py-2 rounded-lg border" placeholder="contoh: し (shi)" />
        </div>
      )}
    </div>
  );
}
