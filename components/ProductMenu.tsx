import {FC, useRef, useState} from 'react'
import IcMoreHoriz from 'icons/material/MoreHoriz.svg'
import {useClickAway} from 'react-use'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {isEmpty} from 'lodash'
import {AdvertiseDetail} from 'front-api'
import {RemoveFromSaleType} from 'front-api/src/models/index'
import Button from './Buttons/Button'
import {makeRequest} from '../api'
import DeactivateAdvModal from './DeactivateAdvModal'

interface Props {
  product: AdvertiseDetail
}
const ProductMenu: FC<Props> = ({product}) => {
  const {advert, owner} = product
  const {t} = useTranslation()
  const router = useRouter()
  const [showPopup, setShowPopup] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)

  const ref = useRef(null)
  useClickAway(ref, () => {
    setShowPopup(false)
  })
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
    const edit = {
      title: t('EDIT_AD'),
      onClick: () => {
        router.push(`/advert/edit/${advert.hash}`)
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
      items.push(edit, deactivate)
    }
    return items
  }

  const options = getOptions()
  if (isEmpty(options)) return null
  return (
    <>
      <div ref={ref}>
        <Button onClick={() => setShowPopup(!showPopup)} className='relative'>
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
    </>
  )
}
export default ProductMenu
