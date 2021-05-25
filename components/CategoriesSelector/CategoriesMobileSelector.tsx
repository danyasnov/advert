import IcArrowBack from 'icons/material/ArrowBack.svg'
import {FC, useState} from 'react'
import {toJS} from 'mobx'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import CategoryItem from './CategoryItem'
import {notImplementedAlert} from '../../helpers'
import Button from '../Button'
import {useCategoriesStore} from '../../providers/RootStoreProvider'

const CategoriesMobileSelector: FC = observer(() => {
  const categoriesStore = useCategoriesStore()
  const categories = toJS(categoriesStore.categoriesWithoutAll)
  const {t} = useTranslation()
  const [subCategories, setSubCategories] = useState(null)

  return (
    <div className='absolute top-89px inset-x-0 z-10 bg-white divide-y divide-shadow-b border-t flex flex-col items-start'>
      {!subCategories &&
        categories.map((c) => (
          <CategoryItem
            category={c}
            key={c.id}
            onClick={() => setSubCategories(c.items)}
          />
        ))}
      {!!subCategories && (
        <>
          <Button
            onClick={() => setSubCategories(null)}
            className='categories-selector-item'>
            <IcArrowBack className='w-6 h-6 fill-current text-black-c mr-2' />
            {t('BACK')}
          </Button>
          <Button
            onClick={notImplementedAlert}
            className='categories-selector-item font-bold'>
            {t('ALL_ADVERTS')}
          </Button>
          {subCategories.reduce((acc, value) => {
            acc.push(
              <Button
                className='categories-selector-item'
                onClick={notImplementedAlert}>
                {value.name}
              </Button>,
            )
            return acc
          }, [])}
        </>
      )}
    </div>
  )
})

export default CategoriesMobileSelector
