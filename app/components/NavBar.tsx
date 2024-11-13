import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { getUser } from '../../database/users';

export default async function NavBar() {
  // 1. Checking if the sessionToken cookie exists
  const sessionTokenCookie = (await cookies()).get('sessionToken');

  // 2. Get the current logged in user from the database using the sessionToken value
  const user = sessionTokenCookie && (await getUser(sessionTokenCookie.value));

  return (
    <nav className="flex h-20 w-screen items-center justify-between bg-black px-8">
      <Link className="w-fit" href={`/my-globe/${user?.id}`}>
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
          >
            my globe
          </Link>
        )}
        {user && (
          <Link
            className="px-8 transition-all duration-500 hover:-translate-y-1 hover:underline"
            href="/followers"
          >
            followers
          </Link>
        )}
        <Link
          className="px-8 transition-all duration-500 hover:-translate-y-1 hover:underline"
          href="/"
        >
          about
        </Link>
        {user ? (
          <div className="duration-250 relative h-[60px] w-[60px] rounded-full border-2 border-white transition-all hover:shadow-[0_0_10px_3px_rgba(255,255,255,0.5)]">
            <Link href="/profile">
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
          >
            log in
          </Link>
        )}
      </div>
    </nav>
  );
}
