import React, {createContext, FC, ReactNode, useContext} from 'react'
import {enableStaticRendering} from 'mobx-react-lite'
import {RootStore, IRootStoreHydration, IRootStore} from '../stores/RootStore'
import {ICategoriesStore} from '../stores/CategoriesStore'
import {IProductsStore} from '../stores/ProductsStore'
import {ICountriesStore} from '../stores/CountriesStore'
import {ILanguagesStore} from '../stores/LanguagesStore'
import {IGeneralStore} from '../stores/GeneralStore'
import {IUserStore} from '../stores/UserStore'
import {IModalsStore} from '../stores/ModalsStore'

enableStaticRendering(typeof window === 'undefined')

let store: IRootStore
const StoreContext = createContext<RootStore | undefined>(undefined)
StoreContext.displayName = 'StoreContext'

export const useRootStore = (): IRootStore => {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useRootStore must be used within RootStoreProvider')
  }

  return context
}

export const useCategoriesStore = (): ICategoriesStore => {
  const {categoriesStore} = useRootStore()
  return categoriesStore
}

export const useProductsStore = (): IProductsStore => {
  const {productsStore} = useRootStore()
  return productsStore
}

export const useCountriesStore = (): ICountriesStore => {
  const {countriesStore} = useRootStore()
  return countriesStore
}

export const useLanguagesStore = (): ILanguagesStore => {
  const {languagesStore} = useRootStore()
  return languagesStore
}

export const useUserStore = (): IUserStore => {
  const {userStore} = useRootStore()
  return userStore
}

export const useGeneralStore = (): IGeneralStore => {
  const {generalStore} = useRootStore()
  return generalStore
}
export const useModalsStore = (): IModalsStore => {
  const {modalsStore} = useRootStore()
  return modalsStore
}

export const RootStoreProvider: FC = ({
  children,
  hydrationData,
}: {
  children: ReactNode
  hydrationData?: IRootStoreHydration
}) => {
  return (
    <StoreContext.Provider value={initializeStore(hydrationData)}>
      {children}
    </StoreContext.Provider>
  )
}

RootStoreProvider.defaultProps = {
  hydrationData: undefined,
}

function initializeStore(initialData?: IRootStoreHydration): IRootStore {
  const _store = store ?? new RootStore()

  if (initialData) {
    _store.hydrate(initialData)
  }
  if (typeof window === 'undefined') return _store
  if (!store) store = _store
  return _store
}
