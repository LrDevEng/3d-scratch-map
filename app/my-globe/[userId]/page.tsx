type Props = {
  params: Promise<{ userId: number }>;
};

export default async function UserGlobe(props: Props) {
  const { userId } = await props.params;
  return <div>User Id: {userId}</div>;
}
