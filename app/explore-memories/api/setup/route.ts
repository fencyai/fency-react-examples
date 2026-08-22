import { NextResponse } from 'next/server'
import { getAuthorizedUserId } from '../../../auth'
import {
  DEMO_CAR_CATALOG_SIZE,
  countSyncedUserCars,
} from '../../db/queries'
import { ensureDemoCarMemoryType } from './ensureDemoCarMemoryType'
import { syncDemoCars } from './syncDemoCars'

export const dynamic = 'force-dynamic'

export async function GET() {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const synced = await countSyncedUserCars(userId)
  return NextResponse.json({
    ready: synced >= DEMO_CAR_CATALOG_SIZE,
    syncedCars: synced,
  })
}

export async function POST() {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const memoryTypeId = await ensureDemoCarMemoryType()
    await syncDemoCars(userId, memoryTypeId)
    return NextResponse.json({
      ready: true,
      memoryTypeId,
      syncedCars: DEMO_CAR_CATALOG_SIZE,
    })
  } catch (error) {
    console.error('Explore memories setup failed:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to create the car catalog.'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
