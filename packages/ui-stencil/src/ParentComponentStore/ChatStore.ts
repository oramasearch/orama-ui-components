import type { ChatService } from '@/services/ChatService'
import { OramaCoreChatService } from '@/services/OramaCoreChatService'
import type { SourcesMap, TChatInteraction } from '@/types'
import type { ObservableMap } from '@stencil/store'

export const ChatStoreInitialProps = {
  chatService: null as ChatService | OramaCoreChatService | null,
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
}

export type ChatStoreType = ObservableMap<typeof ChatStoreInitialProps>
