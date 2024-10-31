import { getCountries } from '../../util/localdata';
import Workbench from './Workbench';

export default async function MyGlobe() {
  const countryData = await getCountries();

  return <Workbench countryData={countryData} />;
}
