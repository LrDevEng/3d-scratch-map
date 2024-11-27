import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <div className="w-full bg-black px-8 py-4 border-t-2 border-[#424242] flex flex-col items-center">
      <div className="text-sm">Designed & Developed with 💚 by LrDevEng</div>

      <div className="w-fit">
        <div className="flex items-center mt-4 w-full justify-between">
          <div className="mr-4 text-sm">Get in touch:</div>
          <Link
            href="https://www.linkedin.com/in/lukas-richter-dev-eng/"
            target="_blank"
          >
            <Image
              src="/images/logo-linkedin.png"
              alt="logo LinkedIn"
              width={24}
              height={24}
            />
          </Link>
        </div>

        <div className="flex items-center mt-4 w-full justify-between">
          <div className="mr-4 text-sm">Follow my work:</div>
          <Link href="https://github.com/LrDevEng" target="_blank">
            <Image
              src="/images/logo-github.png"
              alt="logo GitHub"
              width={24}
              height={24}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
