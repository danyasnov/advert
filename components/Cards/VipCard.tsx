import {FC} from 'react'
import {AdvertiseListItemModel} from 'front-api/src/index'
import useEmblaCarousel from 'embla-carousel-react'
import IcMoreVert from 'icons/material/MoreVert.svg'
import IcVisibility from 'icons/material/Visibility.svg'
import {useTranslation} from 'next-i18next'
import IcPhone from 'icons/material/Phone.svg'
import ImageWrapper from '../ImageWrapper'
import {unixToDate} from '../../utils'
import Button from '../Buttons/Button'
import {notImplementedAlert} from '../../helpers'

interface Props {
  product: AdvertiseListItemModel
}
const Card: FC<Props> = ({product}) => {
  const {t} = useTranslation()
  const {title, images, price, oldPrice, dateUpdated, views} = product
  const [viewportRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    draggable: images.length > 1,
  })
  return (
    <div className='w-82 s:w-86 m:w-74 l:w-110 border border-brand-a1 rounded-lg overflow-hidden'>
      <div className='overflow-hidden' ref={viewportRef}>
        <div className='flex h-54 s:h-58 m:h-50 l:h-73 bg-image-placeholder'>
          {images.map((i) => (
            <div key={i} className='relative min-w-full'>
              <ImageWrapper
                type={i}
                key={i}
                alt={title}
                layout='fill'
                objectFit='cover'
              />
            </div>
          ))}
        </div>
      </div>
      <div className='p-4 flex flex-col justify-between h-48 s:h-49 l:h-10 bg-brand-a2'>
        <div className='flex flex-col h-full'>
          <div className='flex items-start mb-1'>
            <span className='text-body-14 text-black-b line-clamp-3 flex-1 break-words'>
              {title}
            </span>
            <IcMoreVert className='fill-current text-black-c h-4 w-4' />
          </div>
          <span className='text-body-14 text-black-b font-bold mb-1'>
            {price}
          </span>
          <span className='text-body-12 text-black-c line-through'>
            {oldPrice}
          </span>
          <Button
            onClick={() => notImplementedAlert()}
            className='text-brand-b1 border rounded-lg border-brand-b1 py-2 mt-auto mb-4'>
            <IcPhone className='fill-current h-4 w-4 mr-1' />
            {t('CONTACT_SELLER')}
          </Button>
        </div>
        <div className='text-body-10 text-black-c flex justify-between border-t border-shadow-b pt-1'>
          <span suppressHydrationWarning>{unixToDate(dateUpdated)}</span>
          <div className='flex items-center'>
            <div>
              <IcVisibility className='fill-current text-black-d h-4 w-4' />
            </div>
            <span className='ml-1'>{views}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Card
