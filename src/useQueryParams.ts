import { useSearchParams } from 'react-router'

interface QueryParams {
    exampleTab: 'documentation' | 'code' | null
    setExampleTab: (tab: 'documentation' | 'code') => void
    clearExampleTab: () => void
}

export default function useQueryParams(): QueryParams {
    const [searchParams, setSearchParams] = useSearchParams()
    const exampleTab = searchParams.get('exampleTab')
    return {
        exampleTab: isExampleTab(exampleTab) ? exampleTab : null,
        setExampleTab: (tab: 'documentation' | 'code') => {
            setSearchParams({ exampleTab: tab })
        },
        clearExampleTab: () => {
            searchParams.delete('exampleTab')
        },
    }
}

const isExampleTab = (tab: unknown): tab is 'documentation' | 'code' => {
    return (
        typeof tab === 'string' && (tab === 'documentation' || tab === 'code')
    )
}
