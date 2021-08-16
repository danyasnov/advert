import {FC, ReactNode} from 'react'
import {useTranslation} from 'next-i18next'
import Header from '../Header'
import Footer from '../Footer'
import DevBanner from '../DevBanner'
import LinkWrapper from '../Buttons/LinkWrapper'
import Button from '../Buttons/Button'

interface Props {
  children: ReactNode
}
const HeaderFooterWrapper: FC<Props> = ({children}) => {
  const {t} = useTranslation()
  return (
    <>
      <DevBanner />
      <Header />
      <Button className='s:hidden flex h-10 bg-brand-a1 text-body-2 px-3.5 py-3 rounded-2 whitespace-nowrap fixed left-1/2 -translate-x-1/2	 z-10 bottom-20'>
        <LinkWrapper href='/new-ad' title={t('NEW_AD')}>
          <span className='capitalize-first text-white'>{t('NEW_AD')}</span>
        </LinkWrapper>
      </Button>
      {children}
      <Footer />
    </>
  )
}

export default HeaderFooterWrapper
