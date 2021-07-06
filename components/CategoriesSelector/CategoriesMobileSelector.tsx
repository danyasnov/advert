import IcArrowBack from 'icons/material/ArrowBack.svg'
import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {CACategoryModel} from 'front-api'
import CategoryItem from './CategoryItem'
import {getLocationCodes} from '../../helpers'
import Button from '../Buttons/Button'
import {useCategoriesStore} from '../../providers/RootStoreProvider'
import LinkWrapper from '../Buttons/LinkWrapper'

const CategoriesMobileSelector: FC = observer(() => {
  const {categoriesWithoutAll} = useCategoriesStore()
  const {t} = useTranslation()
  const [activeCategory, setActiveCategory] = useState<CACategoryModel | null>(
    null,
  )

  const locationCodes = getLocationCodes()

  return (
    <div className='absolute top-89px inset-x-0 z-10 bg-white divide-y divide-shadow-b border-t flex flex-col items-start'>
      {!activeCategory?.items &&
        categoriesWithoutAll.map((c) => (
          <CategoryItem
            category={c}
            key={c.id}
            onClick={() => setActiveCategory(c)}
          />
        ))}
      {!!activeCategory?.items && (
        <>
          <Button
            onClick={() => setActiveCategory(null)}
            className='categories-selector-item'>
            <IcArrowBack className='w-6 h-6 fill-current text-black-c mr-2' />
            {t('BACK')}
          </Button>
          <LinkWrapper
            href={`/${locationCodes}/${activeCategory.slug}`}
            className='text-brand-b1 categories-selector-item'>
            {t('SHOW_ALL_ADVERTS')}
          </LinkWrapper>
          {activeCategory.items.map((value) => (
            <CategoryItem
              key={value.id}
              category={value}
              href={`/${locationCodes}/${activeCategory.slug}/${value.slug}`}>
              {value.name}
            </CategoryItem>
          ))}
        </>
      )}
    </div>
  )
})

export default CategoriesMobileSelector
