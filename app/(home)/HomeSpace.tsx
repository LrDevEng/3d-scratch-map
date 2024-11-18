'use client';
import type { FeatureCollection } from 'geojson';
import Space from '../components/Space';

type Props = {
  countryData: FeatureCollection;
};

// const Space = dynamic(() => import('../components/Space'), {
//   ssr: false,
// }) as FunctionComponent<SpaceProps>;

export default function HomeSpace({ countryData }: Props) {
  return (
    <div className="h-[calc(100vh-5rem)] min-h-[300px] w-9/12 bg-[#0f0f0f]">
      <Space earthProps={{ countryData: countryData }} />
    </div>
  );
}
