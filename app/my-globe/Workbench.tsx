'use client';

import type { FeatureCollection } from 'geojson';
import dynamic from 'next/dynamic';
import { type FunctionComponent, useState } from 'react';
import { type Props as SpaceProps } from '../components/Space';
import { useSelectedCountry } from '../stores/useCountry';

const Space = dynamic(() => import('../components/Space'), {
  ssr: false,
}) as FunctionComponent<SpaceProps>;

type Props = {
  countryData: FeatureCollection;
};

export default function Workbench({ countryData }: Props) {
  const selectedCountry = useSelectedCountry((state) => state.country);
  const [isLoading, setIsLoading] = useState(true);
  const selected = selectedCountry !== '' && selectedCountry !== ' ';

  let spaceWidth = 'w-full';
  if (selected) {
    spaceWidth = 'w-[50vw]';
  }

  return (
    <div className="flex h-full w-full">
      <div
        className={`h-[calc(100vh-5rem)] min-h-[300px] bg-[#0f0f0f] ${spaceWidth}`}
      >
        <Space
          earthProps={{
            countryData: countryData,
            rotateSelf: false,
            orbitControlsEnableZoom: true,
            orbitControlsEnableRotate: true,
            showCountryText: true,
            enableCountryInteraction: true,
            onMounted: () => {
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
      {selected && (
        <div>
          <h1>{selectedCountry}</h1>
          <p>Population:</p>
          <p>Size:</p>
          <h2>Trips</h2>
        </div>
      )}
    </div>
  );
}
