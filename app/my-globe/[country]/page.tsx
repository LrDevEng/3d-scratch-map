import { checkAuthorization } from '../../../util/auth';
import { getCountries } from '../../../util/localdata';
import CountryOverview from './CountryOverview';

type Props = {
  params: Promise<{ country: string }>;
};

export default async function UserSpace(props: Props) {
  const { country } = await props.params;
  await checkAuthorization(`/my-globe/${country}`);
  const countryData = await getCountries();

  return (
    <CountryOverview
      countryData={countryData}
      queriedCountryAdm0={country.toUpperCase()}
    />
  );

  // return <UserGlobe countryData={countryData} searchCountry="" />;
}
