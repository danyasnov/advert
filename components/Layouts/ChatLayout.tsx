import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import Logo from '../Logo'
import Auth from '../Auth'
import ChatList from '../Chat/ChatList'
import MetaTags from '../MetaTags'

const ChatLayout: FC = observer(() => {
  const {t} = useTranslation()

  return (
    <div className='flex flex-col py-6 px-4 s:px-8'>
      <MetaTags title={t('MESSAGES')} />
      <div className='flex pb-2 s:pb-8 w-full justify-between'>
        <Logo />
        <h4 className='text-h-4 font-bold text-greyscale-900 hidden s:flex self-center w-full ml-6'>
          {t('MESSAGES')}
        </h4>
        <div className='self-end'>
          <Auth />
        </div>
      </div>
      <h4 className='text-h-4 font-bold text-greyscale-900 pb-4 s:hidden'>
        {t('MESSAGES')}
      </h4>
      <ChatList />
    </div>
  )
})

export default ChatLayout
