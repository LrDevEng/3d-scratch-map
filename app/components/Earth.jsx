'use client';

// To fix drei import errors it may be necessary to convert back to version 9.96.4
import {
  Decal,
  Html,
  Line,
  OrbitControls,
  PerspectiveCamera,
  RenderTexture,
  Text,
  Text3D,
  useTexture,
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Color } from 'three';
import { ConicPolygonGeometry } from 'three-conic-polygon-geometry';
import { GeoJsonGeometry } from 'three-geojson-geometry';
import { v4 as uuid } from 'uuid';
import TextTexture from './TextTexture';

export default function Earth({
  countryData,
  showCoordinateSystem = false,
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
  rotate = false,
  onMounted = () => {
    console.log('Earth mounted.');
  },
}) {
  const refGlobe = useRef();
  const refH1 = useRef();
  const refHtml = useRef();
  const refText = useRef();
  const refCountries = useRef([]);
  const earthTexture = useTexture(texture);
  const [selectedCountry, setSelectedCountry] = useState('');

  const [hoveredCountry, setHoveredCountry] = useState('');

  useFrame((state, delta, frame) => {
    if (rotate) refGlobe.current.rotation.y += delta * 0.05;
  });

  useEffect(() => {
    onMounted();
  }, [onMounted]);

  return (
    <mesh position={[0, 0, 0]} ref={refGlobe}>
      {/* <Text position={[2, 2, 2]} ref={refText}>
        {hoveredCountry}
      </Text>
      <Html name="html" ref={refHtml}>
        <h1 ref={refH1}>Hello</h1>
      </Html> */}
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
        onPointerMissed={() => {
          setSelectedCountry('');
        }}
      >
        <sphereGeometry
          args={[sphereRadius, sphereResolution, sphereResolution]}
        />
        <meshStandardMaterial map={earthTexture} />
      </mesh>

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
                  // console.log(refText.current.__r3f.props.text);
                  // setHoveredCountry(properties.NAME);
                  // refText.current.__r3f.props.text = properties.NAME;
                  // refHtml.current = (
                  //   <div style={{ position: 'absolute', transform: 'none' }}>
                  //     <h1>{properties.NAME}</h1>
                  //   </div>
                  // );
                }}
                onPointerLeave={(event) => {
                  event.stopPropagation();
                  refCountries.current[index].material.color = new Color(
                    countryColor,
                  );
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
                }}
                onPointerLeave={(event) => {
                  event.stopPropagation();
                  refCountries.current[index].children.forEach((child) => {
                    child.material.color = new Color(countryColor);
                  });
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
