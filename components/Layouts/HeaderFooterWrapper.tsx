import {FC, ReactNode, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {toast} from 'react-toastify'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import Header from '../Header'
import Footer from '../Footer'
import DevBanner from '../DevBanner'
import {useGeneralStore} from '../../providers/RootStoreProvider'

interface Props {
  children: ReactNode
}
const HeaderFooterWrapper: FC<Props> = observer(({children}) => {
  const {showContent, showActivationAlert, showErrorActivationAlert} =
    useGeneralStore()
  const {t} = useTranslation()
  const router = useRouter()
  useEffect(() => {
    if (showActivationAlert) {
      toast.success(t('ACCOUNT_ACTIVATED'))
    } else if (showErrorActivationAlert) {
      toast.error(t('CODE_NOT_CORRECT'))
    }
    router.push('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
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
