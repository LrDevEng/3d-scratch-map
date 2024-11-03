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
      <Link
        className="px-8 transition-all duration-500 hover:-translate-y-1 hover:underline"
        href="/"
      >
        <Image
          src="/images/logo-terra-scratch-4.png"
          alt="logo"
          width={60}
          height={60}
        />
      </Link>
      <div className="flex h-full items-center">
        {user && (
          <Link
            className="px-8 transition-all duration-500 hover:-translate-y-1 hover:underline"
            href="/"
          >
            friends
          </Link>
        )}
        <Link
          className="px-8 transition-all duration-500 hover:-translate-y-1 hover:underline"
          href="/my-globe"
        >
          about
        </Link>
        {user ? (
          <Link
            className="px-8 transition-all duration-500 hover:-translate-y-1 hover:underline"
            href={`/profile/${user.id}`}
          >
            profile
          </Link>
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
