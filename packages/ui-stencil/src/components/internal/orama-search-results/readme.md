# orama-search-results

<!-- Auto Generated Below -->


## Properties

| Property               | Attribute               | Description | Type                                                                                                                                                                                                                                                                                                                                                                             | Default                 |
| ---------------------- | ----------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `dictionary`           | `dictionary`            |             | `{ searchPlaceholder?: string; chatPlaceholder?: string; noResultsFound?: string; noResultsFoundFor?: string; suggestionsTitle?: string; seeAll?: string; addMore?: string; clearChat?: string; errorMessage?: string; disclaimer?: string; startYourSearch?: string; initErrorSearch?: string; initErrorChat?: string; chatButtonLabel?: string; searchButtonLabel?: string; }` | `undefined`             |
| `error`                | `error`                 |             | `boolean`                                                                                                                                                                                                                                                                                                                                                                        | `false`                 |
| `highlightDescription` | `highlight-description` |             | `HighlightOptions \| boolean`                                                                                                                                                                                                                                                                                                                                                    | `false`                 |
| `highlightTitle`       | `highlight-title`       |             | `HighlightOptions \| boolean`                                                                                                                                                                                                                                                                                                                                                    | `false`                 |
| `linksRel`             | `links-rel`             |             | `string`                                                                                                                                                                                                                                                                                                                                                                         | `'noopener noreferrer'` |
| `linksTarget`          | `links-target`          |             | `string`                                                                                                                                                                                                                                                                                                                                                                         | `'_blank'`              |
| `loading`              | `loading`               |             | `boolean`                                                                                                                                                                                                                                                                                                                                                                        | `false`                 |
| `searchTerm`           | `search-term`           |             | `string`                                                                                                                                                                                                                                                                                                                                                                         | `undefined`             |
| `sections`             | `sections`              |             | `SearchResultBySection[]`                                                                                                                                                                                                                                                                                                                                                        | `[]`                    |
| `setChatTerm`          | `set-chat-term`         |             | `(term: string) => void`                                                                                                                                                                                                                                                                                                                                                         | `undefined`             |
| `sourceBaseUrl`        | `source-base-url`       |             | `string`                                                                                                                                                                                                                                                                                                                                                                         | `undefined`             |
| `suggestions`          | `suggestions`           |             | `string[]`                                                                                                                                                                                                                                                                                                                                                                       | `[]`                    |


## Events

| Event               | Description | Type                                     |
| ------------------- | ----------- | ---------------------------------------- |
| `searchResultClick` |             | `CustomEvent<{ result: SearchResult; }>` |


## Dependencies

### Used by

 - [orama-search](../orama-search)

### Depends on

- [orama-text](../orama-text)
- [orama-suggestions](../orama-suggestions)

### Graph
```mermaid
graph TD;
  orama-search-results --> orama-text
  orama-search-results --> orama-suggestions
  orama-search --> orama-search-results
  style orama-search-results fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
