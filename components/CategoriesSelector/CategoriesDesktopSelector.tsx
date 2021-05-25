import {FC, useState} from 'react'
import {toJS} from 'mobx'
import {observer} from 'mobx-react-lite'
import {notImplementedAlert} from '../../helpers'
import {useCategoriesStore} from '../../providers/RootStoreProvider'
import {FirstColItem, SecondColItemWrapper, ThirdColItem} from './utils'
// in progress
const CategoriesMobileSelector: FC = observer(() => {
  const categoriesStore = useCategoriesStore()
  const categories = toJS(categoriesStore.categoriesWithoutAll)
  const [secondLevelItems, setSecondLevelItems] = useState(categories[0].items)
  const [thirdLevelItems, setThirdLevelItems] = useState(
    categories[0].items[0].items,
  )

  return (
    <div className='s:flex absolute top-105px inset-x-0 z-10 bg-white divide-x divide-shadow-b border-t w-full flex-row s:px-8 m:px-10 l:px-24'>
      <div className='w-1/3'>
        {categories.map((c) => (
          <FirstColItem
            category={c}
            key={c.id}
            onClick={notImplementedAlert}
            onMouseEnter={(cat) => {
              setSecondLevelItems(cat.items)
              setThirdLevelItems(cat.items[0].items)
            }}
          />
        ))}
      </div>
      <div className='w-1/3'>
        {secondLevelItems.map((c) => {
          return (
            <SecondColItemWrapper
              key={c.id}
              category={c}
              onMouseEnter={(cat) => setThirdLevelItems(cat.items)}
            />
          )
        })}
      </div>
      <div className='w-1/3'>
        {thirdLevelItems.map((c) => {
          return <ThirdColItem key={c.id} category={c} />
        })}
      </div>
    </div>
  )
})

export default CategoriesMobileSelector
