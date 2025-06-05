import type { AnyOrama, Results, SearchParams } from '@orama/orama'
import type { ClientSearchParams } from '@oramacloud/client'

export type SearchResult = {
  id: string
  title: string
  description: string
  path: string
}

export type ColorScheme = 'dark' | 'light' | 'system'

export type SearchResultWithScore = SearchResult & { score: number }
export type SearchResultWithIcon = SearchResult & { icon: string }

export type SearchResultBySection = {
  section: string | undefined
  items: SearchResultWithIcon[]
}

export type Facet = { name: string; count: number }

export type ResultMapKeys = keyof Omit<SearchResult, 'id'> | 'section' | 'datasourceId'
// biome-ignore lint/suspicious/noExplicitAny: Item is indeed not any
export type ResultMapRenderFunction = (item: any, datasourceId: string) => string
// biome-ignore lint/suspicious/noExplicitAny: Item is indeed not any
export type ResultItemRenderFunction = (item: any, datasourceId: string) => string | null | undefined

// TODO: callback function should have the type of the schema
export type ResultMapItem = { [K in ResultMapKeys]?: string | ResultMapRenderFunction } & {
  icon?: string | ResultItemRenderFunction
}

export type ResultMap = ResultMapItem | ResultMapItem[]

export type SourcesMapKeys = keyof Omit<SearchResult, 'id'>

// biome-ignore lint/suspicious/noExplicitAny: Indeed ANY object. unknown would cause extra work for the user
type NewType = (item: any, datasourceId: string) => string

export type SourcesMapRenderFunction = NewType

export type SourcesMapItem = { [K in SourcesMapKeys]?: string | SourcesMapRenderFunction } & {
  datasourceId?: string
}

export type SourceItem = {
  title: string
  description: string
  path: string
}
export type SourcesMap = SourcesMapItem | SourcesMapItem[]

export type CloudIndexConfig = {
  api_key: string
  endpoint: string
}

// TODO: Remove it after upgrading orama-cloud SDK. Currently AskPArams is not exported
export type AskParams = SearchParams<AnyOrama> & {
  userData?: unknown
  related?: {
    howMany?: 1 | 2 | 3 | 4 | 5
    format?: 'question' | 'query'
  }
}

export type ChatMarkdownLinkTitle = ({ text, href }: { text: string; href: string }) => string
export type ChatMarkdownLinkHref = ({ text, href }: { text: string; href: string }) => string
export type ChatMarkdownLinkTarget = ({ text, href }: { text: string; href: string }) => string
export type OnChatMarkdownLinkClickedCallbackProps = { text: string; href: string }

export type OnSearchCompletedCallbackProps = {
  clientSearchParams: ClientSearchParams
  result: { results: SearchResultBySection[]; resultsCount: number; facets: Facet[] }
}

export type OnSearchResultClickCallbackProps = {
  result: SearchResult
}

export type OnAnswerGeneratedCallbackProps = {
  askParams: AskParams
  query: string
  sources: Results<unknown>
  answer: string
  segment: string | null
  trigger: string | null
}

export type onStartConversationCallbackProps = {
  userPrompt: string
  systemPrompts: string[]
}

export type OnAnswerSourceClickCallbackProps = { source: SearchResult }

// TODO: this type should be imported from orama-client
export enum TAnswerStatus {
  idle = 'idle',
  loading = 'loading', // waiting for sources to be fetched
  rendering = 'rendering', // rendering interaction sources
  streaming = 'streaming', // streaming interaction answer
  error = 'error',
  aborted = 'aborted',
  done = 'done',
}

export type TSource = {
  title: string
  description?: string
  path: string
}

export type TChatInteraction = {
  query: string
  response?: string
  sources?: SourceItem[]
  latest?: boolean
  status: TAnswerStatus
  interactionId?: string
  relatedQueries?: string[]
}

/**
 * Dictionary for all text content in the components
 */
export type Dictionary = {
  searchPlaceholder: string
  chatPlaceholder: string
  noResultsFound: string
  noResultsFoundFor: string
  suggestionsTitle: string
  seeAll: string
  addMore: string
  clearChat: string
  errorMessage: string
  disclaimer: string
  startYourSearch: string
  initErrorSearch: string
  initErrorChat: string
  chatButtonLabel: string
  searchButtonLabel: string
}
