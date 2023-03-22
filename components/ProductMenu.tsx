import {FC, useRef, useState} from 'react'
import {useClickAway} from 'react-use'
import {get, isEmpty} from 'lodash'
import {RemoveFromSaleType} from 'front-api/src/models'
import {useTranslation} from 'next-i18next'
import Button from './Buttons/Button'
import {makeRequest} from '../api'
import DeactivateAdvModal from './DeactivateAdvModal'

interface Props {
  hash: string
  title: string
  state?: string
  images: string[]
  getOptions?: ({setShowDeactivateModal, hash, state}) => any[]
  iconRender?
  listRender
}
const ProductMenu: FC<Props> = ({
  hash,
  images,
  title,
  getOptions,
  state,
  iconRender,
  listRender,
}) => {
  const [showPopup, setShowPopup] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const ref = useRef(null)
  useClickAway(ref, () => {
    setShowPopup(false)
  })

  const options = getOptions({setShowDeactivateModal, hash, state})
  if (isEmpty(options)) return null

  const body = iconRender
    ? showPopup && listRender(options, setShowPopup)
    : listRender(options, setShowPopup)
  return (
    <>
      <div ref={ref}>
        {iconRender && (
          <Button
            onClick={(e) => {
              e.preventDefault()
              setShowPopup(!showPopup)
            }}
            className='relative'>
            {iconRender(showPopup)}
          </Button>
        )}
        {body}
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
                hash,
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
