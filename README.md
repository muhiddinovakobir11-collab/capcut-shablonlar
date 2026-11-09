# 🎬 CapCut Shablonlari Veb-Sayti

Akobir uchun maxsus yaratilgan zamonaviy, tezkor va to'liq o'zbek tilidagi CapCut video shablonlari platformasi.

---

## 🌟 Imkoniyatlar va Sahifalar

1. **Hero (Bosh sahifa):**
   - Chiroyli sarlavha, fon nurlari effekti va statistika.
   - "Shablonlarni ko'rish" tezkor tugmasi.

2. **Shablonlar Galereyasi:**
   - 9:16 (TikTok/Reels formati) vertikal video kartochkalari.
   - **Kursor borganda avtomatik video ijrosi (Hover autoplay)** va mobil telefonda ekranga kelganda avtomatik ijro (IntersectionObserver).
   - Kategoriyalar bo'yicha filtrlash (*Reels/TikTok, Reklama, To'y, Tug'ilgan kun, Vlog*).
   - Jonli qidiruv maydoni.
   - Tezkor "Ko'rish" va to'g'ridan-to'g'ri "CapCut'da ochish" tugmalari.

3. **Shablon Tafsilot Modali:**
   - Katta video pleer (ovoz va to'liq boshqaruv bilan).
   - Davomiyligi, kerak bo'ladigan rasm/video soni va ko'rishlar statistikasi.
   - "CapCut'da ochish" va "Havolani nusxalash" tugmalari.
   - 4 qadamli oson qo'llanma.

4. **"Qanday ishlaydi?" bo'limi:**
   - Foydalanuvchi uchun 1-2-3-4 bosqichli oddiy qo'llanma.

5. **Muallif (Men haqimda) va Aloqa:**
   - Akobir haqida ma'lumot va Telegram, Instagram, YouTube tarmoqlariga havolalar.

6. **Admin Panel (`admin.html`):**
   - Parol bilan himoyalangan (`akobircapcut`).
   - Yangi shablon qo'shish, mavjudlarini tahrirlash yoki o'chirish.
   - Yangilangan `templates.json` faylini 1 klikda yuklab olish.

---

## 🛠️ Yangi shablon qo'shish va havolani almashtirish

Shablonlarni boshqarishning **2 xil oson yo'li** bor:

### 1-usul: Admin panel orqali (Eng osoni)
1. Brauzerda `admin.html` sahifasini oching.
2. Parolga: `akobircapcut` deb yozing.
3. Chap tarafdagi formaga:
   - Shablon nomi
   - Kategoriya
   - **CapCut havolasi** (CapCut ilovangizdagi "Shablon havolasini ulashish"dan olingan link)
   - Video manzili (MP4 fayl) va muqova rasm
   - Davomiyligi va kerakli rasmlar sonini kiriting.
4. **"Saqlash"** tugmasini bosing — saytda darhol yangilanadi!
5. Agar saytni Vercel/Netlify'ga qo'ymoqchi bo'lsangiz, **"templates.json ni yuklab olish"** tugmasini bosib, faylni `data/` papkasiga qo'yib qo'yasiz.

### 2-usul: `data/templates.json` fayli orqali
`data/templates.json` faylini oching va xohlagan shabloningizdagi `capcutUrl`, `title` yoki boshqa maydonlarni o'zgartiring:

```json
{
  "id": "template-1",
  "title": "Neon Beat Sync Reels",
  "description": "Musiqa zarbasiga mos dinamik o'tishlar va neon effektlar.",
  "category": "Reels/TikTok",
  "duration": "0:15",
  "mediaCount": "7 ta rasm / video",
  "views": "24.5K",
  "tag": "Trend",
  "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-dj-mixing-music-in-a-nightclub-43398-large.mp4",
  "posterUrl": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600",
  "capcutUrl": "https://www.capcut.com/template-detail/SIZNING_SHABLON_ID"
}
```

---

## 🚀 Saytni Internetga Bepul Joylashtirish (Hosting)

Ushbu loyiha Node.js yoki murakkab server talab qilmaydi (Static Web). Uni bepul platformalarga 1 daqiqada joylashtirish mumkin:

### A variant: Netlify (Eng oson va tezkor)
1. [Netlify.com](https://www.netlify.com/) saytiga kiring va ro'yxatdan o'ting.
2. Bosh sahifada **"Add new site" -> "Deploy manually"** tugmasini bosing.
3. Kompyuteringizdagi `capcut-shablonlar` papkasini sichqoncha bilan brauzer oynasiga sudrab tashlang (Drag & Drop).
4. Bir necha soniyada sizga `https://sizning-sayt.netlify.app` ko'rinishidagi bepul domen beriladi!

### B variant: Vercel
1. [Vercel.com](https://vercel.com/) saytiga kiring.
2. Yangi loyiha oching va GitHub reposini ulang yoki Vercel CLI orqali papka ichida `vercel` buyrug'ini tering.

### C variant: GitHub Pages
1. GitHub'da yangi ombor (repository) oching.
2. Loyiha fayllarini yuklang.
3. **Settings -> Pages** bo'limiga o'ting va `main` tarmoqni (branch) tanlab, "Save" tugmasini bosing.

---

## 📱 Moslashuvchanlik (Responsiveness)
Sayt to'liq mobil telefonlar (iPhone, Android), planshet va kompyuterlar ekranlariga moslashtirilgan.
Trafikni tejash maqsadida videolar faqat kursor borganda yoki ekranda ko'ringanda o'ynaydi.
