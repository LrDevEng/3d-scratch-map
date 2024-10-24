'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useRef } from 'react';

const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
});

export default function GlobeDirect() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      containerRef.current.appenChild(Globe);
    }
  }, []);

  return <div ref={containerRef} />;
}
