/* eslint-disable react/no-unknown-property */

import { Decal, RenderTexture, Text } from '@react-three/drei';

export default function TextTexture({ text = 'Hello World' }) {
  try {
    return (
      <Decal
        debug // Makes "bounding box" of the decal visible
        roughness={1}
        position={[2, 0, 0]} // Position of the decal
        rotation={[0, Math.PI / 2, 0]} // Rotation of the decal (can be a vector or a degree in radians)
        scale={1} // Scale of the decal
      >
        <meshStandardMaterial
          transparent
          polygonOffset
          polygonOffsetFactor={-1} // The material should take precedence over the original
        >
          <RenderTexture attach="map" anisotropy={16}>
            <ambientLight intensity={Math.PI} />
            <directionalLight position={[10, 10, 5]} />
            <Text fontSize={0.5}>{text}</Text>
          </RenderTexture>
        </meshStandardMaterial>
      </Decal>
    );
  } catch (error) {
    console.log(error);
    return null;
  }
}
