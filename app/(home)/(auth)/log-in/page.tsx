import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSessionToken } from '../../../../database/sessions';
import { getSafeReturnToPath } from '../../../../util/validation';
import RegisterLogIn from '../../RegisterLogIn';

type Props = {
  searchParams: Promise<{
    returnTo?: string | string[];
  }>;
};

export default async function LogIn({ searchParams }: Props) {
  const { returnTo } = await searchParams;

  // 1. Check if the sessionToken cookie exists
  const sessionTokenCookie = (await cookies()).get('sessionToken');

  // 2. Check if the sessionToken cookie is still valid
  const session =
    sessionTokenCookie &&
    (await getValidSessionToken(sessionTokenCookie.value));

  // 3. If the sessionToken cookie is valid, redirect to home
  if (session) {
    redirect(getSafeReturnToPath(returnTo) || '/my-globe');
  }

  // Show form if session does not exist or is invalid
  return (
    <div className="flex h-[calc(100vh-5rem)] min-h-[300px] flex-grow flex-col items-center justify-evenly overflow-y-auto overflow-x-hidden px-8">
      <RegisterLogIn isLogIn={true} returnTo={returnTo}/>
    </div>
  );
}