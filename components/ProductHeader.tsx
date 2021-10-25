import {FC, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import IcMoreHoriz from 'icons/material/MoreHoriz.svg'
import {useClickAway} from 'react-use'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {RemoveFromSaleType} from 'front-api/src/models/index'
import {isEmpty} from 'lodash'
import {useGeneralStore, useProductsStore} from '../providers/RootStoreProvider'
import ProductInfoIcons from './ProductInfoIcons'
import Button from './Buttons/Button'
import {makeRequest} from '../api'
import DeactivateAdvModal from './DeactivateAdvModal'

const ProductHeader: FC = observer(() => {
  const {product} = useProductsStore()
  const {userHash} = useGeneralStore()
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const {t} = useTranslation()
  const router = useRouter()
  const [showPopup, setShowPopup] = useState(false)
  const ref = useRef(null)
  useClickAway(ref, () => {
    setShowPopup(false)
  })
  if (!product) return null
  const {advert, owner} = product
  const isUserAdv = userHash === owner.hash

  const getOptions = () => {
    const remove = {
      title: t('REMOVE'),
      onClick: () => {
        makeRequest({
          url: `/api/delete-adv`,
          method: 'post',
          data: {
            hash: advert.hash,
          },
        }).then(() => {
          router.push(`/user/${owner.hash}`)
        })
      },
    }
    const publish = {
      title: t('PUBLISH'),
      onClick: () => {
        makeRequest({
          url: `/api/publish-adv`,
          method: 'post',
          data: {
            hash: advert.hash,
          },
        }).then(() => {
          router.push(`/user/${owner.hash}`)
        })
      },
    }
    const deactivate = {
      title: t('REMOVE_FROM_SALE'),
      onClick: () => {
        setShowDeactivateModal(true)
      },
    }
    const items = []
    if (
      ['archived', 'sold', 'blockedPermanently', 'blocked'].includes(
        advert.state,
      )
    ) {
      if (advert.state === 'archived') {
        items.push(publish)
      }
      items.push(remove)
    }
    if (advert.state === 'active') {
      items.push(deactivate)
    }
    return items
  }

  const options = getOptions()
  const isFree = advert.price === '0'

  return (
    <div>
      <div className='flex justify-between w-full items-center mb-2'>
        <h1 className='text-h-4 font-bold m:text-h-1 text-black-b'>
          {advert.title}
        </h1>
        <div className='flex ml-4 self-start' ref={ref}>
          {/* <Button onClick={notImplementedAlert} className='mr-2'> */}
          {/*  <IcLikeEmpty */}
          {/*    className='fill-current text-black-c' */}
          {/*    width={24} */}
          {/*    height={24} */}
          {/*  /> */}
          {/* </Button> */}
          {isUserAdv && !isEmpty(options) && (
            <Button
              onClick={() => setShowPopup(!showPopup)}
              className='relative'>
              <IcMoreHoriz
                className='fill-current text-black-c'
                width={24}
                height={24}
              />
              {showPopup && (
                <div className='absolute right-0 top-8 bg-white shadow-2xl rounded-lg w-40 overflow-hidden z-10'>
                  {options.map(({title, onClick}) => (
                    <Button
                      key={title}
                      className='px-4 py-3 text-black-b hover:bg-brand-a2 w-full text-body-2'
                      onClick={() => {
                        onClick()
                        setShowPopup(false)
                      }}>
                      {title}
                    </Button>
                  ))}
                </div>
              )}
            </Button>
          )}
        </div>
      </div>
      <div className='flex flex-col m:hidden'>
        <span className='text-h-2 text-black-b font-bold'>
          {isFree ? t('FREE') : advert.price}
        </span>
        <div className='flex flex-col s:flex-row s:items-center s:mb-4 s:mt-2 justify-between'>
          <span className='text-body-3 text-error mt-1 s:mt-0 line-through'>
            {advert.oldPrice}
          </span>
          <div className='my-2 s:my-0'>
            <ProductInfoIcons />
          </div>
        </div>
      </div>
      {showDeactivateModal && (
        <DeactivateAdvModal
          isOpen={showDeactivateModal}
          onClose={() => setShowDeactivateModal(false)}
          onSelect={(value: RemoveFromSaleType) => {
            makeRequest({
              url: `/api/deactivate-adv`,
              method: 'post',
              data: {
                hash: advert.hash,
                soldMode: value,
              },
            }).then(() => {
              router.push(`/user/${owner.hash}`)
            })
          }}
          advert={advert}
        />
      )}
    </div>
  )
})

export default ProductHeader
