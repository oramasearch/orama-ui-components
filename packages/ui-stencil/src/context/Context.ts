import type { ChatService } from '@/services/ChatService'
import type { SearchService } from '@/services/SearchService'
import type { Facet, ResultMap, SearchResultBySection, SourcesMap, TChatInteraction } from '@/types'
import { getExternalComponentHTMLElement } from '@/utils/utils'
import type { AnyOrama, Orama, SearchParams } from '@orama/orama'
import type { OramaClient } from '@oramacloud/client'
import { createStore, type ObservableMap } from '@stencil/store'

const SearchStoreInitProps = {
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
}

const ChatStoreInitProps = {
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
}

const GlobaStoreInitiProps = {
  open: false,
  currentTask: 'search' as 'search' | 'chat',
  currentTerm: '',
}

export type SearchStoreType = ObservableMap<typeof SearchStoreInitProps>
export type ChatStoreType = ObservableMap<typeof ChatStoreInitProps>
export type GlobalStoreType = ObservableMap<typeof GlobaStoreInitiProps>

export type StoresMapType = {
  global?: GlobalStoreType
  search?: SearchStoreType
  chat?: ChatStoreType
}

export type StoresMapKeys = keyof StoresMapType

/**
 * Holds the global references for all stores in Orama Ui.
 */
const storesReferencesMap = new Map<
  string,
  { search?: SearchStoreType; chat?: ChatStoreType; global?: GlobalStoreType }
>()

/**
 * Access storeSReferenceMap and return the initialized store. Throw exception if either parent or store does not exist
 *
 * @param parentComponentId
 * @param storeName
 * @returns
 */
const getParentComponentStore = <T extends StoresMapKeys>(
  parentComponentId: string,
  storeName: T,
): StoresMapType[T] => {
  const parentStores = storesReferencesMap.get(parentComponentId)

  if (!parentStores) {
    throw new Error('Invalid parent component Id')
  }

  const store = parentStores[storeName]

  if (!store) {
    throw new Error('Store not initialized')
  }

  return store
}

export const initStore = <T extends StoresMapKeys>(storeName: T, parentComponentId: string): StoresMapType[T] => {
  let store = null
  if (storeName === 'chat') {
    store = createStore(ChatStoreInitProps)
  } else if (storeName === 'search') {
    store = createStore(SearchStoreInitProps)
  } else if (storeName === 'global') {
    store = createStore(GlobaStoreInitiProps)
  } else {
    throw new Error('Invalid store name')
  }

  if (storesReferencesMap.has(parentComponentId)) {
    const currentStores = storesReferencesMap.get(parentComponentId)
    currentStores[storeName] = store
  } else {
    storesReferencesMap.set(parentComponentId, { [storeName]: store })
  }

  return store
}

export function getStore<T extends StoresMapKeys>(storeName: T, element: HTMLElement) {
  const externalComponent = getExternalComponentHTMLElement(element)

  if (!externalComponent) {
    throw new Error('Failed to get store')
  }

  return getParentComponentStore(externalComponent.id, storeName)
}
