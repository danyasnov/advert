import {FC} from 'react'
import {AdvertiseDetail} from 'front-api'
import {useTranslation} from 'next-i18next'
import {InfoCircle} from 'react-iconly'
import LinkWrapper from '../Buttons/LinkWrapper'

interface Props {
  product: AdvertiseDetail
}
const ProductStatus: FC<Props> = ({product}) => {
  const {advert, owner} = product
  const {t} = useTranslation()
  let body
  let bgColor
  let iconColor
  switch (advert.state) {
    case 'sold': {
      body = (
        <>
          <span className='ml-2.5 mr-1 font-bold text-greyscale-900'>
            {t('ITEM_SOLD')}.
          </span>
          <LinkWrapper
            className=' text-greyscale-900 underline'
            href={`/user/${owner.hash}`}
            title={t('YOU_CAN_SEE_OTHER_ADS_OF_SELLER')}>
            {t('YOU_CAN_SEE_OTHER_ADS_OF_SELLER')}
          </LinkWrapper>
        </>
      )
      bgColor = 'bg-background-orange'
      iconColor = 'text-secondary-500'
      break
    }
    case 'blocked':
    case 'blockedPermanently': {
      body = (
        <>
          <span className='ml-2.5 mr-1 font-bold text-greyscale-900'>
            {t('BLOCKED')}.
          </span>
          <span className='text-greyscale-900'>
            {t('REASON')}: {t(advert.block.reasonCode)}
          </span>
        </>
      )
      bgColor = 'bg-pink'
      iconColor = 'text-error'
      break
    }
    default: {
      body = null
    }
  }
  if (!body) return null
  return (
    <div
      className={`${bgColor} rounded-xl px-5 py-[15px] flex text-body-14 items-center`}>
      <div className={iconColor}>
        <InfoCircle filled />
      </div>
      {body}
    </div>
  )
}

export default ProductStatus
