# Patika 🐾 — Agent Team Kılavuzu

## Proje Özeti
Türkçe evcil hayvan sağlık takip uygulaması. React Native (Expo) + Supabase + Claude API.
Platform: Android önce, sonra iOS. Dil: Türkçe.

## Tech Stack
- **Frontend:** React Native (Expo SDK), TypeScript
- **State:** Zustand (global), React Query (sunucu verisi)
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **AI:** Anthropic Claude API (semptom asistanı)
- **Navigasyon:** React Navigation (Bottom Tabs + Native Stack)
- **Grafikler:** react-native-chart-kit + react-native-svg
- **Bildirimler:** expo-notifications
- **Storage:** expo-secure-store (hassas), react-native-mmkv (local cache)

## Agent Team Yapısı

Bu projeyi 5 özel agent birlikte inşa eder. Her agent kendi alanına odaklanır.

---

### 🎯 Orchestrator Agent (Ana Koordinatör)
**Rol:** Tüm ajanları yönetir, çakışmaları önler, kod review yapar.
**Sorumluluklar:**
- Görev dağılımı ve önceliklendirme
- Arası geçiş noktalarını (interfaces) tanımlama
- Diğer agentların ürettiği kodu entegre etme
- PR review ve kod kalitesi

**Kurallar:**
- Bir feature başlatmadan önce ilgili agentin sözleşmesini (types, API shape) yaz
- Aynı anda sadece bir agent "in_progress" olsun
- Her tamamlanan feature için `CHANGELOG.md` güncelle

---

### 🎨 UI Agent (Arayüz Uzmanı)
**Rol:** Tüm ekranlar, bileşenler, tema, animasyonlar.
**Klasör:** `src/presentation/`
**Sorumluluklar:**
- Ekran geliştirme (`screens/`)
- Yeniden kullanılabilir bileşenler (`components/`)
- Tema sistemi (`core/theme/`)
- Navigasyon yapısı

**Tasarım Kuralları:**
- Renk paleti: `theme.ts` dosyasından çekilmeli, hardcode renk yok
- Türkçe label ve placeholder kullan
- Tüm touchable elementlerde `activeOpacity={0.8}`
- Loading state her async işlemde gösterilmeli
- Boş state (empty state) her liste ekranında olmalı

**Bileşen Standartları:**
```tsx
// Her bileşen bu yapıda olmalı
interface Props {
  // kesinlikle typed
}
export const ComponentName: React.FC<Props> = ({ ... }) => {
  // implementation
};
```

---

### 🗄️ Backend Agent (Supabase Uzmanı)
**Rol:** Veritabanı, auth, storage, RLS politikaları.
**Klasör:** `src/data/`
**Sorumluluklar:**
- Supabase tablo şeması ve migration'lar
- Row Level Security (RLS) politikaları
- Repository pattern implementasyonu
- Storage bucket yönetimi

**Veritabanı Tabloları:**
```sql
users, pets, vaccinations, medications,
health_logs, feeding_schedules, appointments,
documents, ai_consultations
```

**Kurallar:**
- Her tablo için RLS aktif olmalı
- `user_id` foreign key kontrolü zorunlu
- Tüm tarih alanları ISO 8601 formatında
- Soft delete: `deleted_at timestamp` kullan, gerçek silme yok
- Her repository fonksiyonu try/catch ile error handling yapmalı

**Repository Pattern:**
```typescript
// src/data/repositories/petRepository.ts
export const petRepository = {
  getAll: async (userId: string): Promise<Pet[]> => {...},
  getById: async (id: string): Promise<Pet> => {...},
  create: async (data: CreatePetDto): Promise<Pet> => {...},
  update: async (id: string, data: UpdatePetDto): Promise<Pet> => {...},
  softDelete: async (id: string): Promise<void> => {...},
};
```

---

### 🤖 AI Agent (Claude API Uzmanı)
**Rol:** Semptom analizi, Claude API entegrasyonu, prompt mühendisliği.
**Klasör:** `src/data/services/claudeService.ts`
**Sorumluluklar:**
- Sistem promptu tasarımı ve iyileştirme
- Aciliyet seviyesi belirleme (NORMAL/DİKKAT/ACİL)
- API rate limiting ve kullanım takibi
- Hata senaryolarını yönetme

**Sistem Promptu:**
```
Sen bir evcil hayvan sağlığı asistanısın. Türkçe yanıt ver.
Kesinlikle teşhis koyma. Aciliyet: NORMAL/DİKKAT/ACİL.
Maks 150 kelime. Her zaman veterinere yönlendir.
```

**Kurallar:**
- Ücretsiz kullanıcı: ayda 5 sorgu limiti (Supabase'de say)
- Her AI yanıtı `ai_consultations` tablosuna kaydet
- Sorumluluk reddi beyanı UI'da her zaman göster
- Model: `claude-haiku-4-5-20251001` (maliyet optimizasyonu)
- Prompt caching kullan (system prompt için)

---

### ⚙️ DevOps Agent (Yapılandırma Uzmanı)
**Rol:** Env yönetimi, build config, bildirimler, CI/CD.
**Sorumluluklar:**
- `app.config.ts` ve `eas.json` yapılandırması
- Expo push notification kurulumu
- Environment değişken yönetimi
- `expo-updates` OTA güncelleme

**Env Yönetimi:**
- `.env.local` — geliştirme (git'e commit edilmez)
- `.env.production` — production (git'e commit edilmez)
- `src/core/config.ts` — env değişkenlerini tip-güvenli export eder

---

## Genel Kurallar (Tüm Agentlar)

### Kod Standartları
- TypeScript strict mode açık, `any` tipi yasak
- Fonksiyon adları Türkçe iş mantığını yansıtabilir ama kod İngilizce
- Dosya isimleri: `camelCase.ts`, bileşenler `PascalCase.tsx`
- Import sırası: React → RN → 3rd party → internal

### Güvenlik
- API key'ler asla kaynak kodda olmamalı
- `expo-secure-store` hassas veriler için
- Supabase anon key client-side OK, service role key asla client'ta

### Hata Yönetimi
- Her async işlem try/catch ile sarılı
- Kullanıcıya Türkçe hata mesajı göster
- Konsola `console.error` ile logla

### Test
- Her repository fonksiyonu için birim testi yaz (`__tests__/`)
- Supabase mock: `jest.mock('@supabase/supabase-js')`

---

## Klasör Yapısı
```
patika/
├── src/
│   ├── core/
│   │   ├── config.ts          # env değişkenleri
│   │   ├── constants/
│   │   └── theme/
│   │       ├── colors.ts
│   │       ├── typography.ts
│   │       └── theme.ts
│   ├── data/
│   │   ├── models/            # TypeScript interface'leri
│   │   ├── repositories/      # Supabase CRUD
│   │   └── services/
│   │       ├── supabaseClient.ts
│   │       ├── claudeService.ts
│   │       └── notificationService.ts
│   ├── presentation/
│   │   ├── screens/
│   │   │   ├── onboarding/
│   │   │   ├── dashboard/
│   │   │   ├── petProfile/
│   │   │   ├── healthLog/
│   │   │   ├── aiAssistant/
│   │   │   ├── vetMap/
│   │   │   └── settings/
│   │   ├── components/        # paylaşılan bileşenler
│   │   └── navigation/
│   └── store/                 # Zustand store'ları
├── assets/
├── __tests__/
├── .env.example
├── app.config.ts
└── CLAUDE.md
```

---

## Mevcut Durum
- [x] Expo projesi oluşturuldu
- [x] Temel bağımlılıklar kuruldu
- [ ] Klasör yapısı oluşturulacak
- [ ] Supabase bağlantısı kurulacak
- [ ] Auth akışı geliştirilecek
- [ ] Hayvan profili CRUD geliştirilecek
- [ ] Dashboard ekranı
- [ ] Claude API entegrasyonu
