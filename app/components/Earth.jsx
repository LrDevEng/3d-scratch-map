'use client';

import { Line, OrbitControls, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { ConicPolygonGeometry } from 'three-conic-polygon-geometry';
import { GeoJsonGeometry } from 'three-geojson-geometry';
import { v4 as uuid } from 'uuid';

export default function Earth({ countryData, showAxis = true }) {
  const sphereRadius = 2;
  const sphereResolution = 500;
  const borderLineRadius = 2.025;
  const borderLineColor = 'black';
  const countryPolygonRadiusMin = 2;
  const countryPolygonRadiusMax = 2.02;
  const countryPolygonColor = '#f0d897';
  const axisStart = 0;
  const axisEnd = 4;
  const axisColorX = 'red';
  const axisColorY = 'blue';
  const axisColorZ = 'green';
  const orbitControlsMinDist = 2.2;
  const orbitControlsMaxDist = 8;
  const ref = useRef();
  const earthTexture = useTexture('./textures/texture_earth_map_10k.jpg');

  console.log(countryData);
  const france = countryData.features[55];
  console.log(france);

  useFrame((state, delta, frame) => {
    // console.log(countries);
    ref.current.rotation.y += delta * 0.05;
    // ref.current.position.z = Math.sin(state.clock.elapsedTime * 4);
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
        {showAxis && (
          <>
            <Line
              points={[
                [axisStart, 0, 0],
                [axisEnd, 0, 0],
              ]}
              segments
              color={axisColorX}
            />
            <Line
              points={[
                [0, axisStart, 0],
                [0, axisEnd, 0],
              ]}
              segments
              color={axisColorY}
            />
            <Line
              points={[
                [0, 0, axisStart],
                [0, 0, axisEnd],
              ]}
              segments
              color={axisColorZ}
            />
          </>
        )}
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
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
                        color={countryPolygonColor}
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
            >
              <meshBasicMaterial
                color={countryPolygonColor}
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
      </mesh>
      <OrbitControls
        minDistance={orbitControlsMinDist}
        maxDistance={orbitControlsMaxDist}
      />
    </mesh>
  );
}
