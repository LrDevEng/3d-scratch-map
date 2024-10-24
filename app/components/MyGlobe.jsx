'use client';

import GlobeTmpl from 'react-globe.gl';

export default function MyGlobe({ forwardRef, ...otherProps }) {
  return <GlobeTmpl {...otherProps} ref={forwardRef} />;
}
