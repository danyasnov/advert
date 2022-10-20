import {FC} from 'react'
import {AdvertiseState} from 'front-api/src/models/index'
import {useTranslation} from 'next-i18next'

interface Props {
  state: AdvertiseState
}
const CardBadge: FC<Props> = ({state}) => {
  const {t} = useTranslation()
  let color
  let message

  switch (state) {
    case 'blocked':
    case 'blockedPermanently': {
      message = 'BLOCKED'
      color = 'bg-error'
      break
    }
    // case 'draft': {
    //   message = 'MODERATION'
    //   color = 'bg-notification-info'
    //   break
    // }
    // case 'archived': {
    //   message = 'ARCHIVED'
    //   color = 'bg-black-c'
    //   break
    // }
    default: {
      message = null
      color = null
    }
  }

  if (!message && !color) {
    return null
  }

  return (
    <div className='absolute w-full z-20 flex justify-center top-1/4 '>
      <span
        className={`${color} flex rounded-md text-body-14 text-white px-2.5 py-1.5`}>
        {t(message)}
      </span>
    </div>
  )
}
export default CardBadge
