import {chromium} from 'playwright';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
try{
for(const width of [320,390,1280]){
 const p=await browser.newPage({viewport:{width,height:844}});
 await p.goto('http://127.0.0.1:3000/peru/');
 await p.locator('input[type=file]').first().setInputFiles('public/examples/metin.pdf');
 await p.getByRole('heading',{name:'4 soru bulundu'}).waitFor();
 if(await p.locator('.editor').count())throw Error('manual editor visible');
 await p.getByRole('button',{name:'Soruları hazırla'}).click();
 await p.getByRole('button',{name:'Deneme başlat'}).click();
 const radios=p.getByRole('radio');if(await radios.count()!==5)throw Error('wrong bubble count');
 await p.getByRole('radio',{name:'C',exact:true}).click();
 await p.getByRole('radio',{name:'B',exact:true}).click();
 const layout=await radios.evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {width:r.width,height:r.height,left:r.left,right:r.right,checked:n.getAttribute('aria-checked'),bg:getComputedStyle(n).backgroundColor}}));
 if(layout.some(r=>r.width<44||r.height<44||r.left<0||r.right>width)||layout.filter(r=>r.checked==='true').length!==1||layout[1].bg===layout[2].bg)throw Error(JSON.stringify(layout));
 await p.getByRole('button',{name:'Cevabı temizle'}).click();
 if(await p.getByRole('radio',{checked:true}).count())throw Error('clear failed');
 await p.getByRole('radio',{name:'B',exact:true}).click();
 await p.screenshot({path:'/tmp/denemeye-'+width+'.png'});
 console.log('PASS automatic four questions and optical',width);
 await p.close();
}
}finally{await browser.close()}
