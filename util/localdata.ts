import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { FeatureCollection } from 'geojson';

let cache: FeatureCollection | undefined = undefined;

export async function getCountries(): Promise<FeatureCollection> {
  if (cache) return cache;

  const filePath = path.join(process.cwd(), 'data/world_countries.geojson');
  const countriesGeoJson = await fs.readFile(filePath, 'utf-8');
  cache = (await JSON.parse(countriesGeoJson)) as FeatureCollection;
  return cache;
}
