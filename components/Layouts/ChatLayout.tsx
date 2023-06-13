import {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import {toJS} from 'mobx'
import {Chats, globalChatsStore, chatEventEmitter, ChatData} from 'chats'
import {useRouter} from 'next/router'
import {isEmpty, size} from 'lodash'
import {Delete} from 'react-iconly'
import {SerializedCookiesState} from '../../types'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import {getRest} from '../../api'
import Storage from '../../stores/Storage'
import Logo from '../Logo'
import {handleMetrics} from '../../helpers'
import Auth from '../Auth'
import ImageWrapper from '../ImageWrapper'
import EmptyProductImage from '../EmptyProductImage'
import {unixMlToDate} from '../../utils'
import Button from '../Buttons/Button'
import ChatList from '../Chat/ChatList'
import MetaTags from '../MetaTags'

const ChatLayout: FC = observer(() => {
  const {t} = useTranslation()

  return (
    <div className='flex flex-col py-6 px-4 s:px-8'>
      <MetaTags title={t('MESSAGES')} />
      <div className='flex pb-2 w-full justify-between'>
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
