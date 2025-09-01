import {MAPBOX_ACCESSSTOKEN} from '@env';

export const getLocationText = async (
  lng: number,
  lat: number,
): Promise<string> => {
  const accessToken = MAPBOX_ACCESSSTOKEN;
  const LOCATIONTEXT_URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`;

  try {
    const response = await fetch(LOCATIONTEXT_URL);
    const data = await response.json();

    if (data.features.length > 0) {
      const address = data.features[0].place_name;
      const splitAddress = address.split(' ');

      const displayAddress =
        splitAddress.length >= 5
          ? `${splitAddress[2] ?? ''} ${splitAddress[3] ?? ''} ${
              splitAddress[4] ?? ''
            }`
          : address;
      return displayAddress.trim();
    } else {
      return 'Location not found';
    }
  } catch (error) {
    console.error('Error fetching location name:', error);
    return 'Error fetching location';
  }
};
