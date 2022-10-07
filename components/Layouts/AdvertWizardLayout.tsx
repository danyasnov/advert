import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import MetaTags from '../MetaTags'
import Header from '../AdvertWizard/Header'
import AdvertWizard from '../AdvertWizard/AdvertWizard'

const CategoriesLayout: FC = observer(() => {
  const {t} = useTranslation()

  return (
    <>
      <Header />
      <MetaTags title={t('NEW_AD')} />
      <div
        className='bg-white s:px-8 m:px-10 l:px-29 s:pb-44 flex min-h-screen s:min-h-9/10 flex l:justify-center'
        style={{
          // mobile safari smart bar fix
          minHeight: '-webkit-fill-available',
        }}>
        <div className='flex w-full l:w-1208px'>
          <AdvertWizard />
        </div>
      </div>
    </>
  )
})

export default CategoriesLayout
