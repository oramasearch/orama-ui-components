import type { ChatService } from '@/services/ChatService'
import { createStore } from '@stencil/store'
import type { SourcesMap } from '@/types'

// TODO: Seems like there is no message type being exported from orama-client rn
// export type TChatMessageBlock = {
//   type: 'text' | 'component' | 'sources'
//   received?: boolean
//   content: string
// }

// TODO;: this type should be imported from orama-client
export enum TAnswerStatus {
  idle = 'idle',
  loading = 'loading', // waiting for sources to be fetched
  rendering = 'rendering', // rendering interaction sources
  streaming = 'streaming', // streaming interaction answer
  error = 'error',
  aborted = 'aborted',
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
  sources?: any // should be Results<any> from orama-client
  latest?: boolean
  status: TAnswerStatus
  interactionId?: string
  relatedQueries?: string[]
}

const { state: chatContext, ...chatStore } = createStore({
  chatService: null as ChatService | null,
  interactions: [] as TChatInteraction[] | null,
  sourceBaseURL: '' as string,
  linksTarget: '_blank' as string,
  linksRel: 'noopener noreferrer' as string,
  prompt: '',
  sourcesMap: {
    title: 'title',
    description: 'description',
    path: 'path',
  } as SourcesMap,
})

export { chatContext, chatStore }
