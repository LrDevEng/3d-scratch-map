import { getJourneys } from '../../database/journeys';
import { checkAuthorization } from '../../util/auth';
import { getCountries } from '../../util/localdata';
import UserGlobe from './UserGlobe';

export default async function GlobeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { sessionTokenCookie } = await checkAuthorization('/my-globe');
  const countryData = await getCountries();
  const journeys = await getJourneys(sessionTokenCookie.value);
  const visitedCountries = new Set<string>();
  journeys.forEach((journey) => visitedCountries.add(journey.countryAdm0A3));

  return (
    <div className="relative flex h-full w-full">
      <UserGlobe
        countryData={countryData}
        visitedCountries={visitedCountries}
      />
      {children}
    </div>
  );
}
