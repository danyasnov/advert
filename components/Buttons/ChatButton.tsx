import {FC, useEffect, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import LinkWrapper from './LinkWrapper'
import SecondaryButton from './SecondaryButton'
import {SerializedCookiesState} from '../../types'

interface Props {
  setShowLogin: (value: boolean) => void
  hash: string
}
const ChatButton: FC<Props> = ({setShowLogin, hash}) => {
  const {t} = useTranslation()
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const state: SerializedCookiesState = parseCookies()
    setShowChat(!!state.hash)
  }, [])
  return (
    <div className='w-full'>
      {showChat ? (
        <LinkWrapper
          id='chat'
          href={`/chat?hash=${hash}`}
          className='rounded-lg py-3 px-3.5 border border-shadow-b h-10 text-body-14 text-black-b flex justify-center'
          title={t('SEND_A_MESSAGE')}>
          {t('SEND_A_MESSAGE')}
        </LinkWrapper>
      ) : (
        <SecondaryButton
          id='chat'
          className='w-full'
          onClick={() => {
            setShowLogin(true)
          }}>
          {t('SEND_A_MESSAGE')}
        </SecondaryButton>
      )}
    </div>
  )
}
export default ChatButton
