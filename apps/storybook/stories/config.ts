import type { Components } from '@orama/wc-components'
import { OramaClient } from '@oramacloud/client'
import { CollectionManager } from '@orama/core'
import { create, insert } from '@orama/orama'

export type DemoIndexConfig = Record<string, Components.OramaSearchBox>

// Create an Orama.js database for the OSS example
const createOramaJSDatabase = async () => {
  // Create a new database
  const db = await create({
    schema: {
      title: 'string',
      content: 'string',
      category: 'string',
      url: 'string',
    },
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

// Create the database instance
// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
let oramaJSDatabase
createOramaJSDatabase().then((db) => {
  oramaJSDatabase = db
})

const demoIndexes: DemoIndexConfig = {
  orama: {
    open: true,
    // index: {
    //   api_key: 'LerNlbp6379jVKaPs4wt2nZT4MJZbU1J',
    //   endpoint: 'https://cloud.orama.run/v1/indexes/docs-orama-b3f5xd',
    // },
    // Uncomment this line to use the OramaClient instance and comment the index prop
    clientInstance: new OramaClient({
      api_key: 'LerNlbp6379jVKaPs4wt2nZT4MJZbU1J',
      endpoint: 'https://cloud.orama.run/v1/indexes/docs-orama-b3f5xd',
    }),
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

  oramaCore: {
    open: true,
    oramaCoreClientInstance: new CollectionManager({
      url: 'https://oramacore.orama.foo',
      collectionID: 'cxlenmho72jp3qpbdphbmfdn',
      readAPIKey: 'caTS1G81uC8uBoWICSQYzmGjGVBCqxrf',
    }),
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
  oramaJS: {
    open: true,
    // Use the Orama.js database instance
    clientInstance: oramaJSDatabase,
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
