import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="px-8 h-20 w-screen flex justify-between items-center bg-black">
      <Link
        className="px-8 hover:underline hover:-translate-y-1 transition-all duration-500"
        href="/"
      >
        logo
      </Link>
      <div className="h-full flex items-center">
        <Link
          className="px-8 hover:underline hover:-translate-y-1 transition-all duration-500"
          href="/"
        >
          about
        </Link>
        <Link
          className="px-8 hover:underline hover:-translate-y-1 transition-all duration-500"
          href="/"
        >
          sign in
        </Link>
      </div>
    </nav>
  );
}
