'use client';

import { AdaptiveDpr, AdaptiveEvents, Html, Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import type { FeatureCollection } from 'geojson';
import dynamic from 'next/dynamic';
import { type FunctionComponent, Suspense } from 'react';
import { type Props as EarthProps } from './Earth';
import HeroText from './HeroText';
import Starfield from './Starfield';

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
          position={[-2.25, 0.9, 2.5]}
          fontSize={0.5}
        />
        <HeroText
          text="start your journey today"
          position={[-2, 0, 2.5]}
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
            rotateSelf={true}
          />
        </Suspense>
        <Starfield starRadius={starRadius} />
      </Suspense>
    </Canvas>
  );
}
