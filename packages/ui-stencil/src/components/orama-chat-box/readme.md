# orama-chat-box

<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description | Type                                                                                                                                                                             | Default     |
| ---------------- | ----------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `autoFocus`      | `auto-focus`      |             | `boolean`                                                                                                                                                                        | `true`      |
| `clientInstance` | --                |             | `FunctionComponents<unknown> & Internals<unknown, Index, DocumentsStore, Sorter> & ArrayCallbackComponents<any> & OramaID & { plugins: OramaPlugin<unknown>[]; } \| OramaClient` | `undefined` |
| `index`          | --                |             | `{ api_key: string; endpoint: string; }`                                                                                                                                         | `undefined` |
| `linksRel`       | `links-rel`       |             | `string`                                                                                                                                                                         | `undefined` |
| `linksTarget`    | `links-target`    |             | `string`                                                                                                                                                                         | `undefined` |
| `placeholder`    | `placeholder`     |             | `string`                                                                                                                                                                         | `undefined` |
| `sourceBaseUrl`  | `source-base-url` |             | `string`                                                                                                                                                                         | `undefined` |
| `sourcesMap`     | --                |             | `{ title?: string; path?: string; description?: string; }`                                                                                                                       | `undefined` |
| `suggestions`    | --                |             | `string[]`                                                                                                                                                                       | `undefined` |
| `systemPrompts`  | --                |             | `string[]`                                                                                                                                                                       | `undefined` |


## Dependencies

### Depends on

- [orama-text](../internal/orama-text)
- [orama-chat](../internal/orama-chat)

### Graph
```mermaid
graph TD;
  orama-chat-box --> orama-text
  orama-chat-box --> orama-chat
  orama-chat --> orama-chat-messages-container
  orama-chat --> orama-chat-suggestions
  orama-chat --> orama-textarea
  orama-chat --> orama-button
  orama-chat --> orama-text
  orama-chat-messages-container --> orama-chat-user-message
  orama-chat-messages-container --> orama-chat-assistent-message
  orama-chat-messages-container --> orama-chat-suggestions
  orama-chat-user-message --> orama-text
  orama-chat-assistent-message --> orama-dots-loader
  orama-chat-assistent-message --> orama-text
  orama-chat-assistent-message --> orama-sources
  orama-chat-assistent-message --> orama-markdown
  orama-chat-assistent-message --> orama-button
  orama-sources --> orama-text
  style orama-chat-box fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
