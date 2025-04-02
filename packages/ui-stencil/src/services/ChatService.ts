import type { AskParams } from '@oramacloud/client'
import type { AnswerSession as OSSAnswerSession } from '@orama/orama'
import type { AnswerSession } from '@orama/core'
import type { OramaSwitchClient } from '@orama/switch'
import { OramaClientNotInitializedError } from '@/erros/OramaClientNotInitialized'
import { TAnswerStatus, type OnAnswerGeneratedCallbackProps } from '@/types'
import type { ChatStoreType } from '@/ParentComponentStore/ChatStore'

export class ChatService {
  private oramaClient: any
  answerSession: AnswerSession | OSSAnswerSession | any
  private chatStore: ChatStoreType

  constructor(oramaClient: OramaSwitchClient, chatStore: ChatStoreType) {
    this.oramaClient = oramaClient
    this.chatStore = chatStore
    console.log('ChatService initialized with client:', this.oramaClient)
  }

  sendQuestion = async (
    term: string,
    systemPrompts?: string[],
    callbacks?: {
      onAnswerGeneratedCallback?: (onAnswerGeneratedCallback: OnAnswerGeneratedCallbackProps) => unknown
    },
  ) => {
    if (!this.oramaClient) throw new OramaClientNotInitializedError()
    console.log('sendQuestion called with term:', term)

    // Define askParams for use in callbacks
    const askParams = {
      term,
      interactionID: `interaction-${Date.now()}`,
      sessionID: `session-${Date.now()}`,
      visitorID: `visitor-${Date.now()}`,
    }

    if (systemPrompts?.length) {
      console.log('Setting system prompts:', systemPrompts)
      if (this.answerSession && 'setSystemPromptConfiguration' in this.answerSession) {
        (this.answerSession as any).setSystemPromptConfiguration(systemPrompts)
      }
    }

    const existingInteractions = this.chatStore.state.interactions

    console.log('Creating answer session with client:', this.oramaClient)
    console.log('Client has createAnswerSession method:', !!this.oramaClient.createAnswerSession)
    
    if (!this.answerSession) {
      const existingInteractions = this.chatStore.state.interactions
      this.answerSession = this.oramaClient.createAnswerSession({
        events: {
          onStateChange: (state) => {
            console.log('Answer session state changed:', state)
            // TODO: Remove: this is a quick and dirty fix for odd behavior of the SDK. When we abort, it generates a new interaction with empty query and empty anwer.
            const normalizedState = state.filter((stateItem) => !!stateItem.query)
            console.log('Normalized state:', normalizedState)

            this.chatStore.state.interactions = [
              ...(existingInteractions || []),
              ...normalizedState.map((interaction, index) => {
                const isLatest = state.length - 1 === index
                let answerStatus = TAnswerStatus.loading
                let sources = []

                if (interaction.aborted) {
                  answerStatus = TAnswerStatus.aborted
                } else if (interaction.loading && interaction.sources) {
                  answerStatus = TAnswerStatus.rendering
                } else if (interaction.loading && interaction.response) {
                  answerStatus = TAnswerStatus.streaming
                } else if (!interaction.loading && interaction.response) {
                  answerStatus = TAnswerStatus.done
                }

                // biome-ignore lint/suspicious/noExplicitAny: Client should expose this type
                /**
                 * we usually expected to receive interaction.sources as an array, but sometimes it comes as an object.
                 * need to check OSS Orama and fix it if it's a bug.
                 **/
                if (interaction.sources) {
                  sources = Array.isArray(interaction.sources)
                    ? (interaction.sources as any)?.map((source) => source.document)
                    : (interaction.sources.hits as any)?.map((source) => source.document)
                }

                if (isLatest && answerStatus === TAnswerStatus.done) {
                  callbacks?.onAnswerGeneratedCallback?.({
                    askParams,
                    query: interaction.query,
                    sources: interaction.sources,
                    answer: interaction.response,
                    segment: interaction.segment,
                    trigger: interaction.trigger,
                  })
                }

                return {
                  query: interaction.query,
                  interactionId: interaction.interactionId,
                  response: interaction.response,
                  relatedQueries: interaction.relatedQueries,
                  status: answerStatus,
                  latest: isLatest,
                  sources,
                }
              }),
            ]
          },
        },
      })
    }

    console.log('Answer session created:', this.answerSession)
    console.log('Answer session has answerStream method:', !!this.answerSession.answerStream)

    try {
      if (this.answerSession.answerStream) {
        console.log('Using answerStream method')
        const answerStream = this.answerSession.answerStream({
          query: term,
          interactionID: `interaction-${Date.now()}`,
          sessionID: `session-${Date.now()}`,
          visitorID: `visitor-${Date.now()}`,
        })

        // Create a helper function to process the AsyncGenerator
        const processAsyncGenerator = async () => {
          try {
            // Proper way to iterate over an AsyncGenerator
            for await (const answer of answerStream) {
              console.log('Answer stream response:', answer)
            }
          } catch (error) {
            console.error('Error processing answer stream:', error)
          }
        }
        
        // Start processing but don't await it (non-blocking)
        processAsyncGenerator()
      } else if (this.answerSession.ask) {
        // Fallback to ask method if available
        console.log('Using ask method')
        const response = await this.answerSession.ask(term)
        console.log('Ask method response:', response)
      } else {
        console.error('Neither answerStream nor ask method is available')
      }
    } catch (e) {
      console.error('Error in answer method:', e)
    }
  }

  abortAnswer = () => {
    if (!this.answerSession) {
      throw new OramaClientNotInitializedError()
    }

    this.answerSession.abortAnswer()
  }

  regenerateLatest = async () => {
    if (!this.answerSession) {
      throw new OramaClientNotInitializedError()
    }

    this.answerSession.regenerateLast({ stream: false })
  }

  resetChat = async () => {
    if (!this.answerSession) {
      throw new OramaClientNotInitializedError()
    }

    if (this.chatStore.state.interactions.length < 1) {
      return
    }

    // TODO: SDK should abort any streaming before cleaning the sessions. It is not doing that today
    if (
      ['loading', 'rendering', 'streaming'].includes(
        this.chatStore.state.interactions[this.chatStore.state.interactions.length - 1].status,
      )
    ) {
      this.abortAnswer()
    }

    // Clear the session if the method exists
    if ('clearSession' in this.answerSession) {
      (this.answerSession as any).clearSession()
    }
    this.chatStore.state.interactions = []
  }
}
