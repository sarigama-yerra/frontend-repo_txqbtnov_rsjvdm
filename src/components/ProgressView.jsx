import React, { useMemo } from 'react';
import { loadData } from './storage';

export default function ProgressView(){
  const data = loadData();
  const counts = useMemo(()=>{
    const c = {1:0,2:0,3:0};
    Object.values(data.srsBox).forEach(v=>{ c[v] = (c[v]||0)+1; });
    return c;
  },[data]);

  const total = counts[1]+counts[2]+counts[3];
  const pct = (n)=> Math.round((n/total)*100);

  const notMastered = Object.entries(data.srsBox).filter(([id,box])=>box<3).slice(0,20);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Persentase Kuasai</h3>
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map(b => (
            <div key={b} className="p-4 rounded-xl bg-white border">
              <div className="text-sm text-gray-600">Kotak {b}</div>
              <div className="text-2xl font-bold">{pct(counts[b])}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-indigo-50 text-indigo-800">
        Streak belajar: <strong>{data.settings.streak}</strong> hari
      </div>

      <div>
        <h3 className="font-semibold mb-2">Belum dikuasai</h3>
        <div className="flex flex-wrap gap-2">
          {notMastered.map(([id])=> (
            <span key={id} className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">{id}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
