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

## Öğrenci akışı
PDF yüklenince numaralı sorular otomatik ayrılır; taranmış sayfalar için OCR paketi hazırsa işlem kendiliğinden başlar. Öğrenci bölge çizmez. Yalnız gerektiğinde öğretmen modu ile düzeltilebilir. Yeni optik satırı 320, 390 ve 1280 CSS piksel genişliklerde sınamak için önizleme açıkken `node scripts/student-smoke.mjs` çalıştırın.

## Öğrenme geçmişi
Soru geçişinde cevaplı sorular için Eminim / Kararsızım / Tahmin ettim, boş sorular için Zaman lazım / Bilmiyorum / Atladım seçilir; isteğe bağlıdır ve deneme ayarlarında kapatılabilir. Başlangıçta geri bildirim zamanı seçilir. Anlık geri bildirimde soru tamamlanınca doğrulanmış anahtar gösterilir ve cevap kilitlenir. Öğrenme listesi son tamamlanmış girişime göre kalıcı soru kimlikleriyle sınıflandırılır. Anladım ile arşive taşınır; arşivi temizlemek deneme geçmişini silmez.

## Otomatik cevap anahtarı
PDF metni konuma göre satırlara ayrılır. OCR tarama sayfalarını okur. Test/bölüm kimliği ve basılı soru numarasına göre anahtar önerilir. Desteklenen biçimler: numara-şık dizileri (1-A, 2:B, 3) C), dikey numara/şık çiftleri, yatay numara ve şık satırları, açık numara aralığı (1-4: A B C D). Çelişkili ve eksik eşleşmeler puanlanmaz; otomatik öneriler kullanıcı doğrulaması gerektirir. Sadece harf dizileri gibi numarası belirsiz anahtarlar otomatik dağıtılmaz. Üç özgün örnek PDF public/examples altında bulunur.
