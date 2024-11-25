'use client';

import type { FeatureCollection } from 'geojson';
import { useParams } from 'next/navigation';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import type { FollowingUser } from '../../../migrations/00000-createTableUsers';
import UserGlobe from './UserGlobe';

type Props = {
  children: React.ReactNode;
  countryData: FeatureCollection;
  visitedCountries: Set<string>;
  personalGlobe: boolean;
  followingUser: FollowingUser | undefined;
};

export default function ResizableLayout({
  children,
  countryData,
  visitedCountries,
  personalGlobe,
  followingUser,
}: Props) {
  const params = useParams();
  const paramsCountry = params?.country || '';
  const selectedCountryAdm0A3 = Array.isArray(paramsCountry)
    ? paramsCountry[0]?.toUpperCase()
    : paramsCountry.toUpperCase();
  const selected = selectedCountryAdm0A3?.length === 3;
  const globePanelDefaultSize = selected ? 50 : 100;

  return (
    <PanelGroup direction="horizontal">
      <Panel
        id="my-globe-panel-1"
        order={1}
        defaultSize={globePanelDefaultSize}
      >
        <UserGlobe
          countryData={countryData}
          visitedCountries={visitedCountries}
          personalGlobe={personalGlobe}
          followingUser={followingUser}
        />
      </Panel>
      {selected && <PanelResizeHandle className="w-[2px] bg-[#424242]" />}
      {selected && (
        <Panel
          id="my-globe-panel-2"
          order={2}
          minSize={50}
          maxSize={70}
          defaultSize={50}
        >
          {children}
        </Panel>
      )}
    </PanelGroup>
  );
}
