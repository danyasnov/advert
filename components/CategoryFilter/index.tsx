import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import Select, {SelectItem} from '../Selects/Select'
import {useCategoriesStore} from '../../providers/RootStoreProvider'
import {findCategoryByQuery, getQueryValue} from '../../helpers'
import DefaultForm from './DefaultForm'

const CategoryFilter: FC = observer(() => {
  const router = useRouter()
  const slug = getQueryValue(router.query, 'category')
  const {t} = useTranslation()
  const {categories} = useCategoriesStore()
  const currentCategory = findCategoryByQuery(
    router.query.categories,
    categories,
  )
  const options = currentCategory.items.map((i) => ({
    value: i.id,
    label: i.name,
    slug: i.slug,
  }))
  return (
    <div className='hidden m:block w-72 bg-white border border-shadow-b rounded-lg px-4 py-4 divide-y'>
      <div className='pb-8'>
        <Select
          placeholder={t('SUBCATEGORY')}
          options={options}
          onChange={(opt: SelectItem & {slug: string}) => {
            router.push(`${router.asPath}/${opt.slug}`)
          }}
        />
      </div>
      <DefaultForm />
    </div>
  )
})

export default CategoryFilter
