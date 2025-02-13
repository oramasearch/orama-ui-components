import colors from './colors'
import typography from './typography'
import radius from './radius'
import shadow from './shadow'

const theme = {
  typography,
  colors,
  radius,
  shadow,
}

type TTheme = typeof theme

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type TThemeOverrides = DeepPartial<TTheme>

export default theme
