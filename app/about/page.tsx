import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/Footer';

export const metadata = {
  title: 'About',
  description: 'Information about Terra Scratch.',
};

export default function About() {
  return (
    <div className="flex flex-col h-full">
      <div
        className="relative px-8 pt-24 flex flex-col items-center flex-grow"
        style={{
          backgroundImage: "url('/images/bg-image.jpg')",
          backgroundSize: '700px 700px',
          backgroundRepeat: 'repeat',
        }}
      >
        <h1 className="text-5xl">Terra Scratch</h1>
        <div className="text-xl mt-8">
          Designed & Developed with 💚 by LrDevEng
        </div>

        <div className="w-fit">
          <div className="flex items-center mt-4 w-full justify-between">
            <div className="mr-4 text-xl">Get in touch:</div>
            <Link
              href="https://www.linkedin.com/in/lukas-richter-dev-eng/"
              target="_blank"
            >
              <Image
                src="/images/logo-linkedin.png"
                alt="logo LinkedIn"
                width={36}
                height={36}
              />
            </Link>
          </div>

          <div className="flex items-center mt-4 w-full justify-between">
            <div className="mr-4 text-xl">Follow my work:</div>
            <Link href="https://github.com/LrDevEng" target="_blank">
              <Image
                src="/images/logo-github.png"
                alt="logo GitHub"
                width={36}
                height={36}
              />
            </Link>
          </div>
        </div>
        <div className="text-xl mt-8">
          Final project of the full stack web development bootcamp
        </div>
        <div className="text-xl">
          @
          <Link
            className="underline"
            href="https://upleveled.io/"
            target="_blank"
          >
            UpLeveled
          </Link>
        </div>
        <div className="text-xl mt-8">Disclaimer:</div>
        <div className="text-xl">
          This is not a real website. Sole purpose of this project is to
          showcase the development and setup of a full stack web application.
        </div>
        <div className="text-xs mt-auto mb-8">
          Background designed by
          <Link
            className="underline ml-1"
            href="https://www.freepik.com/"
            target="_blank"
          >
            Freepik
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
