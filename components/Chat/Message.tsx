import {FC} from 'react'
import {ChatMessage} from 'chats/src/models/internal'
import {OwnerModel} from 'front-api/src/models'
import IcChatDelivered from 'icons/material/ChatDelivered.svg'
import IcChatRead from 'icons/material/ChatRead.svg'
import {unixMlToTime} from '../../utils'

interface Props {
  message: ChatMessage
  user: OwnerModel
}

const Message: FC<Props> = ({message, user}) => {
  // console.log(toJS(message), toJS(user))
  const isMyMessage = message.userId === user.hash
  return (
    <div
      className={`mb-5 flex flex-col max-w-[75%] ${
        isMyMessage ? 'self-end' : 'self-start'
      }`}>
      <div className={`mb-2 flex ${isMyMessage ? 'self-end' : 'self-start'}`}>
        <span className='text-body-3 font-normal text-gray-500'>
          {unixMlToTime(message.date)}
        </span>
        {isMyMessage && (
          <div className='ml-2'>
            {message.isRead && <IcChatRead className='h-4 w-4' />}
            {message.isDelivered && !message.isRead && (
              <IcChatDelivered className='h-4 w-4' />
            )}
            {!message.isDelivered && !message.isRead && (
              <IcChatDelivered className='h-4 w-4 fill-current text-greyscale-400' />
            )}
          </div>
        )}
      </div>

      <div
        className={`${
          isMyMessage
            ? 'bg-primary-500 rounded-l-2xl text-white'
            : 'bg-greyscale-100 rounded-r-2xl text-greyscale-900'
        } rounded-b-2xl`}>
        <div className='p-3 text-body-2'>
          <span className='break-words'>{message.originalText}</span>
        </div>
      </div>
    </div>
  )
}
export default Message