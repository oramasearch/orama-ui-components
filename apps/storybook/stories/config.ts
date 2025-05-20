import type { Components } from '@orama/wc-components'
import { OramaClient } from '@oramacloud/client'
import { CollectionManager } from '@orama/core'
import { create, insert } from '@orama/orama'
import { pluginSecureProxy } from '@orama/plugin-secure-proxy'

export type DemoIndexConfig = Record<
  string,
  (Components.OramaSearchBox | Components.OramaChatBox) & {
    getOramaJSDatabase?: () => ReturnType<typeof createOramaJSDatabase>
  }
>

// Create an Orama.js database for the OSS example
const createOramaJSDatabase = async () => {
  const secureProxy = await pluginSecureProxy({
    apiKey: 'y7kclx34-h_ktyBa5t7F2hgFK=uZc4C1',
    embeddings: {
      model: 'openai/text-embedding-ada-002',
      defaultProperty: 'embeddings',
      onInsert: {
        generate: true,
        properties: ['description'],
        verbose: true,
      },
    },
    chat: {
      model: 'openai/gpt-3.5-turbo',
    },
  })

  // Create a new database
  const db = await create({
    schema: {
      title: 'string',
      content: 'string',
      category: 'string',
      url: 'string',
    },
    plugins: [secureProxy],
  })

  // Insert some sample documents
  await insert(db, {
    title: 'Getting Started with Orama.js',
    content: 'Orama.js is a powerful full-text search engine that works in any JavaScript runtime.',
    category: 'Open Source',
    url: '/docs/getting-started',
  })

  await insert(db, {
    title: 'Creating a Database',
    content: 'Learn how to create and configure an Orama database for your application.',
    category: 'Open Source',
    url: '/docs/create-database',
  })

  await insert(db, {
    title: 'Searching Documents',
    content: 'Discover how to perform powerful searches across your documents with Orama.',
    category: 'Open Source',
    url: '/docs/search',
  })

  await insert(db, {
    title: 'Using Facets',
    content: 'Implement faceted search to allow users to filter and refine search results.',
    category: 'Open Source',
    url: '/docs/facets',
  })

  await insert(db, {
    title: 'Advanced Configurations',
    content: 'Explore advanced configurations and optimizations for Orama databases.',
    category: 'Open Source',
    url: '/docs/advanced',
  })

  return db
}

export type OramaDb = Awaited<ReturnType<typeof createOramaJSDatabase>>
export type CreateOramaDbResult = ReturnType<typeof createOramaJSDatabase>

const demoIndexes: DemoIndexConfig = {
  orama: {
    open: true,
    clientInstance: new OramaClient({
      api_key: 'LerNlbp6379jVKaPs4wt2nZT4MJZbU1J',
      endpoint: 'https://cloud.orama.run/v1/indexes/docs-orama-b3f5xd',
    }),
    searchPlaceholder: 'What do you want to learn about Orama?',
    sourceBaseUrl: 'https://docs.orama.com',
    sourcesMap: {
      title: 'title',
      description: 'content',
    },
    suggestions: ['What is Orama?', 'Does Orama have an integration with Strapi?', 'How to create an answer session?'],
    facetProperty: 'category',
    resultMap: {
      title: 'title',
      description: 'content',
      section: 'category',
    },
  },

  // oramaCore: {
  //   open: true,
  //   oramaCoreClientInstance: new CollectionManager({
  //     url: 'https://oramacore.orama.foo',
  //     collectionID: 'cxlenmho72jp3qpbdphbmfdn',
  //     readAPIKey: 'caTS1G81uC8uBoWICSQYzmGjGVBCqxrf',
  //   }),
  //   searchPlaceholder: 'What do you want to learn about Orama?',
  //   sourceBaseUrl: 'https://docs.orama.com',
  //   sourcesMap: {
  //     title: 'title',
  //     description: 'content',
  //   },
  //   suggestions: ['What is Orama?', 'Does Orama have an integration with Strapi?', 'How to create an answer session?'],
  //   facetProperty: 'category',
  //   resultMap: {
  //     title: 'title',
  //     description: 'content',
  //     section: 'category',
  //   },
  // },
  // Use the Orama.js database instance
  oramaJS: {
    getOramaJSDatabase: createOramaJSDatabase,
    open: true,
    sourceBaseUrl: 'https://docs.orama.com',
    sourcesMap: {
      title: 'title',
      description: 'content',
    },
    suggestions: ['How to create a database?', 'How to search documents?', 'What are facets?'],
    facetProperty: 'category',
    resultMap: {
      title: 'title',
      description: 'content',
      section: 'category',
    },
    dictionary: {
      chatPlaceholder: 'Ask about our documentation...',
      initErrorChat: 'Chat service could not be initialized',
      disclaimer: 'Orama can make mistakes. Please verify the information.',
    },
    themeConfig: {
      colors: {
        dark: {
          '--background-color-primary': '#1a1a2e',
          '--background-color-secondary': '#16213e',
          '--background-color-tertiary': '#0f3460',
          '--border-color-primary': '#e94560',
          '--backdrop-background-color-primary': 'rgba(26, 26, 46, 0.7)',
        },
      },
    },
  },
  recipes: {
    open: true,
    index: {
      api_key: 'yl2JSnjLNBV6FVfUWEyadpjFr6KzPiDR',
      endpoint: 'https://cloud.orama.run/v1/indexes/recipes-m7w9mm',
    },
    searchPlaceholder: 'What do you want to cook today?',
    sourcesMap: {
      description: 'category',
    },
    suggestions: [
      'How do I make delicious peanut butter cookies?',
      'What are the ingredients for a margherita pizza?',
      'Tell me three pasta recipes.',
    ],
    themeConfig: {
      colors: {
        dark: {
          '--background-color-primary': '#231102',
          '--background-color-secondary': '#261803',
          '--background-color-tertiary': '#3a2a2a',
          '--border-color-primary': '#443737',
          '--backdrop-background-color-primary': 'rgba(20, 3, 3, 0.7)',
        },
      },
      radius: {
        '--textarea-radius': '0.5rem',
      },
      shadow: {
        '--textarea-shadow': 'none',
      },
    },
    facetProperty: 'category',
    resultMap: {
      description: 'title',
      section: 'category',
    },
  },
  multipleDatasources: {
    open: true,
    oramaCoreClientInstance: new CollectionManager({
      url: 'https://collections.orama.com',
      collectionID: 'ncd7zwmirytw1o47dogru4bz',
      readAPIKey: 'df00PbXP0dbRUcJgFeFZSNNb7AhsqCw8',
    }),
    searchPlaceholder: 'As your question to a index with multiple datasources',
    suggestions: ['How old is Emma?', 'When Gotham was released?', 'Who is the writer of Game Of Thrones?'],
    resultMap: [
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
    ],
    sourcesMap: [
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
    ],
  },
}

demoIndexes.oramaWithCustomIcons = {
  ...demoIndexes.orama,
  resultMap: {
    ...demoIndexes.orama,
    icon: (result) => {
      return result.category === 'Open Source'
        ? 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f680.svg'
        : null
    },
  },
}

demoIndexes.multipleIndexes = {
  open: true,
  resultMap: {
    description: (doc) => {
      return doc.description || doc.content
    },
    section: (doc) => {
      return doc.genres?.[0] || doc.section
    },
  },
  index: [
    {
      api_key: 'hdRgZI3j8Z38pImkqYWbAw7SwnrJk8Nt',
      endpoint: 'https://cloud.orama.run/v1/indexes/videogames-nb9lk0',
    },
    { api_key: 'LerNlbp6379jVKaPs4wt2nZT4MJZbU1J', endpoint: 'https://cloud.orama.run/v1/indexes/docs-orama-b3f5xd' },
  ],
  suggestions: ['How to get started?'],
}

export default demoIndexes
