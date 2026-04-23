import { create } from 'zustand';

export interface Appointment {
  id: string;
  type: 'Veteriner' | 'Bakım' | 'Aşı' | 'Diğer';
  title: string;
  location: string;
  phone: string;
  date: string;     // "10 Mayıs 2026" formatı
  time: string;     // "14:30"
  notes: string;
  color: string;    // sol border rengi
}

interface AppointmentState {
  appointments: Appointment[];
  addAppointment: (a: Appointment) => void;
}

const TYPE_COLORS: Record<string, string> = {
  Veteriner: '#4169E1',
  Bakım: '#4CAF82',
  Aşı: '#FF6B35',
  Diğer: '#9B59B6',
};

// Mevcut mock verilerle aynı başlangıç
const initialAppointments: Appointment[] = [
  { id: '1', type: 'Veteriner', title: 'Yıllık Kontrol Muayenesi', location: 'Dr. Ayşe Kaya', phone: '+90 212 555 0001', date: '10 Mayıs 2026', time: '14:30', notes: '', color: '#4169E1' },
  { id: '2', type: 'Bakım', title: 'Tüy Bakımı & Tırnak Kesimi', location: 'Pet Grooming Salonu', phone: '+90 212 555 0002', date: '28 Nisan 2026', time: '11:00', notes: '', color: '#4CAF82' },
  { id: '3', type: 'Aşı', title: 'Kuduz Aşısı Hatırlatması', location: 'Dr. Mehmet Yılmaz', phone: '+90 216 555 0003', date: '15 Ekim 2026', time: '10:00', notes: '', color: '#FF6B35' },
];

export { TYPE_COLORS };
export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: initialAppointments,
  addAppointment: (a) => set((state) => ({ appointments: [a, ...state.appointments] })),
}));
