'use client'
import React from 'react'
import { Tabs } from 'radix-ui'
import { CollectionManager } from '@orama/core'
import { OramaChatBox, OramaSearchBox, OramaSearchButton } from '@orama/react-components'

const clientInstance = new CollectionManager({
  url: 'https://collections.orama.com',
  collectionID: 'ncd7zwmirytw1o47dogru4bz',
  readAPIKey: 'df00PbXP0dbRUcJgFeFZSNNb7AhsqCw8',
})

const Orama = () => {
  const [initialPrompt, setInitialPrompt] = React.useState('')

  return (
    <div>
      <OramaSearchButton style={{ marginBottom: '24px' }} />
      <OramaSearchBox
        oramaCoreClientInstance={clientInstance}
        colorScheme={'light'}
        resultMap={[
          {
            title: 'name',
            description: (item: { sex: string; country: string }) => `${item.sex} - ${item.country}`,
            datasourceId: 'afvto8jyhbt1we54zait7nmo',
          },
          {
            title: 'Title',
            description: 'Genre',
            path: 'ip_address',
            datasourceId: 'qn426ptegyc8owv9y0kd3imj',
          },
        ]}
        sourcesMap={[
          {
            title: 'name',
            description: (item: { sex: string; country: string }) => `${item.sex} - ${item.country}`,
            path: 'country',
            datasourceId: 'afvto8jyhbt1we54zait7nmo',
          },
          {
            title: 'Title',
            description: 'Genre',
            path: 'Poster',
            datasourceId: 'qn426ptegyc8owv9y0kd3imj',
          },
        ]}
      />
      <Tabs.Root className="TabsRoot" defaultValue="tab1">
        <Tabs.List className="TabsList" aria-label="Manage your account">
          <Tabs.Trigger className="TabsTrigger" value="tab1">
            Tab 1
          </Tabs.Trigger>
          <Tabs.Trigger className="TabsTrigger" value="tab2">
            Tab 2
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="TabsContent" value="tab1">
          <p className="Text">Some content for tab 1. Switch to tab 2 to see chatbox.</p>
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="tab2">
          <p className="Text">Tab with chatbox here</p>
          <div style={{ height: '400px' }}>
            <OramaChatBox
              oramaCoreClientInstance={clientInstance}
              clearChatOnDisconnect={false}
              sourcesMap={{
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                title: (item: any, datasourceId) => {
                  console.log(item)
                  if (datasourceId === 'afvto8jyhbt1we54zait7nmo') {
                    return item.name
                  }

                  return item.Title
                },
                // biome-ignore lint/suspicious/noExplicitAny: Indeed uknown data
                description: (item: any, datasourceId) => {
                  if (datasourceId === 'afvto8jyhbt1we54zait7nmo') {
                    return `${item.sex} - ${item.country}`
                  }

                  return item.Description
                },
                path: 'country',
              }}
              onClearChat={() => setInitialPrompt('')}
              onStartConversation={(e: Event) => console.log('onStartConversation', e)}
              prompt={initialPrompt}
              style={{ height: '100%' }}
            />
          </div>
          <p>
            <b>Chat suggestions</b>
          </p>
          <button
            type="button"
            onClick={(e) => {
              const text = (e.target as HTMLButtonElement).innerText
              setInitialPrompt(text)
            }}
          >
            What is Orama?
          </button>
          <button
            type="button"
            onClick={(e) => {
              const text = (e.target as HTMLButtonElement).innerText
              setInitialPrompt(text)
            }}
          >
            Does Orama have an integration with Strapi?
          </button>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

export default Orama
