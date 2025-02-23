import { createStore, type ObservableMap } from '@stencil/store'

export const GlobalStoreInitialProps = {
  open: false,
  currentTask: 'search' as 'search' | 'chat',
  currentTerm: '',
}
export type GlobalStoreType = ObservableMap<typeof GlobalStoreInitialProps>

export const testGlobalStore = createStore(GlobalStoreInitialProps)
