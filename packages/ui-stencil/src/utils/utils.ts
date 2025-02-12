import type { CloudIndexConfig } from '@/types'
import type { AnyOrama, Orama } from '@orama/orama'
import { OramaClient } from '@oramacloud/client'
import type { ColorScheme } from '@/types'
import { TThemeOverrides } from '@/components'

/**
 * Arrow keys navigation for focusable elements within a container
 *
 * @param ref HTMLElement - The element that contains the focusable elements
 * @param event KeyboardEvent - The event that triggered the navigation
 * @param selector string - The selector for the focusable elements (default: '[focus-on-arrow-nav]')
 * @returns void
 */
export function arrowKeysNavigation(ref: HTMLElement, event: KeyboardEvent, selector = '[focus-on-arrow-nav]') {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

  event.stopPropagation()
  event.preventDefault()

  const focusableElements = ref.querySelectorAll(selector)

  let focusableArray = Array.from(focusableElements) as HTMLElement[]
  focusableArray = focusableArray.filter((element) => element.tabIndex !== -1)

  const firstFocusableElement = focusableArray[0]
  const lastFocusableElement = focusableArray[focusableArray.length - 1]

  const focusedElement = ref.querySelector(':focus') as HTMLElement
  const focusedIndex = focusableArray.indexOf(focusedElement)

  let nextFocusableElement: HTMLElement

  if (event.key === 'ArrowDown') {
    nextFocusableElement =
      focusedIndex === focusableArray.length - 1 ? firstFocusableElement : focusableArray[focusedIndex + 1]
    nextFocusableElement?.focus()
  } else if (event.key === 'ArrowUp') {
    nextFocusableElement = focusedIndex === 0 ? lastFocusableElement : focusableArray[focusedIndex - 1]
    nextFocusableElement?.focus()
  }
}

export function format(first: string, middle: string, last: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '')
}

export function copyToClipboard(text) {
  // Check if the Clipboard API is supported
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error('Could not copy text: ', err)
    })
  } else {
    // Fallback for browsers that do not support the Clipboard API
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}

export function getNonExplicitAttributes(element: HTMLElement, explicitProps: string[]): { [key: string]: string } {
  const allAttributes = Array.from(element.attributes)
  return allAttributes.reduce((acc, attr) => {
    if (!explicitProps.includes(attr.name)) {
      acc[attr.name] = attr.value
    }
    return acc
  }, {})
}

export function validateCloudIndexConfig(
  el: HTMLElement,
  indexOrIndexes?: CloudIndexConfig | CloudIndexConfig[],
  instance?: OramaClient | AnyOrama,
): void {
  const componentDetails = `
    Component: ${el.tagName.toLowerCase()}
    Id: ${el.id}
  `

  if (!indexOrIndexes && !instance) {
    throw new Error(
      `Invalid component configuration. Please provide a valid index or instance prop. ${componentDetails}`,
    )
  }

  if (indexOrIndexes) {
    const indexes = Array.isArray(indexOrIndexes) ? indexOrIndexes : [indexOrIndexes]
    if (indexes.some((index) => !index.api_key || !index.endpoint)) {
      throw new Error(
        `Invalid cloud index configuration. Please provide a valid api_key and endpoint ${componentDetails}`,
      )
    }
  }

  if (indexOrIndexes && instance) {
    console.warn(`Both index and instance props are provided. Instance prop will be used. ${componentDetails}`)
  }
}

export function initOramaClient(indexOrIndexes: CloudIndexConfig | CloudIndexConfig[]): OramaClient | null {
  if (Array.isArray(indexOrIndexes)) {
    const indexes = indexOrIndexes as CloudIndexConfig[]
    return new OramaClient({
      mergeResults: true,
      indexes: indexes,
    })
  }

  const index = indexOrIndexes as CloudIndexConfig
  return new OramaClient({
    api_key: index.api_key,
    endpoint: index.endpoint,
  })
}

export function generateRandomID(componentName: string): string {
  const prefix = `orama-ui-${componentName}`
  return `${prefix}-${Math.random().toString(36).substring(2, 15)}`
}

export function updateThemeClasses(
  element: HTMLElement,
  colorScheme: ColorScheme,
  systemScheme: Omit<ColorScheme, 'system'>
) {
  const scheme = colorScheme === 'system' ? systemScheme : colorScheme

  if (element && scheme) {
    element.classList.remove('theme-light', 'theme-dark')
    element.classList.add(`theme-${scheme}`)
  }

  return scheme
}

export function updateCssVariables(
  element: HTMLElement,
  scheme: ColorScheme,
  themeConfig?: Partial<TThemeOverrides>
) {
  if (!element || !themeConfig || !scheme) return

  for (const base of Object.keys(themeConfig)) {
    if (base === 'colors') {
      if (themeConfig[base]?.[scheme]) {
        for (const key of Object.keys(themeConfig[base][scheme])) {
          element.style.setProperty(`${key}`, themeConfig[base][scheme][key])
        }
      }
    } else {
      for (const key of Object.keys(themeConfig[base])) {
        element.style.setProperty(`${key}`, themeConfig[base][key])
      }
    }
  }
}
