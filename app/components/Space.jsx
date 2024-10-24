'use client';

import { Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Earth = dynamic(() => import('./Earth'), {
  ssr: false,
});

export default function Space({ countryData }) {
  return (
    <Canvas>
      <Suspense>
        <ambientLight intensity={3} />
        <Earth countryData={countryData} />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
