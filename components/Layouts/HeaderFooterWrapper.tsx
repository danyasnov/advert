import {FC, ReactNode} from 'react'
import Header from '../Header'
import Footer from '../Footer'
import DevBanner from '../DevBanner'

interface Props {
  children: ReactNode
}
const HeaderFooterWrapper: FC<Props> = ({children}) => {
  return (
    <>
      <DevBanner />
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default HeaderFooterWrapper
