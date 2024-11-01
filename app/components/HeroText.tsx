'use client';

import { Text3D, useMatcapTexture } from '@react-three/drei';
import { type Vector3 } from '@react-three/fiber';

type Props = {
  text: string;
  position: Vector3;
  fontSize?: number;
};

export default function HeroText({ text, position, fontSize = 0.7 }: Props) {
  // https://github.com/emmelleppi/matcaps
  // 6D6050_C8C2B9_A2998E_B4AA9F with color #508418 or #5e9b1b
  // 46804D_CBE9AC_90B57C_95D38F with color #508418 or #5e9b1b or #64a71d
  // 4F4C45_A7AEAA_7A8575_9D97A2 with color #acd57f
  const [matcapTexture] = useMatcapTexture('46804D_CBE9AC_90B57C_95D38F');

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
        <meshMatcapMaterial color="#64a71d" matcap={matcapTexture} />
      </Text3D>
    </mesh>
  );
}
