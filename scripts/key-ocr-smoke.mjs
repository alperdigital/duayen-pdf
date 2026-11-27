import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
try{
const ctx=await b.newContext({viewport:{width:390,height:844}});let p=await ctx.newPage();
await p.goto('http://127.0.0.1:3000/peru/');await p.evaluate(()=>navigator.serviceWorker.ready.then(()=>true));
await p.getByRole('button',{name:'Ayarlar'}).click();await p.getByRole('button',{name:'Türkçe OCR paketini indir'}).click();
await p.getByText('● Türkçe OCR hazır',{exact:false}).waitFor({timeout:120000});
await p.close();await ctx.setOffline(true);p=await ctx.newPage();await p.goto('http://127.0.0.1:3000/peru/');
await p.locator('input[type=file]').first().setInputFiles('public/examples/gorselli-tarama-anahtar.pdf');
await p.getByRole('button',{name:'Soruları hazırla'}).waitFor();await p.waitForFunction(()=>!document.querySelector('button.primary[disabled]'),{},{timeout:120000});
await p.getByText('Metin / OCR çıktısı').click();console.log((await p.locator('pre').textContent()).slice(-800));
await p.getByRole('button',{name:'Soruları hazırla'}).click();
await p.getByRole('heading',{name:'Cevap anahtarı eşleştirmesi'}).waitFor();
assert.deepEqual(await p.locator('.key-suggestion').allTextContents(),['C','D','D','B','C','B','E','B'].map(x=>'Öneri: '+x));
console.log('PASS real offline OCR key on mixed PDF');
}finally{await b.close()}
