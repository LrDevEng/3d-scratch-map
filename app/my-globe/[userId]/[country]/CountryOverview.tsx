'use client';

import type { GeoJsonProperties } from 'geojson';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Journey } from '../../../../migrations/00002-createTableJourneys';
import CloseButton from '../../../components/CloseButton';
import CountryInfo from './CountryInfo';
import Journeys from './Journeys';

type Props = {
  selectedCountry: GeoJsonProperties | undefined;
  journeys: Journey[];
  userId: string;
  personalGlobe: boolean;
};

export default function CountryOverview({
  selectedCountry,
  journeys,
  userId,
  personalGlobe,
}: Props) {
  const router = useRouter();
  const selectedCountryName = selectedCountry?.NAME as string;
  const selectedCountryIsoA2 = selectedCountry?.ISO_A2 as string;
  const selectedCountryAdm0A3 = selectedCountry?.ADM0_A3 as string;

  // Flag apis
  // https://flagcdn.com/fr.svg
  // https://flagsapi.com/${selectedCountry.isoA2}/flat/64.png

  return (
    <div className="relative mx-8 w-full">
      <div className="fixed z-40 w-full bg-black pb-2 pl-2 pt-6">
        <CloseButton onClick={() => router.push(`/my-globe/${userId}`)} />
      </div>
      <div className="mt-24 w-full">
        <div className="flex items-center">
          <div className="h-[64px] w-[64px]">
            {selectedCountryIsoA2.length === 2 && (
              <Image
                className="m-auto"
                src={`https://flagsapi.com/${selectedCountryIsoA2}/flat/64.png`}
                width={64}
                height={64}
                alt="flag"
              />
            )}
          </div>
          <h1 className="ml-8">{selectedCountryName}</h1>
        </div>
        <CountryInfo countryIsoA2={selectedCountryIsoA2} />
        <Journeys
          journeys={journeys}
          selectedCountryAdm0A3={selectedCountryAdm0A3}
          userId={userId}
          personalGlobe={personalGlobe}
        />
      </div>
    </div>
  );
}
