import { NextResponse } from 'next/server'
import { getAuthorizedUserId } from '../../../auth'
import {
  DEMO_CAR_CATALOG_SIZE,
  countSyncedUserCars,
} from '../../db/queries'
import { getExploreMemoriesVersionTag } from '../../versionTag'

export const dynamic = 'force-dynamic'

export async function GET() {
  const userId = await getAuthorizedUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const versionTag = getExploreMemoriesVersionTag()
  const synced = await countSyncedUserCars(userId, versionTag)
  return NextResponse.json({
    ready: synced >= DEMO_CAR_CATALOG_SIZE,
    syncedCars: synced,
    versionTag,
  })
}
