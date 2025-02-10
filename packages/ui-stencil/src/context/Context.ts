import type { ChatService } from '@/services/ChatService'
import type { SearchService } from '@/services/SearchService'
import type { Facet, ResultMap, SearchResultBySection, SourcesMap, TChatInteraction } from '@/types'
import type { AnyOrama, Orama, SearchParams } from '@orama/orama'
import type { OramaClient } from '@oramacloud/client'
import { createStore } from '@stencil/store'

const initSearchStore = () => {
  return createStore({
    count: 0,
    facets: [] as Facet[],
    facetProperty: '', // TODO: consider to move to resultsMap
    results: [] as SearchResultBySection[],
    resultMap: {} as ResultMap,
    highlightedIndex: -1,
    loading: false,
    error: false,
    // TODO: Probable needs to be held in component property.
    // Lets queckly dicudd about this again.
    searchService: null as SearchService | null,
    searchParams: null as SearchParams<Orama<AnyOrama | OramaClient>>,
  })
}

const initChatStore = () => {
  return createStore({
    chatService: null as ChatService | null,
    interactions: [] as TChatInteraction[] | null,
    sourceBaseURL: '' as string,
    linksTarget: '_blank' as string,
    linksRel: 'noopener noreferrer' as string,
    prompt: '',
    sourcesMap: {
      title: 'title',
      description: 'description',
      path: 'path',
    } as SourcesMap,
  })
}

const initGlobalStore = () => {
  return createStore({
    open: false,
    currentTask: 'search' as 'search' | 'chat',
    currentTerm: '',
  })
}

export type SearchStoreType = ReturnType<typeof initSearchStore>
export type ChatStoreType = ReturnType<typeof initChatStore>
export type GlobalStoreType = ReturnType<typeof initGlobalStore>

export { initSearchStore, initChatStore, initGlobalStore }
