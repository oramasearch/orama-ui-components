import { OramaChatBox, OramaSearchBox, OramaSearchButton } from '@orama/react-components'
import './App.css'
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router'
import { CollectionManager } from '@orama/core'

const ORAMACORE_ENDPOINT = 'https://oramacore.orama.foo'
const ORAMACORE_COLLECTION_ID = 'iq4km9an1dqgzk6nuhudf9s2'
const ORAMACORE_READ_API_KEY = 'b3jAPTFHAoZ3j5iEKN7jKMn0J3CyBvMK'

// Create a CollectionManager instance
const collectionManager = new CollectionManager({
  url: ORAMACORE_ENDPOINT,
  collectionID: ORAMACORE_COLLECTION_ID,
  readAPIKey: ORAMACORE_READ_API_KEY,
})


function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <NavLink to="/searchbox" end>
            SearchBox
          </NavLink>
          <NavLink to="/chat" end>
            ChatBox
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/searchbox" />} />
          <Route path="/searchbox" element={<SearchBoxPage />} />
          <Route path="/chat" element={<ChatBoxPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

const ChatBoxPage = () => {
  return (
    <>
      <main>
        <h2 style={{ textAlign: 'center' }}>CHAT BOX</h2>
        <div className="component-row">
          <OramaChatBox
            sourcesMap={{description: "content"}}
            clientInstance={collectionManager}
            style={{ height: '600px' }}
            onAnswerSourceClick={(e: Event) => console.log(e)}
            onAnswerGenerated={(e: Event) => console.log(e)}
            chatMarkdownLinkTitle={({ text }: { text: string; href: string }) => text?.toUpperCase()}
            chatMarkdownLinkHref={({ href }: { text: string; href: string }) => href}
            onChatMarkdownLinkClicked={(e: Event) => {
              console.log(e)
              e.preventDefault()
            }}
          />
        </div>
      </main>
    </>
  )
}

const SearchBoxPage = () => {
  return (
    <>
      <main>
        <h2 style={{ textAlign: 'center' }}>SEARCH BOX</h2>
        <div className="component-row">
        <OramaSearchButton colorScheme="system">Search</OramaSearchButton>
          <OramaSearchBox
            resultMap={{description: "content"}}
            onModalClosed={() => {
              console.log('closed')
            }}
            onModalStatusChanged={(e: CustomEvent) => {
              console.log('Status changed to: ', e.detail.open)
            }}
            colorScheme="system"
            clientInstance={collectionManager}
            suggestions={['Suggestion 1', 'Suggestion 2', 'Suggestion 3']}
            onSearchCompleted={(e: Event) => console.log(e)}
            onSearchResultClick={(e: React.MouseEvent) => {
              e.preventDefault()
              alert('Element clicked')
            }}
            onAnswerGenerated={(e: Event) => console.log(e)}
            onAnswerSourceClick={(e: Event) => {
              console.log(e)
              e.preventDefault()
            }}
            chatMarkdownLinkTitle={({ text }: { text: string; href: string }) => text?.toUpperCase()}
            chatMarkdownLinkHref={({ href }: { text: string; href: string }) => href}
            onChatMarkdownLinkClicked={(e: React.MouseEvent) => {
              alert('Callback on client side')
              e.preventDefault()
            }}
          />
        </div>
      </main>
    </>
  )
}

export default App
