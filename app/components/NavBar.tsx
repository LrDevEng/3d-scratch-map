import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { getFollowerUsers } from '../../database/followers';
import { getUser } from '../../database/users';
import FollowerUpdates from '../followers/FollowerUpdates';

export default async function NavBar() {
  // 1. Checking if the sessionToken cookie exists
  const sessionTokenCookie = (await cookies()).get('sessionToken');

  // 2. Get the current logged in user from the database using the sessionToken value
  const user = sessionTokenCookie && (await getUser(sessionTokenCookie.value));

  let followerUsersPending = undefined;
  if (sessionTokenCookie) {
    // Follower users
    const followerUsers = await getFollowerUsers(sessionTokenCookie.value);
    // Follower users pending
    followerUsersPending = followerUsers.filter(
      (followerUser) => followerUser.status === 0,
    );
  }

  return (
    <nav className="flex h-20 w-screen items-center justify-between bg-black px-8 border-b-2 border-[#424242]">
      <Link
        className="w-fit"
        href={`/my-globe/${user?.id}`}
        data-test-id="nav-bar-home"
      >
        <Image
          className="h-auto w-fit"
          src="/images/logo-terra-scratch-4.png"
          alt="logo"
          height={60}
          width={60}
        />
      </Link>
      <div className="flex h-full items-center">
        {user && (
          <Link
            className="px-8 transition-all duration-500 hover:-translate-y-1 hover:underline"
            href={`/my-globe/${user.id}`}
            data-test-id="nav-bar-my-globe"
          >
            My Globe
          </Link>
        )}
        {user && <FollowerUpdates currentUserId={user.id} />}
        {user && (
          <Link
            className="relative px-8 transition-all duration-500 hover:-translate-y-1 hover:underline"
            href="/followers"
            data-test-id="nav-bar-followers"
          >
            Followers
            {followerUsersPending && followerUsersPending.length > 0 && (
              <div className="absolute right-0 top-0 flex h-7 w-7 items-center rounded-full bg-[#66b14e]">
                <div className="m-auto w-fit text-base">
                  {followerUsersPending.length}
                </div>
              </div>
            )}
          </Link>
        )}
        <Link
          className="px-8 transition-all duration-500 hover:-translate-y-1 hover:underline"
          href="/"
          data-test-id="nav-bar-about"
        >
          About
        </Link>
        {user ? (
          <div className="duration-250 relative h-[60px] w-[60px] rounded-full border-2 border-white transition-all hover:shadow-[0_0_10px_3px_rgba(255,255,255,0.5)]">
            <Link href="/profile" data-test-id="nav-bar-profile">
              <Image
                className="rounded-full object-contain"
                src={user.imageUrl ? user.imageUrl : '/icons/userIcon.svg'}
                alt="profile picture"
                height={60}
                width={60}
              />
            </Link>
          </div>
        ) : (
          <Link
            className="px-8 transition-all duration-500 hover:-translate-y-1 hover:underline"
            href="/log-in"
            data-test-id="nav-bar-login"
          >
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
}
