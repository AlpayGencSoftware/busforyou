# 🚌 Bus4You - Modern Otobüs Bilet Rezervasyon Platformu

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple?style=flat-square&logo=redux)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

**Türkiye'nin en modern otobüs bilet rezervasyon platformu**

[Demo](http://localhost:3000) • [Dokümantasyon](#-kullanim-klavuzu) • [Özellikler](#-temel-ozellikler) • [API](#-api-referansi)

</div>

---

## 📖 Proje Hakkında

**Bus4You**, kullanıcıların şehirlerarası otobüs seferlerini kolayca arayıp, koltuk seçimi yapıp, güvenli ödeme ile bilet satın alabileceği modern bir web uygulamasıdır. Next.js 14 App Router, TypeScript ve Redux Toolkit kullanılarak geliştirilmiş, tamamen responsive tasarıma sahip bir platformdur.

### 🎯 Proje Vizyonu
Modern teknolojiler kullanarak, kullanıcı dostu ve güvenli bir otobüs bilet rezervasyon deneyimi sunmak.

---

## ✨ Temel Özellikler

### 🔐 **Kullanıcı Yönetimi**
- **Güvenli Kayıt Sistemi**: Güçlü parola politikası ile
- **Oturum Yönetimi**: Redux tabanlı state management
- **Profil Yönetimi**: Kullanıcı bilgileri güncelleme

### 🔍 **Gelişmiş Sefer Arama**
- **Akıllı Filtreleme**: Şehir, tarih bazlı arama
- **Gerçek Zamanlı Sonuçlar**: Anlık sefer listesi
- **Fiyat Karşılaştırma**: Şeffaf fiyatlandırma

### 🪑 **İnteraktif Koltuk Seçimi**
- **Görsel Otobüs Düzeni**: SVG tabanlı koltuk haritası
- **Cinsiyet Kuralları**: Güvenlik odaklı yerleşim
- **Maksimum 5 Koltuk**: Grup rezervasyonu desteği
- **Gerçek Zamanlı Durum**: Dolu/boş koltuk takibi

### 💳 **Güvenli Ödeme Sistemi**
- **Kart ile Ödeme**: Güvenli ödeme simülasyonu
- **Form Validasyonu**: Comprehensive input kontrolü
- **İşlem Takibi**: Ödeme durumu bildirimleri

### 📱 **Bilet Yönetimi**
- **PDF Bilet Oluşturma**: Profesyonel bilet tasarımı
- **Bilet Geçmişi**: Tüm rezervasyonları görüntüleme
- **Durum Takibi**: Aktif/kullanılmış/iptal edilmiş

### 🎨 **Modern Kullanıcı Arayüzü**
- **Responsive Tasarım**: Mobil-first yaklaşım
- **GSAP Animasyonları**: Akıcı geçişler ve efektler
- **Dark/Light Theme**: Kullanıcı tercihi
- **Accessibility**: WCAG 2.1 uyumlu

---

## 🛠 Teknoloji Stack'i

### **Frontend**
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| **Next.js** | 14.2.5 | React framework (App Router) |
| **TypeScript** | 5.0+ | Type-safe development |
| **React** | 18+ | UI library |
| **Tailwind CSS** | 3.4+ | Utility-first CSS framework |

### **State Management**
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| **Redux Toolkit** | 2.0+ | Modern Redux state management |
| **React-Redux** | 9.0+ | React bindings for Redux |

### **Form & Validation**
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| **Formik** | 2.4+ | Form handling |
| **Yup** | 1.4+ | Schema validation |

### **UI & Animations**
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| **Lucide React** | 0.400+ | Modern icon library |
| **GSAP** | 3.12+ | Professional animations |
| **SweetAlert2** | 11.10+ | Beautiful alerts |

### **PDF & Export**
| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| **jsPDF** | 2.5+ | PDF generation |
| **html2canvas** | 1.4+ | HTML to canvas conversion |

---

## 🚀 Hızlı Başlangıç

### 📋 Gereksinimler

- **Node.js**: 18.0.0 veya üzeri
- **npm**: 9.0.0 veya üzeri / **yarn**: 1.22.0 veya üzeri
- **Git**: Versiyon kontrolü için

### 💻 Kurulum

```bash
# 1. Projeyi klonlayın
git clone https://github.com/your-username/bus4you.git
cd bus4you

# 2. Bağımlılıkları yükleyin
npm install
# veya
yarn install

# 3. Geliştirme sunucusunu başlatın
npm run dev
# veya
yarn dev

# 4. Tarayıcınızda açın
# http://localhost:3000
```

### 🔧 Geliştirme Komutları

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Production sunucu
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

---

## 📱 Kullanım Klavuzu

### 🔑 **Giriş ve Kayıt**

#### Test Kullanıcısı
```
E-posta: demo@bus4you.com
Parola: Demo1!
```

#### Yeni Kayıt
- **Güçlü Parola**: Min. 6 karakter, büyük/küçük harf, rakam, özel karakter
- **E-posta Validasyonu**: Gerçek e-posta formatı gerekli
- **Kişisel Bilgiler**: Ad, soyad, telefon, doğum tarihi

### 🔍 **Sefer Arama**

1. **Ana sayfada** kalkış/varış şehri seçin
2. **Tarih** seçin (bugün ve sonrası)
3. **"Sefer Ara"** butonuna tıklayın
4. **Sonuçları** inceleyin ve sefer seçin

### 🪑 **Koltuk Seçimi**

#### Kurallar
- **Maksimum 5 koltuk** seçilebilir
- **Cinsiyet kuralı**: Çiftli koltuklarda karşı cinsten yanına oturulamaz
- **Görsel gösterim**: Erkek (mavi), Kadın (pembe), Boş (gri)

#### Çiftli Koltuk Listesi
```
2-3, 5-6, 8-9, 11-12, 14-15, 17-18, 
22-23, 25-26, 28-29, 31-32, 34-35, 
38-39, 37-40, 36-41
```

### 💳 **Ödeme Süreci**

1. **Koltuk seçimi** sonrası "Devam Et"
2. **Kart bilgilerini** girin (test kartı kabul edilir)
3. **2 saniye** ödeme simülasyonu
4. **Başarı mesajı** ve bilet oluşturma
5. **PDF indirme** seçeneği

---

## 🗂 Proje Yapısı

```
bus4you/
├── 📁 public/                  # Static assets
│   ├── 🖼 bg.jpg              # Hero background
│   ├── 🖼 bus_PNG101194.png   # Bus illustration
│   └── 🖼 logo.png            # App logo
├── 📁 src/
│   ├── 📁 app/                # Next.js App Router
│   │   ├── 📁 (auth)/         # Authentication pages
│   │   │   ├── 📄 login/      # Login page
│   │   │   └── 📄 register/   # Register page
│   │   ├── 📄 globals.css     # Global styles
│   │   ├── 📄 layout.tsx      # Root layout
│   │   ├── 📄 page.tsx        # Home page
│   │   ├── 📄 inquiry/        # Search results
│   │   ├── 📄 trip/[id]/      # Trip details
│   │   ├── 📄 payment/        # Payment page
│   │   ├── 📄 tickets/        # User tickets
│   │   ├── 📄 sitemap.ts      # SEO sitemap
│   │   └── 📄 robots.ts       # SEO robots
│   ├── 📁 components/         # Reusable components
│   │   ├── 📄 Header.tsx      # Navigation header
│   │   ├── 📄 Footer.tsx      # Site footer
│   │   ├── 📄 Hero.tsx        # Hero section
│   │   ├── 📄 SearchBar.tsx   # Search form
│   │   └── 📁 ui/             # UI components
│   ├── 📁 store/              # Redux store
│   │   ├── 📄 index.ts        # Store configuration
│   │   └── 📁 slices/         # Redux slices
│   ├── 📁 mocks/              # Mock data
│   │   └── 📄 trips.json      # Sample trips
│   └── 📁 types/              # TypeScript definitions
├── 📄 package.json            # Dependencies
├── 📄 tailwind.config.js      # Tailwind configuration
├── 📄 tsconfig.json           # TypeScript configuration
└── 📄 README.md               # This file
```

---

## 🎨 Tasarım Sistemi

### 🎨 **Renk Paleti**
```css
/* Primary Colors */
--blue-primary: #3B82F6;      /* Ana mavi */
--blue-hover: #2563EB;        /* Hover mavi */

/* Status Colors */
--green-success: #10B981;     /* Başarı */
--red-error: #EF4444;         /* Hata */
--yellow-warning: #F59E0B;    /* Uyarı */

/* Gender Colors */
--male-blue: #3B82F6;         /* Erkek */
--female-pink: #EC4899;       /* Kadın */

/* Neutral Colors */
--gray-50: #F9FAFB;           /* Açık gri */
--gray-900: #111827;          /* Koyu gri */
```

### 📐 **Spacing System**
```css
/* Rem-based spacing */
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-4: 1rem;       /* 16px */
--space-8: 2rem;       /* 32px */
```

### 🔤 **Typography**
- **Font Family**: Inter, system fonts
- **Font Sizes**: Clamp-based responsive sizes
- **Font Weights**: 400 (normal), 600 (semibold), 700 (bold)

---

## 🗺 API Referansı

### 🔍 **Sefer Arama**
```typescript
interface SearchCriteria {
  fromCity: string;    // Kalkış şehri
  toCity: string;      // Varış şehri  
  date: string;        // Tarih (YYYY-MM-DD)
}
```

### 🪑 **Koltuk Bilgisi**
```typescript
interface Seat {
  id: number;          // Koltuk numarası
  occupied: boolean;   // Dolu/boş durumu
  gender?: 'male' | 'female'; // Cinsiyet (dolu ise)
}
```

### 🎫 **Bilet Bilgisi**
```typescript
interface Ticket {
  id: string;          // Bilet ID
  userId: string;      // Kullanıcı ID
  tripId: string;      // Sefer ID
  seatNumbers: number[]; // Koltuk numaraları
  totalPrice: number;  // Toplam fiyat
  status: 'active' | 'used' | 'cancelled';
  purchaseDate: string; // Satın alma tarihi
}
```

---

## 🧪 Test Senaryoları

### ✅ **Temel Test Adımları**

1. **Kullanıcı Kaydı**
   - Yeni hesap oluştur
   - Güçlü parola kontrolü
   - E-posta validasyonu

2. **Sefer Arama**
   - İstanbul → Ankara sefer ara
   - Bugünün tarihi seç
   - Sonuçları görüntüle

3. **Koltuk Seçimi**
   - 2-3 numaralı koltukları seç (çiftli)
   - Cinsiyet kuralını test et
   - 5'ten fazla koltuk seçmeye çalış

4. **Ödeme**
   - Test kart bilgileri gir
   - Ödeme simülasyonunu bekle
   - PDF bilet indir

---

## 🔧 Geliştirme Notları

### 🏗 **Mimari Kararlar**

- **App Router**: Next.js 13+ routing sistemi
- **Redux Toolkit**: Modern state management
- **TypeScript**: Type safety için
- **Tailwind CSS**: Utility-first styling
- **Rem Units**: Accessibility için

### 🎯 **Performans Optimizasyonları**

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Route-based splitting
- **Lazy Loading**: Component-based loading
- **Memoization**: React.memo kullanımı

### 🔐 **Güvenlik Önlemleri**

- **Input Validation**: Formik + Yup
- **XSS Protection**: Next.js built-in
- **CSRF Protection**: SameSite cookies
- **Type Safety**: TypeScript strict mode

---

## 🚀 Deployment

### 🌐 **Vercel Deployment**
```bash
# Vercel CLI ile deploy
npm i -g vercel
vercel --prod
```

### 🐳 **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🤝 Katkıda Bulunma

### 📝 **Geliştirme Süreci**

1. **Fork** edin
2. **Feature branch** oluşturun (`git checkout -b feature/amazing-feature`)
3. **Commit** edin (`git commit -m 'Add amazing feature'`)
4. **Push** edin (`git push origin feature/amazing-feature`)
5. **Pull Request** açın

### 🎨 **Kod Standartları**

- **ESLint**: Kod kalitesi kontrolü
- **Prettier**: Kod formatı
- **TypeScript**: Strict mode
- **Conventional Commits**: Commit message formatı

---

## 📄 Lisans

Bu proje **MIT License** altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

---

## 📞 İletişim & Destek

<div align="center">

**Bus4You Development Team**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-username)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-profile)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:contact@bus4you.com)

**Proje hakkında sorularınız için iletişime geçebilirsiniz.**

</div>

---

<div align="center">

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın! ⭐**

Made with ❤️ in Turkey 🇹🇷

</div>