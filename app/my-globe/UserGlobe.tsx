'use client';

import type { FeatureCollection } from 'geojson';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { type FunctionComponent, useEffect, useState } from 'react';
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

  // Set url based on current country state
  const router = useRouter();
  useEffect(() => {
    if (selectedCountry.name.length > 0) {
      router.push(`/my-globe/${selectedCountry.adm0A3.toLowerCase()}`);
    } else {
      router.push('/my-globe');
    }
  }, [selectedCountry, router]);

  // Set country state based on url
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.endsWith('/my-globe')) {
      updateSelectedCountry('', '', '');
    }
  }, [pathname, updateSelectedCountry]);

  return (
    <div className="flex h-full w-full">
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
          <div className="absolute left-1/4 top-1/2 z-50">
            <h1>Loading ...</h1>
          </div>
        )}
      </div>
      <div className={`absolute right-0 top-0 ${selected ? 'bg-black' : ''}`}>
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
