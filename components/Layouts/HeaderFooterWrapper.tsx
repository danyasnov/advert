import {FC, ReactNode} from 'react'
import {toJS} from 'mobx'
import Header from '../Header'
import Footer from '../Footer'
import {useProductsStore} from '../../providers/RootStoreProvider'

interface Props {
  children: ReactNode
}
const HeaderFooterWrapper: FC<Props> = ({children}) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default HeaderFooterWrapper
