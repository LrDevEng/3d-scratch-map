'use client';

import type { FeatureCollection } from 'geojson';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { type FunctionComponent, useState } from 'react';
import type { FollowingUser } from '../../../migrations/00000-createTableUsers';
import { parseGenitive } from '../../../util/parsers';
import CloseButton from '../../components/CloseButton';
import { type Props as SpaceProps } from '../../components/Space';
import {
  useAutoRotateGlobe,
  useAutoRotateStars,
  useCameraZoom,
} from '../../stores/useControls';

const Space = dynamic(() => import('../../components/Space'), {
  ssr: false,
}) as FunctionComponent<SpaceProps>;

type Props = {
  countryData: FeatureCollection;
  visitedCountries: Set<string>;
  personalGlobe: boolean;
  followingUser: FollowingUser | undefined;
};

export default function UserGlobe({
  countryData,
  visitedCountries,
  personalGlobe,
  followingUser,
}: Props) {
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
  const paramsUserId = params.userId;
  const userId = Array.isArray(paramsUserId) ? paramsUserId[0] : paramsUserId;

  const updateUrl = (newCountryAdm0A3: string) => {
    if (newCountryAdm0A3.length === 3) {
      router.push(`/my-globe/${userId}/${newCountryAdm0A3.toLowerCase()}`);
    } else {
      router.push(`/my-globe/${userId}`);
    }
  };

  // State
  const [isLoading, setIsLoading] = useState(true);
  const globeRotation = useAutoRotateGlobe((state) => state.rotate);
  const updateGlobeRotation = useAutoRotateGlobe((state) => state.update);
  const starRotation = useAutoRotateStars((state) => state.rotate);
  const updateStarRotation = useAutoRotateStars((state) => state.update);
  const zoomSlider = useCameraZoom((state) => state.zoomSlider);
  const updateSliderAndInject = useCameraZoom(
    (state) => state.updateSliderAndInject,
  );

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
            rotateSelf: globeRotation,
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
          rotateStars={starRotation}
        />

        {isLoading && (
          <div className="absolute left-0 top-0 z-[60] flex h-full w-full items-center justify-center bg-[#0f0f0f]">
            <h1>Loading Interactive 3D Map ...</h1>
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
      <div className="absolute left-0 top-0 z-50">
        <div className="mx-8 my-4 rounded-xl border border-white bg-base-100 px-4 py-4">
          <h3>Control Center</h3>
          <div className="mt-2 flex">
            <div className="mr-4">zoom:</div>
            <input
              type="range"
              min="-15"
              max="-2.5"
              step="0.1"
              value={-zoomSlider}
              className="range"
              onChange={(event) => {
                updateSliderAndInject(-Number(event.target.value));
              }}
            />
          </div>
          <div className="mt-2 flex w-full justify-between">
            <div className="mr-4">auto rotate (globe):</div>
            <input
              type="checkbox"
              checked={globeRotation}
              onChange={() => updateGlobeRotation(!globeRotation)}
              className="checkbox"
            />
          </div>
          <div className="mt-2 flex w-full justify-between">
            <div className="mr-4">auto rotate (stars):</div>
            <input
              type="checkbox"
              checked={starRotation}
              onChange={() => updateStarRotation(!starRotation)}
              className="checkbox"
            />
          </div>
        </div>
      </div>
      {!personalGlobe && followingUser && (
        <div className="absolute bottom-0 left-0 z-50 flex items-center p-8">
          <div className="rounded-full border-2 border-white">
            <Image
              className="rounded-full object-contain"
              src={
                followingUser.imageUrl
                  ? followingUser.imageUrl
                  : '/icons/userIcon.svg'
              }
              alt="profile picture"
              height={60}
              width={60}
            />
          </div>
          <div className="pl-4">
            {parseGenitive(followingUser.givenName)} Globe
          </div>
        </div>
      )}
    </div>
  );
}
