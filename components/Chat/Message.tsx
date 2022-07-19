import {FC} from 'react'
import {ChatMessage} from 'chats/src/models/internal'
import {toJS} from 'mobx'
import {OwnerModel} from 'front-api/src/models'

interface Props {
  message: ChatMessage
  user: OwnerModel
}

const Message: FC<Props> = ({message, user}) => {
  console.log(toJS(message), toJS(user))
  const isMyMessage = message.userId === user.hash
  return (
    <div
      className={`${
        isMyMessage
          ? 'self-end bg-primary-500 rounded-l-2xl text-white'
          : 'self-start bg-greyscale-100 rounded-r-2xl text-greyscale-900'
      } mb-5 rounded-b-2xl`}>
      <div className='p-3 text-body-2'>
        <span>{message.originalText}</span>
      </div>
    </div>
  )
}
export default Message
