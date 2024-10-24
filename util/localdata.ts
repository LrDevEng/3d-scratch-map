import { promises as fs } from 'node:fs';
import path from 'node:path';

export async function getCountries(): Promise<any> {
  const filePath = path.join(process.cwd(), 'data/world_countries.geojson');
  const countriesGeoJson = await fs.readFile(filePath, 'utf-8');
  return await JSON.parse(countriesGeoJson);
}
