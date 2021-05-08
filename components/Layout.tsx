import {FC, ReactNode} from 'react'
import Header from './Header'
import Footer from './Footer'

interface Props {
  children: ReactNode
}

const Layout: FC = ({children}: Props) => {
  return (
    <div className='mx-auto s:w-768px m:w-1024px l:w-1360px'>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
