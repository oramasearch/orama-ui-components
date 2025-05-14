import type { dictionary } from '@/types'

/**
 * Default text dictionary with standard text values for all components
 */
export const defaultTextDictionary: dictionary = {
  searchPlaceholder: 'Search...',
  chatPlaceholder: 'Ask me anything',
  noResultsFound: 'No results found',
  noResultsFoundFor: 'No results found for',
  suggestions: 'Suggestions',
  seeAll: 'See all',
  addMore: 'Add more',
  clearChat: 'Clear chat',
  errorMessage: 'An error occurred while trying to search. Please try again.',
  disclaimer: 'Orama can make mistakes. Please verify the information.',
  startYourSearch: 'Start your search',
  initErrorSearch: 'Unable to initialize search service',
  initErrorChat: 'Unable to initialize chat service',
  chatButtonLabel: 'Get a summary',
  searchButtonLabel: 'Search',
}

/**
 * Gets the text for a specific key from the dictionary prop.
 * Prioritizes direct props (searchPlaceholder, chatPlaceholder) for backward compatibility,
 * then falls back to the dictionary prop, and finally to the defaultTextDictionary.
 * 
 * @param key - The key to get the text for
 * @param dictionary - The custom text dictionary provided by the user
 * @param directProps - Optional direct props that take precedence (for backward compatibility)
 * @returns The text for the specified key
 */
export function getText(
  key: keyof dictionary,
  dictionary: Partial<dictionary> = {},
  directProps: Partial<Record<keyof dictionary, string>> = {}
): string {
  // First check if there's a direct prop for this key (for backward compatibility)
  if (directProps[key]) {
    return directProps[key];
  }
  
  // Then check the dictionary prop
  return dictionary[key] || defaultTextDictionary[key];
}
