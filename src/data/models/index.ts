export type PetSpecies = 'dog' | 'cat' | 'other';
export type PetGender = 'male' | 'female';
export type UrgencyLevel = 'NORMAL' | 'DİKKAT' | 'ACİL';
export type AppointmentType = 'vet' | 'grooming' | 'vaccine' | 'other';
export type DocumentCategory = 'report' | 'bloodwork' | 'xray' | 'prescription' | 'other';
export type StoolCondition = 'normal' | 'soft' | 'liquid' | 'hard' | 'none';

export interface Pet {
  id: string;
  user_id: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  birth_date: string | null;
  gender: PetGender | null;
  neutered: boolean;
  microchip_no: string | null;
  photo_url: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface Vaccination {
  id: string;
  pet_id: string;
  vaccine_name: string;
  date_given: string;
  next_due_date: string | null;
  administered_by: string | null;
  notes: string | null;
}

export interface Medication {
  id: string;
  pet_id: string;
  med_name: string;
  dose: string;
  frequency: string;
  start_date: string;
  end_date: string | null;
  reminder_enabled: boolean;
}

export interface HealthLog {
  id: string;
  pet_id: string;
  date: string;
  weight: number | null;
  appetite_score: number | null;  // 1-5
  stool_condition: StoolCondition | null;
  vomiting: boolean;
  energy_level: number | null;    // 1-5
  notes: string | null;
  symptoms_text: string | null;
}

export interface FeedingSchedule {
  id: string;
  pet_id: string;
  food_name: string;
  food_brand: string | null;
  barcode: string | null;
  meal_times: string[];           // ["07:00", "19:00"]
  portion_size: number | null;
  unit: string | null;            // "gram", "cup" vb.
}

export interface Appointment {
  id: string;
  pet_id: string;
  vet_name: string;
  vet_phone: string | null;
  date_time: string;
  appointment_type: AppointmentType;
  notes: string | null;
  reminder_minutes_before: number;
}

export interface Document {
  id: string;
  pet_id: string;
  title: string;
  file_url: string;
  file_type: string;
  category: DocumentCategory;
  uploaded_at: string;
}

export interface AiConsultation {
  id: string;
  pet_id: string;
  user_input: string;
  ai_response: string;
  urgency_level: UrgencyLevel;
  created_at: string;
}

// DTO'lar
export type CreatePetDto = Omit<Pet, 'id' | 'created_at' | 'deleted_at'>;
export type UpdatePetDto = Partial<CreatePetDto>;
export type CreateVaccinationDto = Omit<Vaccination, 'id'>;
export type CreateMedicationDto = Omit<Medication, 'id'>;
export type CreateHealthLogDto = Omit<HealthLog, 'id'>;
export type CreateAppointmentDto = Omit<Appointment, 'id'>;
