import { create } from 'zustand';

interface HoveredCountry {
  country: string;
  update: (newCountry: string) => void;
}

export const useHoveredCountry = create<HoveredCountry>((set) => ({
  country: '',
  update: (newCountry) => set(() => ({ country: newCountry })),
}));
