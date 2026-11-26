import type {Attempt,Question} from './storage';
export const codes=[
 {id:'sure',emoji:'✅',label:'Eminim',answered:true},
 {id:'unsure',emoji:'🤔',label:'Kararsızım',answered:true},
 {id:'guess',emoji:'🎲',label:'Tahmin ettim',answered:true},
 {id:'time',emoji:'⏳',label:'Zaman lazım',answered:false},
 {id:'unknown',emoji:'❓',label:'Bilmiyorum',answered:false},
 {id:'skip',emoji:'⏭️',label:'Atladım',answered:false}
] as const;
export type Code=typeof codes[number]['id'];
export const legacy:Record<string,Code>={'Hallettim':'sure','Favori':'unsure','Direkt geç':'skip','Fikrim yok':'unknown','Zaman alır':'time'};
export const codeOf=(a:Attempt,q:Question)=>codes.find(c=>c.id===(legacy[a.flags[q.id]?.[0]]||a.flags[q.id]?.[0]));
export function outcome(a:Attempt,q:Question){const answer=a.answers[q.id];return !answer?'Boş':!q.answer?'Anahtar yok':answer===q.answer?'Doğru':'Yanlış'}
export function priority(a:Attempt,q:Question){const c=codeOf(a,q)?.id;return c==='skip'?0:c==='time'?1:c==='unsure'?2:c==='guess'?3:c==='unknown'?4:c==='sure'?6:!a.answers[q.id]?0:5}
export type Entry={a:Attempt,q:Question};
export function latestQuestions(attempts:Attempt[]):Entry[]{const seen=new Set<string>();return attempts.filter(a=>a.finished).sort((a,b)=>b.finished!-a.finished!).flatMap(a=>a.bank.questions.flatMap(q=>{if(seen.has(q.id))return [];seen.add(q.id);return [{a,q}]}))}
