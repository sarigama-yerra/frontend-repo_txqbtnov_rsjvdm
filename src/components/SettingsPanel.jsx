import React, { useRef, useState } from 'react';
import { exportJSON, importJSON, loadData, saveData, setSetting } from './storage';

export default function SettingsPanel(){
  const [data, setData] = useState(loadData());
  const fileRef = useRef(null);

  function toggleRomaji(v){
    const nd = { ...data };
    setSetting(nd, 'hideRomaji', v);
    setData(nd);
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-white border flex items-center justify-between">
        <div>
          <div className="font-medium">Sembunyikan Romaji</div>
          <div className="text-sm text-gray-600">Tingkatkan pengenalan visual.</div>
        </div>
        <input type="checkbox" checked={!!data.settings.hideRomaji} onChange={e=>toggleRomaji(e.target.checked)} />
      </div>

      <div className="p-4 rounded-xl bg-white border">
        <div className="flex gap-3">
          <button onClick={exportJSON} className="px-4 py-2 rounded-lg bg-gray-900 text-white">Ekspor JSON</button>
          <button onClick={()=>fileRef.current?.click()} className="px-4 py-2 rounded-lg bg-gray-100">Impor JSON</button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e)=>{
            const f = e.target.files?.[0];
            if (!f) return;
            importJSON(f, ok => { if (ok) { const nd = loadData(); setData(nd); alert('Data berhasil diimpor'); } else { alert('File tidak valid'); } });
          }} />
        </div>
      </div>
    </div>
  );
}
