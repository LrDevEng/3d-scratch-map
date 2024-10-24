'use client';

import { Line, OrbitControls, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { GeoJsonGeometry } from 'three-geojson-geometry';

export default function Earth({ countryData }) {
  const ref = useRef();
  const earthTexture = useTexture('./textures/texture_earth_map_10k.jpg');

  // useEffect(() => {
  //   fetch('../data/ne_110m_admin_0_countries.geojson')
  //     .then((res) => res.json())
  //     .then(setCountries)
  //     .catch((error) => console.log(error));
  // }, []);
  // const line = new THREE.Line(
  //   new GeoJsonGeometry(countryData),
  //   new THREE.LineBasicMaterial({ color: 'red' }),
  // );

  // const raycaster = new THREE.Raycaster();
  // const pointerPos = new THREE.Vector2();
  // const globeUV = new THREE.Vector2();

  // state.scene.add(line);

  console.log(countryData);

  useFrame((state, delta, frame) => {
    // console.log(countries);
    // ref.current.rotation.y += delta * 0.05;
    //ref.current.position.z = Math.sin(state.clock.elapsedTime * 4);
  });

  return (
    <mesh position={[0, 0, 0]} ref={ref}>
      <mesh
        onDoubleClick={(event) => {
          console.log(event.intersections[0]);
        }}
      >
        <sphereGeometry args={[2, 500, 500]} />
        <meshStandardMaterial map={earthTexture} />
        {/* <meshStandardMaterial color="black" /> */}
        <Line
          points={[
            [0, 0, 0],
            [5, 0, 0],
          ]}
          segments
          color="red"
        />
        <Line
          points={[
            [0, 0, 0],
            [0, 5, 0],
          ]}
          segments
          color="blue"
        />
        <Line
          points={[
            [0, 0, 0],
            [0, 0, 5],
          ]}
          segments
          color="green"
        />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        {countryData.features.map(({ geometry, properties }) => {
          return (
            <lineSegments
              key={`country-${properties.NAME}`}
              geometry={new GeoJsonGeometry(geometry, 2.005)}
            >
              <lineBasicMaterial color="black" />
            </lineSegments>
          );
        })}
      </mesh>
      <OrbitControls />
    </mesh>
  );
}
