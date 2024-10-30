import { getCountries } from '../util/localdata';
import Space from './components/Space';

export default async function Home() {
  const countryData = await getCountries();

  return (
    <div style={{ width: '80vw', height: '100vh', backgroundColor: '#0f0f0f' }}>
      <Space countryData={countryData} />
    </div>
  );
}
