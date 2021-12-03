import {FC, useEffect, useState} from 'react'
import {CACategoryModel} from 'front-api'
import {useTranslation} from 'next-i18next'
import {first, isEmpty, last} from 'lodash'
import IcKeyboardArrowLeft from 'icons/material/KeyboardArrowLeft.svg'
import {observer} from 'mobx-react-lite'
import ImageWrapper from '../ImageWrapper'
import Button from '../Buttons/Button'
import PrimaryButton from '../Buttons/PrimaryButton'
import {useCategoriesStore} from '../../providers/RootStoreProvider'
import {AdvertPages, PageProps} from './AdvertWizard'
import OutlineButton from '../Buttons/OutlineButton'

const CategoryPage: FC<PageProps> = observer(({state, dispatch}) => {
  const {t} = useTranslation()
  const {categoriesWithoutAll: categories} = useCategoriesStore()

  const [selected, setSelected] = useState<CACategoryModel[]>([])
  const [valid, setValid] = useState(false)

  useEffect(() => {
    const lastSelected = last(selected)
    if (lastSelected && isEmpty(lastSelected.items)) {
      setValid(true)
    } else {
      setValid(false)
    }
  }, [selected])
  const rootCategory = first(selected)

  const header = (
    <h3 className='text-headline-8 text-hc-title font-bold mb-4 mt-8'>
      {rootCategory ? (
        <div className='flex'>
          <Button
            onClick={() => {
              setSelected([])
              dispatch({
                type: 'setCategory',
                category: null,
              })
            }}>
            <IcKeyboardArrowLeft className='fill-current text-nc-primary w-7 h-7' />
          </Button>
          {rootCategory.name}
        </div>
      ) : (
        t('SELECT_CATEGORY')
      )}
    </h3>
  )

  const footer = (
    <div className='fixed inset-x-0 bottom-0 flex justify-between bg-white shadow-2xl px-29 py-2.5'>
      <OutlineButton
        onClick={() => {
          dispatch({
            type: 'setPage',
            page: AdvertPages.mapPage,
          })
        }}>
        {t('BACK')}
      </OutlineButton>
      <PrimaryButton
        onClick={() => {
          const category = last(selected)
          // if (state.category?.id && category.id !== state.category?.id) {
          //   dispatch({
          //     type: 'setFormData',
          //     formData: null,
          //   })
          // }
          dispatch({
            type: 'setCategory',
            category,
          })
          dispatch({
            type: 'setPage',
            page: AdvertPages.formPage,
          })
        }}
        disabled={!valid}>
        {t('APPLY')}
      </PrimaryButton>
    </div>
  )

  if (isEmpty(selected)) {
    return (
      <div className='w-full'>
        {header}
        <div className='flex flex-wrap gap-x-4 gap-y-8 justify-between m:justify-start'>
          {categories.map((c) => (
            <Button
              key={c.id}
              className='flex flex-col'
              onClick={() => {
                setSelected([c])
              }}>
              <ImageWrapper
                type={`/img/categories/${c.slug}.jpg`}
                width={188}
                height={188}
                alt={c.name}
                className='rounded-xl'
                layout='fixed'
              />
              <span className='text-nc-title text-body-1 mt-2'>{c.name}</span>
            </Button>
          ))}
        </div>
        {footer}
      </div>
    )
  }
  return (
    <div className='w-full'>
      {header}
      <div className='flex mb-15'>
        <div className='grid grid-cols-3 w-full gap-x-4'>
          {selected.map((parentCategory, index) => (
            <div className='flex flex-col'>
              {parentCategory.items.map((c) => (
                <Button
                  key={c.id}
                  className={`min-h-10 hover:bg-nc-accent rounded-lg py-2 px-4 ${
                    selected[index + 1]?.id === c.id ? 'bg-nc-accent' : ''
                  }`}
                  onClick={() => {
                    if (selected.length - 1 === index) {
                      setSelected([...selected, c])
                    } else {
                      setSelected([...selected.slice(0, index + 1), c])
                    }
                  }}>
                  <span className='text-nc-title text-body-1 font-normal w-full text-left'>
                    {c.name}
                  </span>
                </Button>
              ))}
            </div>
          ))}
        </div>
        <div className='ml-4 hidden l:block'>
          <ImageWrapper
            type={`/img/categories/${selected[0].slug}.jpg`}
            width={290}
            height={290}
            alt={selected[0].name}
            className='rounded-xl'
            layout='fixed'
          />
        </div>
      </div>
      {footer}
    </div>
  )
})

export default CategoryPage
