import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
try{
for(const width of [320,390,1280]){
 const p=await b.newPage({viewport:{width,height:844}});
 await p.goto('http://127.0.0.1:3000/peru/');
 await p.getByRole('heading',{name:/Her soru/}).waitFor();
 assert.equal(await p.title(),'Duayenpdf — Her soru, bir adım ileri');
 const fits=()=>p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
 assert(await fits());await p.screenshot({path:'/tmp/duayen-home-'+width+'.png',fullPage:true});
 await p.locator('input[type=file]').first().setInputFiles('public/examples/gorselli-iki-test.pdf');
 await p.getByRole('heading',{name:'8 soru bulundu'}).waitFor();assert(await fits());
 await p.getByRole('button',{name:'Soruları hazırla'}).click();
 await p.getByRole('button',{name:'Önerilen cevapları doğrula'}).click();assert(await fits());
 await p.screenshot({path:'/tmp/duayen-setup-'+width+'.png',fullPage:true});
 await p.getByRole('button',{name:'Deneme başlat'}).click();
 await p.getByRole('radio',{name:'C',exact:true}).click();
 assert(await fits());await p.screenshot({path:'/tmp/duayen-exam-'+width+'.png'});
 await p.getByRole('button',{name:'Sonraki →'}).click();await p.getByRole('dialog').waitFor();await p.screenshot({path:'/tmp/duayen-emoji-'+width+'.png'});
 await p.getByRole('dialog').getByRole('button',{name:/Eminim/}).click();
 console.log('PASS responsive branded views',width);
 await p.close();
}
}finally{await b.close()}
