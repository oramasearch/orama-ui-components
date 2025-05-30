import type { StoryObj, Meta } from '@storybook/web-components'
import type { Components } from '@orama/wc-components'
import demoIndexes from '../config'
import { html } from 'lit-html'

const meta: Meta<
  Components.OramaSearchButton & {
    openSearchbox: boolean
  }
> = {
  title: 'Components/SearchButton',
  component: 'orama-search-button',
  argTypes: {
    colorScheme: {
      options: ['light', 'dark', 'system'],
      table: {
        defaultValue: { summary: 'dark' },
      },
      control: { type: 'radio' },
    },
    themeConfig: {
      control: false,
      table: {
        type: {
          summary: 'Partial<TThemeOverrides>',
        },
      },
    },
    dictionary: {
      control: { type: 'object' },
      table: {
        type: {
          summary: 'Partial<dictionary>',
          detail: `{
  searchButtonLabel: string
  // ... other text properties
}`,
        },
      },
    },
    size: {
      options: ['small', 'medium', 'large'],
      table: {
        defaultValue: { summary: 'medium' },
      },
      control: { type: 'radio' },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<Components.OramaSearchButton>

const Template = (label: string) => (args: {
  label?: string;
  colorScheme?: string;
  size?: 'small' | 'medium' | 'large';
  dictionary?: Record<string, string>;
}) => {
  return html`
    <div style="display: flex; justify-content: flex-start">
      <div style="width: 240px">
        <orama-search-button
          label="${args.label}"
          .colorScheme=${args.colorScheme}
          .size=${args.size}
          .dictionary=${args.dictionary}
        >
            ${label}
        </orama-search-button>
      </div>
      <orama-search-box
        .colorScheme=${args.colorScheme}
        .index=${
          {
            api_key: 'LerNlbp6379jVKaPs4wt2nZT4MJZbU1J',
            endpoint: 'https://cloud.orama.run/v1/indexes/docs-orama-b3f5xd'
          }
        }
        .searchPlaceholder="Search our documentation..."
        .facetProperty=${demoIndexes.orama.facetProperty}
        .resultMap=${demoIndexes.orama.resultMap}
        .themeConfig=${demoIndexes.orama.themeConfig}
        .suggestions=${demoIndexes.orama.suggestions}
        .sourceBaseUrl=${demoIndexes.orama.sourceBaseUrl}
        .sourcesMap=${demoIndexes.orama.sourcesMap}
      >
      </orama-search-box>
    </div>
  `
}

export const SearchButton: Story = {
  render: Template('Search...'),
  args: {
    colorScheme: 'light',
    size: 'medium',
    dictionary: {
      searchButtonLabel: 'Search Documentation',
    },
  },
}
