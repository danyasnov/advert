import {FC, useRef, useState} from 'react'
import {useClickAway} from 'react-use'
import {isEmpty} from 'lodash'
import Button from './Buttons/Button'
import {TGetOptions} from '../types'

interface Props {
  hash: string
  state?: string
  title: string
  images: string[]
  showRefreshButton?: boolean
  getOptions: TGetOptions
  iconRender?
  listRender
}
const ProductMenu: FC<Props> = ({
  hash,
  getOptions,
  state,
  iconRender,
  listRender,
  showRefreshButton,
  images,
  title,
}) => {
  const [showPopup, setShowPopup] = useState(false)
  const ref = useRef(null)
  useClickAway(ref, () => {
    setShowPopup(false)
  })

  const options = getOptions({
    hash,
    state,
    showRefreshButton,
    images,
    title,
  })
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
    </>
  )
}
export default ProductMenu
