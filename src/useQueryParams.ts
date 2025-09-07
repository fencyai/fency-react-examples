import { useSearchParams } from 'react-router'

interface QueryParams {
    provider: ModelProvider | null
    setProvider: (provider: ModelProvider) => void
    clearProvider: () => void
}

export default function useQueryParams(): QueryParams {
    const [searchParams, setSearchParams] = useSearchParams()
    const provider = searchParams.get('provider')
    return {
        provider: isProvider(provider) ? provider : null,
        setProvider: (provider: ModelProvider) => {
            setSearchParams({ provider })
        },
        clearProvider: () => {
            searchParams.delete('provider')
        },
    }
}

type ModelProvider = 'openai' | 'anthropic' | 'gemini'

const isProvider = (tab: unknown): tab is ModelProvider => {
    return (
        typeof tab === 'string' &&
        (tab === 'openai' || tab === 'anthropic' || tab === 'gemini')
    )
}
