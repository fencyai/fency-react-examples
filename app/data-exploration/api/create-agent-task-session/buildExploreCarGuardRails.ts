import { DEMO_CAR_TAG_KEY } from '../../demoCarConstants'

export function buildExploreCarGuardRails(
  memoryTypeId: string,
  versionTag: string,
  userId: string,
) {
  return {
    memoryTypes: [
      {
        memoryTypeId,
        match: { [DEMO_CAR_TAG_KEY]: versionTag, userId },
        metadata: [
          { key: 'id', visible: false },
          { key: DEMO_CAR_TAG_KEY, visible: false },
          { key: 'userId', visible: false },
          { key: 'catalog_id', visible: true, description: 'Catalog identity' },
          { key: 'make', visible: true, description: 'Vehicle make' },
          { key: 'model', visible: true, description: 'Vehicle model' },
          { key: 'year', visible: true, description: 'Model year' },
          { key: 'color', visible: true, description: 'Exterior color' },
          {
            key: 'price_usd',
            visible: true,
            description: 'List price in US dollars',
          },
          {
            key: 'mileage_km',
            visible: true,
            description: 'Odometer reading in kilometers',
          },
          { key: 'fuel_type', visible: true, description: 'Fuel type' },
          { key: 'transmission', visible: true, description: 'Transmission' },
          { key: 'body_style', visible: true, description: 'Body style' },
          { key: 'horsepower', visible: true, description: 'Horsepower' },
        ],
      },
    ],
  }
}
