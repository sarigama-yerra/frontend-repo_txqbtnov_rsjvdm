// Dataset kana (46 hiragana + 46 katakana)
// Setiap item: { id, char, romaji, audio, script }
// audio disimpan sebagai string romaji; pelafalan memakai SpeechSynthesis ja-JP

export const hiragana = [
  ['あ','a'],['い','i'],['う','u'],['え','e'],['お','o'],
  ['か','ka'],['き','ki'],['く','ku'],['け','ke'],['こ','ko'],
  ['さ','sa'],['し','shi'],['す','su'],['せ','se'],['そ','so'],
  ['た','ta'],['ち','chi'],['つ','tsu'],['て','te'],['と','to'],
  ['な','na'],['に','ni'],['ぬ','nu'],['ね','ne'],['の','no'],
  ['は','ha'],['ひ','hi'],['ふ','fu'],['へ','he'],['ほ','ho'],
  ['ま','ma'],['み','mi'],['む','mu'],['め','me'],['も','mo'],
  ['や','ya'],['ゆ','yu'],['よ','yo'],
  ['ら','ra'],['り','ri'],['る','ru'],['れ','re'],['ろ','ro'],
  ['わ','wa'],['を','wo'],['ん','n']
].map(([char, romaji]) => ({ id: `h-${romaji}`, char, romaji, audio: `${romaji}.mp3`, script: 'hiragana' }));

export const katakana = [
  ['ア','a'],['イ','i'],['ウ','u'],['エ','e'],['オ','o'],
  ['カ','ka'],['キ','ki'],['ク','ku'],['ケ','ke'],['コ','ko'],
  ['サ','sa'],['シ','shi'],['ス','su'],['セ','se'],['ソ','so'],
  ['タ','ta'],['チ','chi'],['ツ','tsu'],['テ','te'],['ト','to'],
  ['ナ','na'],['ニ','ni'],['ヌ','nu'],['ネ','ne'],['ノ','no'],
  ['ハ','ha'],['ヒ','hi'],['フ','fu'],['ヘ','he'],['ホ','ho'],
  ['マ','ma'],['ミ','mi'],['ム','mu'],['メ','me'],['モ','mo'],
  ['ヤ','ya'],['ユ','yu'],['ヨ','yo'],
  ['ラ','ra'],['リ','ri'],['ル','ru'],['レ','re'],['ロ','ro'],
  ['ワ','wa'],['ヲ','wo'],['ン','n']
].map(([char, romaji]) => ({ id: `k-${romaji}`, char, romaji, audio: `${romaji}.mp3`, script: 'katakana' }));

export const allKana = [...hiragana, ...katakana];

export function getDeck(deck) {
  if (deck === 'hiragana') return hiragana;
  if (deck === 'katakana') return katakana;
  return allKana;
}

export function byId(id) {
  return allKana.find(k => k.id === id);
}
