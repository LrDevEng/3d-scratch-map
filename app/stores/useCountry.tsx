import { create } from 'zustand';

// interface Country {
//   country: string;
//   update: (newCountry: string) => void;
// }

// export const useHoveredCountry = create<Country>((set) => ({
//   country: '',
//   update: (newCountry) => set(() => ({ country: newCountry })),
// }));

interface Country {
  country: string;
  countryPrev: string;
  update: (newCountry: string) => void;
}

export const useSelectedCountry = create<Country>((set) => ({
  country: '',
  countryPrev: '',
  update: (newCountry) =>
    set((state) => ({ country: newCountry, countryPrev: state.country })),
}));
