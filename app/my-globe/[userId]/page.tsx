import Link from 'next/link';
import { checkAuthorization } from '../../../util/auth';
import { getCountries } from '../../../util/localdata';
import UserGlobe from '../UserGlobe';

type Props = {
  params: Promise<{ userId: number }>;
};

export default async function UserSpace(props: Props) {
  const { userId } = await props.params;
  const countryData = await getCountries();

  const user = await checkAuthorization(`/my-globe/${userId}`);

  // Only the user is allowed to enter their profile
  if (Number(userId) !== user.id) {
    return (
      <div>
        <h1>Access Denied.</h1>
        <div>You do not have permission to access this page.</div>
        <Link href={`/my-globe/${user.id}`}>Return</Link>
      </div>
    );
  }

  return <UserGlobe countryData={countryData} />;
}
