import {FC, ReactNode} from 'react'
import Header from '../Header'
import Footer from '../Footer'

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
