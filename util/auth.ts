import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getFollowingUser } from '../database/followers';
import { getUser } from '../database/users';
import type { User } from '../migrations/00000-createTableUsers';
import { type Session } from '../migrations/00001-createTableSessions';

export async function checkAuthorization(returnTo: string | undefined) {
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

export async function checkAuthentication(
  sessionToken: Session['token'],
  followingUserId: User['id'],
) {
  // 1. Check if following user has accepted a follower request from current user
  const followingUser = await getFollowingUser(sessionToken, followingUserId);

  return followingUser;
}
