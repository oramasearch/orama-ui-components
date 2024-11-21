import type { OramaClient, AnswerSession, AskParams } from '@oramacloud/client'
import { OramaClientNotInitializedError } from '@/erros/OramaClientNotInitialized'
import { chatContext, TAnswerStatus } from '@/context/chatContext'
import type { OnAnswerGeneratedCallbackProps } from '@/types'

export class ChatService {
  oramaClient: OramaClient
  answerSession: AnswerSession<true>

  constructor(oramaClient: OramaClient) {
    this.oramaClient = oramaClient
  }

  sendQuestion = (
    term: string,
    systemPrompts?: string[],
    callbacks?: {
      onAnswerGeneratedCallback?: (onAnswerGeneratedCallback: OnAnswerGeneratedCallbackProps) => unknown
    },
  ) => {
    if (!this.oramaClient) {
      throw new OramaClientNotInitializedError()
    }

    const askParams: AskParams = { term: term, related: { howMany: 3, format: 'question' } }

    if (!this.answerSession) {
      this.answerSession = this.oramaClient.createAnswerSession({
        events: {
          onStateChange: (state) => {
            // TODO: Remove: this is a quick and dirty fix for odd behavior of the SDK. When we abort, it generates a new interaction with empty query and empty anwer.
            const normalizedState = state.filter((stateItem) => !!stateItem.query)
            // if (normalizedState[normalizedState.length - 1].aborted) {
            //   chatContext.interactions = chatContext.interactions.map((interaction, index) => {
            //     if (index === chatContext.interactions.length - 1) {
            //       return {
            //         ...interaction,
            //         status: TAnswerStatus.aborted,
            //       };
            //     }
            //     return interaction;
            //   });
            //   return;
            // }
            chatContext.interactions = normalizedState.map((interaction, index) => {
              const isLatest = state.length - 1 === index
              let answerStatus = TAnswerStatus.loading

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
              const sources = (interaction.sources as any)?.map((source) => source.document)

              if (isLatest && answerStatus === TAnswerStatus.done) {
                callbacks?.onAnswerGeneratedCallback?.({
                  askParams: askParams,
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
            })
          },
        },
      })

      if (systemPrompts) {
        this.answerSession.setSystemPromptConfiguration({ systemPrompts })
      }
    }

    // TODO: ABORT/ERROR/STOP should emmit onStateChange event. Keeping the lines below as a reference
    // TODO: WE may want to reveive ask props as a Service prop instead of enforcing it here
    return this.answerSession.ask(askParams).catch((error) => {
      chatContext.interactions = chatContext.interactions.map((interaction, index) => {
        if (index === chatContext.interactions.length - 1) {
          return {
            ...interaction,
            status: TAnswerStatus.error,
          }
        }
        return interaction
      })
      console.error(error)
    })
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

    if (chatContext.interactions.length < 1) {
      return
    }

    // TODO: SDK should abort any streaming before cleaning the sessions. It is not doing that today
    if (
      ['loading', 'rendering', 'streaming'].includes(
        chatContext.interactions[chatContext.interactions.length - 1].status,
      )
    ) {
      this.answerSession.abortAnswer()
    }

    this.answerSession.clearSession()
  }
}
