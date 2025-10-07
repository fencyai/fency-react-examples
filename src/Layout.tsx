import { AppShell, Burger, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import clsx from 'clsx'
import { Link, Outlet, useLocation } from 'react-router'
import reactExamplesLogo from './assets/react-examples.svg'
import { examples } from './examples'
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
                <div className="px-2 pb-2 py-3">
                    <SidebarElement
                        key={'running-this-project-locally'}
                        title={'Running locally'}
                        description={'Play around with the source code locally'}
                        href={routes.runningLocally}
                        selected={location.pathname === routes.runningLocally}
                    />
                </div>
                <Title order={6} className="px-3 pb-2 text-gray-400">
                    EXAMPLES
                </Title>
                <div className="px-4">
                    {examples.map((example) => (
                        <SidebarElement
                            key={example.href}
                            title={example.title}
                            description={example.description}
                            href={example.href}
                            selected={location.pathname === example.href}
                        />
                    ))}
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
            className={clsx('py-2 block px-3', {
                'bg-blue-100 border-l-1 border-blue-500 rounded-tr-sm rounded-br-sm':
                    selected,
                'border-l-1 border-gray-200': !selected,
            })}
            to={href}
        >
            <span
                className={clsx('text-sm', {
                    'text-blue-500': selected,
                    'text-gray-500': !selected,
                })}
            >
                {title}
            </span>
            <br />
            <span
                className={clsx('text-xs', {
                    'text-blue-500': selected,
                    'text-gray-400': !selected,
                })}
            >
                {description}
            </span>
        </Link>
    )
}
