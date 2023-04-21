import {FC, useEffect, useState} from 'react'
import IcLikeEmpty from 'icons/material/LikeEmpty.svg'
import IcLike from 'icons/material/Like.svg'
import {parseCookies} from 'nookies'
import {AdvertiseState} from 'front-api/src/models'
import {useTranslation} from 'next-i18next'
import {Heart2} from 'react-iconly'
import Button from './Buttons/Button'
import {makeRequest} from '../api'
import {SerializedCookiesState} from '../types'
import {handleMetrics, trackSingle} from '../helpers'

interface Props {
  hash: string
  userHash: string
  isFavorite: boolean
  state: AdvertiseState
  type?: 'card' | 'page'
}
const ProductLike: FC<Props> = ({
  hash,
  isFavorite,
  userHash,
  state,
  type = 'card',
}) => {
  const {t} = useTranslation()
  const [like, setLike] = useState(isFavorite)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const cookies: SerializedCookiesState = parseCookies()

    setShow(cookies.hash && cookies.hash !== userHash && state !== 'sold')
  }, [state, userHash])
  if (!show) return null
  let body
  if (type === 'card') {
    body = like ? (
      <IcLike width={32} height={32} />
    ) : (
      <IcLikeEmpty width={32} height={32} />
    )
  } else {
    body = like ? (
      <div className='text-body-14 text-error flex space-x-2'>
        <Heart2 size={20} filled />
        <span className='text-greyscale-500'>{t('REMOVE_FROM_FAVS')}</span>
      </div>
    ) : (
      <div className='text-body-14 text-greyscale-500 flex space-x-2'>
        <Heart2 size={20} filled />
        <span className=''>{t('ADD_TO_FAVS')}</span>
      </div>
    )
  }
  return (
    <Button
      onClick={(e) => {
        e.preventDefault()
        if (!like) {
          handleMetrics('addTo_favorite', {productHash: hash, user: userHash})
          trackSingle('AddToWishlist', {hash})
        }
        makeRequest({
          url: '/api/set-favorite',
          method: 'post',
          data: {
            hash,
            operation: like ? 'delete' : 'add',
          },
        }).then(() => {
          setLike(!like)
        })
      }}>
      {body}
    </Button>
  )
}
export default ProductLike
