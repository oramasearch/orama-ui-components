import type { Components } from '@orama/wc-components'
import { OramaClient } from '@oramacloud/client'

export type DemoIndexConfig = Record<string, Components.OramaSearchBox>

const demoIndexes: DemoIndexConfig = {
  orama: {
    open: true,
    index: {
      api_key: 'LerNlbp6379jVKaPs4wt2nZT4MJZbU1J',
      endpoint: 'https://cloud.orama.run/v1/indexes/docs-orama-b3f5xd',
    },
    // Uncomment this line to use the OramaClient instance and comment the index prop
    // clientInstance: new OramaClient({
    //   api_key: 'LerNlbp6379jVKaPs4wt2nZT4MJZbU1J',
    //   endpoint: 'https://cloud.orama.run/v1/indexes/docs-orama-b3f5xd',
    // }),
    placeholder: 'What do you want to learn about Orama?',
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
  recipes: {
    open: true,
    index: {
      api_key: 'yl2JSnjLNBV6FVfUWEyadpjFr6KzPiDR',
      endpoint: 'https://cloud.orama.run/v1/indexes/recipes-m7w9mm',
    },
    placeholder: 'What do you want to cook today?',
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
    },
    facetProperty: 'category',
    resultMap: {
      description: 'title',
      section: 'category',
    },
  },
}

export default demoIndexes
