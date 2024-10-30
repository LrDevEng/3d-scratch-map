import { create } from 'zustand';

interface Country {
  country: string;
  update: (newCountry: string) => void;
}

export const useHoveredCountry = create<Country>((set) => ({
  country: '',
  update: (newCountry) => set(() => ({ country: newCountry })),
}));

export const useSelectedCountry = create<Country>((set) => ({
  country: '',
  update: (newCountry) => set(() => ({ country: newCountry })),
}));
