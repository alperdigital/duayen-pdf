import {cp,mkdir,readdir,readFile,writeFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const dest='dist/ocr/v1';await mkdir(dest,{recursive:true});
await cp('node_modules/tesseract.js/dist/worker.min.js',dest+'/worker.min.js');
for(const f of await readdir('node_modules/tesseract.js-core'))if(/\.wasm(\.js)?$/.test(f))await cp('node_modules/tesseract.js-core/'+f,dest+'/'+f);
async function walk(dir){const out=[];for(const f of await readdir(dir)){const p=dir+'/'+f;if((await stat(p)).isDirectory())out.push(...await walk(p));else out.push(p)}return out}
const model=(await walk('node_modules/@tesseract.js-data/tur')).find(f=>f.endsWith('tur.traineddata.gz'));if(!model)throw Error('Türkçe model bulunamadı');
await cp(model,dest+'/tur.traineddata.gz');
const manifest=[];for(const file of await readdir(dest)){const b=await readFile(dest+'/'+file);manifest.push({file,size:b.length,sha256:createHash('sha256').update(b).digest('hex')})}await writeFile(dest+'/manifest.json',JSON.stringify(manifest));
await mkdir('dist/pdf',{recursive:true});await cp('node_modules/pdfjs-dist/cmaps','dist/pdf/cmaps',{recursive:true});await cp('node_modules/pdfjs-dist/standard_fonts','dist/pdf/fonts',{recursive:true});
const files=(await walk('dist')).filter(f=>!f.startsWith('dist/ocr/')||f.endsWith('/manifest.json')).map(f=>f.slice(5));const rev=createHash('sha256').update(await readFile('dist/index.html')).digest('hex').slice(0,12);
await writeFile('dist/sw.js',`const APP='denemeye-app-${rev}', OCR='denemeye-ocr-v1';const paths=${JSON.stringify(files)};self.addEventListener('install',e=>e.waitUntil(caches.open(APP).then(c=>c.addAll(['./',...paths])).then(()=>self.skipWaiting())));self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('denemeye-app-')&&k!==APP).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;e.respondWith((async()=>{const o=await caches.open(OCR);const a=await caches.open(APP);const hit=await o.match(e.request)||await a.match(e.request);if(hit)return hit;try{return await fetch(e.request)}catch(err){if(e.request.mode==='navigate')return await a.match('./');throw err}})())});`);
await cp('dist/index.html','dist/404.html');
