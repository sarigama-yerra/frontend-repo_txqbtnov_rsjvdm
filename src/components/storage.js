// Simple persistence using localStorage
// Structure:
// {
//  kana: [...],
//  srsBox: { [id]: 1|2|3 },
//  dueDate: { [id]: 'YYYY-MM-DD' },
//  settings: { hideRomaji: boolean, deck: 'hiragana'|'katakana'|'semua', streak: number, lastStudy: 'YYYY-MM-DD' }
// }

import { allKana, getDeck } from './kanaData';

const KEY = 'kana-tracer-data-v1';

function todayStr(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return todayStr(d);
}

export function loadData() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return initData();
  try {
    const parsed = JSON.parse(raw);
    return migrate(fillDefaults(parsed));
  } catch {
    return initData();
  }
}

function fillDefaults(data) {
  const defaults = initData();
  return {
    kana: data.kana || defaults.kana,
    srsBox: { ...defaults.srsBox, ...(data.srsBox || {}) },
    dueDate: { ...defaults.dueDate, ...(data.dueDate || {}) },
    settings: { ...defaults.settings, ...(data.settings || {}) },
  };
}

function migrate(data){
  // ensure all kana exist
  const ids = new Set(allKana.map(k=>k.id));
  for (const id of ids) {
    if (!data.srsBox[id]) data.srsBox[id] = 1;
    if (!data.dueDate[id]) data.dueDate[id] = todayStr();
  }
  return data;
}

export function initData() {
  const srsBox = {};
  const dueDate = {};
  const t = todayStr();
  allKana.forEach(k => { srsBox[k.id] = 1; dueDate[k.id] = t; });
  const data = {
    kana: allKana,
    srsBox,
    dueDate,
    settings: { hideRomaji: false, deck: 'hiragana', streak: 0, lastStudy: '' }
  };
  localStorage.setItem(KEY, JSON.stringify(data));
  return data;
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getDueIds(data, deck) {
  const t = todayStr();
  const ids = new Set(getDeck(deck).map(k=>k.id));
  return Object.keys(data.dueDate)
    .filter(id => ids.has(id) && data.dueDate[id] <= t)
    .sort((a,b)=> (data.srsBox[a]-data.srsBox[b]) || a.localeCompare(b));
}

export function updateSRS(data, id, remembered) {
  const cur = data.srsBox[id] || 1;
  let nextBox = remembered ? Math.min(3, cur + 1) : 1;
  data.srsBox[id] = nextBox;
  const days = nextBox; // 1->1d, 2->2d, 3->3d
  const t = todayStr();
  data.dueDate[id] = addDays(t, days);
  // streak update if any learning today
  if (data.settings.lastStudy !== t) {
    const yesterday = addDays(t, -1);
    data.settings.streak = (data.settings.lastStudy === yesterday) ? (data.settings.streak + 1) : 1;
    data.settings.lastStudy = t;
  }
  saveData(data);
  return data;
}

export function exportJSON() {
  const raw = localStorage.getItem(KEY) || '{}';
  const blob = new Blob([raw], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kana-tracer-data.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importJSON(file, onDone) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      localStorage.setItem(KEY, JSON.stringify(migrate(fillDefaults(parsed))));
      onDone?.(true);
    } catch {
      onDone?.(false);
    }
  };
  reader.readAsText(file);
}

export function setSetting(data, key, value){
  data.settings[key] = value;
  saveData(data);
}

export function getSetting(data, key){
  return data.settings[key];
}
