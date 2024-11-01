import Image from 'next/image';
import CreateAccount from './CreateAccount';

export default function Home() {
  return (
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
      <CreateAccount />
    </div>
  );
}
