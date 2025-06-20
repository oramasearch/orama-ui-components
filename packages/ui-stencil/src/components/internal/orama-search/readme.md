# orama-search



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute               | Description | Type                                                                                                                                                                                                                                                                                                                                                                             | Default       |
| ---------------------- | ----------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `dictionary`           | `dictionary`            |             | `{ searchPlaceholder?: string; chatPlaceholder?: string; noResultsFound?: string; noResultsFoundFor?: string; suggestionsTitle?: string; seeAll?: string; addMore?: string; clearChat?: string; errorMessage?: string; disclaimer?: string; startYourSearch?: string; initErrorSearch?: string; initErrorChat?: string; chatButtonLabel?: string; searchButtonLabel?: string; }` | `undefined`   |
| `disableChat`          | `disable-chat`          |             | `boolean`                                                                                                                                                                                                                                                                                                                                                                        | `false`       |
| `focusInput`           | `focus-input`           |             | `boolean`                                                                                                                                                                                                                                                                                                                                                                        | `false`       |
| `highlightDescription` | `highlight-description` |             | `HighlightOptions \| boolean`                                                                                                                                                                                                                                                                                                                                                    | `false`       |
| `highlightTitle`       | `highlight-title`       |             | `HighlightOptions \| boolean`                                                                                                                                                                                                                                                                                                                                                    | `false`       |
| `linksRel`             | `links-rel`             |             | `string`                                                                                                                                                                                                                                                                                                                                                                         | `undefined`   |
| `linksTarget`          | `links-target`          |             | `string`                                                                                                                                                                                                                                                                                                                                                                         | `undefined`   |
| `placeholder`          | `placeholder`           |             | `string`                                                                                                                                                                                                                                                                                                                                                                         | `'Search...'` |
| `relatedQueries`       | `related-queries`       |             | `number`                                                                                                                                                                                                                                                                                                                                                                         | `undefined`   |
| `sourceBaseUrl`        | `source-base-url`       |             | `string`                                                                                                                                                                                                                                                                                                                                                                         | `undefined`   |
| `suggestions`          | `suggestions`           |             | `string[]`                                                                                                                                                                                                                                                                                                                                                                       | `[]`          |


## Events

| Event             | Description | Type                                                                                                                                             |
| ----------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `answerGenerated` |             | `CustomEvent<{ askParams: AskParams; query: string; sources: Results<unknown>; answer: string; segment: string; trigger: string; }>`             |
| `searchCompleted` |             | `CustomEvent<{ clientSearchParams: ClientSearchParams; result: { results: SearchResultBySection[]; resultsCount: number; facets: Facet[]; }; }>` |


## Dependencies

### Used by

 - [orama-search-box](../../orama-search-box)

### Depends on

- [orama-input](../orama-input)
- [orama-facets](../orama-facets)
- [orama-search-results](../orama-search-results)

### Graph
```mermaid
graph TD;
  orama-search --> orama-input
  orama-search --> orama-facets
  orama-search --> orama-search-results
  orama-search-results --> orama-text
  orama-search-results --> orama-suggestions
  orama-search-box --> orama-search
  style orama-search fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
