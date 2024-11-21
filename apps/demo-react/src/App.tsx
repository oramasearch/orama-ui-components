import { OramaChatBox, OramaSearchBox, OramaSearchButton } from '@orama/react-components'
import './App.css'

function App() {
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
                  api_key: 'yl2JSnjLNBV6FVfUWEyadpjFr6KzPiDR',
                  endpoint: 'https://cloud.orama.run/v1/indexes/recipes-m7w9mm',
                }}
                style={{ height: '600px' }}
                onAnswerSourceClick={(e: Event) => console.log(e)}
                onAnswerGenerated={(e: Event) => console.log(e)}
              />
            </div>
          </section>
          <h2>Another section</h2>
          <OramaSearchButton colorScheme="system">Search</OramaSearchButton>
          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
            atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique
            sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum
            facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil
            impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor
            repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et
            voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus,
            ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
          </p>
          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
            atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique
            sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum
            facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil
            impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor
            repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et
            voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus,
            ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
          </p>
        </section>

        <section>
          <div className="component-row">
            <OramaSearchBox
              colorScheme="system"
              index={{
                api_key: 'LerNlbp6379jVKaPs4wt2nZT4MJZbU1J',
                endpoint: 'https://cloud.orama.run/v1/indexes/docs-orama-b3f5xd',
              }}
              onSearchCompleted={(e: Event) => console.log(e)}
              onSearchResultClick={(e: Event) => {
                console.log(e)
                e.preventDefault()

                console.log('Prevented')
              }}
              onAnswerGenerated={(e: Event) => console.log(e)}
              onAnswerSourceClick={(e: Event) => {
                console.log(e)
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
