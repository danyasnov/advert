import {FC, useRef, useState} from 'react'
import {useClickAway} from 'react-use'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {get, isEmpty} from 'lodash'
import {AdvertiseState, RemoveFromSaleType} from 'front-api/src/models'
import Button from './Buttons/Button'
import {makeRequest} from '../api'
import DeactivateAdvModal from './DeactivateAdvModal'

interface Props {
  advertHash: string
  title: string
  images: string[]
  iconRender
  listRender
  getOptions
}
const ProductMenu: FC<Props> = ({
  iconRender,
  listRender,
  advertHash,
  images,
  title,
  getOptions,
}) => {
  const [showPopup, setShowPopup] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)

  const ref = useRef(null)
  useClickAway(ref, () => {
    setShowPopup(false)
  })

  const options = getOptions(setShowDeactivateModal)
  if (isEmpty(options)) return null
  return (
    <>
      <div ref={ref}>
        <Button
          onClick={(e) => {
            e.preventDefault()
            setShowPopup(!showPopup)
          }}
          className='relative'>
          {iconRender(showPopup)}
        </Button>
        {showPopup && listRender(options, setShowPopup)}
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
                hash: advertHash,
                soldMode: value,
              },
            }).then(() => {
              get(
                options.find((o) => o.title === 'REMOVE_FROM_SALE'),
                'cb',
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                () => {},
              )()
            })
          }}
          title={title}
          images={images}
        />
      )}
    </>
  )
}
export default ProductMenu
