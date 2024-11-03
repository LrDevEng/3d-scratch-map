import { checkAuthorization } from '../../../util/auth';

type Props = {
  params: Promise<{ userId: number }>;
};

export default async function UserGlobe(props: Props) {
  const { userId } = await props.params;

  await checkAuthorization(`/my-globe/${userId}`);

  return <div>User Id: {userId}</div>;
}
