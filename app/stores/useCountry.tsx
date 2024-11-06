import { create } from 'zustand';

interface Country {
  country: string;
  countryIsoA2: string;
  countryAdm0A3: string;
  countryPrev: string;
  update: (newCountry: string, isoA2: string, adm0A3: string) => void;
}

export const useSelectedCountry = create<Country>((set) => ({
  country: '',
  countryIsoA2: '',
  countryAdm0A3: '',
  countryPrev: '',
  update: (newCountry, isoA2, adm0A3) =>
    set((state) => ({
      country: newCountry,
      countryIsoA2: isoA2,
      countryAdm0A3: adm0A3,
      countryPrev: state.country,
    })),
}));

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
