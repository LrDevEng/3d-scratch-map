import LogoutButton from '../../(home)/(auth)/logout/LogoutButton';
import { checkAuthorization } from '../../../util/auth';

type Props = {
  params: Promise<{ userId: number }>;
};

export default async function UserProfile(props: Props) {
  const { userId } = await props.params;

  const user = await checkAuthorization(`/my-globe/${userId}`);

  return (
    <div>
      <div>User id: {user.id}</div>
      <div>User email: {user.email}</div>
      <div>User name: {user.givenName}</div>
      <div>User surname: {user.familyName}</div>
      <div>
        <LogoutButton />
      </div>
    </div>
  );
}
