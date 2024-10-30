import { h, type FunctionalComponent } from '@stencil/core'

export const OramaChatSuggestions: FunctionalComponent<{
  suggestions: string[]
  as?: 'chips' | 'list'
  icon?: Node
  suggestionClicked: (suggestion: string) => void
}> = ({ suggestions, as = 'chips', icon, suggestionClicked }) => {
  const isChips = as === 'chips'
  const isList = as === 'list'
  const classSuffix = isChips ? 'chips' : isList ? 'list' : ''

  const handleClick = (suggestion: string) => {
    if (!suggestion) {
      return
    }
    suggestionClicked(suggestion)
  }

  if (!suggestions?.length) {
    return null
  }

  return (
    <ul class={`suggestions-${classSuffix}`}>
      {suggestions.map((suggestion) => {
        return (
          <li key={suggestion} class={`suggestion-item-${classSuffix}`}>
            <button
              focus-on-arrow-nav
              type="button"
              class={`suggestion-button-${classSuffix}`}
              onClick={(e) => {
                e.preventDefault()
                handleClick(suggestion)
              }}
            >
              {icon}
              {suggestion}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
