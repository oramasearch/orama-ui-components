import { defineCustomElements } from 'ui-stencil/loader'
import 'ui-stencil/dist/orama-ui/orama-ui.css'
import { html } from 'lit-html'
import { DARK_THEME_BG, LIGTH_THEME_BG } from '../constants'

defineCustomElements()

const preview = {
  decorators: [
    (story, context) => {
      const classTheme = context.globals?.backgrounds?.value === DARK_THEME_BG ? 'theme-dark' : 'theme-light'
      return html`<div id="orama-ui" class="${classTheme}">${story()}</div>`
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      onchange: (value) => {
        console.log('backgrounds', value)
      },
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
