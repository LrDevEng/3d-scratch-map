import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUser } from '../database/users';

export async function checkAuthentication(returnTo: string | undefined) {
  // 1. Check if the sessionToken cookie exists
  const sessionTokenCookie = (await cookies()).get('sessionToken');

  // 2. Query the current user with the sessionToken
  const user = sessionTokenCookie && (await getUser(sessionTokenCookie.value));

  // 3. If user doesn't exist, redirect to login page
  const redirectionPath = returnTo ? `/log-in?returnTo=${returnTo}` : '/log-in';
  if (!user) {
    redirect(redirectionPath);
  }

  return { user, sessionTokenCookie };
}
