import IcArrowBack from 'icons/material/ArrowBack.svg'
import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {CACategoryModel} from 'front-api'
import {isEmpty, last} from 'lodash'
import CategoryItem from './CategoryItem'
import {getLocationCodes} from '../../helpers'
import Button from '../Buttons/Button'
import {
  useCategoriesStore,
  useGeneralStore,
} from '../../providers/RootStoreProvider'
import LinkWrapper from '../Buttons/LinkWrapper'

const getSlugs = (categories: CACategoryModel[]): string => {
  return categories.map((c) => c.slug).join('/')
}
const CategoriesMobileSelector: FC = observer(() => {
  const {categoriesWithoutAll} = useCategoriesStore()
  const {t} = useTranslation()
  const [history, setHistory] = useState<CACategoryModel[]>([])
  const {setShowOnlyHeader} = useGeneralStore()

  const locationCodes = getLocationCodes()

  const onLinkClick = () => {
    setShowOnlyHeader(false)
  }
  return (
    <div className='absolute top-[200px] inset-x-0 z-10 bg-white divide-y divide-shadow-b border-t flex flex-col items-start min-h-[95vh]'>
      {isEmpty(history) &&
        categoriesWithoutAll.map((c) => (
          <CategoryItem
            category={c}
            key={c.id}
            onClick={() => setHistory([c])}
          />
        ))}
      {!isEmpty(history) && (
        <>
          <Button
            onClick={() => setHistory(history.slice(0, -1))}
            className='categories-selector-item py-3'>
            <IcArrowBack className='w-6 h-6 fill-current text-black-c mr-2' />
            {t('BACK')}
          </Button>
          <LinkWrapper
            handleClick={() => {
              onLinkClick()
            }}
            title={t('SHOW_ALL_ADVERTS')}
            href={`/${locationCodes}/${getSlugs(history)}`}
            className='text-brand-b1 categories-selector-item py-3'>
            {t('SHOW_ALL_ADVERTS')}
          </LinkWrapper>
          {last(history).items.map((value) => (
            <CategoryItem
              key={value.id}
              category={value}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...(isEmpty(value.items)
                ? {
                    href: `/${locationCodes}/${getSlugs(history)}/${
                      value.slug
                    }`,
                    onLinkClick,
                  }
                : {
                    onClick: () => setHistory([...history, value]),
                  })}>
              {value.name}
            </CategoryItem>
          ))}
        </>
      )}
    </div>
  )
})

export default CategoriesMobileSelector
