import {FC, useEffect, useState} from 'react'
import {CACategoryModel} from 'front-api'
import {useTranslation} from 'next-i18next'
import {first, isEmpty, last, toNumber} from 'lodash'
import IcKeyboardArrowLeft from 'icons/material/KeyboardArrowLeft.svg'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import Button from '../../Buttons/Button'
import PrimaryButton from '../../Buttons/PrimaryButton'
import {useCategoriesStore} from '../../../providers/RootStoreProvider'
import {AdvertPages, PageProps} from '../AdvertWizard'
import OutlineButton from '../../Buttons/OutlineButton'
import {makeRequest} from '../../../api'
import SearchCategories from '../SearchCategories'
import CategoriesDesktop from './CategoriesDesktop'
import CategoriesMobile from './CategoriesMobile'
import MobileCategoriesHeader from './MobileCategoriesHeader'

const CategoryPage: FC<PageProps> = observer(({state, dispatch}) => {
  const {t} = useTranslation()
  const {query} = useRouter()
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

  const onSubmit = (id) => {
    const {draft} = state

    if (draft.categoryId !== id) {
      makeRequest({
        url: '/api/category-data',
        method: 'post',
        data: {
          id,
        },
      })
        .then((res) => {
          const categoryData = res.data.result
          const newDraft = {
            ...draft,
            categoryId: categoryData.id,
            data: categoryData,
          }
          dispatch({
            type: 'setDraft',
            draft: newDraft,
          })
          return makeRequest({
            url: '/api/save-draft',
            method: 'post',
            data: {
              hash: query.hash,
              draft: newDraft,
            },
          })
        })
        .then(() => {
          dispatch({
            type: 'setPage',
            page: AdvertPages.formPage,
          })
        })
    } else {
      dispatch({
        type: 'setPage',
        page: AdvertPages.formPage,
      })
    }
  }

  const header = (
    <>
      <div className='mb-6 hidden s:block'>
        <h3 className='text-headline-8 text-hc-title font-bold mb-6 mt-8'>
          {rootCategory ? (
            <div className='flex'>
              <Button
                onClick={() => {
                  setSelected([])
                }}>
                <IcKeyboardArrowLeft className='fill-current text-nc-primary w-7 h-7' />
              </Button>
              {rootCategory.name}
            </div>
          ) : (
            t('SELECT_CATEGORY')
          )}
        </h3>
        <div className='w-1/2'>
          <SearchCategories
            handleSelectedItemChange={(item) => {
              onSubmit(toNumber(item.id))
            }}
          />
        </div>
      </div>
      <div className='s:hidden'>
        <MobileCategoriesHeader
          selected={selected}
          setSelected={setSelected}
          onBackToMap={() =>
            dispatch({
              type: 'setPage',
              page: AdvertPages.mapPage,
            })
          }
        />
      </div>
    </>
  )

  const footer = (
    <div className='fixed inset-x-0 bottom-0 s:flex justify-between bg-white shadow-2xl px-8 m:px-10 l:px-29 py-2.5 justify-around hidden'>
      <div className='w-full l:w-1208px flex justify-between'>
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
            onSubmit(category.id)
          }}
          disabled={!valid}>
          {t('APPLY')}
        </PrimaryButton>
      </div>
    </div>
  )

  return (
    <div className='w-full'>
      {header}
      <div className='hidden s:block'>
        <CategoriesDesktop
          selected={selected}
          setSelected={setSelected}
          categories={categories}
        />
      </div>
      <div className='s:hidden'>
        <CategoriesMobile
          onSubmit={onSubmit}
          selected={selected}
          setSelected={setSelected}
          categories={categories}
        />
      </div>
      {footer}
    </div>
  )
})

export default CategoryPage
