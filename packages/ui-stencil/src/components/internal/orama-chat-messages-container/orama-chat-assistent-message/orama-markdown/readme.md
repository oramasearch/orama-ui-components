# orama-markdown



<!-- Auto Generated Below -->


## Properties

| Property                 | Attribute                   | Description | Type                                                          | Default     |
| ------------------------ | --------------------------- | ----------- | ------------------------------------------------------------- | ----------- |
| `chatMarkdownLinkHref`   | `chat-markdown-link-href`   |             | `({ text, href }: { text: string; href: string; }) => string` | `undefined` |
| `chatMarkdownLinkTarget` | `chat-markdown-link-target` |             | `({ text, href }: { text: string; href: string; }) => string` | `undefined` |
| `chatMarkdownLinkTitle`  | `chat-markdown-link-title`  |             | `({ text, href }: { text: string; href: string; }) => string` | `undefined` |
| `content`                | `content`                   |             | `string`                                                      | `undefined` |


## Events

| Event                     | Description | Type                                           |
| ------------------------- | ----------- | ---------------------------------------------- |
| `chatMarkdownLinkClicked` |             | `CustomEvent<{ text: string; href: string; }>` |


## Dependencies

### Used by

 - [orama-chat-assistent-message](..)

### Graph
```mermaid
graph TD;
  orama-chat-assistent-message --> orama-markdown
  style orama-markdown fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
