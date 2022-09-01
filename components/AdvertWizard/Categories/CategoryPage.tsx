import {FC, useContext, useEffect, useState} from 'react'
import {CACategoryModel, CAParamsModel} from 'front-api'
import {useTranslation} from 'next-i18next'
import {first, isEmpty, last, toNumber} from 'lodash'
import IcKeyboardArrowLeft from 'icons/material/KeyboardArrowLeft.svg'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import Button from '../../Buttons/Button'
import PrimaryButton from '../../Buttons/PrimaryButton'
import {useCategoriesStore} from '../../../providers/RootStoreProvider'
import {AdvertPages, WizardContext} from '../AdvertWizard'
import OutlineButton from '../../Buttons/OutlineButton'
import {makeRequest} from '../../../api'
import SearchCategories from '../SearchCategories'
import CategoriesDesktop from './CategoriesDesktop'
import CategoriesMobile from './CategoriesMobile'
import MobileCategoriesHeader from './MobileCategoriesHeader'

const CategoryPage: FC = observer(() => {
  const {state, dispatch} = useContext(WizardContext)

  const {t} = useTranslation()
  const router = useRouter()
  const {query} = router
  const hash = first(query.hash)

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
          const newDraft: Partial<CAParamsModel> = {
            currencies: draft.currencies,
            currency: draft.currency,
            degradation: draft.degradation,
            location: draft.location,
            addressDraft: draft.addressDraft,
            categoryId: categoryData.id,
            data: categoryData,
            // @ts-ignore
            breadcrumbs: selected.map((s) => s.name).join(' - '),
          }
          if (draft.userHash) newDraft.userHash = draft.userHash
          if (hash) newDraft.hash = hash
          dispatch({
            type: 'setDraft',
            draft: newDraft,
          })
          return makeRequest({
            url: '/api/save-draft',
            method: 'post',
            data: {
              hash: hash || null,
              draft: newDraft,
            },
          })
        })
        .then((res) => {
          if (!hash) {
            router.query.hash = [res.data.result.hash]
            router.push(router)
          }
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
      <div className='mb-8 hidden s:block'>
        <h5 className='text-h-5 text-greyscale-900 font-normal mb-8 mt-8'>
          {rootCategory ? (
            <div className='flex'>
              <Button
                onClick={() => {
                  setSelected([])
                }}>
                <IcKeyboardArrowLeft className='fill-current text-primary-500 w-7 h-7' />
              </Button>
              {rootCategory.name}
            </div>
          ) : (
            t('SELECT_CATEGORY')
          )}
        </h5>
        <div className='w-1/2'>
          <SearchCategories
            handleSelectedItemChange={(item) => {
              if (!item.id) return
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
          id='ad-back-button'
          onClick={() => {
            dispatch({
              type: 'setPage',
              page: AdvertPages.mapPage,
            })
          }}>
          {t('BACK')}
        </OutlineButton>
        <PrimaryButton
          id='ad-apply-button'
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
