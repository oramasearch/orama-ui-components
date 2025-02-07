import colors from './colors'
import typography from './typography'
import chatbox from './chatbox'

const theme = {
  typography,
  colors,
  chatbox,
}

type TTheme = typeof theme

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type TThemeOverrides = DeepPartial<TTheme>

export default theme
