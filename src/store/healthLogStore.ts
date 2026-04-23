import { create } from 'zustand';

export interface HealthLogEntry {
  id: string;
  date: string;        // "22 Nisan 2026" formatında
  dateISO: string;     // "2026-04-22" formatında (grafik için)
  weight: number | null;
  appetite: number;    // 1-5
  energy: number;      // 1-5
  stool: string;       // 'Normal' | 'Yumuşak' | 'Sıvı' | 'Sert'
  vomiting: boolean;
  notes: string;
}

interface HealthLogState {
  logs: HealthLogEntry[];
  addLog: (log: HealthLogEntry) => void;
}

// Mock başlangıç verileri (HealthScreen'deki mevcut mock verilerle aynı)
const initialLogs: HealthLogEntry[] = [
  { id: '1', date: '22 Nisan 2026', dateISO: '2026-04-22', weight: 4.2,  appetite: 5, energy: 5, stool: 'Normal',   vomiting: false, notes: '' },
  { id: '2', date: '15 Nisan 2026', dateISO: '2026-04-15', weight: 4.1,  appetite: 4, energy: 4, stool: 'Normal',   vomiting: false, notes: '' },
  { id: '3', date: '8 Nisan 2026',  dateISO: '2026-04-08', weight: 4.0,  appetite: 3, energy: 3, stool: 'Yumuşak', vomiting: true,  notes: '' },
  { id: '4', date: '1 Nisan 2026',  dateISO: '2026-04-01', weight: 3.9,  appetite: 4, energy: 4, stool: 'Normal',   vomiting: false, notes: '' },
  { id: '5', date: '25 Mart 2026',  dateISO: '2026-03-25', weight: 3.85, appetite: 4, energy: 5, stool: 'Normal',   vomiting: false, notes: '' },
];

export const useHealthLogStore = create<HealthLogState>((set) => ({
  logs: initialLogs,
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
}));
