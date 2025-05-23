# orama-sources



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute           | Description | Type     | Default                 |
| --------------- | ------------------- | ----------- | -------- | ----------------------- |
| `linksRel`      | `links-rel`         |             | `string` | `'noopener noreferrer'` |
| `linksTarget`   | `links-target`      |             | `string` | `'_blank'`              |
| `sourceBaseURL` | `source-base-u-r-l` |             | `string` | `''`                    |
| `sources`       | `sources`           |             | `any`    | `undefined`             |


## Events

| Event               | Description | Type                                     |
| ------------------- | ----------- | ---------------------------------------- |
| `answerSourceClick` |             | `CustomEvent<{ source: SearchResult; }>` |


## Dependencies

### Used by

 - [orama-chat-assistent-message](..)

### Depends on

- [orama-text](../../../orama-text)

### Graph
```mermaid
graph TD;
  orama-sources --> orama-text
  orama-chat-assistent-message --> orama-sources
  style orama-sources fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
