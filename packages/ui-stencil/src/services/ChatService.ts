import type { AskParams } from '@oramacloud/client'
import type { AnswerSession as OSSAnswerSession } from '@orama/orama'
import type { AnswerSession as CloudAnswerSession } from '@oramacloud/client'
import type { AnswerSession } from '@orama/core'
import type { OramaClient } from '@oramacloud/client'
import type { CollectionManager } from '@orama/core'
import type { AnyOrama } from '@orama/orama'
import { OramaClientNotInitializedError } from '@/erros/OramaClientNotInitialized'
import { TAnswerStatus, type OnAnswerGeneratedCallbackProps } from '@/types'
import type { ChatStoreType } from '@/ParentComponentStore/ChatStore'
import { Switch, type OramaSwitchClient } from '@orama/switch'

export class ChatService {
  answerSession: OSSAnswerSession | CloudAnswerSession<true> | AnswerSession
  private oramaClient: Switch<OramaSwitchClient>
  private chatStore: ChatStoreType

  constructor(oramaClient: OramaClient | CollectionManager | AnyOrama , chatStore: ChatStoreType) {
    this.oramaClient = new Switch(oramaClient)
    this.chatStore = chatStore
  }

  sendQuestion = async (
    term: string,
    systemPrompts?: string[],
    callbacks?: {
      onAnswerGeneratedCallback?: (onAnswerGeneratedCallback: OnAnswerGeneratedCallbackProps) => unknown
    },
  ) => {
    if (!this.oramaClient) throw new OramaClientNotInitializedError()

    // Define askParams for use in callbacks
    const askParams = {
      term
    }

    if (systemPrompts?.length) {
      if (this.answerSession && 'setSystemPromptConfiguration' in this.answerSession) {
        (this.answerSession as any).setSystemPromptConfiguration(systemPrompts)
      }
    }

    const existingInteractions = this.chatStore.state.interactions
    
    if (!this.answerSession) {
      try {
        const existingInteractions = this.chatStore.state.interactions
        
        try {
          this.answerSession = (this.oramaClient as any).createAnswerSession({
            events: {
              onStateChange: (state: any) => {
                // Filter out empty interactions
                const normalizedState = state.filter((stateItem) => !!stateItem.query)

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

                    // Handle sources in different formats
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
        } catch (methodError) {
          console.error('Client does not support createAnswerSession method:', methodError)
          this.chatStore.state.interactions = [
            ...(existingInteractions || []),
            {
              query: term,
              interactionId: `interaction-${Date.now()}`,
              response: 'Sorry, this client does not support chat functionality.',
              status: TAnswerStatus.error,
              latest: true,
              sources: [],
            },
          ]
          return
        }
      } catch (error) {
        console.error('Error creating answer session:', error)
        this.chatStore.state.interactions = [
          ...(existingInteractions || []),
          {
            query: term,
            interactionId: `interaction-${Date.now()}`,
            response: 'Sorry, there was an error creating the answer session. Please try again later.',
            status: TAnswerStatus.error,
            latest: true,
            sources: [],
          },
        ]
        return
      }
    }

    try {
      if (!this.answerSession) {
        console.error('Answer session was not created')
        return
      }
      
      // Try to use ask method first as it might be more stable   
      try {
        const askParams: AskParams = {
          term: term,
          limit: 10,
          threshold: 0.5,
          userData: {
            interactionID: `interaction-${Date.now()}`,
            sessionID: `session-${Date.now()}`,
            visitorID: `visitor-${Date.now()}`
          }
        }
        const response = await (this.answerSession as any).ask(askParams)
      } catch (askError) {
        console.error('Error using ask method, falling back to answerStream:', askError)
        // Fall back to answerStream if ask fails
        try {
          this.tryAnswerStream(term)
        } catch (streamError) {
          console.error('Error using answerStream method:', streamError)
          // Update chat store to show error to user
          const latestInteraction = this.chatStore.state.interactions[this.chatStore.state.interactions.length - 1]
          if (latestInteraction) {
            latestInteraction.status = TAnswerStatus.error
            latestInteraction.response = 'Sorry, the answer service is not available. Please try again later.'
            this.chatStore.state.interactions = [...this.chatStore.state.interactions]
          }
        }
      }
    } catch (e) {
      console.error('Error in answer method:', e)
    }
  }

  private tryAnswerStream = (term: string) => {
    // Create proper params object for answerStream with required fields
    const streamParams = {
      term: term,
      limit: 10,
      threshold: 0.5,
      // Add required fields for AnswerConfig
      interactionID: `interaction-${Date.now()}`,
      query: term,
      visitorID: `visitor-${Date.now()}`,
      sessionID: `session-${Date.now()}`
    }
    
    try {
      const answerStream = (this.answerSession as any).answerStream(streamParams)

      // Create a helper function to process the AsyncGenerator
      const processAsyncGenerator = async () => {
        try {
          // Proper way to iterate over an AsyncGenerator
          for await (const answer of answerStream) {
            // Process answer silently
          }
        } catch (error) {
          console.error('Error processing answer stream:', error)
          
          // Update chat store to show error to user
          const latestInteraction = this.chatStore.state.interactions[this.chatStore.state.interactions.length - 1]
          if (latestInteraction) {
            latestInteraction.status = TAnswerStatus.error
            latestInteraction.response = 'Sorry, there was an error processing your request. Please try again later.'
            this.chatStore.state.interactions = [...this.chatStore.state.interactions]
          }
        }
      }
      
      // Start processing but don't await it (non-blocking)
      processAsyncGenerator()
    } catch (error) {
      console.error('Error creating answer stream:', error)
    }
  }

  abortAnswer = () => {
    if (!this.answerSession) {
      throw new OramaClientNotInitializedError()
    }

    (this.answerSession as any).abortAnswer()
  }

  regenerateLatest = async () => {
    if (!this.answerSession) {
      throw new OramaClientNotInitializedError()
    }

    (this.answerSession as any).regenerateLast({ stream: false })
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
