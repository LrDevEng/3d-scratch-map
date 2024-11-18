import Link from 'next/link';
import {
  getJourneys,
  getJourneysByFollowingId,
} from '../../../../database/journeys';
import { checkAuthentication } from '../../../../util/auth';
import { getCountries } from '../../../../util/localdata';
import { validateUrlParam } from '../../../../util/validation';
import CountryOverview from './CountryOverview';

type Props = {
  params: Promise<{ country: string; userId: string }>;
};

export default async function UserSpace(props: Props) {
  const { country, userId } = await props.params;
  const { user, sessionTokenCookie } = await checkAuthentication(
    `/my-globe/${userId}/${country}`,
  );
  const countryData = await getCountries();
  const selectedCountry = countryData.features.find(
    ({ properties }) => properties?.ADM0_A3 === country.toUpperCase(),
  );

  // 1. Validate url input and show access denied page in case it does not match
  if (
    !selectedCountry ||
    !validateUrlParam('country', country) ||
    !validateUrlParam('userId', userId)
  ) {
    return (
      <div className="relative flex h-full w-full flex-col items-center bg-[#0f0f0f]">
        <h1 className="my-16">Country does not exist or access denied!</h1>
        <Link href={`/my-globe/${user.id}`}>Return home.</Link>
      </div>
    );
  }

  // 2. Get journeys either from current user or from follower
  let journeys;
  let personalGlobe = true;
  if (user.id === Number(userId)) {
    journeys = await getJourneys(sessionTokenCookie.value);
  } else {
    journeys = await getJourneysByFollowingId(
      sessionTokenCookie.value,
      Number(userId),
    );
    personalGlobe = false;
  }

  const countryJourneys = journeys.filter(
    (journey) => journey.countryAdm0A3 === selectedCountry.properties?.ADM0_A3,
  );

  return (
    <div className="flex h-[calc(100vh-5rem)] min-h-[300px] w-full overflow-auto">
      <CountryOverview
        selectedCountry={selectedCountry.properties}
        journeys={countryJourneys}
        userId={userId}
        personalGlobe={personalGlobe}
      />
    </div>
  );
}
