import { OramaChatBox, OramaSearchBox, OramaSearchButton } from '@orama/react-components'
import './App.css'

import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router'

const API_KEY = 'LerNlbp6379jVKaPs4wt2nZT4MJZbU1J'
const ENDPOINT = 'https://cloud.orama.run/v1/indexes/docs-orama-b3f5xd'

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <NavLink to="/" end>
            ChatBox
          </NavLink>
          <NavLink to="/chat" end>
            SearchBox
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<ChatBoxPage />} />
          <Route path="/chat" element={<SearchBoxPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

const ChatBoxPage = () => {
  return (
    <>
      <main>
        <section>
          <h1>App React</h1>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
            aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
            dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
            sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore
            magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
            suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in
            ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas
            nulla pariatur?
          </p>
          <section>
            <h2>ChatBox in a section</h2>
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
          </section>
        </section>
      </main>
    </>
  )
}

const SearchBoxPage = () => {
  const navigate = useNavigate()
  return (
    <>
      <main>
        <section>
          <div className="component-row">
            <OramaSearchButton colorScheme="system">Search</OramaSearchButton>
            <OramaSearchBox
              colorScheme="system"
              index={{
                api_key: API_KEY,
                endpoint: ENDPOINT,
              }}
              suggestions={['Suggestion 1', 'Suggestion 2', 'Suggestion 3']}
              onSearchCompleted={(e: Event) => console.log(e)}
              onSearchResultClick={(e) => {
                e.preventDefault()
                alert('Moving back to home page')
                navigate('/')
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
        </section>
      </main>
    </>
  )
}

export default App
