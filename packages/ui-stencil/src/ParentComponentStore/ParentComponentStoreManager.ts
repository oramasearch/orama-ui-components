import { ChatStoreInitialProps, type ChatStoreType } from '@/ParentComponentStore/ChatStore'
import { type GlobalStoreType, GlobalStoreInitialProps } from '@/ParentComponentStore/GlobalStore'
import { SearchStoreInitialProps, type SearchStoreType } from '@/ParentComponentStore/SearchStore'
import { getExternalComponentHTMLElement } from '@/utils/utils'
import { createStore } from '@stencil/store'

export type StoresMapType = {
  global?: GlobalStoreType
  search?: SearchStoreType
  chat?: ChatStoreType
}

// biome-ignore lint/suspicious/noExplicitAny: Any is acceptable here
const storesMapInitialProps: Record<keyof StoresMapType, any> = {
  global: GlobalStoreInitialProps,
  search: SearchStoreInitialProps,
  chat: ChatStoreInitialProps,
}

export type StoresMapKeys = keyof StoresMapType

/**
 * Holds the global references for all stores in Orama Ui.
 *
 */
const storesReferencesMap = new Map<
  string,
  { search?: SearchStoreType; chat?: ChatStoreType; global?: GlobalStoreType }
>()

/**
 * Access storeSReferenceMap and return the initialized store. Throw exception if either parent or store does not exist
 *
 * @param parentComponentId
 * @param storeName
 * @returns
 */
const getParentComponentStore = <T extends StoresMapKeys>(
  parentComponentId: string,
  storeName: T,
): StoresMapType[T] => {
  const parentStores = storesReferencesMap.get(parentComponentId)

  if (!parentStores) {
    throw new Error('Invalid parent component Id')
  }

  const store = parentStores[storeName]

  if (!store) {
    throw new Error('Store not initialized')
  }

  return store
}

export const initStore = <T extends StoresMapKeys>(storeName: T, parentComponentId: string): StoresMapType[T] => {
  const initialProps = storesMapInitialProps[storeName]
  if (!initialProps) {
    throw new Error('Invalid store name')
  }

  const store = createStore(initialProps)

  if (storesReferencesMap.has(parentComponentId)) {
    const currentStores = storesReferencesMap.get(parentComponentId)
    currentStores[storeName] = store
  } else {
    storesReferencesMap.set(parentComponentId, { [storeName]: store })
  }

  return store
}

export const removeAllStores = (parentComponentId: string) => {
  storesReferencesMap.delete(parentComponentId)
}

export function getStore<T extends StoresMapKeys>(storeName: T, element: HTMLElement) {
  const externalComponent = getExternalComponentHTMLElement(element)

  if (!externalComponent) {
    throw new Error('Failed to get store')
  }

  return getParentComponentStore(externalComponent.id, storeName)
}
