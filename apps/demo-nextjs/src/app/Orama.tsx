'use client'
import { Tabs } from 'radix-ui'
import { OramaChatBox, OramaSearchBox, OramaSearchButton } from '@orama/react-components'

const API_KEY = 'LerNlbp6379jVKaPs4wt2nZT4MJZbU1J'
const ENDPOINT = 'https://cloud.orama.run/v1/indexes/docs-orama-b3f5xd'

const Orama = () => {
  return (
    <div>
      <OramaSearchButton style={{ marginBottom: '24px' }} />
      <OramaSearchBox index={{ api_key: API_KEY, endpoint: ENDPOINT }} colorScheme={'light'} />
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
          <div style={{ height: '600px' }}>
            <OramaChatBox
              index={{ api_key: API_KEY, endpoint: ENDPOINT }}
              clearChatOnDisconnect={false}
              prompt="what is orama?"
              style={{ height: '100%' }}
            />
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

export default Orama
