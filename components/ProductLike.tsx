import {FC, useEffect, useState} from 'react'
import IcLikeEmpty from 'icons/material/LikeEmpty.svg'
import IcLikeEmptyWhite from 'icons/material/LikeEmptyWhite.svg'
import IcLike from 'icons/material/Like.svg'
import {parseCookies} from 'nookies'
import {AdvertiseState} from 'front-api/src/models/index'
import Button from './Buttons/Button'
import {makeRequest} from '../api'
import {SerializedCookiesState} from '../types'

interface Props {
  hash: string
  userHash: string
  isFavorite: boolean
  color?: string
  state: AdvertiseState
}
const ProductLike: FC<Props> = ({
  hash,
  isFavorite,
  color = 'black-c',
  userHash,
  state,
}) => {
  const [like, setLike] = useState(isFavorite)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const cookies: SerializedCookiesState = parseCookies()
    setShow(cookies.hash && cookies.hash !== userHash && state !== 'sold')
  }, [state, userHash])
  if (!show) return null
  return (
    <Button
      onClick={(e) => {
        e.preventDefault()
        makeRequest({
          url: '/api/set-favorite',
          method: 'post',
          data: {
            hash,
            operation: like ? 2 : 1,
          },
        }).then(() => {
          setLike(!like)
        })
      }}>
      {like ? (
        <IcLike className='fill-current text-error' width={24} height={24} />
      ) : (
        <>
          {color === 'white' ? (
            <IcLikeEmptyWhite className='fill-current' width={24} height={24} />
          ) : (
            <IcLikeEmpty className='fill-current' width={24} height={24} />
          )}
        </>
      )}
    </Button>
  )
}
export default ProductLike
