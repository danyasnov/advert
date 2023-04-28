import {FC, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {AdvertiseDetail} from 'front-api'
import {RemoveFromSaleType} from 'front-api/src/models/index'
import {useRouter} from 'next/router'
import DeactivateAdvModal from '../Modals/DeactivateAdvModal'
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
        className='w-full text-body-14 text-greyscale-900 order-0 '>
        {t('REMOVE_FROM_SALE')}
      </OutlineButton>

      {showDeactivateModal && (
        <DeactivateAdvModal
          images={advert.images}
          title={advert.title}
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
        />
      )}
    </div>
  )
}

export default DeactivateAdvButton
