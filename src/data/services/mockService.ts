import { Pet, Vaccination, Medication, HealthLog, Appointment } from '../models';

export const DEMO_PET: Pet = {
  id: 'pet-demo-1',
  user_id: 'user-demo-1',
  name: 'Karamel',
  species: 'cat',
  breed: 'British Shorthair',
  birth_date: '2021-06-15',
  gender: 'female',
  neutered: true,
  microchip_no: '941000026523842',
  photo_url: null,
  created_at: '2024-01-10T10:00:00Z',
  deleted_at: null,
};

export const DEMO_PET_2: Pet = {
  id: 'pet-demo-2',
  user_id: 'user-demo-1',
  name: 'Pofuduk',
  species: 'dog',
  breed: 'Golden Retriever',
  birth_date: '2020-03-22',
  gender: 'male',
  neutered: false,
  microchip_no: null,
  photo_url: null,
  created_at: '2024-02-05T10:00:00Z',
  deleted_at: null,
};

export const DEMO_VACCINATIONS: Vaccination[] = [
  {
    id: 'vac-1',
    pet_id: 'pet-demo-1',
    vaccine_name: 'Kuduz Aşısı',
    date_given: '2025-10-15',
    next_due_date: '2026-10-15',
    administered_by: 'Dr. Ayşe Kaya',
    notes: 'Yıllık tekrar gerekli',
  },
  {
    id: 'vac-2',
    pet_id: 'pet-demo-1',
    vaccine_name: '3lü Kombine (FVRCP)',
    date_given: '2025-10-15',
    next_due_date: '2026-10-15',
    administered_by: 'Dr. Ayşe Kaya',
    notes: null,
  },
];

export const DEMO_MEDICATIONS: Medication[] = [
  {
    id: 'med-1',
    pet_id: 'pet-demo-1',
    med_name: 'Milbemax (İç Parazit)',
    dose: '1 tablet',
    frequency: 'Aylık',
    start_date: '2026-04-01',
    end_date: null,
    reminder_enabled: true,
  },
];

export const DEMO_HEALTH_LOGS: HealthLog[] = [
  { id: 'log-1', pet_id: 'pet-demo-1', date: '2026-04-22', weight: 4.2, appetite_score: 5, stool_condition: 'normal', vomiting: false, energy_level: 5, notes: 'Çok enerjik!', symptoms_text: null },
  { id: 'log-2', pet_id: 'pet-demo-1', date: '2026-04-15', weight: 4.1, appetite_score: 4, stool_condition: 'normal', vomiting: false, energy_level: 4, notes: null, symptoms_text: null },
  { id: 'log-3', pet_id: 'pet-demo-1', date: '2026-04-08', weight: 4.0, appetite_score: 3, stool_condition: 'soft', vomiting: true, energy_level: 3, notes: 'Hafif mide sorunu', symptoms_text: 'Kusma, iştahsızlık' },
  { id: 'log-4', pet_id: 'pet-demo-1', date: '2026-04-01', weight: 3.9, appetite_score: 4, stool_condition: 'normal', vomiting: false, energy_level: 4, notes: null, symptoms_text: null },
  { id: 'log-5', pet_id: 'pet-demo-1', date: '2026-03-25', weight: 3.85, appetite_score: 5, stool_condition: 'normal', vomiting: false, energy_level: 5, notes: null, symptoms_text: null },
];

export const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    pet_id: 'pet-demo-1',
    vet_name: 'Dr. Ayşe Kaya',
    vet_phone: '+90 212 555 0001',
    date_time: '2026-05-10T14:30:00Z',
    appointment_type: 'vet',
    notes: 'Yıllık kontrol muayenesi',
    reminder_minutes_before: 60,
  },
  {
    id: 'apt-2',
    pet_id: 'pet-demo-1',
    vet_name: 'Pet Grooming Salonu',
    vet_phone: '+90 212 555 0002',
    date_time: '2026-04-28T11:00:00Z',
    appointment_type: 'grooming',
    notes: 'Tırnak kesimi + tüy bakımı',
    reminder_minutes_before: 30,
  },
];

export const DEMO_AI_RESPONSE = `🔍 Durum Değerlendirmesi: Karamel'in belirttiğiniz semptomlar (iştahsızlık ve enerji düşüklüğü) birkaç farklı durumun işareti olabilir. Genellikle hafif sindirim sorunları veya stres bu belirtilere yol açabilir.

⚠️ Aciliyet: DİKKAT

✅ Önerilen Adımlar:
• 24 saat boyunca su tüketimini ve iştahı yakından takip edin
• Semptomlarda kötüleşme (kusma, ishal, letarji) olursa derhal veterinere gidin
• 48 saat içinde düzelme olmazsa veteriner randevusu alın`;
