import { getStore, type StoresMapKeys } from '@/ParentComponentStore/ParentComponentStoreManager'
import { type ComponentInterface, getElement } from '@stencil/core/internal'

// Define unique symbols for internal metadata
const STORE_PROPS = Symbol('storeProps')
const STORE_WILL_LOAD_PATCHED = Symbol('storeWillLoadPatched')

/**
 * A decorator that:
 * - Patches `componentWillLoad` to initialize a Component Store.
 */
export function Store<S extends StoresMapKeys>(storeName: S): PropertyDecorator {
  return (targetClass: ComponentInterface, propKey: string) => {
    const classConstructor = targetClass.constructor

    // Initialize the store properties metadata array if needed.
    if (!classConstructor[STORE_PROPS]) {
      classConstructor[STORE_PROPS] = []
    }
    // Add the property key to our metadata.
    classConstructor[STORE_PROPS].push(propKey)

    // Patch componentWillLoad only once for the class.
    if (!classConstructor[STORE_WILL_LOAD_PATCHED]) {
      classConstructor[STORE_WILL_LOAD_PATCHED] = true

      const originalComponentWillLoad = targetClass.componentWillLoad

      // Replace componentWillLoad with our own wrapped version.
      targetClass.componentWillLoad = function () {
        // Access the host element
        const hostEl = getElement(this)

        const storeProps: (string | symbol)[] = this.constructor[STORE_PROPS]
        if (storeProps) {
          for (const storeProp of storeProps) {
            const store = getStore(storeName, hostEl)
            this[storeProp] = store
          }
        }

        // Call the original componentWillLoad (if it exists).
        if (typeof originalComponentWillLoad === 'function') {
          originalComponentWillLoad.apply(this)
        }
      }
    }
  }
}
