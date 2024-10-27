# orama-chat



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute         | Description | Type                                                       | Default             |
| --------------- | ----------------- | ----------- | ---------------------------------------------------------- | ------------------- |
| `defaultTerm`   | `default-term`    |             | `string`                                                   | `undefined`         |
| `focusInput`    | `focus-input`     |             | `boolean`                                                  | `false`             |
| `linksRel`      | `links-rel`       |             | `string`                                                   | `undefined`         |
| `linksTarget`   | `links-target`    |             | `string`                                                   | `undefined`         |
| `placeholder`   | `placeholder`     |             | `string`                                                   | `'Ask me anything'` |
| `showClearChat` | `show-clear-chat` |             | `boolean`                                                  | `true`              |
| `sourceBaseUrl` | `source-base-url` |             | `string`                                                   | `''`                |
| `sourcesMap`    | --                |             | `{ title?: string; description?: string; path?: string; }` | `undefined`         |
| `suggestions`   | --                |             | `string[]`                                                 | `undefined`         |
| `systemPrompts` | --                |             | `string[]`                                                 | `undefined`         |


## Dependencies

### Used by

 - [orama-chat-box](../../orama-chat-box)
 - [orama-search-box](../../orama-search-box)

### Depends on

- [orama-chat-messages-container](../orama-chat-messages-container)
- [orama-chat-suggestions](../orama-chat-suggestions)
- [orama-textarea](../orama-textarea)
- [orama-button](../orama-button)
- [orama-text](../orama-text)

### Graph
```mermaid
graph TD;
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
  orama-chat-box --> orama-chat
  orama-search-box --> orama-chat
  style orama-chat fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
