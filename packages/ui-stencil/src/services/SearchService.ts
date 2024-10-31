import type { ClientSearchParams } from '@oramacloud/client'
import { OramaClientNotInitializedError } from '@/erros/OramaClientNotInitialized'
import { searchState } from '@/context/searchContext'
import type {
  ResultMap,
  SearchResultBySection,
  SearchResultWithScore,
  ResultMapKeys,
  ResultMapRenderFunction,
} from '@/types'
import type { Switch } from '@orama/switch'

const LIMIT_RESULTS = 10

// TODO: Orama Client should expose Result type
// biome-ignore lint/suspicious/noExplicitAny: There is not way to type document as we only know what it is in runtime
type OramaHit = { id: string; score: number; document: any }

export class SearchService {
  private abortController: AbortController
  private oramaClient: Switch

  constructor(oramaClientSwitch: Switch) {
    this.oramaClient = oramaClientSwitch
    this.abortController = new AbortController()
  }

  search = (term: string, selectedFacet?: string) => {
    if (!this.oramaClient) {
      throw new OramaClientNotInitializedError()
    }

    this.abortSearch()

    if (!term) {
      searchState.results = []
      searchState.count = 0
      searchState.facets = []
      searchState.highlightedIndex = -1

      return
    }

    searchState.loading = true

    const latestAbortController = this.abortController
    const { limit, offset, where, ...restSearchParams } = searchState.searchParams ?? {}

    this.oramaClient
      .search(
        {
          ...restSearchParams,
          term,
          limit: limit || LIMIT_RESULTS,
          ...(where ? { where } : {}),
          ...(searchState.facetProperty && {
            facets: {
              [searchState.facetProperty]: {},
            },
            ...(selectedFacet &&
              selectedFacet !== 'All' && {
                where: {
                  [searchState.facetProperty]: {
                    eq: selectedFacet,
                  },
                  ...where,
                },
              }),
          }),
        } as ClientSearchParams,
        { abortController: this.abortController },
      )
      .then((results) => {
        if (latestAbortController.signal.aborted) {
          return
        }

        searchState.results = this.parserResults(results?.hits, searchState.resultMap)
        searchState.count = results?.count || 0
        searchState.facets = this.parseFacets(results?.facets, searchState.facetProperty)
        searchState.highlightedIndex = -1

        searchState.loading = false
      })
      .catch(() => {
        searchState.loading = false
      })
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
      const sectionKey = typeof resultMap.section === 'function' ? resultMap.section(hit.document) : resultMap.section
      const documentSectionValue = hit.document[sectionKey]

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

  private hitToSearchResultParser = (hit: OramaHit, resultMap: ResultMap): SearchResultWithScore => {
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

    return {
      id: hit.id,
      score: hit.score,
      title: getResultMapValue('title'),
      description: getResultMapValue('description'),
      path: getResultMapValue('path'),
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
