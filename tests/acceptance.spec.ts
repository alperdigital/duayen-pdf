import {test,expect} from '@playwright/test';
test('otomatik çevrimdışı OCR, kalem, optik, devam',async({page,context})=>{
 const requests:string[]=[];page.on('request',r=>requests.push(r.url()));
 await page.goto('./');await page.evaluate(()=>navigator.serviceWorker.ready.then(()=>true));
 expect(requests.some(x=>x.includes('traineddata'))).toBeFalsy();
 await page.getByRole('button',{name:'Ayarlar'}).click();
 await page.getByRole('button',{name:'Türkçe OCR paketini indir'}).click();
 await expect(page.getByText('● Türkçe OCR hazır',{exact:false})).toBeVisible({timeout:150000});
 await page.close();await context.setOffline(true);
 const p=await context.newPage();await p.goto('http://127.0.0.1:3000/duayen-pdf/');
 await p.locator('input[type=file]').first().setInputFiles('public/examples/tarama.pdf');

 await p.getByText('Metin / OCR çıktısı').click();
 await expect(p.locator('pre')).toContainText(/Öğrenci/i,{timeout:120000});
 await expect(p.locator('pre')).toContainText(/1\./);
 await expect(p.getByRole('heading',{name:'2 soru bulundu'})).toBeVisible();
 await expect(p.locator('.editor')).toHaveCount(0);
 await p.getByRole('button',{name:'Soruları hazırla'}).click();await p.getByRole('button',{name:'Deneme başlat'}).click();
 const svg=p.locator('.paper svg').first();await svg.scrollIntoViewIfNeeded();const r=await svg.boundingBox();await p.mouse.move(r!.x+20,r!.y+20);await p.mouse.down();await p.mouse.move(r!.x+80,r!.y+Math.min(30,r!.height/2),{steps:5});await p.mouse.up();
 await p.getByRole('radio',{name:'C',exact:true}).click();await p.getByRole('radio',{name:'B',exact:true}).click();await p.getByRole('button',{name:'Sonraki →'}).click();await p.getByRole('button',{name:/Eminim/}).click();await p.reload();await p.getByRole('button',{name:/Devam et/}).click();await expect(p.getByRole('radio',{checked:true})).toHaveCount(0);await p.getByRole('button',{name:'← Önceki'}).click();await p.getByRole('button',{name:/Zaman lazım/}).click();await expect(p.getByRole('radio',{name:'B',exact:true})).toHaveAttribute('aria-checked','true');await expect(p.locator('polyline')).toHaveCount(1);
});
