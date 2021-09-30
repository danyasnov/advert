import {Dispatch, FC, SetStateAction, useEffect, useRef, useState} from 'react'
import {AdvertiseListItemModel} from 'front-api/src/index'
import {useEmblaCarousel} from 'embla-carousel/react'
import IcVisibility from 'icons/material/Visibility.svg'
import {useIntersection, useMouseHovered} from 'react-use'
import {isEmpty, isNumber} from 'lodash'
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
  const {title, images, price, oldPrice, dateUpdated, views, location} = product
  const [currentIndex, setCurrentIndex] = useState(0)
  const [intersectionRatio, setIntersectionRatio] = useState<number>(1)
  const [viewportRef, embla] = useEmblaCarousel({
    loop: true,
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
  const intersection = useIntersection(ref, {
    root: null,
    rootMargin: '500px',
    threshold: 0,
  })

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
    if (!Number.isNaN(index)) embla.scrollTo(index)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elW, elX, embla, images?.length])
  useEffect(() => {
    if (embla) {
      embla.on('select', () => {
        setCurrentIndex(embla.selectedScrollSnap() || 0)
      })
    }
  }, [embla])

  useEffect(() => {
    if (
      isNumber(intersection?.intersectionRatio) &&
      intersection?.intersectionRatio !== intersectionRatio
    ) {
      setIntersectionRatio(intersection?.intersectionRatio)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intersection?.intersectionRatio])
  const inView = intersectionRatio > 0
  return (
    <div
      className={`w-full min-w-40 text-left s:w-56 m:w-48 l:w-53 border rounded-lg overflow-hidden ${
        variant === 'default' ? 'border-shadow-b' : 'border-brand-a1'
      }`}
      // @ts-ignore safari fix border radius
      style={{'-webkit-mask-image': '-webkit-radial-gradient(white, black)'}}
      ref={ref}>
      <div className='overflow-hidden relative' ref={viewportRef}>
        <div className='flex h-40 s:h-56 m:h-48 l:h-53 bg-image-placeholder'>
          {inView && (
            <>
              {isEmpty(images) ? (
                <div className='relative min-w-full'>
                  <CardImage
                    url={`/img/subcategories/${product.categoryId}.jpg`}
                    // @ts-ignore
                    fallbackUrl={`/img/subcategories/${product.rootCategoryId}.jpg`}
                    alt={title}
                  />
                </div>
              ) : (
                images.map((i) => (
                  <div key={i} className='relative min-w-full'>
                    <CardImage url={i} alt={title} />
                  </div>
                ))
              )}
            </>
          )}
        </div>
        {inView && (
          <>
            {images.length > 1 && (
              <div className='absolute bottom-0 w-full flex justify-center space-x-1 px-1 pb-1'>
                {images.map((i, index) => (
                  <div
                    key={i}
                    className={`w-4 h-0.5 ${
                      currentIndex === index ? 'bg-brand-a1' : 'bg-black-d'
                    }`}
                  />
                ))}
              </div>
            )}
            <div className='absolute inset-x-0 bottom-0 pb-2 px-2'>
              {location.distance && (
                <span className='text-body-4 text-white-a py-0.5 px-1 bg-shadow-overlay rounded'>
                  {location.distance}
                </span>
              )}
            </div>
          </>
        )}
      </div>
      <div
        className={`p-2 flex flex-col justify-between h-34 s:h-31 m:h-35 l:h-31 ${
          variant === 'default' ? 'bg-white' : 'bg-brand-a2'
        }`}>
        <div className='flex flex-col'>
          <div className='flex items-start mb-1'>
            <span className='text-body-3 text-black-b line-clamp-2 flex-1 break-words'>
              {title}
            </span>
            {/* <IcMoreVert className='fill-current text-black-c h-4 w-4' /> */}
          </div>
          <span className='text-body-1 text-black-b font-bold'>{price}</span>
          <span className='text-body-3 text-black-c line-through'>
            {oldPrice}
          </span>
        </div>
        <div className='text-body-4 text-black-c flex justify-between border-t border-shadow-b pt-1'>
          <span suppressHydrationWarning className='inline-flex items-center'>
            {unixToDate(dateUpdated)}
          </span>
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
