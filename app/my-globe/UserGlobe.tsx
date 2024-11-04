'use client';

import type { FeatureCollection } from 'geojson';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { type FunctionComponent, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import CloseButton from '../components/CloseButton';
import { type Props as SpaceProps } from '../components/Space';
import { useSelectedCountry } from '../stores/useCountry';

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
        <div className={`flex items-center justify-between ${dropDownWidth}`}>
          {selected && (
            <CloseButton onClick={() => updateSelectedCountry('', '', '')} />
          )}
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
      {selected && (
        <div>
          <h1>{selectedCountry.name}</h1>
          <p>Population:</p>
          <p>Size:</p>

          <div className="h-[64px] w-[64px]">
            <Image
              className="m-auto"
              src={`https://flagsapi.com/${selectedCountry.isoA2}/flat/64.png`}
              width={64}
              height={64}
              alt="flag"
            />
          </div>
          <h2>Trips</h2>
        </div>
      )}
    </div>
  );
}
