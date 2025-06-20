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
  ResultMapItem,
  ResultMapKeys,
  ResultMapRenderFunction,
  SearchResultBySection,
  SearchResultWithIcon,
} from '@/types'
import type { SearchStoreType } from '@/ParentComponentStore/SearchStore'

const LIMIT_RESULTS = 10

// TODO: Orama Client should expose Result type
// biome-ignore lint/suspicious/noExplicitAny: There is not way to type document as we only know what it is in runtime
type OramaHit = { id: string; score: number; document: any; datasource_id: string }

export class SearchService {
  private abortController: AbortController
  private client: Switch<OramaSwitchClient> | CollectionManager
  private searchStore: SearchStoreType

  constructor(oramaClient: OramaClient | AnyOrama, oramaCoreClient: CollectionManager, searchStore: SearchStoreType) {
    this.client = oramaCoreClient ? oramaCoreClient : new Switch(oramaClient)
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
      // In order to make the types work for both Switch and CollectionManager
    } as ClientSearchParams & { term: string }

    try {
      const results = await this.client.search(clientSearchParams)
      if (latestAbortController.signal.aborted) {
        return
      }

      if (results && !results.hits) {
        throw new Error(
          'This search was made by a OramaClient with property mergeResult set to false. Orama Search Service requires mergeResult to be true.',
        )
      }

      // biome-ignore lint/suspicious/noExplicitAny: To be fixed when Orama Swtich export the right type
      this.searchStore.state.results = this.parserResults(results?.hits as any, this.searchStore.state.resultMap)
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

  private getResultMapObjectByForTheHit = (resultMapArrayOrObject: ResultMap, hit: OramaHit): ResultMapItem => {
    const resultMapArray = Array.isArray(resultMapArrayOrObject) ? resultMapArrayOrObject : [resultMapArrayOrObject]

    // If there is only one result map, assume it's the one for all hits, regardless of datasourceId
    if (resultMapArray.length === 1) {
      return resultMapArray[0]
    }

    // TODO: Instead of doing it per each HIT, we may want to create a map of datasourceId -> resultMap to avoid the O(n) lookup
    const resultmapMatch = resultMapArray.find((resultMap) => resultMap.datasourceId === hit.datasource_id)

    return resultmapMatch || {}
  }

  private parserResults = (
    hits: OramaHit[] | undefined,
    resultMapArrayOrObject: ResultMap,
  ): SearchResultBySection[] => {
    if (!hits) {
      return []
    }

    const perSectionResults = [] as SearchResultBySection[]
    const arraySectionMap: { [key: string]: number } = {}

    for (const hit of hits) {
      const resultMap = this.getResultMapObjectByForTheHit(resultMapArrayOrObject, hit)

      const searchResultWithScore = this.hitToSearchResultParser(hit, resultMap)
      const documentSectionValue =
        typeof resultMap.section === 'function'
          ? resultMap.section(hit.document, hit.datasource_id)
          : hit.document[resultMap.section]

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

  private hitToSearchResultParser = (hit: OramaHit, resultMapObject: ResultMapItem): SearchResultWithIcon => {
    function getResultMapValue(resultMapKey: ResultMapKeys): string {
      if (!hit.document) {
        return '';
      }

      const resultMapFunctionOrString = resultMapObject[resultMapKey];

      if (!resultMapFunctionOrString) {
        const value = hit.document[resultMapKey];
        return typeof value === 'string' ? value : String(value ?? '');
      }

      if (typeof resultMapFunctionOrString === 'function') {
        const resultMapFunction = resultMapFunctionOrString as ResultMapRenderFunction;
        const value = resultMapFunction(hit.document, hit.datasource_id);
        return typeof value === 'string' ? value : String(value ?? '');
      }

      const resultMapString = resultMapFunctionOrString as string;
      const value = hit.document[resultMapString];
      return typeof value === 'string' ? value : String(value ?? '');
    }

    function getIcon(): string | null {
      const iconStringOrFunction = resultMapObject.icon

      if (!iconStringOrFunction) {
        return null
      }

      if (typeof iconStringOrFunction === 'function') {
        const iconFunctionRender = iconStringOrFunction as ResultItemRenderFunction
        const iconFunctionRenderResult = iconFunctionRender(hit.document, hit.datasource_id)

        return iconFunctionRenderResult ?? null
      }

      return resultMapObject.icon as string
    }

    return {
      id: hit.id,
      title: getResultMapValue('title'),
      description: getResultMapValue('description'),
      path: getResultMapValue('path'),
      icon: getIcon(),
    }
  }

  private parseFacets = (rawFacets: unknown, facetProperty: string): { name: string; count: number }[] => {
    // Handle case where facets are missing or empty
    if (!facetProperty || !rawFacets) {
      return []
    }

    // Handle different facet formats based on client type
    const facetPropertyObject = rawFacets[facetProperty]
    if (!facetPropertyObject || !facetPropertyObject.values) {
      return []
    }

    // Process facets in standard format
    const totalCount = Object.values(facetPropertyObject.values).reduce((acc: number, count: number) => acc + count, 0)
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
