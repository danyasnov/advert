import {FC} from 'react'
import IcArrowBack from 'icons/material/ArrowBack.svg'
import {ArrowLeft, MoreCircle} from 'react-iconly'
import {ChatData} from 'chats'
import {useTranslation} from 'next-i18next'
import {toJS} from 'mobx'
import Button from '../Buttons/Button'
import ImageWrapper from '../ImageWrapper'
import UserAvatar from '../UserAvatar'

interface Props {
  onBack: () => void
  chat: ChatData
}
const ChatHeader: FC<Props> = ({onBack, chat}) => {
  const {product, interlocutor} = chat
  const {t} = useTranslation()
  console.log('chat', toJS(chat))
  return (
    <div className='flex flex-col'>
      <div className='flex mb-5'>
        <Button onClick={onBack} className='text-greyscale-900 mr-3'>
          <ArrowLeft />
        </Button>
        <div className='w-10 h-10 min-w-[40px] rounded-full overflow-hidden mr-3'>
          <UserAvatar
            size={10}
            url={interlocutor.avatarSrc}
            name={`${interlocutor.name} ${interlocutor.surname}`}
          />
        </div>
        {/* <div className='w-10 h-10 rounded-full overflow-hidden'> */}
        {/*  <ImageWrapper */}
        {/*    width={40} */}
        {/*    height={40} */}
        {/*    type={product.image} */}
        {/*    alt={product.image} */}
        {/*  /> */}
        {/* </div> */}
        <div className='flex flex-col overflow-hidden mr-5'>
          <p className='text-body-1 font-semibold truncate'>
            {interlocutor.name} {interlocutor.surname}
          </p>
          {/*  {interlocutor.online ? ( */}
          {/*    <p>{t('ONLINE')}</p> */}
          {/*  ) : ( */}
          {/*    <p>{interlocutor.onlineLastTime}</p> */}
          {/*  )} */}
        </div>
        <Button className='text-primary-500'>
          <MoreCircle />
        </Button>
      </div>
      <div className='flex p-3 bg-greyscale-50 border border-greyscale-500 rounded-2xl items-center mb-4'>
        <div className='border-2xl overflow-hidden min-w-[56px]'>
          <ImageWrapper
            type={product.image}
            alt={product.image}
            width={56}
            height={56}
          />
        </div>
        <p className='text-body-2 text-greyscale-900 font-normal ml-4 line-clamp-2 leading-5	'>
          {product.title}
        </p>
      </div>
    </div>
  )
}
export default ChatHeader
