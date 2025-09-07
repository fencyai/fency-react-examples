import { AppShell, Burger, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import clsx from 'clsx'
import { Link, Outlet, useLocation } from 'react-router'
import reactExamplesLogo from './assets/react-examples.svg'
import { routes } from './routes'

export default function Layout() {
    const [opened, { toggle }] = useDisclosure()
    const location = useLocation()

    return (
        <AppShell
            padding="md"
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
        >
            <AppShell.Header className="flex items-center">
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                    className="md:hidden visible ml-3"
                />

                <Link to="/" className="md:visible invisible ml-4">
                    <img
                        src={reactExamplesLogo}
                        alt="React Examples"
                        className="h-8"
                    />
                </Link>
            </AppShell.Header>

            <AppShell.Navbar>
                <div className="px-2 py-2">
                    <Title order={6} className="px-3 text-gray-400">
                        EXAMPLES
                    </Title>
                </div>
                <div className="px-4">
                    <SidebarElement
                        title="Basic Chat Completion"
                        description="Synchronous respoanse"
                        href={routes.examples.basicChatCompletion}
                        selected={
                            location.pathname ===
                            routes.examples.basicChatCompletion
                        }
                    />
                    <SidebarElement
                        title="Streaming Chat Completion"
                        description="Real-time response with streaming"
                        href={routes.examples.streamingChatCompletion}
                        selected={
                            location.pathname ===
                            routes.examples.streamingChatCompletion
                        }
                    />
                    <SidebarElement
                        title="Structured Chat Completion"
                        description="JSON response using a Zod schema"
                        href={routes.examples.structuredChatCompletion}
                        selected={
                            location.pathname ===
                            routes.examples.structuredChatCompletion
                        }
                    />
                </div>
            </AppShell.Navbar>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    )
}

interface SidebarElementProps {
    title: string
    description: string
    href: string
    selected: boolean
}

const SidebarElement = ({
    title,
    description,
    href,
    selected,
}: SidebarElementProps) => {
    return (
        <Link
            className={clsx('py-2 block', {
                'bg-blue-100 border-l-1 border-blue-500 rounded-tr-sm rounded-br-sm':
                    selected,
                'border-l-1 border-gray-200': !selected,
            })}
            to={href}
        >
            <span
                className={clsx('px-3 text-sm', {
                    'text-blue-500': selected,
                    'text-gray-500': !selected,
                })}
            >
                {title}
            </span>
            <br />
            <span
                className={clsx('px-3 text-xs', {
                    'text-blue-500': selected,
                    'text-gray-400': !selected,
                })}
            >
                {description}
            </span>
        </Link>
    )
}
