import Image from 'next/image';
import { getCountries } from '../util/localdata';
import RegisterLogIn from './components/RegisterLogIn';
import Space from './components/Space';

export default async function Home() {
  const countryData = await getCountries();

  return (
    <div className="flex h-full w-full">
      <div className="h-[calc(100vh-5rem)] min-h-[300px] w-9/12 bg-[#0f0f0f]">
        <Space earthProps={{ countryData: countryData }} />
      </div>
      <div className="flex h-[calc(100vh-5rem)] min-h-[300px] flex-grow flex-col items-center justify-evenly overflow-y-auto overflow-x-hidden px-8">
        <div className="flex flex-col items-center text-center">
          <h3>welcome to</h3>
          <div className="my-8">
            <Image
              className="mb-2 ml-6"
              src="/images/logo-terra-scratch-4.png"
              alt="logo"
              width={140}
              height={140}
            />
            <h1>Terra Scratch</h1>
          </div>
          <h4>your digital 3D scratch map</h4>
        </div>

        <div className="card my-8 w-full min-w-32 bg-neutral text-neutral-content">
          <div className="card-body items-center text-center">
            <h2 className="card-title">join the community</h2>
            <p>create your account for free</p>
            <div className="card-actions mt-8 w-full justify-end">
              <button className="btn btn-primary w-full">register</button>
            </div>
            <div className="text-sm">
              already have an accout?
              <button className="btn btn-link">log in</button>
            </div>
          </div>
        </div>

        <RegisterLogIn />
        <RegisterLogIn isLogIn={true} />
      </div>
    </div>
  );
}
