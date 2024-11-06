import { create } from 'zustand';

type CountryApiInfos = {
  capital: string;
  area: number;
  population: number;
};

interface CountryInfos {
  countryInfos: CountryApiInfos[];
  update: (newCountryInfos: CountryApiInfos[]) => void;
}

export const useCountryInfos = create<CountryInfos>((set) => ({
  countryInfos: [{ capital: '', area: 0, population: 0 }],
  update: (newCountryInfos) => set(() => ({ countryInfos: newCountryInfos })),
}));
