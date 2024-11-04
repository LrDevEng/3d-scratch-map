import { checkAuthorization } from '../../util/auth';
import { getCountries } from '../../util/localdata';
import UserGlobe from './UserGlobe';

export default async function Globe() {
  const countryData = await getCountries();

  await checkAuthorization('/my-globe');

  return <UserGlobe countryData={countryData} />;
}
