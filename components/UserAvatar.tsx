import {FC} from 'react'
import ImageWrapper from './ImageWrapper'

interface Props {
  url?: string
  size?: number
}
const UserAvatar: FC<Props> = ({url, size = 16}) => {
  return (
    <div
      className={`w-${size} h-${size} rounded-full overflow-hidden bg-black-c z-20`}>
      {!!url && (
        <ImageWrapper
          width={size * 4}
          height={size * 4}
          objectFit='cover'
          type={url}
          alt='avatar'
        />
      )}
    </div>
  )
}
export default UserAvatar
