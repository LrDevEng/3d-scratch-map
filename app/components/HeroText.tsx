'use client';

import { Text3D, useMatcapTexture } from '@react-three/drei';
import type { Vector3 } from '@react-three/fiber';

type Props = {
  text: string;
  position: Vector3;
  fontSize?: number;
};

export default function HeroText({ text, position, fontSize = 0.7 }: Props) {
  const [matcapTexture] = useMatcapTexture('CB4E88_F99AD6_F384C3_ED75B9');

  return (
    <mesh position={position}>
      {/* <Text fontSize={fontSize} font="./fonts/quicksand-bold.ttf">
        {text}
        <meshBasicMaterial color="white" />
      </Text> */}
      <Text3D
        font="./fonts/quicksand-semi-bold.json"
        size={fontSize}
        scale={[1, 1, 0.3]}
      >
        {text}
        <meshMatcapMaterial color="white" matcap={matcapTexture} />
      </Text3D>
    </mesh>
  );
}
