import {FC, useRef, useState} from 'react'
import {useClickAway} from 'react-use'
import {get, isEmpty} from 'lodash'
import {RemoveFromSaleType} from 'front-api/src/models'
import {useTranslation} from 'next-i18next'
import IcMoreVert from 'icons/material/MoreVert.svg'
import Button from './Buttons/Button'
import {makeRequest} from '../api'
import DeactivateAdvModal from './DeactivateAdvModal'

interface Props {
  hash: string
  title: string
  state: string
  images: string[]
  getOptions?: ({setShowDeactivateModal, hash, state}) => any[]
}
const ProductMenu: FC<Props> = ({hash, images, title, getOptions, state}) => {
  const [showPopup, setShowPopup] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const {t} = useTranslation()
  const ref = useRef(null)
  useClickAway(ref, () => {
    setShowPopup(false)
  })
  const iconRender = (show) => (
    <div className='w-8 h-8 bg-white rounded-full flex justify-center items-center shadow'>
      <IcMoreVert
        className={`fill-current ${
          show ? 'text-primary-500' : 'text-greyscale-500'
        }`}
        width={20}
        height={20}
      />
    </div>
  )
  const listRender = (options) => (
    <div className='absolute right-0 top-10 bg-white shadow-2xl rounded-lg w-40 overflow-hidden z-10 divide-y divide-greyscale-200 px-5'>
      {/* eslint-disable-next-line no-shadow */}
      {options.map(({title, onClick, icon}, index) => (
        <Button
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className='py-4 text-greyscale-900 hover:text-primary-500 w-full text-body-12 font-normal'
          onClick={(e) => {
            e.preventDefault()
            onClick()
            setShowPopup(false)
          }}>
          <div className='flex items-center justify-start w-full'>
            <div className='w-4 h-4 mr-2'>{!!icon && icon}</div>
            <span className='truncate'>{t(title)}</span>
          </div>
        </Button>
      ))}
    </div>
  )

  const options = getOptions({setShowDeactivateModal, hash, state})
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
        {showPopup && listRender(options)}
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
