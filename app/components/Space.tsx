'use client';

import {
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
  Preload,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { type FunctionComponent, Suspense, useEffect, useRef } from 'react';
import { useSpaceRef } from '../stores/useSpace';
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
  const spaceRef = useSpaceRef((state) => state.spaceRef);
  const updateSpaceRef = useSpaceRef((state) => state.update);
  const localSpaceRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!spaceRef && localSpaceRef.current) {
      updateSpaceRef(localSpaceRef);
    }
  }, [spaceRef, updateSpaceRef]);

  return (
    <Canvas
      ref={spaceRef || localSpaceRef}
      className="cursor-pointer select-none"
      gl={{ powerPreference: 'high-performance' }}
    >
      <PerformanceMonitor>
        <Suspense>
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
          <Suspense>
            <Earth
              orbitControlsMaxDist={starRadius}
              rotateSelf={true}
              {...earthProps}
            />
          </Suspense>
        </Suspense>
        <Starfield starRadius={starRadius} />
      </PerformanceMonitor>
    </Canvas>
  );
}
