'use client';

import dynamic from 'next/dynamic';
import { forwardRef, useEffect, useRef, useState } from 'react';

const MyGlobe = dynamic(() => import('./MyGlobe'), {
  ssr: false,
});
const Globe = forwardRef((props: any, ref) => (
  <MyGlobe {...props} forwardRef={ref} />
));

const World = () => {
  const globeRef = useRef();

  const [globeReady, setGlobeReady] = useState(false);

  const startTime = 1000;

  useEffect(() => {
    if (!globeRef.current) {
      return;
    }
    (globeRef.current as any).pointOfView(
      {
        lat: 39.609913,
        lng: -105.962477,
        altitude: 2.5,
      },
      startTime,
    );
    (globeRef.current as any).controls().enableZoom = false;
  }, [globeReady]);

  return (
    <>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        onGlobeReady={() => setGlobeReady(true)}
        height={500}
        animateIn={false}
        ref={globeRef}
      />
    </>
  );
};

export default World;
