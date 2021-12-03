import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import MetaTags from '../MetaTags'
import Header from '../AdvertWizard/Header'
import AdvertWizard from '../AdvertWizard/AdvertWizard'

const CategoriesLayout: FC = observer(() => {
  const {query} = useRouter()
  const {t} = useTranslation()

  return (
    <>
      <Header />
      <MetaTags title={t('NEW_AD')} />
      <div className='bg-white px-29 flex min-h-1/2'>
        <AdvertWizard />
      </div>
    </>
  )
})

export default CategoriesLayout
