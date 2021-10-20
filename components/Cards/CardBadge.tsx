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
    case 'draft': {
      message = 'MODERATION'
      color = 'bg-notification-info'
      break
    }
    case 'archived': {
      message = 'ARCHIVED'
      color = 'bg-black-c'
      break
    }
    default: {
      message = null
      color = null
    }
  }

  if (!message && !color) {
    return null
  }

  return (
    <div className={`absolute top-4 px-1 h-4 z-10 flex items-center ${color}`}>
      <span className='uppercase text-body-3 text-white'>{t(message)}</span>
    </div>
  )
}
export default CardBadge
