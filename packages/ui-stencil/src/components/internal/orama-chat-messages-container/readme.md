# orama-chat-messages-container



<!-- Auto Generated Below -->


## Properties

| Property                | Attribute | Description | Type                                                          | Default     |
| ----------------------- | --------- | ----------- | ------------------------------------------------------------- | ----------- |
| `chatMarkdownLinkHref`  | --        |             | `({ text, href }: { text: string; href: string; }) => string` | `undefined` |
| `chatMarkdownLinkTitle` | --        |             | `({ text, href }: { text: string; href: string; }) => string` | `undefined` |
| `interactions`          | --        |             | `TChatInteraction[]`                                          | `undefined` |


## Events

| Event             | Description | Type                                                                                                                                             |
| ----------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `answerGenerated` |             | `CustomEvent<{ clientSearchParams: ClientSearchParams; result: { results: SearchResultBySection[]; resultsCount: number; facets: Facet[]; }; }>` |


## Dependencies

### Used by

 - [orama-chat](../orama-chat)

### Depends on

- [orama-chat-user-message](orama-chat-user-message)
- [orama-chat-assistent-message](orama-chat-assistent-message)
- [orama-suggestions](../orama-suggestions)

### Graph
```mermaid
graph TD;
  orama-chat-messages-container --> orama-chat-user-message
  orama-chat-messages-container --> orama-chat-assistent-message
  orama-chat-messages-container --> orama-suggestions
  orama-chat-user-message --> orama-text
  orama-chat-assistent-message --> orama-dots-loader
  orama-chat-assistent-message --> orama-text
  orama-chat-assistent-message --> orama-sources
  orama-chat-assistent-message --> orama-markdown
  orama-chat-assistent-message --> orama-button
  orama-sources --> orama-text
  orama-chat --> orama-chat-messages-container
  style orama-chat-messages-container fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
