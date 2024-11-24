import type { Facet } from '@/types'
import type { SearchService } from '@/services/SearchService'
import { createStore } from '@stencil/store'
import type { ResultMap, SearchResultBySection } from '@/types'
import type { AnyOrama, Orama, SearchParams } from '@orama/orama'
import type { OramaClient } from '@oramacloud/client'

const store = createStore({
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

const { state: searchState, ...searchStore } = store

export { searchState, searchStore }
