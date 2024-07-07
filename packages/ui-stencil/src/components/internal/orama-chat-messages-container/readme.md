# orama-chat-messages-container



<!-- Auto Generated Below -->


## Dependencies

### Used by

 - [orama-chat](../orama-chat)

### Depends on

- [orama-chat-user-message](orama-chat-user-message)
- [orama-chat-assistent-message](orama-chat-assistent-message)

### Graph
```mermaid
graph TD;
  orama-chat-messages-container --> orama-chat-user-message
  orama-chat-messages-container --> orama-chat-assistent-message
  orama-chat-assistent-message --> orama-span
  orama-chat --> orama-chat-messages-container
  style orama-chat-messages-container fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*