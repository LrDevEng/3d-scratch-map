import { getCountries } from '../../util/localdata';
import UserGlobe from './UserGlobe';

export default async function GlobeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const countryData = await getCountries();

  return (
    <div className="relative flex h-full w-full">
      <UserGlobe countryData={countryData} />
      {children}
    </div>
  );
}
