import { getCountries } from '../util/localdata';
import Space from './components/Space';

export default async function Home() {
  const countryData = await getCountries();

  return (
    <div style={{ width: '50vw', height: '100vh', backgroundColor: '#181818' }}>
      <Space countryData={countryData} />
    </div>
  );
}
