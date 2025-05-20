# orama-p

<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                                          | Type                                                                              | Default     |
| ---------- | ----------- | ---------------------------------------------------- | --------------------------------------------------------------------------------- | ----------- |
| `align`    | `align`     | optionally change text alignment                     | `"center" \| "left" \| "right"`                                                   | `undefined` |
| `as`       | `as`        | it defines the HTML tag to be used                   | `"a" \| "h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6" \| "p" \| "small" \| "span"` | `'p'`       |
| `bold`     | `bold`      |                                                      | `boolean`                                                                         | `false`     |
| `class`    | `class`     | the optional class name                              | `string`                                                                          | `undefined` |
| `inactive` | `inactive`  | show as inactive                                     | `boolean`                                                                         | `undefined` |
| `styledAs` | `styled-as` | it defines how it should look like                   | `"p" \| "small" \| "span"`                                                        | `undefined` |
| `variant`  | `variant`   | optionally change variant style - default is primary | `"primary" \| "secondary" \| "tertiary"`                                          | `'primary'` |


## Dependencies

### Used by

 - [orama-chat](../orama-chat)
 - [orama-chat-assistent-message](../orama-chat-messages-container/orama-chat-assistent-message)
 - [orama-chat-user-message](../orama-chat-messages-container/orama-chat-user-message)
 - [orama-footer](../orama-footer)
 - [orama-search-box](../../orama-search-box)
 - [orama-search-results](../orama-search-results)
 - [orama-sources](../orama-chat-messages-container/orama-chat-assistent-message/orama-sources)

### Graph
```mermaid
graph TD;
  orama-chat --> orama-text
  orama-chat-assistent-message --> orama-text
  orama-chat-user-message --> orama-text
  orama-footer --> orama-text
  orama-search-box --> orama-text
  orama-search-results --> orama-text
  orama-sources --> orama-text
  style orama-text fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
