/* eslint-disable react/no-unknown-property */

'use client';

import {
  Html,
  Line,
  OrbitControls,
  Shadow,
  useTexture,
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { ConicPolygonGeometry } from 'three-conic-polygon-geometry';
import { GeoJsonGeometry } from 'three-geojson-geometry';
import { v4 as uuid } from 'uuid';

export default function Earth({
  countryData,
  showCoordinateSystem = true,
  axisStart = 0,
  axisEnd = 4,
  axisColorX = 'red',
  axisColorY = 'blue',
  axisColorZ = 'green',
  sphereRadius = 2,
  sphereResolution = 500,
  borderLineRadius = 2.025,
  borderLineColor = 'black',
  countryPolygonRadiusMin = 2,
  countryPolygonRadiusMax = 2.02,
  countryPolygonOpacity = 0.75,
  countryPolygonColor = '#f0d897',
  countryElevatedColor = 'red',
  countryElevatedRadius = 2.1,
  orbitControlsMaxDist = 8,
  orbitControlsMinDist = 2.5,
  texturePath = './textures/texture_earth_map_10k.jpg',
  renderCountryPolygons = true,
  renderCountryBorders = true,
}) {
  const ref = useRef();
  const earthTexture = useTexture(texturePath);

  const [selectedCountry, setSelectedCountry] = useState('');

  // console.log(countryData);
  // const france = countryData.features[55];
  // console.log(france);

  useFrame((state, delta, frame) => {
    // console.log(delta);
    ref.current.rotation.y += delta * 0.05;
    // ref.current.position.z = Math.sin(state.clock.elapsedTime * 4);
  });

  return (
    <mesh position={[0, 0, 0]} ref={ref}>
      {/* Coordinate system */}
      {showCoordinateSystem && (
        <mesh>
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
        </mesh>
      )}

      {/* Globe sphere */}
      <mesh
        rotation={[0, -Math.PI / 2, 0]}
        onDoubleClick={(event) => {
          event.stopPropagation();
          setSelectedCountry('');
        }}
      >
        <sphereGeometry
          args={[sphereRadius, sphereResolution, sphereResolution]}
        >
          <Shadow
            color="blue"
            colorStop={1}
            opacity={0.5}
            fog={false} // Reacts to fog (default=false)
          />
        </sphereGeometry>
        <meshStandardMaterial map={earthTexture} />
      </mesh>

      {/* Country polygons */}
      {renderCountryPolygons &&
        countryData.features.map(({ geometry, properties }) => {
          const radiusMax =
            selectedCountry === properties.NAME
              ? countryElevatedRadius
              : countryPolygonRadiusMax;
          const countryColor =
            selectedCountry === properties.NAME
              ? countryElevatedColor
              : countryPolygonColor;
          if (geometry.type === 'Polygon') {
            return (
              <mesh
                key={`country-${properties.NAME}`}
                geometry={
                  new ConicPolygonGeometry(
                    geometry.coordinates,
                    countryPolygonRadiusMin,
                    radiusMax,
                  )
                }
                onDoubleClick={(event) => {
                  event.stopPropagation();
                  setSelectedCountry(properties.NAME);
                  console.log(event, properties.NAME);
                }}
              >
                <meshBasicMaterial
                  color={countryColor}
                  transparent="true"
                  opacity={countryPolygonOpacity}
                />
                <Html>{properties.NAME}</Html>
              </mesh>
            );
          } else if (geometry.type === 'MultiPolygon') {
            return (
              <mesh key={`country-${properties.NAME}`}>
                {geometry.coordinates.map((coordinate) => {
                  return (
                    <mesh
                      key={`country-multi-polygon-${properties.NAME}-${uuid()}`}
                      geometry={
                        new ConicPolygonGeometry(
                          coordinate,
                          countryPolygonRadiusMin,
                          radiusMax,
                        )
                      }
                      onDoubleClick={(event) => {
                        event.stopPropagation();
                        setSelectedCountry(properties.NAME);
                        console.log(event, properties.NAME);
                      }}
                    >
                      <meshBasicMaterial
                        color={countryColor}
                        transparent="true"
                        opacity={countryPolygonOpacity}
                      />
                    </mesh>
                  );
                })}
              </mesh>
            );
          } else {
            return null;
          }
        })}

      {/* Country border */}
      {renderCountryBorders && (
        <mesh>
          {countryData.features.map(({ geometry, properties }) => {
            const lineRadius =
              selectedCountry === properties.NAME
                ? countryElevatedRadius
                : borderLineRadius;
            if (geometry.type === 'Polygon') {
              return (
                <line
                  key={`border-${properties.NAME}`}
                  geometry={new GeoJsonGeometry(geometry, lineRadius)}
                >
                  <lineBasicMaterial color={borderLineColor} />
                </line>
              );
            } else if (geometry.type === 'MultiPolygon') {
              return (
                <lineSegments
                  key={`border-${properties.NAME}`}
                  geometry={new GeoJsonGeometry(geometry, lineRadius)}
                >
                  <lineBasicMaterial color={borderLineColor} />
                </lineSegments>
              );
            } else {
              return null;
            }
          })}
        </mesh>
      )}
      <OrbitControls
        minDistance={orbitControlsMinDist}
        maxDistance={orbitControlsMaxDist}
      />
    </mesh>
  );
}
