import { Volume2 } from 'lucide-react';
import React from 'react';

function speakRomaji(romaji) {
  if (!window?.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(romaji);
  // try Japanese voice
  const voice = speechSynthesis.getVoices().find(v => v.lang?.toLowerCase().startsWith('ja'));
  if (voice) utter.voice = voice;
  utter.lang = voice?.lang || 'ja-JP';
  speechSynthesis.speak(utter);
}

export default function AudioButton({ romaji, label = 'Dengar' }){
  return (
    <button
      onClick={() => speakRomaji(romaji)}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] transition"
      aria-label="Putar Audio"
    >
      <Volume2 className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
