/** Conservative answer-key extraction: only key sections, never question options. */
export type KeyPage={text:string;regions:{number?:number;test?:string}[]};
export type KeyCandidate={number:number;letter:string;test?:string;page:number};
export type KeyMatch={letter?:string;status:'found'|'missing'|'ambiguous';source?:string;choices?:string[]};
const fold=(s:string)=>s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
export function isKeyPage(s:string){
 if(/\b(?:cevap\s*anahtar(?:i|lari)?|yanit\s*anahtar(?:i|lari)?|answer\s*key)\b/.test(fold(s)))return true;
 // OCR can omit a high-contrast title. Require strong structural evidence:
 // a test heading plus a compact, explicit answer row and no printed option row.
 const lines=s.split(/\r?\n/);
 return lines.some(l=>testId(l))&&lines.some(l=>pairs(l).length>=3)&&!lines.some(l=>/\b[A-E]\)\s*\S/.test(l));
}
export function testId(s:string):string|undefined{
 const t=fold(s);const m=t.match(/(?:^|\b)(?:test|deneme|bolum)\s*[-:.]?\s*(\d{1,3}|[a-z])(?=\s|[.:–—-]|$)|(?:^|\b)(\d{1,3})\s*[.)-]?\s*(?:test|deneme|bolum)\b/);
 if(m)return 'test-'+(m[1]||m[2]);
 const subject=t.trim().match(/^(turkce|matematik|geometri|fen bilimleri|sosyal bilgiler|tarih|cografya|fizik|kimya|biyoloji|ingilizce|din kulturu)(?:\s+testi|\s+bolumu)?\s*[:.]?$/);
 return subject?'subject-'+subject[1]:undefined;
}
export function pageTest(s:string){return s.split(/\r?\n/).slice(0,6).map(testId).find(Boolean)}
function pairs(line:string):{number:number;letter:string}[]{
 const clean=line.trim().replace(/^(?:soru(?:lar)?|cevap(?:lar)?|yanıt(?:lar)?)\s*[:|]?\s*/i,'');
 const pattern=/(\d{1,3})\s*[-–—.:)=|/]?\s*([A-E])(?=\s|[,;|/]|$)/gi;
 const matches=[...clean.matchAll(pattern)];
 if(!matches.length)return [];
 // Reject prose, equations and explanatory solutions; only pair separators remain.
 if(clean.replace(pattern,'').replace(/[\s,;|/]+/g,'')!=='')return [];
 return matches.map(m=>({number:+m[1],letter:m[2].toUpperCase()})).filter(x=>x.number>0);
}
export function extractKeys(pages:KeyPage[]):KeyCandidate[]{
 const result:KeyCandidate[]=[];let carried:string|undefined;
 for(let p=0;p<pages.length;p++){
  const page=pages[p];if(!isKeyPage(page.text)){carried=undefined;continue}
  let scope=carried;let numbers:number[]|undefined;
  for(const raw of page.text.split(/\r?\n/)){
   let line=raw.trim();if(!line)continue;
   if(isKeyPage(line)){line=line.replace(/(?:cevap|yanıt)\s*anahtar[ıiİI]?(?:ları)?\s*[:–—-]?\s*/i,'').trim();if(!line)continue}
   const id=testId(line);
   if(id){scope=id;numbers=undefined;const match=line.match(/(?:test|deneme|bölüm)\s*[-:.]?\s*(?:\d{1,3}|[a-z])\s*[:–—-]?\s*(.*)$/i);line=match?.[1]?.trim()||'';if(!line)continue}
   const explicit=pairs(line);if(explicit.length){result.push(...explicit.map(x=>({...x,test:scope,page:p+1})));numbers=undefined;continue}
   const cleaned=line.replace(/^(?:soru(?:lar)?(?:\s*no)?|numara(?:lar)?|cevap(?:lar)?|yanıt(?:lar)?)\s*[:|]?\s*/i,'').trim();
   const interval=cleaned.match(/^(\d{1,3})\s*[-–—]\s*(\d{1,3})\s*:\s*([A-E\s,;|]+)$/i);
   if(interval){const first=+interval[1],last=+interval[2],letters=interval[3].replace(/[\s,;|]/g,'').toUpperCase();if(first>0&&last>=first&&last-first+1===letters.length)result.push(...[...letters].map((letter,i)=>({number:first+i,letter,test:scope,page:p+1})));numbers=undefined;continue}
   const tokens=cleaned.split(/[\s,;|]+/).filter(Boolean);
   if(tokens.length>=2&&tokens.every(t=>/^\d{1,3}$/.test(t))){numbers=tokens.map(Number);continue}
   if(tokens.length&&tokens.every(t=>/^[A-E]$/i.test(t))){
    // A row of letters is safe only when paired with a same-length number row.
    if(numbers&&numbers.length===tokens.length)result.push(...tokens.map((l,i)=>({number:numbers![i],letter:l.toUpperCase(),test:scope,page:p+1})));
    numbers=undefined;continue
   }
   numbers=undefined;
  }
  carried=scope;
 }
 return result;
}
export function matchKeys(questions:{number?:number;test?:string;id:string}[],keys:KeyCandidate[]):Record<string,KeyMatch>{
 const out:Record<string,KeyMatch>={};
 for(const q of questions){
  if(!q.number){out[q.id]={status:'missing'};continue}
  const duplicates=questions.filter(x=>x.number===q.number&&x.test===q.test).length;
  const all=keys.filter(x=>x.number===q.number);
  const scoped=q.test?all.filter(x=>x.test===q.test):[];
  const unscoped=all.filter(x=>!x.test);
  const uniqueAcross=questions.filter(x=>x.number===q.number).length===1;
  const candidates=scoped.length?scoped:uniqueAcross?unscoped:[];
  const unique=[...new Set(candidates.map(c=>c.letter))];
  if(duplicates>1||unique.length>1||(!candidates.length&&all.length)){out[q.id]={status:'ambiguous',choices:[...new Set(all.map(x=>x.letter))]};continue}
  out[q.id]=unique.length===1?{status:'found',letter:unique[0],source:'PDF sayfa '+[...new Set(candidates.map(c=>c.page))].join(', ')}:{status:'missing'};
 }
 return out;
}
export function manualKeys(text:string){return extractKeys([{text:'Cevap anahtarı\n'+text,regions:[]}])}
