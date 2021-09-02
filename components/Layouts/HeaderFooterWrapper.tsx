import {FC, ReactNode} from 'react'
import {observer} from 'mobx-react-lite'
import Header from '../Header'
import Footer from '../Footer'
import DevBanner from '../DevBanner'
import {useGeneralStore} from '../../providers/RootStoreProvider'

interface Props {
  children: ReactNode
}
const HeaderFooterWrapper: FC<Props> = observer(({children}) => {
  const {showContent} = useGeneralStore()
  return (
    <>
      <DevBanner />
      <Header />
      <div className={showContent ? '' : 'hidden'}>
        {children}
        <Footer />
      </div>
    </>
  )
})

export default HeaderFooterWrapper
