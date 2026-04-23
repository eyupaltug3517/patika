import { supabase } from '../services/supabaseClient';
import { Pet, CreatePetDto, UpdatePetDto } from '../models';

export const petRepository = {
  getAll: async (userId: string): Promise<Pet[]> => {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data as Pet[];
  },

  getById: async (id: string): Promise<Pet> => {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) throw new Error(error.message);
    return data as Pet;
  },

  create: async (dto: CreatePetDto): Promise<Pet> => {
    const { data, error } = await supabase
      .from('pets')
      .insert(dto)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Pet;
  },

  update: async (id: string, dto: UpdatePetDto): Promise<Pet> => {
    const { data, error } = await supabase
      .from('pets')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Pet;
  },

  softDelete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('pets')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  uploadPhoto: async (petId: string, uri: string): Promise<string> => {
    const fileName = `${petId}/profile.jpg`;
    const response = await fetch(uri);
    const blob = await response.blob();

    const { error } = await supabase.storage
      .from('pet-photos')
      .upload(fileName, blob, { upsert: true, contentType: 'image/jpeg' });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from('pet-photos').getPublicUrl(fileName);
    return data.publicUrl;
  },
};
