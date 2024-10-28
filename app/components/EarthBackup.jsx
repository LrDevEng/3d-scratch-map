'use client';

import { OrbitControls, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { ConicPolygonGeometry } from 'three-conic-polygon-geometry';
import { GeoJsonGeometry } from 'three-geojson-geometry';
import { v4 as uuid } from 'uuid';

export default function Earth({ countryData }) {
  const sphereRadius = 2;
  const sphereResolution = 500;
  const borderLineRadius = 2.025;
  const borderLineColor = 'black';
  const countryPolygonRadiusMin = 2;
  const countryPolygonRadiusMax = 2.02;
  const countryPolygonColor = '#f0d897';
  const orbitControlsMinDist = 2.2;
  const orbitControlsMaxDist = 8;
  const ref = useRef();
  const earthTexture = useTexture('./textures/texture_earth_map_10k.jpg');

  console.log(countryData);
  const france = countryData.features[55];
  console.log(france);

  useFrame((state, delta, frame) => {
    // console.log(countries);
    // ref.current.rotation.y += delta * 0.05;
    // ref.current.position.z = Math.sin(state.clock.elapsedTime * 4);
  });

  return (
    <mesh position={[0, 0, 0]} ref={ref}>
      <mesh>
        <sphereGeometry
          args={[sphereRadius, sphereResolution, sphereResolution]}
        />
        <meshStandardMaterial map={earthTexture} />
        {/* <meshStandardMaterial color="black" /> */}
      </mesh>
      <group rotation={[0, Math.PI / 2, 0]}>
        {countryData.features.map(({ geometry, properties }) => {
          if (geometry.type === 'MultiPolygon') {
            return (
              <mesh key={`country-${properties.NAME}`}>
                {geometry.coordinates.map((coordinate, index) => {
                  return (
                    <mesh
                      key={`country-multi-polygon-${properties.NAME}-${uuid()}`}
                      geometry={
                        new ConicPolygonGeometry(
                          coordinate,
                          countryPolygonRadiusMin,
                          countryPolygonRadiusMax,
                        )
                      }
                    >
                      <meshBasicMaterial
                        color={
                          properties.NAME === 'France'
                            ? 'red'
                            : countryPolygonColor
                        }
                        transparent="true"
                        opacity={0.75}
                      />
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
              onDoubleClick={(event) => {
                event.stopPropagation();
                console.log(event, properties.NAME);
              }}
            >
              <meshBasicMaterial
                color={
                  properties.NAME === 'France' ? 'red' : countryPolygonColor
                }
                transparent="true"
                opacity={0.75}
              />
              <lineSegments
                geometry={new GeoJsonGeometry(geometry, borderLineRadius)}
              >
                <lineBasicMaterial color={borderLineColor} />
              </lineSegments>
            </mesh>
          );
        })}
      </group>
      <OrbitControls
        minDistance={orbitControlsMinDist}
        maxDistance={orbitControlsMaxDist}
      />
    </mesh>
  );
}
