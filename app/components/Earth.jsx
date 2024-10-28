'use client';

import { Line, OrbitControls, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { ConicPolygonGeometry } from 'three-conic-polygon-geometry';
import { GeoJsonGeometry } from 'three-geojson-geometry';

export default function Earth({ countryData }) {
  const sphereRadius = 2;
  const sphereResolution = 500;
  const borderLineRadius = 2.02;
  const borderLineColor = 'black';
  const countryPolygonRadiusMin = 2;
  const countryPolygonRadiusMax = 2.02;
  const countryPolygonColor = '#f0d897';
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
  const france = countryData.features[55];
  console.log(france);

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
        <sphereGeometry
          args={[sphereRadius, sphereResolution, sphereResolution]}
        />
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
        {/* <mesh
          geometry={
            new ConicPolygonGeometry(
              france.geometry.coordinates[0],
              1.995,
              2.005,
            )
          }
        >
          <meshBasicMaterial color="purple" />
        </mesh> */}

        {countryData.features.map(({ geometry, properties }) => {
          if (geometry.type === 'MultiPolygon') {
            return (
              <mesh key={`country-${properties.NAME}`}>
                {geometry.coordinates.map((coordinate, index) => {
                  return (
                    <mesh
                      key={`country-multi-polygon-${properties.NAME}-${index}`}
                      geometry={
                        new ConicPolygonGeometry(
                          coordinate,
                          countryPolygonRadiusMin,
                          countryPolygonRadiusMax,
                        )
                      }
                    >
                      <meshBasicMaterial color={countryPolygonColor} />
                    </mesh>
                  );
                })}
                <lineSegments
                  geometry={new GeoJsonGeometry(geometry, borderLineRadius)}
                >
                  <lineBasicMaterial color={borderLineColor} />
                </lineSegments>
              </mesh>
            );
          }

          return (
            <mesh
              key={`country-${properties.NAME}`}
              geometry={
                new ConicPolygonGeometry(
                  geometry.coordinates,
                  countryPolygonRadiusMin,
                  countryPolygonRadiusMax,
                )
              }
            >
              <meshBasicMaterial color={countryPolygonColor} />
              <lineSegments
                geometry={new GeoJsonGeometry(geometry, borderLineRadius)}
              >
                <lineBasicMaterial color={borderLineColor} />
              </lineSegments>
            </mesh>
          );
        })}
      </mesh>
      <OrbitControls />
    </mesh>
  );
}

//  <mesh
//             key={`country-${properties.NAME}`}
//             geometry={new ConicPolygonGeometry(geometry)}
//           >
//             <meshBasicMaterial color="blue" />
//           </mesh>
