'use client';

import type { FeatureCollection } from 'geojson';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { type FunctionComponent, useState } from 'react';
import CloseButton from '../components/CloseButton';
import { type Props as SpaceProps } from '../components/Space';

const Space = dynamic(() => import('../components/Space'), {
  ssr: false,
}) as FunctionComponent<SpaceProps>;

type Props = {
  countryData: FeatureCollection;
  visitedCountries: Set<string>;
};

export default function UserGlobe({ countryData, visitedCountries }: Props) {
  // Router
  const router = useRouter();

  // Url state
  const params = useParams();
  const paramsCountry = params.country || '';
  const selectedCountryAdm0A3 = Array.isArray(paramsCountry)
    ? paramsCountry[0]?.toUpperCase()
    : paramsCountry.toUpperCase();
  const selectedCountry = countryData.features.find(
    ({ properties }) => properties?.ADM0_A3 === selectedCountryAdm0A3,
  ) || { properties: { NAME: '- select country -' } };

  const updateUrl = (newCountryAdm0A3: string) => {
    if (newCountryAdm0A3.length === 3) {
      router.push(`/my-globe/${newCountryAdm0A3.toLowerCase()}`);
    } else {
      router.push('/my-globe');
    }
  };

  // State
  const [isLoading, setIsLoading] = useState(true);

  // Derived state
  const selected = selectedCountryAdm0A3?.length === 3;
  const spaceWidth = selected ? 'w-[50vw]' : 'w-full';
  const dropDownWidth = selected ? 'w-[50vw]' : 'w-[30vw]';

  return (
    <div className="flex h-full w-full">
      <div
        className={`h-[calc(100vh-5rem)] min-h-[300px] bg-[#0f0f0f] ${spaceWidth}`}
      >
        <Space
          earthProps={{
            countryData: countryData,
            visitedCountries: visitedCountries,
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
          <div className="absolute left-1/4 top-1/2 z-50">
            <h1>Loading ...</h1>
          </div>
        )}
      </div>
      <div
        className={`absolute right-0 top-0 z-50 ${selected ? 'bg-black' : ''}`}
      >
        <div className={`flex items-center ${dropDownWidth}`}>
          {selected && (
            <CloseButton className="ml-8" onClick={() => updateUrl('')} />
          )}
          <div className="flex w-full justify-end">
            <select
              className="select select-bordered mx-8 my-4 w-[25vw] min-w-fit"
              value={selectedCountry.properties?.NAME}
              onChange={(event) => {
                const dropDownCountry = countryData.features.find(
                  (country) =>
                    country.properties?.NAME === event.currentTarget.value,
                );
                if (dropDownCountry && dropDownCountry.properties) {
                  updateUrl(dropDownCountry.properties.ADM0_A3);
                } else {
                  updateUrl('');
                }
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
    </div>
  );
}
