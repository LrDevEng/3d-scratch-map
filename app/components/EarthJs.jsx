/* eslint-disable react/no-unknown-property */

'use client';

// To fix drei import errors it may be necessary to convert back to version 9.96.4
import {
  Bvh,
  Line,
  OrbitControls,
  Text,
  Text3D,
  useTexture,
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Color, Mesh } from 'three';
import { ConicPolygonGeometry } from 'three-conic-polygon-geometry';
import { GeoJsonGeometry } from 'three-geojson-geometry';
import { FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js';
import { v4 as uuid } from 'uuid';
import quicksand from '../../fonts/quicksand-semi-bold.json';

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
  orbitControlsMaxDist = 20,
  orbitControlsMinDist = 2.5,
  texture = './textures/texture_earth_map_10k.jpg',
  renderCountryPolygons = true,
  renderCountryBorders = true,
  rotate = true,
  onMounted = () => {
    console.log('Earth mounted.');
    console.log(countryData);
  },
}) {
  const refGlobe = useRef();
  const refText = useRef();
  // const refText3D = useRef();
  const refCountries = useRef([]);
  const earthTexture = useTexture(texture);
  const [selectedCountry, setSelectedCountry] = useState('');

  useFrame((state, delta) => {
    if (refGlobe.current && rotate) {
      refGlobe.current.rotation.y += delta * 0.05;
    }
    if (refText.current) {
      refText.current.lookAt(state.camera.position);
      // refText3D.current.lookAt(state.camera.position);
    }
  });

  useEffect(() => {
    onMounted();
  }, [onMounted]);

  return (
    <mesh position={[0, 0, 0]} ref={refGlobe}>
      {/* Text 2D */}
      <Text ref={refText} position={[0, 3, 0]} fontSize={0.5}>
        {' '}
      </Text>

      {/* Text 3D
      <Text3D ref={refText3D} position={[0, 3, 0]} font={quicksand}>
        Hello
      </Text3D> */}

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
      <Bvh firstHitOnly>
        <mesh
          rotation={[0, -Math.PI / 2, 0]}
          onDoubleClick={(event) => {
            event.stopPropagation();
            setSelectedCountry('');
          }}
          onPointerMissed={() => {
            setSelectedCountry('');
          }}
          onPointerEnter={(event) => {
            event.stopPropagation();
          }}
        >
          <sphereGeometry
            args={[sphereRadius, sphereResolution, sphereResolution]}
          />
          <meshStandardMaterial map={earthTexture} />
        </mesh>
      </Bvh>

      {/* Country polygons */}
      {renderCountryPolygons &&
        countryData.features.map(({ geometry, properties }, index) => {
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
                ref={(currentRef) => (refCountries.current[index] = currentRef)}
                onDoubleClick={(event) => {
                  event.stopPropagation();
                  setSelectedCountry(properties.NAME);
                }}
                onPointerEnter={(event) => {
                  event.stopPropagation();
                  refCountries.current[index].material.color.r = 0;
                  refCountries.current[index].material.color.g = 1;
                  refCountries.current[index].material.color.b = 0;

                  // Text 2D
                  refText.current.text = properties.NAME;

                  // Text 3D
                  // refText3D.current.geometry.dispose();
                  // refText3D.current.geometry = new TextGeometry(
                  //   properties.NAME,
                  //   {
                  //     font: new FontLoader().parse(quicksand),
                  //     size: 1,
                  //     depth: 0.5,
                  //   },
                  // );
                }}
                onPointerLeave={(event) => {
                  event.stopPropagation();
                  refCountries.current[index].material.color = new Color(
                    countryColor,
                  );

                  // Text 2D
                  refText.current.text = '';

                  // Text 3D
                  // refText3D.current.geometry.dispose();
                  // refText3D.current.geometry = new TextGeometry('', {
                  //   font: new FontLoader().parse(quicksand),
                  //   size: 1,
                  //   depth: 0.5,
                  // });
                }}
              >
                <meshBasicMaterial
                  attachArray="material"
                  color={countryColor}
                  transparent="true"
                  opacity={countryPolygonOpacity}
                />
              </mesh>
            );
          } else if (geometry.type === 'MultiPolygon') {
            return (
              <mesh
                key={`country-${properties.NAME}`}
                ref={(currentRef) => (refCountries.current[index] = currentRef)}
                onPointerEnter={(event) => {
                  event.stopPropagation();
                  refCountries.current[index].children.forEach((child) => {
                    child.material.color.r = 0;
                    child.material.color.g = 1;
                    child.material.color.b = 0;
                  });
                  // Text 2D
                  refText.current.text = properties.NAME;
                }}
                onPointerLeave={(event) => {
                  event.stopPropagation();
                  refCountries.current[index].children.forEach((child) => {
                    child.material.color = new Color(countryColor);
                  });
                  // Text 2D
                  refText.current.text = '';
                }}
              >
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
            if (
              geometry.type === 'Polygon' ||
              geometry.type === 'MultiPolygon'
            ) {
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
