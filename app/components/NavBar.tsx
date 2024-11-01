import Image from 'next/image';
import Link from 'next/link';

export default function NavBar() {
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
        <Link
          className="px-8 transition-all duration-500 hover:-translate-y-1 hover:underline"
          href="/my-globe"
        >
          about
        </Link>
        <Link
          className="px-8 transition-all duration-500 hover:-translate-y-1 hover:underline"
          href="/"
        >
          sign in
        </Link>
      </div>
    </nav>
  );
}
