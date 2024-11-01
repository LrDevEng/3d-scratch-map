'use client';

import { Sparkles, Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import { Mesh } from 'three';

type Props = {
  starRadius: number;
  rotate?: boolean;
};

export default function Starfield({ starRadius, rotate = true }: Props) {
  const ref = useRef<Mesh>();

  useFrame((state, delta) => {
    if (ref.current && rotate) {
      ref.current.rotation.y += delta * 0.005;
    }
  });

  return (
    <mesh>
      <mesh ref={ref}>
        <Stars
          radius={starRadius}
          depth={50}
          count={3000}
          factor={1}
          saturation={0}
          fade={false}
          speed={0.2}
        />
      </mesh>
      <Sparkles
        count={50}
        size={3}
        speed={0.01}
        opacity={0.7}
        scale={starRadius}
        color="#fff3b0"
      />
    </mesh>
  );
}
