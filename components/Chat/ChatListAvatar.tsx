import {FC} from 'react'
import {ChatData} from 'chats'
import SupportInterlocutor from 'icons/SupportInterlocutor.svg'
import ImageWrapper from '../ImageWrapper'
import EmptyProductImage from '../EmptyProductImage'

interface Props {
  chat: ChatData
}
const ChatListAvatar: FC<Props> = ({chat}) => {
  const {interlocutor, product} = chat
  let body
  if (interlocutor.id === 'support') {
    body = (
      <div className='w-[52px] h-[52px] relative'>
        <SupportInterlocutor />
      </div>
    )
  } else if (product.image) {
    body = (
      <div className='rounded-2xl overflow-hidden w-[52px] h-[52px] relative'>
        <ImageWrapper
          type={product.image}
          alt='image'
          layout='fill'
          objectFit='cover'
        />
      </div>
    )
  } else {
    body = <EmptyProductImage size={52} />
  }

  return (
    <div className='relative  mr-4 flex items-center justify-center'>
      {body}
    </div>
  )
}

export default ChatListAvatar
