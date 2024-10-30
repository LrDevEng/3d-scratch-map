'use client';

import {
  AdaptiveDpr,
  AdaptiveEvents,
  Html,
  Preload,
  Sparkles,
  Stars,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import type { FeatureCollection } from 'geojson';
import dynamic from 'next/dynamic';
import { type FunctionComponent, Suspense } from 'react';
import { type Props as EarthProps } from './Earth';
import HeroText from './HeroText';

const Earth = dynamic(() => import('./Earth'), {
  ssr: false,
}) as FunctionComponent<EarthProps>;

type Props = {
  countryData: FeatureCollection;
};

export default function Space({ countryData }: Props) {
  const starRadius = 15;

  return (
    <Canvas>
      <Suspense
        fallback={
          <Html>
            <h1>Loading ...</h1>
          </Html>
        }
      >
        <AdaptiveEvents />
        <AdaptiveDpr pixelated />
        <ambientLight intensity={3} />
        <Preload all />
        <HeroText
          text="Terra Scratch"
          position={[-2.25, 0.5, 2.5]}
          fontSize={0.5}
        />
        <HeroText
          text="start your journey today"
          position={[-2, -0.6, 2.5]}
          fontSize={0.25}
        />
        <Suspense
          fallback={
            <Html>
              <h1>...</h1>
            </Html>
          }
        >
          <Earth
            countryData={countryData}
            orbitControlsMaxDist={starRadius}
            rotate={true}
          />
        </Suspense>
        <Stars
          radius={starRadius}
          depth={50}
          count={3000}
          factor={1}
          saturation={0}
          fade={false}
          speed={0.2}
        />
        <Sparkles
          count={50}
          size={3}
          speed={0.1}
          opacity={0.7}
          scale={starRadius}
          color="#fff3b0"
        />
      </Suspense>
    </Canvas>
  );
}
