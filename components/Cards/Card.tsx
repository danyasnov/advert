import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {AdvertiseListItemModel} from 'front-api/src/index'
import {useEmblaCarousel} from 'embla-carousel/react'
import IcVisibility from 'icons/material/Visibility.svg'
import {useMouseHovered} from 'react-use'
import {isEmpty} from 'lodash'
import {useInView} from 'react-intersection-observer'
import IcPlayCircle from 'icons/material/PlayCircle.svg'
import {useTranslation} from 'next-i18next'
import {toJS} from 'mobx'
import {unixToDate} from '../../utils'
import CardImage from '../CardImage'
import CardBadge from './CardBadge'
import ProductLike from '../ProductLike'

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
  const {t} = useTranslation()
  const {
    title,
    images,
    price,
    oldPrice,
    dateUpdated,
    views,
    location,
    hasVideo,
  } = product
  const [currentIndex, setCurrentIndex] = useState(0)
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

  const [inViewRef, inView] = useInView()
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
  const setRefs = useCallback(
    (node) => {
      ref.current = node
      inViewRef(node)
    },
    [inViewRef],
  )
  useEffect(() => {
    if (inView) {
      embla.reInit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])
  const isFree = price === '0'
  return (
    <div
      className={`w-full min-w-40 text-left s:w-56 m:w-48 l:w-53 border rounded-lg overflow-hidden h-full flex flex-col relative ${
        variant === 'default' ? 'border-shadow-b' : 'border-brand-a1'
      }`}
      // @ts-ignore safari fix border radius
      style={{'-webkit-mask-image': '-webkit-radial-gradient(white, black)'}}
      ref={setRefs}>
      <CardBadge state={product.state} />
      <div className='absolute top-1 right-1 w-6 h-6 z-20'>
        <ProductLike
          userHash={product.owner.hash}
          color='white'
          hash={product.hash}
          isFavorite={product.isFavorite}
        />
      </div>
      <div className='overflow-hidden relative' ref={viewportRef}>
        <div className='flex h-40 s:h-56 m:h-48 l:h-53 bg-image-placeholder'>
          {inView && (
            <>
              {isEmpty(images) ? (
                <div className='relative min-w-full'>
                  <CardImage
                    url={`/img/subcategories/${product.categoryId}.jpg`}
                    fallbackUrl={[
                      // @ts-ignore
                      `/img/subcategories/${product.rootCategoryId}.jpg`,
                      `/img/CommonPlaceholder.jpg`,
                    ]}
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
            <div className='absolute inset-x-0 bottom-0 pb-2 px-2 flex justify-between'>
              {location.distance && (
                <span className='text-body-4 text-white-a py-0.5 px-1 bg-shadow-overlay rounded'>
                  {location.distance}
                </span>
              )}
              {hasVideo && (
                <IcPlayCircle className='fill-current text-white h-4 w-4' />
              )}
            </div>
          </>
        )}
      </div>
      <div
        className={`p-2 flex flex-col justify-between flex-1 ${
          variant === 'default' ? 'bg-white' : 'bg-brand-a2'
        }`}>
        <div className='flex flex-col pb-4'>
          <div className='flex items-start mb-1'>
            <span className='text-body-3 text-black-b line-clamp-2 flex-1 break-words'>
              {title}
            </span>
            {/* <IcMoreVert className='fill-current text-black-c h-4 w-4' /> */}
          </div>
          <span className='text-body-1 text-black-b font-bold'>
            {isFree ? t('FREE') : price}
          </span>
          <span className='text-body-3 text-black-c line-through'>
            {oldPrice}
          </span>
        </div>
        <div className='text-body-4 text-black-c flex justify-between border-t border-shadow-b pt-1'>
          <span suppressHydrationWarning className='inline-flex items-center'>
            {dateUpdated && unixToDate(dateUpdated)}
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
