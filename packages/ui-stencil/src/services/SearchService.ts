import type { OramaClient } from '@oramacloud/client'
import { OramaClientNotInitializedError } from '@/erros/OramaClientNotInitialized'
import { searchState } from '@/context/searchContext'
import type { ResultMap, SearchResultBySection, SearchResultWithScore } from '@/types'

const LIMIT_RESULTS = 10

// TODO: Orama Client should expose Result type
type OramaHit = { id: string; score: number; document: { title: string; description: string; path: string } }

export class SearchService {
  private abortController: AbortController
  private oramaClient: OramaClient

  constructor(oramaClient: OramaClient) {
    this.oramaClient = oramaClient
    this.abortController = new AbortController()
  }

  search = (term: string, selectedFacet?: string) => {
    if (!this.oramaClient) {
      throw new OramaClientNotInitializedError()
    }

    if (!term) {
      return
    }

    this.abortSearch()

    // TODO: Maybe we would like to have a debounce here (Check with Michele)
    this.oramaClient
      .search(
        {
          term: term,
          limit: LIMIT_RESULTS,
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
                },
              }),
          }),
        },
        { abortController: this.abortController },
      )
      .then((results) => {
        searchState.results = this.parserResults(results?.hits, searchState.resultMap)
        searchState.count = results?.count || 0
        searchState.facets = this.parseFacets(results?.facets, searchState.facetProperty)
        searchState.highlightedIndex = -1
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
      const documentSectionValue = hit.document[resultMap.section]

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
    return {
      id: hit.id,
      score: hit.score,
      title: resultMap.title ? hit.document[resultMap.title] : hit.document.title,
      description: resultMap.description ? hit.document[resultMap.description] : hit.document.description,
      path: resultMap.path ? hit.document[resultMap.path] : hit.document.path,
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
