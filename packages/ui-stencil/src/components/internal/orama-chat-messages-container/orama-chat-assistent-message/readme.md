# orama-chat-assistent-message



<!-- Auto Generated Below -->


## Properties

| Property                 | Attribute                   | Description | Type                                                                                                                                                        | Default     |
| ------------------------ | --------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `chatMarkdownLinkHref`   | `chat-markdown-link-href`   |             | `({ text, href }: { text: string; href: string; }) => string`                                                                                               | `undefined` |
| `chatMarkdownLinkTarget` | `chat-markdown-link-target` |             | `({ text, href }: { text: string; href: string; }) => string`                                                                                               | `undefined` |
| `chatMarkdownLinkTitle`  | `chat-markdown-link-title`  |             | `({ text, href }: { text: string; href: string; }) => string`                                                                                               | `undefined` |
| `interaction`            | `interaction`               |             | `{ query: string; response?: string; sources?: SourceItem[]; latest?: boolean; status: TAnswerStatus; interactionId?: string; relatedQueries?: string[]; }` | `undefined` |


## Dependencies

### Used by

 - [orama-chat-messages-container](..)

### Depends on

- [orama-dots-loader](../../orama-dots-loader)
- [orama-text](../../orama-text)
- [orama-sources](orama-sources)
- [orama-markdown](orama-markdown)
- [orama-button](../../orama-button)

### Graph
```mermaid
graph TD;
  orama-chat-assistent-message --> orama-dots-loader
  orama-chat-assistent-message --> orama-text
  orama-chat-assistent-message --> orama-sources
  orama-chat-assistent-message --> orama-markdown
  orama-chat-assistent-message --> orama-button
  orama-sources --> orama-text
  orama-chat-messages-container --> orama-chat-assistent-message
  style orama-chat-assistent-message fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
