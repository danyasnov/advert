import {FC, ReactNode, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {toast} from 'react-toastify'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import Header from '../Header'
import Footer from '../Footer'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import MobileAppBottomSheet from '../MobileAppBottomSheet'

interface Props {
  children: ReactNode
}
const HeaderFooterWrapper: FC<Props> = observer(({children}) => {
  const {showSuccessAlert, showErrorAlert, showOnlyHeader} = useGeneralStore()
  const {t} = useTranslation()
  const router = useRouter()
  useEffect(() => {
    if (showSuccessAlert) {
      toast.success(t('ACCOUNT_ACTIVATED'))
      router.push('/')
    } else if (showErrorAlert) {
      toast.error(t('CODE_NOT_CORRECT'))
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <Header />
      {!showOnlyHeader && (
        <>
          {children}
          <Footer />
          <MobileAppBottomSheet />
        </>
      )}
    </>
  )
})

export default HeaderFooterWrapper
