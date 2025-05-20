import '@orama/wc-components/dist/orama-ui/orama-ui.css'
import { html } from 'lit-html'
import { defineCustomElements } from '@orama/wc-components/loader'
import { DARK_THEME_BG, LIGTH_THEME_BG } from '../constants'

defineCustomElements()

const preview = {
  decorators: [
    (story, context) => {
      const bgTheme = context.globals?.backgrounds?.value === DARK_THEME_BG ? 'theme-dark' : 'theme-light'
      const heightValue = context.parameters?.layout === 'set-height' ? '613px' : 'auto'
      const publicComponent = context.kind?.includes('Components') && !context.kind?.includes('Internal')
      const wrapperId = !publicComponent && `orama-ui-${context.id}`
      const wrapperClass = !publicComponent && bgTheme
      return html`
        <style>
          orama-chat-box {
            height: ${heightValue};
          }
        </style>
        <div id="${wrapperId}" class="${wrapperClass}">${story()}</div>
      `
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      sort: 'requiredFirst',
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'dark',
          value: DARK_THEME_BG,
        },
        {
          name: 'light',
          value: LIGTH_THEME_BG,
        },
      ],
    },
  },
}

export default preview
