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
import useEmblaCarousel from 'embla-carousel-react'
import IcArrowRight from 'icons/material/ArrowRight.svg'
import {useMouseHovered} from 'react-use'
import {isEmpty, size} from 'lodash'
import {useInView} from 'react-intersection-observer'
import {useTranslation} from 'next-i18next'
import {Call, Star} from 'react-iconly'
import {parseCookies} from 'nookies'
import CardImage from '../CardImage'
import CardBadge from './CardBadge'
import ProductLike from '../ProductLike'
import {trackSingle} from '../../helpers'
import LinkWrapper from '../Buttons/LinkWrapper'
import CallButton from '../Buttons/CallButton'
import {SerializedCookiesState} from '../../types'

interface Props {
  product: AdvertiseListItemModel
  href?: string
  setLockParentScroll?: Dispatch<SetStateAction<boolean>>
  disableVipWidth?: boolean
}
const Card: FC<Props> = ({
  product,
  setLockParentScroll,
  href,
  disableVipWidth,
}) => {
  const {t} = useTranslation()
  const {
    title,
    price,
    location,
    state,
    owner,
    hash,
    isFavorite,
    rootCategoryId,
    url,
    isTop,
    isVip,
    showCallButton,
  } = product
  const imagesCount = size(product.images)

  const [images] = useState(
    imagesCount > 4 ? product.images.slice(0, 4) : product.images,
  )

  const [hideConnect, setHideConnect] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [viewportRef, embla] = useEmblaCarousel({
    loop: true,
    align: 'start',
    containScroll: 'trimSnaps',
    draggable: images.length > 1,
    speed: 30,
  })

  useEffect(() => {
    const cookies: SerializedCookiesState = parseCookies()
    setHideConnect(cookies.hash === owner?.hash)
  }, [])

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
  let widthClassname = 'w-full min-w-40 s:w-56 m:w-[194px] l:w-53'
  if (isVip && !disableVipWidth) {
    widthClassname = 'w-full s:w-[464px] m:w-[404px] l:w-[440px]'
  }
  return (
    <LinkWrapper title={title} href={href || url} key={hash} target='_blank'>
      <div
        onClick={() =>
          trackSingle({categoryId: rootCategoryId, event: 'CustomizeProduct'})
        }
        className={`text-left rounded-2xl overflow-hidden flex flex-col relative h-full border-2
        ${
          isTop || isVip ? 'border-primary-500' : 'border-transparent'
        } ${widthClassname}`}
        style={{
          // @ts-ignore safari fix border radius
          '-webkit-mask-image': '-webkit-radial-gradient(white, black)',
        }}
        ref={setRefs}>
        <CardBadge state={state} />
        {owner?.hash && (
          <div className='absolute top-4 right-4 w-8 h-8 z-20'>
            <ProductLike
              userHash={owner.hash}
              hash={hash}
              isFavorite={isFavorite}
              state={state}
            />
          </div>
        )}
        {(isTop || isVip) && (
          <div className='absolute top-4 left-4 z-20 bg-primary-500 rounded-2xl px-4 py-1 flex items-center'>
            {isVip && (
              <div className='text-white mr-1'>
                <Star size={16} filled primaryColor='currentColor' />
              </div>
            )}
            <span className='text-body-16 text-white font-bold'>
              {t(isTop ? 'TOP' : 'VIP')}
            </span>
          </div>
        )}

        <div
          className='overflow-hidden relative bg-white rounded-t-xl'
          ref={viewportRef}>
          {['blocked', 'blockedPermanently', 'sold'].includes(state) && (
            <div className='absolute inset-0 bg-greyscale-900 opacity-50 z-10' />
          )}

          <div className='flex h-50 l:h-50 bg-image-placeholder '>
            {inView && (
              <>
                {isEmpty(images) ? (
                  <div className='relative min-w-full'>
                    {/* <CardImage */}
                    {/*  url={`/img/subcategories/${categoryId}.jpg`} */}
                    {/*  fallbackUrl={[ */}
                    {/*    // @ts-ignore */}
                    {/*    `/img/subcategories/${rootCategoryId}.jpg`, */}
                    {/*    `/img/CommonPlaceholder.jpg`, */}
                    {/*  ]} */}
                    {/*  alt={title} */}
                    {/* /> */}
                  </div>
                ) : (
                  images.map((i, index) => (
                    <div key={i} className='relative min-w-full'>
                      <CardImage
                        isLast={index === images.length - 1}
                        morePhotosCount={imagesCount > 4 ? imagesCount - 4 : 0}
                        url={i}
                        alt={title}
                        isVip={isVip && !disableVipWidth}
                      />
                    </div>
                  ))
                )}
              </>
            )}
          </div>
          {inView && (
            <>
              {!!images.length && (
                <div className='absolute bottom-0 w-full flex justify-center space-x-1 px-1 pb-1'>
                  {images.map((i, index) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        currentIndex === index
                          ? 'bg-primary-500'
                          : 'bg-greyscale-100'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div className='px-4 py-3 flex flex-col bg-white rounded-b-xl flex-1 justify-between'>
          <div className='flex flex-col pb-3'>
            <span className='text-body-16 text-greyscale-900 font-semibold'>
              {isFree ? t('FREE') : price}
            </span>
            <div className='flex items-start'>
              <span className='text-body-14 text-greyscale-600 line-clamp-2 flex-1 break-words'>
                {title}
              </span>
            </div>
          </div>
          <div className='flex justify-between w-full'>
            <span className='text-body-14 text-greyscale-600'>
              {location?.distance && location.distance}
            </span>
            {isVip && showCallButton && !hideConnect ? (
              <CallButton
                className='text-white space-x-2 bg-primary-500 rounded-2xl w-[168px] h-[44px]'
                icon={<Call size={20} filled />}
                hash={hash}
                ownerHash={owner.hash}
                rootCategoryId={rootCategoryId}
              />
            ) : (
              <IcArrowRight className='w-5 h-5 self-end' />
            )}
          </div>
        </div>
      </div>
    </LinkWrapper>
  )
}
export default Card
