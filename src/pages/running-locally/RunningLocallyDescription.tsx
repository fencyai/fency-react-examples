import { Button, Text } from '@mantine/core'
import { IconBrandGithub } from '@tabler/icons-react'
import { Link } from 'react-router'

export default function RunningLocallyDescription() {
    const repositoryUrl = 'https://github.com/fencyai/fency-react-examples'
    return (
        <div>
            <Text size="sm" c="dimmed" className="max-w-xl">
                You can run this project by going to the{' '}
                <Link
                    to={repositoryUrl}
                    className="text-blue-500 hover:text-blue-600 hover:underline"
                >
                    repository
                </Link>{' '}
                and then follow the instructions in the README.
            </Text>
            <Button
                component={Link}
                size="xs"
                className="mt-4"
                radius={'xl'}
                to={repositoryUrl}
                target="_blank"
                leftSection={<IconBrandGithub size={16} />}
            >
                Repository
            </Button>
        </div>
    )
}
