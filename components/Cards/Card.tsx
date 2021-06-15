import {Dispatch, FC, SetStateAction, useEffect} from 'react'
import {AdvertiseListItemModel} from 'front-api/src/index'
import {useEmblaCarousel} from 'embla-carousel/react'
import IcMoreVert from 'icons/material/MoreVert.svg'
import IcVisibility from 'icons/material/Visibility.svg'
import ImageWrapper from '../ImageWrapper'
import unixToString from '../../utils/unixToString'

interface Props {
  product: AdvertiseListItemModel
  setLockParentScroll?: Dispatch<SetStateAction<boolean>>
  variant?: 'default' | 'top'
}
const Card: FC<Props> = ({
  product,
  setLockParentScroll,
  variant = 'default',
}) => {
  const {title, images, price, oldPrice, dateUpdated, views} = product

  const [viewportRef, embla] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    draggable: images.length > 1,
  })

  useEffect(() => {
    if (!embla || !setLockParentScroll) return
    embla.on('pointerDown', () => setLockParentScroll(true))
    embla.on('pointerUp', () => setLockParentScroll(false))
  }, [embla, setLockParentScroll])

  return (
    <div
      className={`w-40 s:w-56 m:w-48 l:w-53 border rounded-lg overflow-hidden ${
        variant === 'default' ? 'border-shadow-b' : 'border-brand-a1'
      }`}>
      <div className='overflow-hidden' ref={viewportRef}>
        <div className='flex h-40 s:h-56 m:h-48 l:h-53 bg-image-placeholder'>
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
      <div
        className={`p-2 flex flex-col justify-between h-34 s:h-31 m:h-35 l:h-31 ${
          variant === 'default' ? 'bg-white' : 'bg-brand-a2'
        }`}>
        <div className='flex flex-col'>
          <div className='flex items-start mb-1'>
            <span className='text-body-3 text-black-b line-clamp-3 flex-1 break-words'>
              {title}
            </span>
            <IcMoreVert className='fill-current text-black-c h-4 w-4' />
          </div>
          <span className='text-body-1 text-black-b font-bold'>{price}</span>
          <span className='text-body-3 text-black-c line-through'>
            {oldPrice}
          </span>
        </div>
        <div className='text-body-4 text-black-c flex justify-between border-t border-shadow-b pt-1'>
          <span suppressHydrationWarning>{unixToString(dateUpdated)}</span>
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
