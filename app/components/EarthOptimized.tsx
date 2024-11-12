'use client';

import { Bvh, Line, OrbitControls, Text, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { FeatureCollection } from 'geojson';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { Mesh, MeshBasicMaterial } from 'three';
import { ConicPolygonGeometry } from 'three-conic-polygon-geometry';
import { GeoJsonGeometry } from 'three-geojson-geometry';
import { v4 as uuid } from 'uuid';
import { useEarthRef } from '../stores/useEarth';

export type Props = {
  countryData: FeatureCollection;
  visitedCountries?: Set<string>;
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
  countryPolygonOpacityVisited?: number;
  countryPolygonColor?: string;
  countryHoveredColor?: string;
  countryElevatedColor?: string;
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
  baseUrl?: string;
  onMounted?: () => void;
};

// Country materials
// const countryMaterialHovered = new MeshBasicMaterial({
//   color: '#00ff00',
//   transparent: true,
//   opacity: 0.75,
// });
// const countryMaterialNotHovered = new MeshBasicMaterial({
//   color: '#f0d897',
//   transparent: true,
//   opacity: 0.75,
// });
// const countryMaterialNotHoveredVisited = new MeshBasicMaterial({
//   color: '#f0d897',
//   transparent: true,
//   opacity: 0.01,
// });
// const countryMaterialSelected = new MeshBasicMaterial({
//   color: '#ff0000',
//   transparent: true,
//   opacity: 0.75,
// });

export default function Earth({
  countryData,
  visitedCountries = new Set<string>(),
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
  countryPolygonOpacityVisited = 0.01,
  countryPolygonColor = '#f0d897',
  countryHoveredColor = '#00ff00',
  countryElevatedColor = '#ff0000',
  orbitControlsMaxDist = 20,
  orbitControlsMinDist = 2.5,
  orbitControlsAutoRotate = false,
  orbitControlsEnableZoom = false,
  orbitControlsEnableRotate = false,
  texture = '/textures/texture_earth_map_10k.jpg',
  renderCountryPolygons = true,
  renderCountryBorders = true,
  rotateSelf = true,
  showCountryText = false,
  enableCountryInteraction = false,
  baseUrl = '/my-globe',
  onMounted = () => {
    console.log('Earth mounted.');
  },
}: Props) {
  // Router
  const router = useRouter();

  // References
  const refGlobe = useRef<Mesh>(null);
  const refText = useRef<Mesh>();
  const refCountries = useRef<Mesh[]>([]);

  // References from state
  const refEarth = useEarthRef((state) => state.earthRef);
  const updateEarthRef = useEarthRef((state) => state.update);

  useEffect(() => {
    if (!refEarth && refGlobe.current) {
      updateEarthRef(refGlobe);
    }
  }, [refEarth, updateEarthRef]);

  // Url state
  const params = useParams();
  const paramsCountry = params.country || '';
  const selectedCountryAdm0A3 = Array.isArray(paramsCountry)
    ? paramsCountry[0]?.toUpperCase()
    : paramsCountry.toUpperCase();
  const selectedRef = refCountries.current.find(
    (refCountry) => refCountry.name === selectedCountryAdm0A3,
  );
  const updateUrl = (newCountryAdm0A3: string) => {
    if (newCountryAdm0A3.length === 3) {
      router.push(`/my-globe/${newCountryAdm0A3.toLowerCase()}`);
    } else {
      router.push('/my-globe');
    }
  };

  // Derived state
  // if (selectedCountryAdm0A3) rotateSelf = false;

  // Texture
  const earthTexture = useTexture(texture);

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
  const countryMaterialNotHoveredVisited = new MeshBasicMaterial({
    color: countryPolygonColor,
    transparent: true,
    opacity: countryPolygonOpacityVisited,
  });
  const countryMaterialSelected = new MeshBasicMaterial({
    color: countryElevatedColor,
    transparent: true,
    opacity: countryPolygonOpacity,
  });

  // Process country data and memorize for future re-renders
  const countriesProcessed = useMemo(
    () =>
      countryData.features.map(({ geometry, properties }) => {
        if (geometry.type === 'Polygon') {
          return {
            type: 'Polygon',
            countryName: properties ? properties.NAME : '',
            isoA2: properties ? properties.ISO_A2 : '',
            adm0A3: properties ? properties.ADM0_A3 : undefined,
            conicPolygon: new ConicPolygonGeometry(
              geometry.coordinates,
              countryPolygonRadiusMin,
              countryPolygonRadiusMax,
            ),
            line: new GeoJsonGeometry(geometry, borderLineRadius),
          };
        } else if (geometry.type === 'MultiPolygon') {
          const conicPolygons = geometry.coordinates.map(
            (coordinate) =>
              new ConicPolygonGeometry(
                coordinate,
                countryPolygonRadiusMin,
                countryPolygonRadiusMax,
              ),
          );

          return {
            type: 'MultiPolygon',
            countryName: properties ? properties.NAME : '',
            adm0A3: properties ? properties.ADM0_A3 : undefined,
            isoA2: properties ? properties.ISO_A2 : '',
            conicPolygons: conicPolygons,
            line: new GeoJsonGeometry(geometry, borderLineRadius),
          };
        } else {
          return undefined;
        }
      }),
    [
      countryData,
      borderLineRadius,
      countryPolygonRadiusMin,
      countryPolygonRadiusMax,
    ],
  );

  // Render loop
  useFrame((state, delta) => {
    if (refGlobe.current && rotateSelf) {
      refGlobe.current.rotation.y += delta * 0.02;
    }
    if (refEarth?.current && rotateSelf) {
      refEarth.current.rotation.y += delta * 0.02;
    }
    if (refText.current) {
      refText.current.lookAt(state.camera.position);
    }
    if (selectedRef) {
      if (
        selectedRef.children.length === 0 &&
        selectedRef.material !== countryMaterialSelected
      ) {
        selectedRef.material = countryMaterialSelected;
      } else if (selectedRef.children.length > 0) {
        selectedRef.children.forEach((child) => {
          if (
            child instanceof Mesh &&
            child.material !== countryMaterialSelected
          ) {
            child.material = countryMaterialSelected;
          }
        });
      }
    }
    // console.log(delta);
  });

  // On mounted event
  useEffect(() => {
    onMounted();
    if (refGlobe.current) refGlobe.current.visible = true;
    if (refEarth?.current) refEarth.current.visible = true;
  }, [onMounted, refEarth]);

  function updateText(text: string) {
    if (refText.current) {
      // @ts-expect-error
      refText.current.text = text;
    }
  }

  return (
    <mesh position={[0, 0, 0]} ref={refEarth || refGlobe} visible={false}>
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
          }}
          onPointerMissed={() => {
            if (enableCountryInteraction) {
              updateUrl('');
            }
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
        countriesProcessed.map((country, index) => {
          if (country) {
            const isSelected = selectedCountryAdm0A3 === country.adm0A3;
            const hasVisit = visitedCountries.has(country.adm0A3);
            const baseMaterial = hasVisit
              ? countryMaterialNotHoveredVisited
              : countryMaterialNotHovered;

            if (country.type === 'Polygon') {
              return (
                <mesh
                  key={`country-${country.adm0A3}`}
                  name={country.adm0A3}
                  geometry={country.conicPolygon}
                  material={baseMaterial}
                  ref={(currentRef) => {
                    if (currentRef) refCountries.current[index] = currentRef;
                  }}
                  onDoubleClick={(event) => {
                    event.stopPropagation();
                    if (enableCountryInteraction) {
                      updateUrl(country.adm0A3);
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
                    updateText(country.countryName);
                  }}
                  onPointerLeave={(event) => {
                    event.stopPropagation();
                    if (
                      refCountries.current[index] &&
                      enableCountryInteraction
                    ) {
                      refCountries.current[index].material = baseMaterial;
                    }

                    // Text 2D
                    updateText('');
                  }}
                />
              );
            } else if (country.type === 'MultiPolygon') {
              return (
                <mesh
                  key={`country-${country.adm0A3}`}
                  name={country.adm0A3}
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
                    updateText(country.countryName);
                  }}
                  onPointerLeave={(event) => {
                    event.stopPropagation();
                    if (
                      refCountries.current[index] &&
                      enableCountryInteraction
                    ) {
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
                  {country.conicPolygons &&
                    country.conicPolygons.map((conicPolygon) => {
                      return (
                        <mesh
                          key={`country-multi-polygon-${country.adm0A3}-${uuid()}`}
                          geometry={conicPolygon}
                          material={baseMaterial}
                          onDoubleClick={(event) => {
                            event.stopPropagation();
                            if (enableCountryInteraction) {
                              updateUrl(country.adm0A3);
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
          } else {
            return null;
          }
        })}

      {/* Country border */}
      {renderCountryBorders && (
        <mesh>
          {countriesProcessed.map((country) => {
            if (
              country &&
              (country.type === 'Polygon' || country.type === 'MultiPolygon')
            ) {
              return (
                <lineSegments
                  key={`border-${country.countryName}`}
                  geometry={country.line}
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
