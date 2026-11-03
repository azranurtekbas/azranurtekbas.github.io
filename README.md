# Azra Nur Tekbaş — Portfolio

Statik, iki dilli (TR/EN) kişisel portfolyo. Build adımı yok: dosyaları olduğu gibi yayınlayabilirsin.

## Klasör yapısı

```
index.html          Ana sayfa (Home, Works, Projects, About, Skills, Contact)
project.html        Proje detay / vaka çalışması sayfası  → project.html?p=brandifier
css/style.css       Tüm tasarım
js/content.js       ★ TÜM METİNLER VE VERİLER (TR + EN) — düzenleyeceğin dosya bu
js/common.js        Dil geçişi, menü, lightbox, animasyonlar
js/home.js          Ana sayfa render
js/project.js       Detay sayfası render
assets/
  Azra_Nur_Tekbas_CV.pdf   ← CV'ni bu adla buraya koy (CV İndir butonu)
  img/profile.jpg          ← Profil fotoğrafın (kare önerilir, yoksa "AT" baş harfleri görünür)
  works/                   ← Brandifier görsel ve videoların
  audio/                   ← (isteğe bağlı) Emilia / TTS ses örnekleri
```

## Brandifier çalışmalarını ekleme

1. Görsel/videoları `assets/works/` içine koy (jpg, png, webp, mp4, webm).
2. `js/content.js` içindeki `works` listesinde her çalışma için:
   - `src`: dosya yolu, ör. `"assets/works/parfum-kampanya.jpg"`
   - `type`: `"image"` veya `"video"`
   - `poster`: (video için isteğe bağlı) kapak görseli
   - `title`, `desc`: TR + EN başlık ve açıklama
   - `workflow`: ör. `"Image-to-Image"`, `"Image-to-Video"`
   - `models`: **o çalışmada gerçekten kullandığın** modeller, ör. `["Nano Banana", "Kling"]`
   - `size`: `"big"` (2×2), `"wide"` (yatay), `"tall"` (dikey), `""` (normal)
3. `models: []` olan çalışmalarda model etiketi gösterilmez — kullandığın modeli biliyorsan ekle.
4. `img/` klasörü orijinal dosyalarındır; site onları kullanmaz (web için optimize edilmiş kopyalar `assets/works/` içinde). Yayınlarken `img/` klasörünü yüklemene gerek yok.

İpucu: Videoları web için sıkıştır (H.264 MP4, 1080p, birkaç MB). İlk 3 çalışma ana sayfadaki hero kolajında da görünür.

## Ses örnekleri (TTS / Voice Cloning)

`content.js` → `emilia` projesindeki `audio: []` dizisine ekle:
```js
audio: [{ src: "assets/audio/emilia-01.mp3", label: { en: "Turkish TTS sample", tr: "Türkçe TTS örneği" } }]
```
Aynı alanı diğer projelere de ekleyebilirsin. Projelere `github: "https://..."` veya `demo: "https://..."` eklersen detay sayfasında buton çıkar; `gallery: [...]` ile proje görselleri eklenebilir.

## Dil

- Sağ üstteki TR / EN düğmesi; seçim tarayıcıda hatırlanır.
- Yurt dışına link gönderirken: `https://<site-adresin>/?lang=en` — sayfa her zaman İngilizce açılır.

## Yerelde açma

`index.html`'e çift tıklaman yeterli. Videoların sorunsuz oynaması için yerel sunucu önerilir:
```
python -m http.server 8000
```
→ http://localhost:8000

## Yayınlama (ücretsiz)

**GitHub Pages:** Yeni bir repo oluştur (ör. `azranurtekbas.github.io`), tüm dosyaları yükle → Settings → Pages → Branch: `main` / root. Site `https://azranurtekbas.github.io` adresinde yayınlanır.

**Netlify / Vercel:** Klasörü sürükle-bırak ile yükle.
