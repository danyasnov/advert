import {FC, useEffect, useState} from 'react'
import IcLikeEmpty from 'icons/material/LikeEmpty.svg'
import IcLike from 'icons/material/Like.svg'
import {parseCookies} from 'nookies'
import Button from './Buttons/Button'
import {makeRequest} from '../api'
import {SerializedCookiesState} from '../types'

interface Props {
  hash: string
  userHash: string
  isFavorite: boolean
  color?: string
}
const ProductLike: FC<Props> = ({
  hash,
  isFavorite,
  color = 'black-c',
  userHash,
}) => {
  const [like, setLike] = useState(isFavorite)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const state: SerializedCookiesState = parseCookies()
    setShow(state.hash && state.hash !== userHash)
  }, [userHash])
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
        <IcLikeEmpty
          className={`fill-current text-${color}`}
          width={24}
          height={24}
        />
      )}
    </Button>
  )
}
export default ProductLike
