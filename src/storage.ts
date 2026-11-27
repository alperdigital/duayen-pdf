export type Region={page:number,x:number,y:number,w:number,h:number,number?:number,test?:string};
export type Question={id:string,section:string,number:number,sourceNumber?:number,sourceTest?:string,labels:string[],images:string[],regions?:Region[],answer?:string,objective?:string,solution?:string};
export type Bank={id:string,title:string,questions:Question[]};
export type Point=[number,number];
export type Stroke={part:number,points:Point[]};
export type Attempt={id:string,bank:Bank,index:number,answers:Record<string,string>,ink:Record<string,Stroke[]>,flags:Record<string,string[]>,times:Record<string,number>,start:number,end:number|null,finished?:number,feedback?:'instant'|'end',prompt?:boolean,checked?:Record<string,boolean>};
export const uid=()=>crypto.randomUUID();
const db=new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open('denemeye',1);r.onupgradeneeded=()=>r.result.createObjectStore('data');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
export async function read<T>(key:string):Promise<T|undefined>{const d=await db;return new Promise((resolve,reject)=>{const r=d.transaction('data').objectStore('data').get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
export async function save(key:string,value:unknown){const d=await db;return new Promise<void>((resolve,reject)=>{const tx=d.transaction('data','readwrite');tx.objectStore('data').put(value,key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}
export function download(data:Blob,name:string){const a=document.createElement('a');a.href=URL.createObjectURL(data);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
