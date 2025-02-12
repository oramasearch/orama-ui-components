import { OramaClientNotInitializedError } from '@/erros/OramaClientNotInitialized'
import { ChatStoreType } from '@/ParentComponentStore/ChatStore'
import { TAnswerStatus, type OnAnswerGeneratedCallbackProps } from '@/types'
import { CollectionManager } from '@orama/core'
import { AnswerConfig, AnswerSession } from '@orama/core/script/answer-session'

export class OramaCoreChatService {
  oramaClient: CollectionManager
  answerSession: AnswerSession
  private chatStore: ChatStoreType

  constructor(oramaClient: CollectionManager, chatStore: ChatStoreType) {
    this.oramaClient = oramaClient
    this.chatStore = chatStore
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

    if (!this.answerSession) {
      const existingInteractions = this.chatStore.state.interactions

      this.answerSession = this.oramaClient.createAnswerSession({
        initialMessages: [
          {
            role: "user",
            content: "Hello, how are you?"
          },
          {
            role: "assistant",
            content: "I'm fine, thank you! How can I help you?"
          },
        ],
        events: {
          onStateChange: (state) => {
            // TODO: Remove: this is a quick and dirty fix for odd behavior of the SDK. When we abort, it generates a new interaction with empty query and empty anwer.
            const normalizedState = state.filter((stateItem) => !!stateItem.query)
            // if (normalizedState[normalizedState.length - 1].aborted) {
            //   this.chatStore.state.interactions = this.chatStore.state.interactions.map((interaction, index) => {
            //     if (index === this.chatStore.state.interactions.length - 1) {
            //       return {
            //         ...interaction,
            //         status: TAnswerStatus.aborted,
            //       };
            //     }
            //     return interaction;
            //   });
            //   return;
            // }

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
                const hasSources = interaction.sources;
                const isValidSourceArray = Array.isArray(interaction.sources) && interaction.sources.some(source => source);
                const isValidSourceObject = !Array.isArray(interaction.sources);

                if (hasSources) {
                  if (isValidSourceArray) {
                    sources = (interaction.sources as any)?.map((source) => source.document)
                  } else if (isValidSourceObject) {
                    sources = (interaction.sources.hits as any)?.map((source) => source.document)
                  }
                }

                // if (isLatest && answerStatus === TAnswerStatus.done) {
                //   callbacks?.onAnswerGeneratedCallback?.({
                //     askParams: {

                //     },
                //     query: interaction.query,
                //     // @ts-ignore
                //     sources: interaction.sources as {id: string, score: string, document: {id: string, title: string, content: string}},
                //     answer: interaction.response,
                //   })
                // }

                return {
                  interactionId: interaction.id,
                  query: interaction.query,
                  response: interaction.response,
                  status: answerStatus,
                  latest: isLatest,
                  sources,
                  plan: interaction.plan,
                }
              }),
            ]
          },
        },
      })
    }

    const askParams: AnswerConfig = {
      interactionID: '1',
      visitorID: '1',
      sessionID: '1',
      query: term,
    }

    // TODO: ABORT/ERROR/STOP should emmit onStateChange event. Keeping the lines below as a reference
    // TODO: WE may want to reveive ask props as a Service prop instead of enforcing it here
    return this.answerSession.getPlannedAnswer(askParams).catch((error) => {
      this.chatStore.state.interactions = this.chatStore.state.interactions.map((interaction, index) => {
        if (index === this.chatStore.state.interactions.length - 1) {
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

    this.answerSession.abort()
  }

  regenerateLatest = async () => {
    if (!this.answerSession) {
      throw new OramaClientNotInitializedError()
    }

    // this.answerSession.regenerateLast({ stream: false })
    // this.answerSession.regenerate({ stream: false })
    console.log('regenerateLatest')
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
      this.answerSession.abort()
      console.log('abortAnswer')
    }

    // this.answerSession.clearSession()
    console.log('clearSession')
    this.chatStore.state.interactions = []
  }
}
