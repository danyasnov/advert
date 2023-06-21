import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import LinkWrapper from './Buttons/LinkWrapper'

const links = [
  {
    title: 'TERMS_AND_CONDITIONS',
    href: '/p/terms-and-conditions',
  },
  {
    title: 'PRIVACY_POLICY',
    href: 'p/privacy-policy',
  },
  {
    title: 'COOKIES_POLICY',
    href: 'p/cookies-policy',
  },
]

const SimpleFooter: FC = observer(() => {
  const {t} = useTranslation()

  return (
    <footer>
      <div className='flex flex-col mx-4 s:mx-auto s:w-704px m:w-944px l:w-1208px '>
        <div className='mt-12  mb-8 -mx-4 s:-mx-8 m:-mx-10'>
          <div className='flex flex-col m:flex-row m:items-center mx-4 s:mx-8 m:mx-10 s:mt-8'>
            <div className='flex flex-col s:flex-row space-y-10 s:space-y-0 s:space-x-5 m:space-x-10 text-greyscale-900 text-body-16 font-semibold text-left my-8 s:my-0 s:justify-between w-full'>
              {links.map((link, index) => (
                <LinkWrapper
                  key={index}
                  title={t(link.title)}
                  className='flex items-center whitespace-nowrap'
                  href={link.href}>
                  {t(link.title)}
                </LinkWrapper>
              ))}
              <LinkWrapper
                className='flex items-center w-full'
                title={t('SUPPORT')}
                href='/support'>
                {t('SUPPORT')}
              </LinkWrapper>
            </div>
            <div className='s:mt-4 m:mt-0 text-body-14 font-normal self-end text-greyscale-900 self-start whitespace-nowrap'>
              © {new Date().getFullYear()} VooXee
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
})

export default SimpleFooter
