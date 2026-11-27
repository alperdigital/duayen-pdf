import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
try{
for(const [file,range,expected] of [['gorselli-iki-test.pdf','1-4',['C','D','D','B','C','B','E','B']],['gorselli-iki-test.pdf','3-4',['C','B','E','B']],['gorselli-tablo-anahtar.pdf','1-4',['C','D','D','B','C','B','E','B']]]){
 const p=await b.newPage({viewport:{width:390,height:844}});
 await p.goto('http://127.0.0.1:3000/peru/');
 await p.locator('input[type=file]').first().setInputFiles('public/examples/'+file);
 await p.getByRole('heading',{name:'8 soru bulundu'}).waitFor();
 await p.getByLabel('Sayfa aralığı').fill(range);
 await p.getByRole('button',{name:'Soruları hazırla'}).click();
 await p.getByRole('heading',{name:'Cevap anahtarı eşleştirmesi'}).waitFor();
 const rows=p.locator('.key-row');
 assert.deepEqual(await rows.locator('.key-suggestion').allTextContents(),expected.map(x=>'Öneri: '+x));
 assert.deepEqual(await rows.locator('select').evaluateAll(ns=>ns.map(n=>n.value)),expected.map(()=>''));
 await p.getByRole('button',{name:'Önerilen cevapları doğrula'}).click();
 assert.deepEqual(await rows.locator('select').evaluateAll(ns=>ns.map(n=>n.value)),expected);
 if(range!=='3-4')await p.getByLabel('Her soru tamamlanınca').check();
 await p.getByRole('button',{name:'Deneme başlat'}).click();
 await p.getByRole('radio',{name:'C',exact:true}).click();
 await p.getByRole('button',{name:'Sonraki →'}).click();
 await p.getByRole('dialog').getByRole('button',{name:/Eminim/}).click();
 if(range==='3-4'){
  assert.equal(await p.getByText('Doğru cevap: C',{exact:true}).count(),0);
  for(let i=0;i<2;i++){await p.getByRole('button',{name:'Sonraki →'}).click();await p.getByRole('dialog').getByRole('button',{name:/Atladım/}).click()}
  await p.getByRole('button',{name:'Denemeyi bitir'}).click();await p.getByRole('dialog').getByRole('button',{name:/Atladım/}).click();await p.getByRole('dialog').getByRole('button',{name:'Sonuçları gör'}).click();
  await p.getByRole('heading',{name:'Deneme özeti'}).waitFor();await p.getByText(/4 puanlanan soru · 1 doğru/).waitFor();
 }else await p.getByRole('dialog').getByText('Doğru cevap: C').waitFor();
 console.log('PASS scoped key and instant feedback',range,expected);
 await p.close();
}
}finally{await b.close()}
