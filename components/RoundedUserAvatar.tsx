import {FC} from 'react'
import UserAvatar from './UserAvatar'

interface Props {
  url?: string
  name?: string
  size?: number
}
const RoundedUserAvatar: FC<Props> = ({url, name, size}) => {
  return (
    <div className='overflow-hidden h-7 w-7 rounded-full border-[3px] border-white absolute -right-1.5 -bottom-1.5'>
      <UserAvatar url={url} name={name} size={size} />
    </div>
  )
}

export default RoundedUserAvatar
