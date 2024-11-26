import { cookies } from 'next/headers';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getUser } from '../../database/users';
import Footer from '../components/Footer';
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
    <div className="flex flex-col overflow-y-auto overflow-x-hidden h-[calc(100vh-5rem)] min-h-[300px] border-l-2 border-[#424242] bg-[url('/images/bg-image.jpg')] bg-contain">
      <div className="flex flex-grow flex-col items-center justify-evenly px-8 ">
        <div className="flex flex-col items-center text-center my-24">
          <h3 className="text-3xl">Welcome to</h3>
          <div className="my-8 flex flex-col items-center">
            <Image
              className="mb-2 ml-6"
              src="/images/logo-terra-scratch-4.png"
              alt="logo"
              width={140}
              height={140}
            />
            <h1 data-test-id="landing-page-title" className="text-5xl">
              Terra Scratch
            </h1>
          </div>
          <h4 className="text-xl">your digital 3D scratch map</h4>
        </div>
        <CreateAccount />

        <div className="mt-24 px-12 w-full flex flex-col items-center">
          <h2 className=" self-start">Create Memories.</h2>
          <h2>Write Journeys.</h2>
          <h2 className=" self-end">Capture Moments.</h2>
          <Image
            className="mb-2 ml-6 rounded-xl mt-8"
            src="/images/journey.png"
            alt="example journey"
            width={400}
            height={400}
          />
        </div>

        <div className="mt-24 px-12 w-full flex flex-col items-center">
          <h2 className=" self-start">Chase Dreams.</h2>
          <h2>Find Yourself.</h2>
          <h2 className=" self-end">Discover Freedom.</h2>
          <Image
            className="mb-2 ml-6 rounded-xl mt-8"
            src="/images/terra.jpg"
            alt="example map"
            width={400}
            height={400}
          />
        </div>

        <div className="mt-24 px-12 w-full flex flex-col items-center">
          <h2 className=" self-start">Share Your Adventures.</h2>
          <h2>Tell Your Story.</h2>
          <h2 className=" self-end">Follow Your Friends.</h2>
          <Image
            className="mb-2 ml-6 rounded-xl mt-8"
            src="/images/terra.jpg"
            alt="example followers"
            width={400}
            height={400}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
