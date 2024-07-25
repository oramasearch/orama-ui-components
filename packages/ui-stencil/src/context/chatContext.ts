import type { ChatService } from '@/services/ChatService'
import { createStore } from '@stencil/store'

// TODO: Seems like there is no message type being exported from orama-client rn
// export type TChatMessageBlock = {
//   type: 'text' | 'component' | 'sources'
//   received?: boolean
//   content: string
// }

// TODO;: this type should be imported from orama-client
export enum TAnswerStatus {
  idle = 'idle',
  loading = 'loading',
  streaming = 'streaming',
  error = 'error',
  done = 'done',
}

export type TSource = {
  title: string
  description?: string
  path: string
}

export type TChatInteraction = {
  query: string
  response?: string
  sources?: TSource[]
  latest?: boolean
  status: TAnswerStatus
  interactionId?: string
  relatedQueries?: string[]
}

const { state: chatContext, ...chatStore } = createStore({
  chatService: null as ChatService | null,
  interactions: [] as TChatInteraction[],
  sourceBaseURL: '' as string,
  lockScrollOnBottom: true as boolean,
})

export { chatContext, chatStore }
