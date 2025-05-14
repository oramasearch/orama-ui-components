# orama-navigation-bar



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description | Type         | Default     |
| ----------------- | ------------------- | ----------- | ------------ | ----------- |
| `handleClose`     | --                  |             | `() => void` | `undefined` |
| `showBackButton`  | `show-back-button`  |             | `boolean`    | `true`      |
| `showChatActions` | `show-chat-actions` |             | `boolean`    | `false`     |


## Dependencies

### Used by

 - [orama-search-box](../../orama-search-box)

### Depends on

- [orama-button](../orama-button)
- [orama-toggler](../orama-toggler)

### Graph
```mermaid
graph TD;
  orama-navigation-bar --> orama-button
  orama-navigation-bar --> orama-toggler
  orama-search-box --> orama-navigation-bar
  style orama-navigation-bar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
