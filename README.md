# PDF’den Denemeye
Türkçe, yerel verili, statik soru çözme uygulaması.

## Kurulum
Node 22+ ile `npm install`, `npm run build`, `npm run preview`.
Üretim adresi yerelde /peru/ altındadır. GitHub Pages kaynağı GitHub Actions
olmalıdır. Ana dalın workflow’u test ve dağıtımı yürütür.

## Uçak modu
İlk açılışta Ayarlar üzerinden uygulamanın çevrimdışı hazır olmasını bekleyin.
Türkçe OCR paketini isteğe bağlı indirin. Sekmeyi kapatın, ağı kesin,
aynı tarayıcı profilinde yeniden açın ve yeni tarama PDF'sini seçin.
Manuel seçim için sayfa üzerinde iki dikdörtgen çizip soruları hazırlayın.
Şık seçin, kalemle işaretleyin, sonraki soruya geçin; yeniden açıp devam edin.

## ZIP şeması (v1)
manifest.json: version (1), id, title, questions dizisi. Her soru id, section,
number, labels, images (ZIP içi PNG yolları), isteğe bağlı answer (doğrulanmış
şık), objective ve solution alanları taşır. Çok bölgeli sorular ve ortak
kökler sıralı PNG listesinde tutulur. Girişimler ayrı IndexedDB kaydındadır;
kişisel yedek JSON olarak indirilir. Paket öğrenci verisi içermez.

## Örnekler
public/examples altında özgün metin ve tarama PDF'leri bulunur.
`python scripts/fixtures.py` ile tekrar üretilebilir.
`npm test` üretim önizlemesini gerçek Chromium ile test eder.

Doğrudan Chromium kabul akışı: önizleme sunucusu açıkken
`CHROMIUM_PATH=/usr/bin/chromium npm run test:smoke`.
Bu akış masaüstü ve 390px mobil boyutunda gerçek çevrimdışı OCR,
optik değişikliği, kalem ve yeniden açma senaryosunu sınar.
