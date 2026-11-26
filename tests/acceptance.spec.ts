import {test,expect} from '@playwright/test';
test('manuel ve çevrimdışı OCR, kalem, optik, devam',async({page,context})=>{
 const requests:string[]=[];page.on('request',r=>requests.push(r.url()));
 await page.goto('./');await page.evaluate(()=>navigator.serviceWorker.ready.then(()=>true));
 expect(requests.some(x=>x.includes('traineddata'))).toBeFalsy();
 await page.getByRole('button',{name:'Ayarlar'}).click();
 await page.getByRole('button',{name:'Türkçe OCR paketini indir'}).click();
 await expect(page.getByText('● Türkçe OCR hazır')).toBeVisible({timeout:150000});
 await page.close();await context.setOffline(true);
 const p=await context.newPage();await p.goto('http://127.0.0.1:3000/peru/');
 await p.locator('input[type=file]').first().setInputFiles('public/examples/tarama.pdf');
 await p.getByRole('button',{name:'Taranmış sayfaları OCR ile oku'}).click();
 await p.getByText('Metin / OCR çıktısı').click();
 await expect(p.locator('pre')).toContainText(/Öğrenci/i,{timeout:120000});
 await expect(p.locator('pre')).toContainText(/1\./);
 const box=await p.locator('.paper svg').boundingBox();if(!box)throw Error('pdf');
 for(const [a,b] of [[.02,.4],[.45,.85]]){await p.locator('.paper svg').scrollIntoViewIfNeeded();const r=await p.locator('.paper svg').boundingBox();await p.mouse.move(r!.x+r!.width*.02,r!.y+r!.height*a);await p.mouse.down();await p.mouse.move(r!.x+r!.width*.96,r!.y+r!.height*b,{steps:8});await p.mouse.up()}
 await p.getByRole('button',{name:'Soruları hazırla'}).click();await p.getByRole('button',{name:'Deneme başlat'}).click();
 const svg=p.locator('.paper svg').first();await svg.scrollIntoViewIfNeeded();const r=await svg.boundingBox();await p.mouse.move(r!.x+20,r!.y+20);await p.mouse.down();await p.mouse.move(r!.x+80,r!.y+50,{steps:5});await p.mouse.up();
 await p.getByRole('radio',{name:'C',exact:true}).click();await p.getByRole('radio',{name:'B',exact:true}).click();await p.getByRole('button',{name:'Sonraki →'}).click();await p.reload();await p.getByRole('button',{name:/Devam et/}).click();await expect(p.getByRole('radio',{checked:true})).toHaveCount(0);await p.getByRole('button',{name:'← Önceki'}).click();await expect(p.getByRole('radio',{name:'B',exact:true})).toHaveAttribute('aria-checked','true');await expect(p.locator('polyline')).toHaveCount(1);
});
