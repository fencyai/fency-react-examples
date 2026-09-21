import { NextResponse } from 'next/server'
import { getAuthorizedUserId } from '../../../../auth'
import { DEMO_CAR_CATALOG_SIZE } from '../../../demoCarConstants'
import { getExploreMemoriesVersionTag } from '../../../versionTag'
import { ensureDemoCarMemoryType } from './ensureDemoCarMemoryType'
import { syncDemoCars } from './syncDemoCars'

export async function POST() {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const versionTag = getExploreMemoriesVersionTag()
    const memoryTypeId = await ensureDemoCarMemoryType()
    await syncDemoCars(userId, memoryTypeId, versionTag)
    return NextResponse.json({
      ready: true,
      memoryTypeId,
      syncedCars: DEMO_CAR_CATALOG_SIZE,
      versionTag,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to create the car catalog.'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
