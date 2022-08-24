import {FC, useEffect, useState} from 'react'
import IcLikeEmpty from 'icons/material/LikeEmpty.svg'
import IcLike from 'icons/material/Like.svg'
import {parseCookies} from 'nookies'
import {AdvertiseState} from 'front-api/src/models'
import Button from './Buttons/Button'
import {makeRequest} from '../api'
import {SerializedCookiesState} from '../types'

interface Props {
  hash: string
  userHash: string
  isFavorite: boolean
  state: AdvertiseState
}
const ProductLike: FC<Props> = ({hash, isFavorite, userHash, state}) => {
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
            operation: like ? 'delete' : 'add',
          },
        }).then(() => {
          setLike(!like)
        })
      }}>
      {like ? (
        <IcLike width={32} height={32} />
      ) : (
        <IcLikeEmpty width={32} height={32} />
      )}
    </Button>
  )
}
export default ProductLike
