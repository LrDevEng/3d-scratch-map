'use client';

import type { FeatureCollection } from 'geojson';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { Journey } from '../../../migrations/00002-createTableJourneys';
import { useSelectedCountry } from '../../stores/useCountry';
import CountryInfo from './CountryInfo';
import Journeys from './Journeys';

type Props = {
  queriedCountryAdm0: string;
  countryData: FeatureCollection;
  journeys: Journey[];
};

export default function CountryOverview({
  queriedCountryAdm0,
  countryData,
  journeys,
}: Props) {
  const selectedCountry = useSelectedCountry(
    useShallow((state) => ({
      name: state.country,
      isoA2: state.countryIsoA2,
      adm0A3: state.countryAdm0A3,
    })),
  );
  const updateSelectedCountry = useSelectedCountry((state) => state.update);

  // useEffect(() => {
  //   if (
  //     queriedCountryAdm0 !== selectedCountry.adm0A3 &&
  //     selectedCountry.adm0A3.length === 0
  //   ) {
  //     const requestedCountry = countryData.features.find(
  //       ({ properties }) => properties?.ADM0_A3 === queriedCountryAdm0,
  //     );
  //     if (requestedCountry) {
  //       updateSelectedCountry(
  //         requestedCountry.properties?.NAME,
  //         requestedCountry.properties?.ISO_A2,
  //         requestedCountry.properties?.ADM0_A3,
  //       );
  //     } else {
  //       redirect('/my-globe');
  //     }
  //   }
  // }, [
  //   updateSelectedCountry,
  //   countryData.features,
  //   queriedCountryAdm0,
  //   selectedCountry.adm0A3,
  // ]);

  // Update selected country state via url
  const refAdm0Prev = useRef(selectedCountry.adm0A3);
  useEffect(() => {
    console.log(
      'Country overview refAdm0Prev: ',
      refAdm0Prev,
      selectedCountry.adm0A3,
    );
    if (
      queriedCountryAdm0 !== selectedCountry.adm0A3 &&
      selectedCountry.adm0A3 === refAdm0Prev.current
    ) {
      const requestedCountry = countryData.features.find(
        ({ properties }) => properties?.ADM0_A3 === queriedCountryAdm0,
      );
      if (requestedCountry) {
        updateSelectedCountry(
          requestedCountry.properties?.NAME,
          requestedCountry.properties?.ISO_A2,
          requestedCountry.properties?.ADM0_A3,
        );
      } else {
        redirect('/my-globe');
      }
    }
  }, [
    updateSelectedCountry,
    countryData.features,
    queriedCountryAdm0,
    selectedCountry.adm0A3,
  ]);

  // Flag apis
  // https://flagcdn.com/fr.svg
  // https://flagsapi.com/${selectedCountry.isoA2}/flat/64.png

  return (
    <div className="flex h-[calc(100vh-5rem)] min-h-[300px] w-full overflow-y-auto">
      <div className="mx-8 mt-24 w-full">
        <div className="flex items-center">
          <div className="h-[64px] w-[64px]">
            {selectedCountry.isoA2.length === 2 && (
              <Image
                className="m-auto"
                src={`https://flagsapi.com/${selectedCountry.isoA2}/flat/64.png`}
                width={64}
                height={64}
                alt="flag"
              />
            )}
          </div>
          <h1 className="ml-8">{selectedCountry.name}</h1>
        </div>
        <CountryInfo countryIsoA2={selectedCountry.isoA2} />
        <Journeys
          journeys={journeys.filter(
            (journey) => journey.countryAdm0A3 === selectedCountry.adm0A3,
          )}
        />
      </div>
    </div>
  );
}
