import { create } from 'zustand';
import { Pet } from '../data/models';

interface PetStore {
  pets: Pet[];
  activePetId: string | null;
  setPets: (pets: Pet[]) => void;
  setActivePet: (id: string) => void;
  addPet: (pet: Pet) => void;
  updatePet: (id: string, data: Partial<Pet>) => void;
  removePet: (id: string) => void;
  getActivePet: () => Pet | undefined;
}

export const usePetStore = create<PetStore>((set, get) => ({
  pets: [],
  activePetId: null,

  setPets: (pets) => set({ pets, activePetId: pets[0]?.id ?? null }),
  setActivePet: (id) => set({ activePetId: id }),

  addPet: (pet) =>
    set((state) => ({
      pets: [...state.pets, pet],
      activePetId: state.activePetId ?? pet.id,
    })),

  updatePet: (id, data) =>
    set((state) => ({
      pets: state.pets.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),

  removePet: (id) =>
    set((state) => {
      const remaining = state.pets.filter((p) => p.id !== id);
      return {
        pets: remaining,
        activePetId:
          state.activePetId === id ? (remaining[0]?.id ?? null) : state.activePetId,
      };
    }),

  getActivePet: () => {
    const { pets, activePetId } = get();
    return pets.find((p) => p.id === activePetId);
  },
}));
