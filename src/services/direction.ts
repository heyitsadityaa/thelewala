// Fetching direction
import {MAPBOX_ACCESSSTOKEN} from '@env';

const BASE_URL = 'https://api.mapbox.com/directions/v5/mapbox';

export async function getDirection(from: any, to: any) {
  const response = await fetch(
    `${BASE_URL}/walking/${from[0]},${from[1]};${to[0]},${to[1]}?alternatives=false&annotations=distance%2Cduration&continue_straight=true&geometries=geojson&overview=full&steps=false&access_token=${MAPBOX_ACCESSSTOKEN}`,
  );
  const json = await response.json();
  return json;
}
