import Globe from 'react-globe.gl';

const GlobeWrapper = ({ forwardRef, ...otherProps }: any) => (
  <Globe {...otherProps} ref={forwardRef} />
);

export default GlobeWrapper;
