import { useTexture } from '@react-three/drei';

export default function Moon() {
  // Texture
  const moonTexture = useTexture('/textures/texture_moon_8k.jpg');

  return (
    <mesh position={[12, 0, 2]}>
      <sphereGeometry args={[0.545, 50, 50]} />
      <meshStandardMaterial map={moonTexture} />
    </mesh>
  );
}
