export function buildExploreCarGuardRails(
  memoryTypeId: string,
  memoryIds: string[],
) {
  return {
    memoryTypes: [
      {
        memoryTypeId,
        memoryIds,
        metadata: [
          { key: 'id', visible: true, description: 'Catalog identity' },
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
