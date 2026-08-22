import { NavLink } from '@mantine/core'

export function ConversationNavItem({
  title,
  active,
  onClick,
}: {
  title: string
  active: boolean
  onClick: () => void
}) {
  return (
    <NavLink
      label={title}
      active={active}
      onClick={onClick}
      style={{ borderRadius: 'var(--mantine-radius-default)' }}
    />
  )
}
