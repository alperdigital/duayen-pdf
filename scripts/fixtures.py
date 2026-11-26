from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
p=Path('public/examples');p.mkdir(exist_ok=True,parents=True)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
pdfmetrics.registerFont(TTFont('Turkish',font))
c=canvas.Canvas(str(p/'metin.pdf'));c.setFont('Turkish',12)
for x,y,n,question in [(40,750,1,'Üç sayının toplamı 18 ise ortalama?'),(40,500,2,'Grafikteki sütunların toplamı kaçtır?'),(310,750,3,'Bir karenin dört kenarı vardır.'),(310,500,4,'Ortak köke göre çevre kaçtır?')]:
 c.drawString(x,y,f'{n}. {question}');c.drawString(x,y-30,'A) 4  B) 6  C) 8  D) 12  E) 18')
 if n==2:
  for j,h in enumerate([30,50,70]):c.rect(x+20+j*30,y-130,20,h,fill=1)
c.showPage();c.setFont('Turkish',12);c.drawString(40,750,'Cevap anahtarı: 1-B 2-D');c.save()
im=Image.new('RGB',(1200,1600),'white');d=ImageDraw.Draw(im);f=ImageFont.truetype(font,38)
for y,t in [(90,'1. Öğrenci üçgenin çevresini ölçüyor.'),(180,'A) 4  B) 6  C) 8  D) 12  E) 18'),(800,'2. Türkçe sözcükleri dikkatle okuyunuz.'),(890,'A) ağaç  B) çiçek  C) üzüm  D) göl  E) ışık')]:d.text((50,y),t,font=f,fill='black')
im.save(p/'tarama.pdf','PDF',resolution=144)
