import {FC, ReactNode} from 'react'
import Header from './Header'
import Footer from './Footer'

interface Props {
  children: ReactNode
}

const Layout: FC = ({children}: Props) => {
  return (
    <div className='mx-auto s:w-192 m:w-256 l:w-340'>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
