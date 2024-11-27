import { getCountries } from '../../util/localdata';
import HomeSpace from './HomeSpace';

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const countryData = await getCountries();

  return (
    <div className="flex h-full w-full">
      <HomeSpace countryData={countryData} />
      <div className="w-3/12">{children}</div>
    </div>
  );
}
