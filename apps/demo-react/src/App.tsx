import { OramaChatBox, OramaSearchBox, OramaSearchButton } from '@orama/react-components'
import './App.css'

import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router'

const API_KEY = 'LerNlbp6379jVKaPs4wt2nZT4MJZbU1J'
const ENDPOINT = 'https://cloud.orama.run/v1/indexes/docs-orama-b3f5xd'

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
            index={{
              api_key: API_KEY,
              endpoint: ENDPOINT,
            }}
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
            index={{
              api_key: API_KEY,
              endpoint: ENDPOINT,
            }}
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
