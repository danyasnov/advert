import {Dispatch, FC, SetStateAction, useEffect, useRef, useState} from 'react'
import {AdvertiseListItemModel} from 'front-api/src/index'
import {useEmblaCarousel} from 'embla-carousel/react'
import IcMoreVert from 'icons/material/MoreVert.svg'
import IcVisibility from 'icons/material/Visibility.svg'
import {useMouseHovered} from 'react-use'
import {unixToDate} from '../../utils'
import CardImage from '../CardImage'

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
  const [currentIndex, setCurrentIndex] = useState(0)

  const [viewportRef, embla] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    draggable: images.length > 1,
    speed: 30,
  })

  useEffect(() => {
    if (!embla || !setLockParentScroll) return
    embla.on('pointerDown', () => setLockParentScroll(true))
    embla.on('pointerUp', () => setLockParentScroll(false))
  }, [embla, setLockParentScroll])

  const ref = useRef(null)
  const {elX, elW} = useMouseHovered(ref, {
    bound: true,
    whenHovered: true,
  })

  useEffect(() => {
    if (!embla) return
    const {length} = images
    if (length < 2) return
    const step = 1 / length
    const position = elX / elW
    const index = Math.floor(position / step)
    embla.scrollTo(index)
  }, [elW, elX, embla, images])
  useEffect(() => {
    if (embla)
      embla.on('select', () => {
        setCurrentIndex(embla.selectedScrollSnap() || 0)
      })
  }, [embla])
  return (
    <div
      className={`w-40 text-left s:w-56 m:w-48 l:w-53 border rounded-lg overflow-hidden ${
        variant === 'default' ? 'border-shadow-b' : 'border-brand-a1'
      }`}
      ref={ref}>
      <div className='overflow-hidden relative' ref={viewportRef}>
        <div className='flex h-40 s:h-56 m:h-48 l:h-53 bg-image-placeholder'>
          {images.map((i) => (
            <div key={i} className='relative min-w-full'>
              <CardImage key={i} url={i} alt={title} />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className='absolute bottom-0 w-full flex justify-center space-x-1 px-1 pb-1'>
            {images.map((i, index) => (
              <div
                key={i}
                className={`w-full h-1 ${
                  currentIndex === index ? 'bg-brand-a1' : 'bg-black-d'
                }`}
              />
            ))}
          </div>
        )}
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
