import type { AskParams } from '@oramacloud/client'
import type { AnswerSession as OSSAnswerSession } from '@orama/orama'
import type { AnswerSession as CloudAnswerSession } from '@oramacloud/client'
import type { AnswerConfig, AnswerSession as CoreAnswerSession } from '@orama/core'
import type { OramaClient } from '@oramacloud/client'
import type { CollectionManager } from '@orama/core'
import type { AnyOrama } from '@orama/orama'
import { OramaClientNotInitializedError } from '@/erros/OramaClientNotInitialized'
import {
  type SourcesMap,
  TAnswerStatus,
  type OnAnswerGeneratedCallbackProps,
  type SourcesMapItem,
  type SourcesMapKeys,
  type SourcesMapRenderFunction,
} from '@/types'
import type { ChatStoreType } from '@/ParentComponentStore/ChatStore'
import { Switch, type OramaSwitchClient } from '@orama/switch'

const parseRelatedQueries = (relatedQueries: string) => {
  try {
    return JSON.parse(relatedQueries)
  } catch (error) {
    return []
  }
}

export class ChatService {
  private answerSession: OSSAnswerSession | CloudAnswerSession<true> | CoreAnswerSession
  private client: Switch<OramaSwitchClient> | CollectionManager
  private chatStore: ChatStoreType

  constructor(oramaClient: OramaClient | AnyOrama, oramaCoreClient: CollectionManager, chatStore: ChatStoreType) {
    this.client = oramaCoreClient ? oramaCoreClient : new Switch(oramaClient)
    this.chatStore = chatStore
  }

  private getSourcesMapObjectByIndexId = (resultMapArrayOrObject: SourcesMap, indexId: string): SourcesMapItem => {
    const searchMapArray = Array.isArray(resultMapArrayOrObject) ? resultMapArrayOrObject : [resultMapArrayOrObject]

    // If there is only one source map, assume it's the one for all hits, regardless of datasourceId
    if (searchMapArray.length === 1) {
      return searchMapArray[0]
    }

    // TODO: Instead of doing it per each HIT, we may want to create a map of datasourceId -> resultMap to avoid the O(n) lookup
    const sourcesMapMatch = searchMapArray.find((resultMap) => resultMap.datasourceId === indexId)

    return sourcesMapMatch || {}
  }

  private getResultMapValue(
    sourceMapKey: SourcesMapKeys,
    sourceMapObject: SourcesMapItem,
    rawSource: { document: unknown; index_id: string },
  ): string {
    const sourcesMapFunctionOrString = sourceMapObject?.[sourceMapKey]

    if (!sourcesMapFunctionOrString) {
      return undefined
    }

    if (typeof sourcesMapFunctionOrString === 'function') {
      const sourcesMapFunction = sourcesMapFunctionOrString as SourcesMapRenderFunction
      return sourcesMapFunction(rawSource.document, rawSource.index_id)
    }

    const resultMapString = sourceMapObject[sourceMapKey] as string
    return rawSource.document[resultMapString]
  }

  sendQuestion = async (
    term: string,
    relatedQueries?: number,
    systemPrompts?: string[],
    callbacks?: {
      onAnswerGeneratedCallback?: (onAnswerGeneratedCallback: OnAnswerGeneratedCallbackProps) => unknown
    },
  ) => {
    if (!this.client) throw new OramaClientNotInitializedError()

    const askParams: AskParams = {
      term,
    }

    if (systemPrompts?.length) {
      if (this.answerSession && 'setSystemPromptConfiguration' in this.answerSession) {
        ;(this.answerSession as any).setSystemPromptConfiguration(systemPrompts)
      }
    }

    const existingInteractions = this.chatStore.state.interactions

    if (!this.answerSession) {
      try {
        const existingInteractions = this.chatStore.state.interactions

        try {
          /* TODO: Inferfaces between Orama Core and Orama Cloud are different.
            we must cast the client to the correct type and use different implementations.

            We are not doing that for the sake of speed, but we must circle back to this.
          */
          this.answerSession = this.client.createAnswerSession({
            events: {
              onStateChange: (state) => {
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
                      const rawSources: { document: unknown; index_id: string }[] = Array.isArray(interaction.sources)
                        ? interaction.sources
                        : interaction.sources.hits

                      sources = rawSources.map((source) => {
                        const matchingMap = this.getSourcesMapObjectByIndexId(
                          this.chatStore.state.sourcesMap,
                          source.index_id,
                        )

                        const title = this.getResultMapValue('title', matchingMap, source)
                        const description = this.getResultMapValue('description', matchingMap, source)
                        const path = this.getResultMapValue('path', matchingMap, source)

                        return {
                          title,
                          description,
                          path,
                        }
                      })
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

                    const relatedQueries = interaction.related

                    return {
                      query: interaction.query,
                      // interactionId for Old Orama and id for Orama Core
                      interactionId: interaction.interactionId || interaction.id,
                      response: interaction.response,
                      relatedQueries: parseRelatedQueries(relatedQueries),
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
            response: 'Sorry, there was an error creating the answer session. Please try again later.',
            status: TAnswerStatus.error,
            latest: true,
            sources: [],
          },
        ]
        return
      }
    }

    if (!this.answerSession) {
      console.error('Answer session was not created')
      return
    }

    try {
      // Check existence of answerStream method (means that the client is Orama Core)
      if ((this.answerSession as CoreAnswerSession).answer) {
        this.askOramaCore(term, relatedQueries)
      } else {
        this.askOramaCloud(term)
      }
    } catch (error) {
      // Update chat store to show error to user
      const latestInteraction = this.chatStore.state.interactions[this.chatStore.state.interactions.length - 1]
      if (latestInteraction) {
        latestInteraction.status = TAnswerStatus.error
        latestInteraction.response = 'Sorry, the answer service is not available. Please try again later.'
        this.chatStore.state.interactions = [...this.chatStore.state.interactions]
      }
    }
  }

  private askOramaCore = (query: string, relatedQueries?: number) => {
    console.log('askOramaCore', query, relatedQueries)
    const streamParams: AnswerConfig = {
      query,
      ...(relatedQueries
        ? {
            related: {
              enabled: true,
              size: relatedQueries,
              format: 'query',
            },
          }
        : {}),
    }

    const answerStream = (this.answerSession as CoreAnswerSession).answerStream(streamParams)

    const processAsyncGenerator = async () => {
      for await (const _ of answerStream) {
      }
    }

    processAsyncGenerator()
  }

  private askOramaCloud = (term: string) => {
    const askParams: AskParams = {
      term: term,
      limit: 10,
      threshold: 0.5,
    }

    const oldAnswerSession = this.answerSession as OSSAnswerSession | CloudAnswerSession<true>
    oldAnswerSession.ask(askParams)
  }

  abortAnswer = () => {
    if (!this.answerSession) {
      throw new OramaClientNotInitializedError()
    }

    if ((this.answerSession as CoreAnswerSession).abort) {
      ;(this.answerSession as CoreAnswerSession).abort()
    } else {
      ;(this.answerSession as OSSAnswerSession | CloudAnswerSession<true>).abortAnswer()
    }
  }

  regenerateLatest = async () => {
    if (!this.answerSession) {
      throw new OramaClientNotInitializedError()
    }

    // Check if the client is Orama Cloud
    if ((this.answerSession as OSSAnswerSession | CloudAnswerSession<true>).regenerateLast) {
      const nonOramaCoreAnswerSession = this.answerSession as OSSAnswerSession | CloudAnswerSession<true>
      nonOramaCoreAnswerSession.regenerateLast({ stream: false })
    } else {
      const oramaCoreAnswerSession = this.answerSession as CoreAnswerSession
      oramaCoreAnswerSession.regenerateLast({ stream: false })
    }
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

    this.answerSession.clearSession()

    this.chatStore.state.interactions = []
  }
}
