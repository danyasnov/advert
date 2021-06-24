import {FC, useEffect} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import Select, {SelectItem} from '../Selects/Select'
import {
  useCategoriesStore,
  useProductsStore,
} from '../../providers/RootStoreProvider'
import {
  findCategoryByQuery,
  findCurrentCategoriesOptionsyByQuery,
} from '../../helpers'
import FilterForm from './FilterForm'

const CategoryFilter: FC = observer(() => {
  const router = useRouter()
  const {t} = useTranslation()
  const {setFilter} = useProductsStore()
  const {categories} = useCategoriesStore()
  const currentCategory = findCategoryByQuery(
    router.query.categories,
    categories,
  )
  useEffect(() => {
    if (currentCategory) {
      setFilter({categoryId: currentCategory.id})
    }
  }, [currentCategory, setFilter])
  const currentCategoriesOptions = findCurrentCategoriesOptionsyByQuery(
    router.query.categories,
    categories,
  )

  const options = currentCategoriesOptions.map((i) => ({
    value: i.id,
    label: i.name,
    slug: i.slug,
  }))
  const currentOption =
    options.find((o) => o.value === currentCategory.id) ?? null

  return (
    <div className='hidden m:block w-72 bg-white border border-shadow-b rounded-lg px-4 py-4 divide-y shadow-md'>
      <div className='pb-8'>
        <Select
          placeholder={t('SUBCATEGORY')}
          value={currentOption}
          options={options}
          onChange={(opt: SelectItem & {slug: string}) => {
            if (opt?.value) setFilter({categoryId: opt.value as number})
            if (currentCategory.items.length) {
              router.push(`${router.asPath}/${opt.slug}`)
            } else {
              const pathArray = router.asPath.split('/')
              pathArray[pathArray.length - 1] = opt.slug
              router.push(pathArray.join('/'))
            }
          }}
        />
      </div>
      <FilterForm />
    </div>
  )
})

export default CategoryFilter
