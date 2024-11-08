import LogoutButton from '../(home)/(auth)/logout/LogoutButton';
import { checkAuthorization } from '../../util/auth';

export default async function Profile() {
  const { user } = await checkAuthorization(`/profile`);

  return (
    <div>
      <div>User id: {user.id}</div>
      <div>User email: {user.email}</div>
      <div>User name: {user.givenName}</div>
      <div>User surname: {user.familyName}</div>
      {user.imageUrl && <div>User surname: {user.imageUrl}</div>}
      <div>
        <LogoutButton />
      </div>
    </div>
  );
}
