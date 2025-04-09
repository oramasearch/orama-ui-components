import type { ClientSearchParams } from '@oramacloud/client'
import { OramaClientNotInitializedError } from '@/erros/OramaClientNotInitialized'
import { Switch, type OramaSwitchClient } from '@orama/switch'
import type { OramaClient } from '@oramacloud/client'
import type { CollectionManager } from '@orama/core'
import type { AnyOrama } from '@orama/orama'
import type {
  OnSearchCompletedCallbackProps,
  ResultItemRenderFunction,
  ResultMap,
  ResultMapKeys,
  ResultMapRenderFunction,
  SearchResultBySection,
  SearchResultWithIcon,
} from '@/types'
import type { SearchStoreType } from '@/ParentComponentStore/SearchStore'

const LIMIT_RESULTS = 10

// TODO: Orama Client should expose Result type
// biome-ignore lint/suspicious/noExplicitAny: There is not way to type document as we only know what it is in runtime
type OramaHit = { id: string; score: number; document: any }

export class SearchService {
  private abortController: AbortController
  private client: any
  private searchStore: SearchStoreType

  constructor(oramaClient: any, searchStore: SearchStoreType) {
    // Check if the client is already a Switch instance
    if (oramaClient && oramaClient.constructor && 
        (oramaClient.constructor.name === 'Switch' || 
         // Also check for properties that indicate it's a Switch instance
         (typeof oramaClient.search === 'function' && 
          typeof oramaClient.clientType === 'string' && 
          (oramaClient.isCloud === true || oramaClient.isCore === true || oramaClient.isJS === true)))) {
      
      this.client = oramaClient
    } else {
      // Just use the client directly - we now create the Switch in the demo app
      this.client = oramaClient
    }
    
    this.searchStore = searchStore
    this.abortController = new AbortController()
  }

  search = async (
    term: string,
    selectedFacet?: string,
    callbacks?: {
      onSearchCompletedCallback?: (onSearchCompletedCallbackProps: OnSearchCompletedCallbackProps) => unknown
      onSearchErrorCallback?: (error: Error) => unknown
    },
  ) => {
    if (!this.client) {
      throw new OramaClientNotInitializedError()
    }

    this.abortSearch()

    if (!term) {
      this.searchStore.state.results = []
      this.searchStore.state.count = 0
      this.searchStore.state.facets = []
      this.searchStore.state.highlightedIndex = -1

      return
    }

    this.searchStore.state.loading = true

    const latestAbortController = this.abortController
    const { limit, offset, where, ...restSearchParams } = this.searchStore.state.searchParams ?? {}

    const clientSearchParams = {
      ...restSearchParams,
      term,
      limit: limit || LIMIT_RESULTS,
      ...(where ? { where } : {}),
      ...(this.searchStore.state.facetProperty && {
        facets: {
          [this.searchStore.state.facetProperty]: {},
        },
        ...(selectedFacet &&
          selectedFacet !== 'All' && {
            where: {
              [this.searchStore.state.facetProperty]: {
                eq: selectedFacet,
              },
              ...where,
            },
          }),
      }),
    } as ClientSearchParams


    try {
      const results = await this.client.search(clientSearchParams, { abortController: this.abortController })

        if (latestAbortController.signal.aborted) {
          return
        }

        if (results && !results.hits) {
          throw new Error(
            'This search was made by a OramaClient with property mergeResult set to false. Orama Search Service requires mergeResult to be true.',
          )
        }

        this.searchStore.state.results = this.parserResults(results?.hits, this.searchStore.state.resultMap)
        this.searchStore.state.count = results?.count || 0
        this.searchStore.state.facets = this.parseFacets(results?.facets, this.searchStore.state.facetProperty)
        this.searchStore.state.highlightedIndex = -1

        this.searchStore.state.loading = false

        callbacks?.onSearchCompletedCallback?.({
          clientSearchParams,
          result: {
            results: this.searchStore.state.results,
            resultsCount: this.searchStore.state.count,
            facets: this.searchStore.state.facets,
          },
        })
      callbacks?.onSearchCompletedCallback?.({
        clientSearchParams,
        result: {
          results: this.searchStore.state.results,
          resultsCount: this.searchStore.state.count,
          facets: this.searchStore.state.facets,
        },
      })
    } catch (error) {
      console.error('Search error:', error)
      
      if (latestAbortController.signal.aborted) {
        return
      }

      this.searchStore.state.loading = false

      callbacks?.onSearchErrorCallback?.(error)
    }
  }

  abortSearch(): void {
    this.abortController.abort()
    this.abortController = new AbortController()
  }

  // TODO
  retry = () => {
    throw new Error('Not implemented')
  }

  private parserResults = (hits: OramaHit[] | undefined, resultMap: ResultMap): SearchResultBySection[] => {
    if (!hits) {
      return []
    }

    const perSectionResults = [] as SearchResultBySection[]
    const arraySectionMap: { [key: string]: number } = {}

    for (const hit of hits) {
      const searchResultWithScore = this.hitToSearchResultParser(hit, resultMap)
      const documentSectionValue =
        typeof resultMap.section === 'function' ? resultMap.section(hit.document) : hit.document[resultMap.section]

      if (arraySectionMap[documentSectionValue] === undefined) {
        perSectionResults.push({
          section: documentSectionValue,
          items: [searchResultWithScore],
        })
        arraySectionMap[documentSectionValue] = perSectionResults.length - 1
      } else {
        const sectionIndex = arraySectionMap[documentSectionValue]
        perSectionResults[sectionIndex].items.push(searchResultWithScore)
      }
    }

    return perSectionResults
  }

  private hitToSearchResultParser = (hit: OramaHit, resultMap: ResultMap): SearchResultWithIcon => {
    function getResultMapValue(resultMapKey: ResultMapKeys): string {
      const resultMapFunctionOrString = resultMap[resultMapKey]

      if (!resultMapFunctionOrString) {
        return hit.document[resultMapKey]
      }

      if (typeof resultMapFunctionOrString === 'function') {
        const resultMapFunction = resultMapFunctionOrString as ResultMapRenderFunction
        return resultMapFunction(hit.document)
      }

      const resultMapString = resultMap[resultMapKey] as string
      return hit.document[resultMapString]
    }

    function getIcon(): string | null {
      const iconStringOrFunction = resultMap.icon

      if (!iconStringOrFunction) {
        return null
      }

      if (typeof iconStringOrFunction === 'function') {
        const iconFunctionRender = iconStringOrFunction as ResultItemRenderFunction
        const iconFunctionRenderResult = iconFunctionRender(hit.document)

        return iconFunctionRenderResult ?? null
      }

      return resultMap.icon as string
    }

    return {
      id: hit.id,
      title: getResultMapValue('title'),
      description: getResultMapValue('description'),
      path: getResultMapValue('path'),
      icon: getIcon(),
    }
  }

  private parseFacets = (
    rawFacets: Record<
      string,
      {
        count: number
        values: Record<string, number>
      }
    >,
    facetProperty,
  ): { name: string; count: number }[] => {
    if (!facetProperty || !rawFacets || !rawFacets[facetProperty]?.values) {
      return []
    }

    const facetPropertyObject = rawFacets[facetProperty]

    const totalCount = Object.values(facetPropertyObject.values).reduce((acc, count) => acc + count, 0)
    const allFacets = Object.keys(facetPropertyObject.values).map((key) => {
      return {
        name: key,
        count: facetPropertyObject.values[key],
      }
    })

    allFacets.unshift({ name: 'All', count: totalCount })
    return allFacets
  }
}
