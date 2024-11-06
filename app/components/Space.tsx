'use client';

import { AdaptiveDpr, AdaptiveEvents, Html, Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { type FunctionComponent, Suspense } from 'react';
import { type Props as EarthProps } from './EarthOptimized';
import HeroText from './HeroText';
import Starfield from './Starfield';

const Earth = dynamic(() => import('./EarthOptimized'), {
  ssr: false,
}) as FunctionComponent<EarthProps>;

export type Props = {
  earthProps: EarthProps;
  showHeroText?: boolean;
};

export default function Space({ earthProps, showHeroText = true }: Props) {
  const starRadius = 15;

  return (
    <Canvas className="cursor-pointer select-none">
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
        {showHeroText && (
          <HeroText
            text="Terra Scratch"
            position={[-2.25, 0.9, 2.5]}
            fontSize={0.5}
          />
        )}
        {showHeroText && (
          <HeroText
            text="start your journey today"
            position={[-2, 0, 2.5]}
            fontSize={0.25}
          />
        )}
        <Suspense
          fallback={
            <Html>
              <h1>Loading ...</h1>
            </Html>
          }
        >
          <Earth
            orbitControlsMaxDist={starRadius}
            rotateSelf={true}
            {...earthProps}
          />
        </Suspense>
        <Starfield starRadius={starRadius} />
      </Suspense>
    </Canvas>
  );
}
