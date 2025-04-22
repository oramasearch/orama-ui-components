'use client'
import React from 'react'
import { Tabs } from 'radix-ui'
import { CollectionManager } from '@orama/core'
import { OramaChatBox, OramaSearchBox, OramaSearchButton } from '@orama/react-components'

const clientInstance = new CollectionManager({
  url: 'https://oramacore.orama.foo',
  collectionID: 'cxlenmho72jp3qpbdphbmfdn',
  readAPIKey: 'caTS1G81uC8uBoWICSQYzmGjGVBCqxrf',
})

const Orama = () => {
  const [initialPrompt, setInitialPrompt] = React.useState('')

  return (
    <div>
      <OramaSearchButton style={{ marginBottom: '24px' }} />
      <OramaSearchBox oramaCoreClientInstance={clientInstance} colorScheme={'light'} />
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
