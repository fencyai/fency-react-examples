import { createHash } from 'node:crypto'
import { DEMO_CAR_CATALOG_SIZE, DEMO_CAR_TAG_KEY } from '../../db/queries'

const MAKES = [
  { make: 'Toyota', models: ['Camry', 'Corolla', 'RAV4', 'Prius'] },
  { make: 'Volkswagen', models: ['Golf', 'Passat', 'Tiguan', 'ID.4'] },
  { make: 'BMW', models: ['3 Series', 'X3', '5 Series', 'i4'] },
  { make: 'Tesla', models: ['Model 3', 'Model Y', 'Model S', 'Model X'] },
  { make: 'Ford', models: ['Focus', 'Mustang', 'Explorer', 'F-150'] },
  { make: 'Volvo', models: ['XC60', 'XC90', 'S60', 'EX30'] },
  { make: 'Audi', models: ['A4', 'Q5', 'A6', 'Q7'] },
  { make: 'Hyundai', models: ['Elantra', 'Tucson', 'Ioniq 5', 'Santa Fe'] },
  { make: 'Mercedes', models: ['C-Class', 'GLC', 'E-Class', 'EQA'] },
  { make: 'Honda', models: ['Civic', 'CR-V', 'Accord', 'HR-V'] },
  { make: 'Kia', models: ['Sportage', 'EV6', 'Ceed', 'Sorento'] },
  { make: 'Peugeot', models: ['308', '3008', '208', '5008'] },
] as const

const COLORS = [
  'black',
  'white',
  'red',
  'blue',
  'silver',
  'gray',
  'green',
  'orange',
] as const

const FUEL_TYPES = ['gasoline', 'diesel', 'hybrid', 'electric'] as const
const TRANSMISSIONS = ['automatic', 'manual'] as const
const BODY_STYLES = [
  'sedan',
  'suv',
  'hatchback',
  'wagon',
  'coupe',
] as const

export type DemoCarRecord = {
  userId: string
  identity: string
  versionTag: string
  make: string
  model: string
  year: number
  color: string
  priceUsd: number
  mileageKm: number
  fuelType: string
  transmission: string
  bodyStyle: string
  horsepower: number
  updatedAt: Date
}

export function demoCarMemoryId(versionTag: string, identity: string) {
  return `${versionTag}:${identity}`
}

export function catalogIdentityFromMemoryId(
  versionTag: string,
  memoryId: string,
) {
  const prefix = `${versionTag}:`
  if (!memoryId.startsWith(prefix)) {
    return null
  }
  return memoryId.slice(prefix.length)
}

export function buildDemoCarCatalog(
  userId: string,
  versionTag: string,
  updatedAt: Date,
): DemoCarRecord[] {
  const userHash = createHash('sha256').update(userId).digest('hex').slice(0, 8)

  return Array.from({ length: DEMO_CAR_CATALOG_SIZE }, (_, index) => {
    const brand = MAKES[index % MAKES.length]
    const model = brand.models[Math.floor(index / MAKES.length) % brand.models.length]
    const year = 2016 + (index % 11)
    const fuelType = FUEL_TYPES[index % FUEL_TYPES.length]
    const electric = fuelType === 'electric'

    return {
      userId,
      identity: `car_${userHash}_${index + 1}`,
      versionTag,
      make: brand.make,
      model,
      year,
      color: COLORS[index % COLORS.length],
      priceUsd: 18000 + ((index * 137) % 62000),
      mileageKm: electric ? 8000 + ((index * 211) % 40000) : 12000 + ((index * 317) % 140000),
      fuelType,
      transmission: electric ? 'automatic' : TRANSMISSIONS[index % TRANSMISSIONS.length],
      bodyStyle: BODY_STYLES[index % BODY_STYLES.length],
      horsepower: electric ? 201 + ((index * 13) % 420) : 95 + ((index * 11) % 320),
      updatedAt,
    }
  })
}

export function demoCarTitle(car: DemoCarRecord) {
  return `${car.year} ${car.make} ${car.model}`
}

export function demoCarMetadata(car: DemoCarRecord) {
  return {
    id: demoCarMemoryId(car.versionTag, car.identity),
    catalog_id: car.identity,
    [DEMO_CAR_TAG_KEY]: car.versionTag,
    userId: car.userId,
    updated_at: car.updatedAt.toISOString(),
    make: car.make,
    model: car.model,
    year: car.year,
    color: car.color,
    price_usd: car.priceUsd,
    mileage_km: car.mileageKm,
    fuel_type: car.fuelType,
    transmission: car.transmission,
    body_style: car.bodyStyle,
    horsepower: car.horsepower,
  }
}
