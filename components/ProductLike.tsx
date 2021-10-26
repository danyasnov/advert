import {FC, useState} from 'react'
import IcLikeEmpty from 'icons/material/LikeEmpty.svg'
import IcLike from 'icons/material/Like.svg'
import {AdvertiseDetail} from 'front-api'
import Button from './Buttons/Button'
import {makeRequest} from '../api'

interface Props {
  product: AdvertiseDetail
}
const ProductLike: FC<Props> = ({product}) => {
  const [like, setLike] = useState(product?.advert?.isFavorite)
  return (
    <Button
      onClick={() => {
        makeRequest({
          url: '/api/set-favorite',
          method: 'post',
          data: {
            hash: product.advert.hash,
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
          className='fill-current text-black-c'
          width={24}
          height={24}
        />
      )}
    </Button>
  )
}
export default ProductLike
