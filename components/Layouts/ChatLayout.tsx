import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import {SerializedCookiesState} from '../../types'

const ChatLayout: FC = observer(() => {
  const cookies: SerializedCookiesState = parseCookies()

  const {query} = useRouter()
  const {t} = useTranslation()

  return (
    <HeaderFooterWrapper>
      <div className=' py-8 m:flex min-h-1/2'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto'>
          <main className='m:w-944px l:w-896px space-y-12'>123</main>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
})

export default ChatLayout
