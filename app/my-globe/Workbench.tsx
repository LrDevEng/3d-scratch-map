'use client';

import type { FeatureCollection } from 'geojson';
import dynamic from 'next/dynamic';
import { type FunctionComponent, useState } from 'react';
import CloseButton from '../components/CloseButton';
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
  const updateSelectedCountry = useSelectedCountry((state) => state.update);
  const [isLoading, setIsLoading] = useState(true);
  const selected = selectedCountry !== '' && selectedCountry !== ' ';

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
      <div className="absolute right-0 top-0">
        <div className={`flex items-center justify-between ${dropDownWidth}`}>
          {selected && (
            <CloseButton onClick={() => updateSelectedCountry('')} />
          )}
          <select
            className="select select-bordered mx-8 my-4 w-[25vw] min-w-fit"
            value={selectedCountry}
            onChange={(event) =>
              updateSelectedCountry(event.currentTarget.value)
            }
          >
            <option>select country</option>
            <option>Han Solo</option>
            <option>Greedo</option>
            <option>Germany</option>
            <option>Austria</option>
          </select>
        </div>
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
