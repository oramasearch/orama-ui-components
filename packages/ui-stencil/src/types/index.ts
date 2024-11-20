import type { ClientSearchParams } from '@oramacloud/client'

export type SearchResult = {
  id: string
  title: string
  description: string
  path: string
}

export type ColorScheme = 'dark' | 'light' | 'system'

export type SearchResultWithScore = SearchResult & { score: number }

export type SearchResultBySection = {
  section: string | undefined
  items: SearchResultWithScore[]
}

export type Facet = { name: string; count: number }

export type ResultMapKeys = keyof Omit<SearchResult, 'id'> | 'section'
export type ResultMapRenderFunction = (any) => string

// TODO: callback function should have the type of the schema
export type ResultMap = { [K in ResultMapKeys]?: string | ResultMapRenderFunction }

export type SourcesMap = { [K in keyof Omit<SearchResult, 'id'>]?: string }

export type CloudIndexConfig = {
  api_key: string
  endpoint: string
}

export type OnSearchCompletedCallbackProps = {
  clientSearchParams: ClientSearchParams
  result: { results: SearchResultBySection[]; resultsCount: number; facets: Facet[] }
}
