import { redirect } from 'next/navigation';
import { getJourneys } from '../../../database/journeys';
import { checkAuthorization } from '../../../util/auth';
import { getCookie } from '../../../util/cookies';
import { getCountries } from '../../../util/localdata';
import { validateUrlParam } from '../../../util/validation';
import CountryOverview from './CountryOverview';

type Props = {
  params: Promise<{ country: string }>;
};

export default async function UserSpace(props: Props) {
  const { country } = await props.params;
  await checkAuthorization(`/my-globe/${country}`);
  const countryData = await getCountries();
  const selectedCountry = countryData.features.find(
    ({ properties }) => properties?.ADM0_A3 === country.toUpperCase(),
  );
  // 1. Validate url input and redirect in case it does not match
  if (!selectedCountry || !validateUrlParam('country', country)) {
    redirect('/my-globe');
  }

  // 2. Check if the sessionToken cookie exists
  const sessionTokenCookie = await getCookie('sessionToken');

  // 3. Query the journeys with the current user
  const journeys =
    sessionTokenCookie && (await getJourneys(sessionTokenCookie));

  return (
    <CountryOverview
      selectedCountry={selectedCountry.properties}
      journeys={journeys ? journeys : []}
    />
  );

  // return <UserGlobe countryData={countryData} searchCountry="" />;
}
