import { auth } from '@clerk/nextjs/server'

export async function getAuthorizedUserId() {
  const { userId } = await auth()
  return userId
}
