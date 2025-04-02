import { OramaChatBox, OramaSearchBox, OramaSearchButton } from '@orama/react-components'
import './App.css'
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router'
import { CollectionManager } from '@orama/core'

const ORAMACORE_ENDPOINT = ''
const ORAMACORE_COLLECTION_ID = ''
const ORAMACORE_READ_API_KEY = ''

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
            clientInstance={collectionManager}
            style={{ height: '600px' }}
            onAnswerSourceClick={(e: Event) => console.log(e)}
            onAnswerGenerated={(e: Event) => console.log(e)}
            chatMarkdownLinkTitle={({ text }) => text?.toUpperCase()}
            chatMarkdownLinkHref={({ href }) => href}
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
            onModalClosed={() => {
              console.log('closed')
            }}
            onModalStatusChanged={(e) => {
              console.log('Status changed to: ', e.detail.open)
            }}
            colorScheme="system"
            clientInstance={collectionManager}
            suggestions={['Suggestion 1', 'Suggestion 2', 'Suggestion 3']}
            onSearchCompleted={(e: Event) => console.log(e)}
            onSearchResultClick={(e) => {
              e.preventDefault()
              alert('Element clicked')
            }}
            onAnswerGenerated={(e: Event) => console.log(e)}
            onAnswerSourceClick={(e: Event) => {
              console.log(e)
              e.preventDefault()
            }}
            chatMarkdownLinkTitle={({ text }) => text?.toUpperCase()}
            chatMarkdownLinkHref={({ href }) => href}
            onChatMarkdownLinkClicked={(e) => {
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
