import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {toJS} from 'mobx'
import {useProductsStore} from '../../providers/RootStoreProvider'
import BigCard from './VipCard'
import Card from './Card'

const ScrollableCardGroup: FC = observer(() => {
  const productsStore = useProductsStore()
  const products = toJS(productsStore.products)
  const vipProducts = products.slice(0, 2)
  const topProducts = products.slice(2, 6)
  const restProducts = products.slice(6, 10)
  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col space-y-4 s:flex-row s:space-y-0 s:space-x-4 mb-4'>
        {vipProducts.map((p) => (
          <BigCard product={p} key={p.hash} />
        ))}
      </div>
      <div className='grid grid-cols-2 gap-2'>
        {topProducts.map((p) => (
          <Card product={p} variant='top' key={p.hash} />
        ))}
      </div>
    </div>
  )
})

export default ScrollableCardGroup
