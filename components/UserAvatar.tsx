import {FC} from 'react'
import ImageWrapper from './ImageWrapper'

interface Props {
  url?: string
  name?: string
  size?: number
}
const UserAvatar: FC<Props> = ({url, size = 16, name}) => {
  let content
  if (url) {
    content = (
      <ImageWrapper
        width={size * 4}
        height={size * 4}
        objectFit='cover'
        type={url}
        alt='avatar'
      />
    )
  } else if (name) {
    let fontSize
    if (size >= 16) {
      fontSize = 'text-body-14'
    } else if (size < 6) {
      fontSize = 'text-body-14'
    } else {
      fontSize = 'text-body-14'
    }
    content = (
      <span className={`${fontSize} text-white w-full text-center `}>
        {name
          .split(' ')
          .map((word) => (word[0] || '').toUpperCase())
          .slice(0, 2)
          .join('')}
      </span>
    )
  }
  return (
    // height hack because tailwind h-16 not working here
    <div
      className='rounded-full overflow-hidden bg-black-c flex items-center z-9'
      style={{height: size * 4, width: size * 4}}>
      {content}
    </div>
  )
}
export default UserAvatar
