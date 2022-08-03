import {FC} from 'react'
import {ChatData} from 'chats'
import ImageWrapper from '../ImageWrapper'
import {unixMlToDate} from '../../utils'
import Button from '../Buttons/Button'
import UserAvatar from '../UserAvatar'

interface Props {
  chat: ChatData
  onClick: () => void
}
const ChatItem: FC<Props> = ({chat, onClick}) => {
  const {product, interlocutor, lastMessage, newMessagesCount} = chat
  return (
    <Button
      onClick={onClick}
      className='min-w-[328px] text-left flex flex-col px-4 py-5'>
      <div className='flex'>
        <div className='relative'>
          {interlocutor.online && (
            <div className='absolute -left-1 -top-1 bg-green w-4 h-4 z-10 rounded-full border-[2.7px] border-white' />
          )}
          <div className='w-13 h-13 rounded-2xl overflow-hidden'>
            <ImageWrapper
              width={52}
              height={52}
              type={product.image}
              alt={product.image}
            />
            <div className='overflow-hidden h-7 w-7 rounded-full border-[3px] border-white absolute -right-1.5 -bottom-1.5'>
              <UserAvatar
                url={interlocutor.avatarSrc}
                name={`${interlocutor.name} ${interlocutor.surname}`}
                size={5.5}
              />
            </div>
          </div>
        </div>
        <div className='flex flex-col w-[228px] ml-4 justify-evenly '>
          <div className='flex'>
            <p className='truncate text-body-14'>
              {interlocutor.name}
              {interlocutor.surname}
            </p>
            {lastMessage && (
              <p className='text-body-12'>{unixMlToDate(lastMessage.date)}</p>
            )}
          </div>
          <p className='text-body-16'>{product.title}</p>
        </div>
      </div>
      {lastMessage && (
        <div className='flex justify-between w-full mt-2'>
          {lastMessage && (
            <p className='truncate w-[264px]'>{lastMessage.originalText}</p>
          )}
          {!!newMessagesCount && (
            <div className='w-6 h-6 bg-primary-100 rounded-full flex justify-center items-center'>
              <p className='text-body-12 text-primary-500 font-semibold'>
                {newMessagesCount}
              </p>
            </div>
          )}
        </div>
      )}
    </Button>
  )
}

export default ChatItem
