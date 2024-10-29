'use client';

import {
  AdaptiveDpr,
  AdaptiveEvents,
  Bvh,
  Preload,
  Stars,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Earth = dynamic(() => import('./Earth'), {
  ssr: false,
});

export default function Space({ countryData }) {
  const starRadius = 15;

  return (
    <Canvas>
      <Suspense fallback={<div>Loading ...</div>}>
        <Bvh firstHitOnly>
          <AdaptiveEvents />
          <AdaptiveDpr pixelated />
          <ambientLight intensity={3} />
          <Earth countryData={countryData} orbitControlsMaxDist={starRadius} />
          <Stars
            radius={starRadius}
            depth={50}
            count={3000}
            factor={1}
            saturation={0}
            fade={false}
            speed={0.2}
          />
          <Preload all />
        </Bvh>
      </Suspense>
    </Canvas>
  );
}
