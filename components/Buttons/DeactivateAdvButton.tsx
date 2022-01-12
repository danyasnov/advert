import {FC, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {AdvertiseDetail} from 'front-api'
import {RemoveFromSaleType} from 'front-api/src/models/index'
import {useRouter} from 'next/router'
import DeactivateAdvModal from '../DeactivateAdvModal'
import {makeRequest} from '../../api'
import OutlineButton from './OutlineButton'

interface Props {
  product: AdvertiseDetail
}
const DeactivateAdvButton: FC<Props> = ({product}) => {
  const router = useRouter()
  const {advert, owner} = product
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const {t} = useTranslation()
  return (
    <div className='w-full'>
      <OutlineButton
        onClick={() => setShowDeactivateModal(true)}
        className='w-full text-body-2 text-black-b order-0 '>
        {t('REMOVE_FROM_SALE')}
      </OutlineButton>

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
}

export default DeactivateAdvButton