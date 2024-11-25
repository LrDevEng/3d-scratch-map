import { cookies } from 'next/headers';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getUser } from '../../database/users';
import CreateAccount from './CreateAccount';

export default async function Home() {
  // 1. Check if the sessionToken cookie exists
  const sessionTokenCookie = (await cookies()).get('sessionToken');

  // 2. Query the current user with the sessionToken
  const user = sessionTokenCookie && (await getUser(sessionTokenCookie.value));

  // 3. Redirect user if already authenticate
  if (user) {
    redirect(`/my-globe/${user.id}`);
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] min-h-[300px] flex-grow flex-col items-center justify-evenly overflow-y-auto overflow-x-hidden px-8 bg-[url('/images/bg-image.jpg')] bg-contain border-l-2 border-[#424242]">
      <div className="flex flex-col items-center text-center">
        <h3>Welcome to</h3>
        <div className="my-8">
          <Image
            className="mb-2 ml-6"
            src="/images/logo-terra-scratch-4.png"
            alt="logo"
            width={140}
            height={140}
          />
          <h1 data-test-id="landing-page-title">Terra Scratch</h1>
        </div>
        <h4>your digital 3D scratch map</h4>
      </div>
      <CreateAccount />
    </div>
  );
}
