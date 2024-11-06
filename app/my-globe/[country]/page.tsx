import { getJourneys } from '../../../database/journeys';
import { checkAuthorization } from '../../../util/auth';
import { getCookie } from '../../../util/cookies';
import { getCountries } from '../../../util/localdata';
import CountryOverview from './CountryOverview';

type Props = {
  params: Promise<{ country: string }>;
};

export default async function UserSpace(props: Props) {
  const { country } = await props.params;
  await checkAuthorization(`/my-globe/${country}`);
  const countryData = await getCountries();

  // 1. Check if the sessionToken cookie exists
  const sessionTokenCookie = await getCookie('sessionToken');

  // 2. Query the journeys with the current user
  const journeys =
    sessionTokenCookie && (await getJourneys(sessionTokenCookie));

  return (
    <CountryOverview
      countryData={countryData}
      queriedCountryAdm0={country.toUpperCase()}
      journeys={journeys ? journeys : []}
    />
  );

  // return <UserGlobe countryData={countryData} searchCountry="" />;
}
