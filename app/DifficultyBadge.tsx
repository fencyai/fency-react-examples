import { Badge } from '@mantine/core'
import type { Difficulty } from './examplesCatalog'

const colors = {
  basic: 'green',
  intermediate: 'yellow',
  advanced: 'red',
} as const

const labels = {
  basic: 'Basic',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
} as const

export function DifficultyBadge({
  level,
  size = 'sm',
}: {
  level: Difficulty
  size?: 'xs' | 'sm'
}) {
  return (
    <Badge size={size} variant="light" color={colors[level]}>
      {labels[level]}
    </Badge>
  )
}
