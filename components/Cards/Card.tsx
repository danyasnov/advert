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
import {useMouseHovered} from 'react-use'
import {isEmpty, size} from 'lodash'
import {useInView} from 'react-intersection-observer'
import {useTranslation} from 'next-i18next'
import {ArrowUp, ArrowDown, Call, Star} from 'react-iconly'
import {parseCookies} from 'nookies'
import IcMoreVert from 'icons/material/MoreVert.svg'
import CardImage from '../CardImage'
import CardBadge from './CardBadge'
import ProductLike from '../ProductLike'
import {handleMetrics} from '../../helpers'
import LinkWrapper from '../Buttons/LinkWrapper'
import CallButton from '../Buttons/CallButton'
import {TGetOptions, SerializedCookiesState} from '../../types'
import ProductMenu from '../ProductMenu'
import Button from '../Buttons/Button'
import EmptyProductImage from '../EmptyProductImage'
import {getDigitsFromString} from '../../utils'

interface Props {
  product: AdvertiseListItemModel
  href?: string
  setLockParentScroll?: Dispatch<SetStateAction<boolean>>
  disableVipWidth?: boolean
  renderFooter?: (product: AdvertiseListItemModel) => Element
  getOptions?: TGetOptions
}
const Card: FC<Props> = ({
  product,
  setLockParentScroll,
  href,
  disableVipWidth,
  getOptions,
  renderFooter,
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
    url,
    isTop,
    isVip,
    showCallButton,
    discount,
    oldPrice,
  } = product
  const imagesCount = size(product.images)

  const [images] = useState(
    imagesCount > 4 ? product.images.slice(0, 4) : product.images,
  )

  const [hideConnect, setHideConnect] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [viewportRef, embla] = useEmblaCarousel({
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
    if (inView && embla) {
      embla.reInit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])
  const isFree = price === '0'
  let widthClassname = 'w-full min-w-40 s:w-56 m:w-[194px] l:w-53'
  if (isVip && !disableVipWidth) {
    widthClassname = 'w-full s:w-[464px] m:w-[404px] l:w-[440px]'
  }
  let showOldPrice = false
  if (discount && oldPrice) {
    const priceDigits = getDigitsFromString(price)
    const oldPriceDigits = getDigitsFromString(oldPrice)
    if (priceDigits?.length <= 6 && oldPriceDigits?.length <= 6) {
      showOldPrice = true
    }
  }

  return (
    <LinkWrapper title={title} href={href || url} key={hash} target='_blank'>
      {/* eslint-disable-next-line */}
      <div
        onMouseLeave={() => {
          if (embla) {
            embla.scrollTo(0)
          }
        }}
        onClick={() => {
          handleMetrics('clickTo_advt', {
            categoryId: product.rootCategoryId,
            subcategoryId: product.categoryId,
          })
        }}
        className={`text-left rounded-2xl overflow-hidden flex flex-col relative h-full border-2 [-webkit-mask-image:-webkit-radial-gradient(white,black)]
        ${
          isTop || isVip ? 'border-primary-500' : 'border-transparent'
        } ${widthClassname}`}
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
        {getOptions && (
          <div className='absolute top-4 right-4 w-8 h-8 z-20'>
            <ProductMenu
              getOptions={getOptions}
              hash={product.hash}
              state={product.state}
              showRefreshButton={product.showRefreshButton}
              title={product.title}
              images={product.images}
              listRender={(options, setShowPopup) => (
                <div className='absolute right-0 top-10 bg-white shadow-2xl rounded-lg w-40 overflow-hidden z-10 divide-y divide-greyscale-200'>
                  {/* eslint-disable-next-line no-shadow */}
                  {options.map(({title, onClick, icon}, index) => (
                    <Button
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      className='py-4 text-greyscale-900 hover:text-primary-500 w-full text-body-12 font-normal px-5'
                      onClick={(e) => {
                        e.preventDefault()
                        onClick()
                        setShowPopup(false)
                      }}>
                      <div className='flex items-center justify-start w-full'>
                        <div className='w-4 h-4 mr-2'>{!!icon && icon}</div>
                        <span className='text-left'>{t(title)}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
              iconRender={(show) => (
                <div className='w-8 h-8 bg-white rounded-full flex justify-center items-center shadow'>
                  <IcMoreVert
                    className={`fill-current ${
                      show ? 'text-primary-500' : 'text-greyscale-500'
                    }`}
                    width={20}
                    height={20}
                  />
                </div>
              )}
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
          <div className='flex h-36 s:h-50 l:h-50 bg-image-placeholder'>
            {inView && (
              <>
                {isEmpty(images) ? (
                  <EmptyProductImage size={50} />
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
              {size(images) > 1 && (
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
            <div>
              <span className='text-body-16 text-greyscale-900 font-semibold'>
                {isFree ? t('FREE') : price}
              </span>
              {(showOldPrice || (isVip && discount)) && (
                <>
                  <span
                    className={`text-body-14 text-greyscale-600 line-through ${
                      isVip ? 'ml-3' : 'ml-1'
                    }`}>
                    {isVip ? oldPrice : oldPrice.slice(0, oldPrice.length - 2)}
                  </span>
                  <span
                    className={`${
                      discount?.isPriceDown ? 'text-green' : 'text-error'
                    }`}>
                    {discount?.isPriceDown ? (
                      <ArrowDown size={16} style={{display: 'inline'}} />
                    ) : (
                      <ArrowUp size={16} style={{display: 'inline'}} />
                    )}
                  </span>
                </>
              )}
            </div>
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
            {isVip && showCallButton && !hideConnect && (
              <CallButton
                className='text-white space-x-2 bg-primary-500 rounded-2xl w-[168px] h-[44px]'
                icon={<Call size={20} filled />}
                hash={hash}
                ownerHash={owner.hash}
              />
            )}
          </div>
          {!!renderFooter && renderFooter(product)}
        </div>
      </div>
    </LinkWrapper>
  )
}

export default Card
