import {FC, useMemo} from 'react'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import {useTranslation} from 'next-i18next'
import {get, size} from 'lodash'
import {toJS} from 'mobx'
import {
  useCategoriesStore,
  useProductsStore,
} from '../providers/RootStoreProvider'
import Breadcrumbs from './Breadcrumbs'
import {getQueryValue} from '../helpers'
import {getSelectOptions} from './FormikComponents'

const CategoryHeader: FC = observer(() => {
  const {categoryData} = useCategoriesStore()
  const {query} = useRouter()
  const search = getQueryValue(query, 'q')
  const {t} = useTranslation()
  const {filter, aggregatedFields, count} = useProductsStore()
  const brand = get(filter, 'fields.1991')
  const model = get(filter, 'fields.1992')
  const getFieldValue = (id, filterValue) => {
    if (!filterValue) return
    const options = getSelectOptions(
      aggregatedFields.find((f) => f.id === id)?.multiselects,
    )

    return options.find((o) => o.value === filterValue)?.label
  }
  const brandLabel = useMemo(() => {
    return getFieldValue(1991, brand?.[0])
  }, [brand])
  const modelLabel = useMemo(() => {
    return getFieldValue(1992, model?.[0])
  }, [model])

  const getHeader = () => {
    if (size(brand) === 1) {
      let result = ''

      if (brandLabel) {
        result = `${t('BUY')} ${brandLabel}`
        if (size(model) === 1) {
          if (modelLabel) {
            return `${result} ${modelLabel}`
          }
          return result
        }
        return result
      }
    } else if (categoryData?.name) {
      return categoryData?.name
    } else if (search) {
      return t('SEARCH_RESULTS_BY_QUERY', {query: search})
    }
  }

  return (
    <div className='flex flex-col my-8'>
      <Breadcrumbs brandLabel={brandLabel} modelLabel={modelLabel} />
      <div className='flex justify-between items-center pt-8'>
        <h1 className='text-h-4 font-bold text-greyscale-900 '>
          {getHeader()}
        </h1>
        <span className='text-body-12 text-greyscale-700'>
          {t('RESULTS_COUNT', {count})}
        </span>
      </div>
    </div>
  )
})

export default CategoryHeader
