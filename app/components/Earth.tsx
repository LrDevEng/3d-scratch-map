'use client';

// To fix drei import errors it may be necessary to convert back to version 9.96.4
import { Bvh, Line, OrbitControls, Text, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { FeatureCollection } from 'geojson';
import { useEffect, useRef } from 'react';
import { Mesh, MeshBasicMaterial } from 'three';
import { ConicPolygonGeometry } from 'three-conic-polygon-geometry';
import { GeoJsonGeometry } from 'three-geojson-geometry';
import { v4 as uuid } from 'uuid';
import { useSelectedCountry } from '../stores/useCountry';

export type Props = {
  countryData: FeatureCollection;
  showCoordinateSystem?: boolean;
  axisStart?: number;
  axisEnd?: number;
  axisColorX?: string;
  axisColorY?: string;
  axisColorZ?: string;
  sphereRadius?: number;
  sphereResolution?: number;
  borderLineRadius?: number;
  borderLineColor?: string;
  countryPolygonRadiusMin?: number;
  countryPolygonRadiusMax?: number;
  countryPolygonOpacity?: number;
  countryPolygonColor?: string;
  countryHoveredColor?: string;
  countryElevatedColor?: string;
  countryElevatedRadius?: number;
  orbitControlsMaxDist?: number;
  orbitControlsMinDist?: number;
  orbitControlsAutoRotate?: boolean;
  orbitControlsEnableZoom?: boolean;
  orbitControlsEnableRotate?: boolean;
  texture?: string;
  renderCountryPolygons?: boolean;
  renderCountryBorders?: boolean;
  rotateSelf?: boolean;
  showCountryText?: boolean;
  enableCountryInteraction?: boolean;
  onMounted?: () => void;
};

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
  countryHoveredColor = '#00ff00',
  countryElevatedColor = '#ff0000',
  countryElevatedRadius = 2.1,
  orbitControlsMaxDist = 20,
  orbitControlsMinDist = 2.5,
  orbitControlsAutoRotate = false,
  orbitControlsEnableZoom = false,
  orbitControlsEnableRotate = false,
  texture = './textures/texture_earth_map_10k.jpg',
  renderCountryPolygons = true,
  renderCountryBorders = true,
  rotateSelf = true,
  showCountryText = false,
  enableCountryInteraction = false,
  onMounted = () => {
    console.log('Earth mounted.');
  },
}: Props) {
  const refGlobe = useRef<Mesh>();
  const refText = useRef<Mesh>();
  const refCountries = useRef<Mesh[]>([]);
  const earthTexture = useTexture(texture);

  // State
  const selectedCountry = useSelectedCountry((state) => state.country);
  const updateSelectedCountry = useSelectedCountry((state) => state.update);

  // Country materials
  const countryMaterialHovered = new MeshBasicMaterial({
    color: countryHoveredColor,
    transparent: true,
    opacity: countryPolygonOpacity,
  });
  const countryMaterialNotHovered = new MeshBasicMaterial({
    color: countryPolygonColor,
    transparent: true,
    opacity: countryPolygonOpacity,
  });
  const countryMaterialSelected = new MeshBasicMaterial({
    color: countryElevatedColor,
    transparent: true,
    opacity: countryPolygonOpacity,
  });

  useFrame((state, delta) => {
    if (refGlobe.current && rotateSelf) {
      refGlobe.current.rotation.y += delta * 0.02;
    }
    if (refText.current) {
      refText.current.lookAt(state.camera.position);
    }
  });

  useEffect(() => {
    onMounted();
    if (refGlobe.current) refGlobe.current.visible = true;
  }, [onMounted]);

  function updateText(text: string) {
    if (refText.current) {
      // @ts-expect-error
      refText.current.text = text;
    }
  }

  return (
    <mesh position={[0, 0, 0]} ref={refGlobe} visible={false}>
      {/* Text 2D */}
      {showCountryText && (
        <Text ref={refText} position={[0, 2.5, 0]} fontSize={0.5}>
          {' '}
        </Text>
      )}

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
            updateSelectedCountry('');
          }}
          onPointerMissed={() => {
            updateSelectedCountry('');
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
          const countryName = properties ? properties.NAME : '';
          const isSelected = selectedCountry === countryName;
          const radiusMax = isSelected
            ? countryElevatedRadius
            : countryPolygonRadiusMax;
          const baseMaterial = isSelected
            ? countryMaterialSelected
            : countryMaterialNotHovered;
          if (geometry.type === 'Polygon') {
            return (
              <mesh
                key={`country-${countryName}`}
                geometry={
                  new ConicPolygonGeometry(
                    geometry.coordinates,
                    countryPolygonRadiusMin,
                    radiusMax,
                  )
                }
                material={baseMaterial}
                ref={(currentRef) => {
                  if (currentRef) refCountries.current[index] = currentRef;
                }}
                onDoubleClick={(event) => {
                  event.stopPropagation();
                  if (enableCountryInteraction) {
                    updateSelectedCountry(countryName);
                  }
                }}
                onPointerEnter={(event) => {
                  event.stopPropagation();
                  if (
                    refCountries.current[index] &&
                    !isSelected &&
                    enableCountryInteraction
                  ) {
                    refCountries.current[index].material =
                      countryMaterialHovered;
                  }

                  // Text 2D
                  updateText(countryName);
                }}
                onPointerLeave={(event) => {
                  event.stopPropagation();
                  if (refCountries.current[index] && enableCountryInteraction) {
                    refCountries.current[index].material = baseMaterial;
                  }

                  // Text 2D
                  updateText('');
                }}
              />
            );
          } else if (geometry.type === 'MultiPolygon') {
            return (
              <mesh
                key={`country-${countryName}`}
                ref={(currentRef) => {
                  if (currentRef) refCountries.current[index] = currentRef;
                }}
                onPointerEnter={(event) => {
                  event.stopPropagation();
                  if (
                    refCountries.current[index] &&
                    !isSelected &&
                    enableCountryInteraction
                  ) {
                    refCountries.current[index].children.forEach((child) => {
                      if (child instanceof Mesh) {
                        child.material = countryMaterialHovered;
                      }
                    });
                  }
                  // Text 2D
                  updateText(countryName);
                }}
                onPointerLeave={(event) => {
                  event.stopPropagation();
                  if (refCountries.current[index] && enableCountryInteraction) {
                    refCountries.current[index].children.forEach((child) => {
                      if (child instanceof Mesh) {
                        child.material = baseMaterial;
                      }
                    });
                  }
                  // Text 2D
                  updateText('');
                }}
              >
                {geometry.coordinates.map((coordinate) => {
                  return (
                    <mesh
                      key={`country-multi-polygon-${countryName}-${uuid()}`}
                      geometry={
                        new ConicPolygonGeometry(
                          coordinate,
                          countryPolygonRadiusMin,
                          radiusMax,
                        )
                      }
                      material={baseMaterial}
                      onDoubleClick={(event) => {
                        event.stopPropagation();
                        if (enableCountryInteraction) {
                          updateSelectedCountry(countryName);
                        }
                      }}
                    />
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
            const countryName = properties ? properties.NAME : '';
            const lineRadius =
              selectedCountry === countryName
                ? countryElevatedRadius
                : borderLineRadius;
            if (
              geometry.type === 'Polygon' ||
              geometry.type === 'MultiPolygon'
            ) {
              return (
                <lineSegments
                  key={`border-${countryName}`}
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
        autoRotate={orbitControlsAutoRotate}
        enableZoom={orbitControlsEnableZoom}
        enableRotate={orbitControlsEnableRotate}
        autoRotateSpeed={0.1}
        enablePan={false}
        zoomSpeed={0.6}
        maxPolarAngle={Math.PI * 0.9}
        minPolarAngle={Math.PI * 0.1}
        minDistance={orbitControlsMinDist}
        maxDistance={orbitControlsMaxDist}
      />
    </mesh>
  );
}
