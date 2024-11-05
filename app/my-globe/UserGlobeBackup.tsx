'use client';

import type { FeatureCollection } from 'geojson';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { type FunctionComponent, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import CloseButton from '../components/CloseButton';
import { type Props as SpaceProps } from '../components/Space';
import { useSelectedCountry } from '../stores/useCountry';
import Journeys from './[country]/Journeys';

const Space = dynamic(() => import('../components/Space'), {
  ssr: false,
}) as FunctionComponent<SpaceProps>;

type Props = {
  countryData: FeatureCollection;
};

export default function UserGlobe({ countryData }: Props) {
  // const selectedCountry = useSelectedCountry((state) => state.country);
  // const selectedCountryIsoA2 = useSelectedCountry(
  //   (state) => state.countryIsoA2,
  // );
  // const selectedCountryAdm0A3 = useSelectedCountry(
  //   (state) => state.countryAdm0A3,
  // );

  const selectedCountry = useSelectedCountry(
    useShallow((state) => ({
      name: state.country,
      isoA2: state.countryIsoA2,
      adm0A3: state.countryAdm0A3,
    })),
  );
  const updateSelectedCountry = useSelectedCountry((state) => state.update);
  const [isLoading, setIsLoading] = useState(true);
  const selected = selectedCountry.name !== '' && selectedCountry.name !== ' ';

  let spaceWidth = 'w-full';
  let dropDownWidth = 'w-[30vw]';
  if (selected) {
    spaceWidth = 'w-[50vw]';
    dropDownWidth = 'w-[50vw]';
  }

  // const searchParams = useSearchParams();
  // const router = useRouter();

  // useEffect(() => {
  //   const searchParamCountry = searchParams.get('country');
  //   if (searchParamCountry) {
  //     const queriedCountry = countryData.features.find(
  //       (country) => country.properties?.NAME === searchParamCountry,
  //     );
  //     updateSelectedCountry(
  //       queriedCountry?.properties?.NAME,
  //       queriedCountry?.properties?.ISO_A2,
  //       queriedCountry?.properties?.ADM0_A3,
  //     );
  //   }
  // }, [searchParams, updateSelectedCountry, countryData.features]);

  // useEffect(() => {
  //   if (selectedCountry.name.length > 0) {
  //     const newParams = new URLSearchParams(searchParams);
  //     newParams.set('country', selectedCountry.name);
  //     router.push(`?${newParams.toString()}`);
  //   }
  // }, [router, searchParams, selectedCountry]);

  return (
    <div className="relative flex h-full w-full">
      <div
        className={`h-[calc(100vh-5rem)] min-h-[300px] bg-[#0f0f0f] ${spaceWidth}`}
      >
        <Space
          earthProps={{
            countryData: countryData,
            visitedCountries: ['GER', 'RUS', 'FRA'],
            rotateSelf: true,
            orbitControlsEnableZoom: true,
            orbitControlsEnableRotate: true,
            showCountryText: true,
            enableCountryInteraction: true,
            onMounted: () => {
              console.log('UserGlobe mounted');
              setIsLoading(false);
            },
          }}
          showHeroText={false}
        />
        {isLoading && (
          <div className="absolute left-1/2 top-1/2 z-50">
            <h1>Loading ...</h1>
          </div>
        )}
      </div>
      <div className="absolute right-0 top-0">
        <div className={`flex items-center ${dropDownWidth}`}>
          {selected && (
            <CloseButton
              className="ml-8"
              onClick={() => updateSelectedCountry('', '', '')}
            />
          )}
          <div className="flex w-full justify-end">
            <select
              className="select select-bordered mx-8 my-4 w-[25vw] min-w-fit"
              value={selectedCountry.name}
              onChange={(event) => {
                const dropDownCountry = countryData.features.find(
                  (country) =>
                    country.properties?.NAME === event.currentTarget.value,
                );
                if (dropDownCountry && dropDownCountry.properties) {
                  updateSelectedCountry(
                    dropDownCountry.properties.NAME,
                    dropDownCountry.properties.ISO_A2,
                    dropDownCountry.properties.ADM0_A3,
                  );
                } else {
                  updateSelectedCountry('', '', '');
                }
                console.log('Country drop down change.');
              }}
            >
              <option className="text-gray-500">- select country -</option>
              {countryData.features.map(({ properties }) => {
                if (properties) {
                  return (
                    <option key={`option-${properties.ADM0_A3}`}>
                      {properties.NAME}
                    </option>
                  );
                } else {
                  return undefined;
                }
              })}
            </select>
          </div>
        </div>
      </div>
      {selected && (
        <div className="mx-8 mt-24 w-full">
          <div className="flex items-center">
            <div className="h-[64px] w-[64px]">
              <Image
                className="m-auto"
                src={`https://flagsapi.com/${selectedCountry.isoA2}/flat/64.png`}
                width={64}
                height={64}
                alt="flag"
              />
            </div>
            <h1 className="ml-8">{selectedCountry.name}</h1>
          </div>
          <p>Population:</p>
          <p>Size:</p>
          <p>Capital:</p>
          <Journeys />
        </div>
      )}
    </div>
  );
}
