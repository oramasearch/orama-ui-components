# orama-search



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute               | Description | Type                          | Default       |
| ---------------------- | ----------------------- | ----------- | ----------------------------- | ------------- |
| `disableChat`          | `disable-chat`          |             | `boolean`                     | `false`       |
| `focusInput`           | `focus-input`           |             | `boolean`                     | `false`       |
| `highlightDescription` | `highlight-description` |             | `HighlightOptions \| boolean` | `false`       |
| `highlightTitle`       | `highlight-title`       |             | `HighlightOptions \| boolean` | `false`       |
| `linksRel`             | `links-rel`             |             | `string`                      | `undefined`   |
| `linksTarget`          | `links-target`          |             | `string`                      | `undefined`   |
| `placeholder`          | `placeholder`           |             | `string`                      | `'Search...'` |
| `sourceBaseUrl`        | `source-base-url`       |             | `string`                      | `undefined`   |
| `suggestions`          | --                      |             | `string[]`                    | `[]`          |


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
