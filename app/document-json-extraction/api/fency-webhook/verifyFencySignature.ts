import { createHmac, timingSafeEqual } from 'node:crypto'

export function verifyFencySignature(payload: string, header: string | null) {
  const secret = process.env.DOCUMENT_ANALYSIS_WEBHOOK_SECRET
  if (!secret) {
    throw new Error('DOCUMENT_ANALYSIS_WEBHOOK_SECRET is not defined.')
  }
  if (!header) {
    throw new Error('Missing x-fency-signature header.')
  }

  const expected = Buffer.from(
    `sha256=${createHmac('sha256', secret).update(payload).digest('hex')}`,
    'utf8',
  )
  const received = Buffer.from(header, 'utf8')
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    throw new Error('Signature invalid')
  }
}
