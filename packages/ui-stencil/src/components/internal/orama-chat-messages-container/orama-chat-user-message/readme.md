# orama-chat-user-message



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute | Description | Type                                                                                                                                               | Default     |
| ------------- | --------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `interaction` | --        |             | `{ query: string; response?: string; sources?: any; latest?: boolean; status: TAnswerStatus; interactionId?: string; relatedQueries?: string[]; }` | `undefined` |


## Dependencies

### Used by

 - [orama-chat-messages-container](..)

### Depends on

- [orama-text](../../orama-text)

### Graph
```mermaid
graph TD;
  orama-chat-user-message --> orama-text
  orama-chat-messages-container --> orama-chat-user-message
  style orama-chat-user-message fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
