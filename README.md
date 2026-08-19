# Ev Gider Takip

Ev veya oda arkadaşlarının ortak ve kişisel giderlerini kaydettiği, ortak giderleri kişi sayısına göre otomatik bölen, kimin kime ne kadar borçlu olduğunu hesaplayan modern bir web uygulaması.

![Lisans](https://img.shields.io/badge/lisans-MIT-blue) ![React](https://img.shields.io/badge/React-19-3468D9) ![Vite](https://img.shields.io/badge/Vite-8-3468D9)

## Özellikler

- 🏠 Ev/oda grubu oluşturma, sınırsız ev arkadaşı ekleme/çıkarma
- 💸 Ortak / kişisel gider ayrımı, özel kategori ekleme
- 🧮 Ortak giderlerin kişi sayısına otomatik ve kuruş hatasız bölüşümü
- 📊 Kişi, kategori ve aylık bazlı grafikler (Recharts)
- 🤝 Minimum sayıda transferle borç/alacak netleştirme algoritması
- ✅ Ödeme geçmişi ve "Ödendi" işaretleme
- 🔍 Arama, filtreleme ve sıralama destekli gider tablosu
- 📱 Uçtan uca responsive, mobil öncelikli tasarım
- 💾 LocalStorage tabanlı veri katmanı — ileride Firebase/Supabase'e taşınmaya hazır servis mimarisi

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| UI | React 19 + Vite |
| Stil | Tailwind CSS |
| Grafikler | Recharts |
| İkonlar | lucide-react |
| Veri | LocalStorage (`services/storageService.js` üzerinden soyutlanmış) |

## Proje Yapısı

```
src/
├── components/
│   ├── Layout/          # Üst bar, gezinme (AppShell)
│   ├── Household/       # Kurulum ekranı, ev/üye yönetimi
│   ├── ExpenseForm/      # Harcama ekle/düzenle modalı
│   ├── ExpenseTable/     # Filtrelenebilir gider tablosu
│   ├── Settlements/      # Borç/alacak netleştirme sayfası
│   ├── Dashboard/        # Özet kartlar, kişi bazlı durum, yan paneller
│   ├── Charts/           # Recharts grafik bileşenleri
│   └── UI/               # Kart, buton, modal gibi ortak parçalar
├── context/
│   └── AppContext.jsx    # Global state + CRUD aksiyonları
├── services/
│   ├── expenseService.js  # Bölüşüm, bakiye, netleştirme mantığı (saf fonksiyonlar)
│   └── storageService.js  # Veri kalıcılığı (bugün localStorage)
├── data/
│   └── defaultCategories.js
└── utils/
    └── formatters.js      # TL/tarih biçimlendirme
```

Hesaplama mantığının tamamı `services/expenseService.js` içinde, UI'dan bağımsız saf fonksiyonlar olarak tutulur. Bu sayede ileride birim testi yazmak veya bir backend'e taşımak kolaydır.

## Veri Modelleri

- **Household**: `{ id, name }`
- **Member**: `{ id, name, active, joinedAt }`
- **Category**: `{ id, label, icon, color }`
- **Expense**: `{ id, memberId, categoryId, amount, date, note, type: 'ortak'|'kisisel', splitMemberIds, status }`
- **Settlement**: `{ id, fromMemberId, toMemberId, amount, date }`

> Bir ortak gider oluşturulduğunda, o anki aktif üyeler `splitMemberIds` içine sabitlenir. Sonradan üye eklenip çıkarılsa bile geçmiş giderlerin bölüşümü bozulmaz.

## Kurulum ve Çalıştırma

```bash
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde açılır.

Production build almak için:

```bash
npm run build
npm run preview
```

## Yol Haritası

- [ ] Kullanıcı kayıt/giriş sistemi
- [ ] Firebase / Supabase entegrasyonu, gerçek zamanlı senkronizasyon
- [ ] Ev davet linki ile katılım
- [ ] Birden fazla ev/oda yönetimi
- [ ] Bildirim ve ödeme hatırlatıcıları
- [ ] PDF / Excel dışa aktarma
- [ ] Karanlık mod

## Lisans

MIT
