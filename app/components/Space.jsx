/* eslint-disable react/no-unknown-property */

'use client';

import { Preload, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Earth = dynamic(() => import('./Earth'), {
  ssr: false,
});

export default function Space({ countryData }) {
  return (
    <Canvas>
      <Suspense fallback={<div>Loading ...</div>}>
        <ambientLight intensity={4} />
        <Earth countryData={countryData} />
        <Stars
          radius={20}
          depth={50}
          count={5000}
          factor={1}
          saturation={0}
          fade={false}
          speed={0.2}
        />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
