import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSessionToken } from '../../../../database/sessions';
import { getUser } from '../../../../database/users';
import { getSafeReturnToPath } from '../../../../util/validation';
import RegisterLogIn from '../../RegisterLogIn';

type Props = {
  searchParams: Promise<{
    returnTo?: string | string[];
  }>;
};

export default async function Register({ searchParams }: Props) {
  const { returnTo } = await searchParams;

  // 1. Check if the sessionToken cookie exists
  const sessionTokenCookie = (await cookies()).get('sessionToken');

  // 2. Check if the sessionToken cookie is still valid
  const session =
    sessionTokenCookie &&
    (await getValidSessionToken(sessionTokenCookie.value));

  // 3. If the sessionToken cookie is valid, redirect to home
  if (session) {
    // Get the current user with the sessionToken
    const user = await getUser(sessionTokenCookie.value);
    redirect(getSafeReturnToPath(returnTo) || `/my-globe/${user?.id}`);
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] min-h-[300px] flex-grow flex-col items-center justify-evenly overflow-y-auto overflow-x-hidden px-8">
      <RegisterLogIn returnTo={returnTo} />
    </div>
  );
}
