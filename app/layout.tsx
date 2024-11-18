import './globals.css';
import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import NavBar from './components/NavBar';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    default: 'Home | Terra Scratch',
    template: '%s | Terra Scratch',
  },
  description:
    'Terra Scratch - Your digital 3D scratch map and travel diary app. Share your adventures and memories with your friends.',
};

const quicksand = Quicksand({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="forest" className="dark" lang="en">
      <body className={quicksand.className}>
        <div className="flex h-screen flex-col">
          <header>
            <NavBar />
          </header>
          <main className="flex-grow">{children}</main>
          <Toaster
            position="bottom-left"
            toastOptions={{
              // Define default options
              className: '',
              duration: 4000,
              style: {
                background: '#0f0f0f',
                color: '#fff',
              },
            }}
          />
        </div>
      </body>
    </html>
  );
}
