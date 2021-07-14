import {FC, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import {
  useCategoriesStore,
  useProductsStore,
} from '../../providers/RootStoreProvider'
import {findCategoryByQuery} from '../../helpers'
import FilterForm from './FilterForm'

const CategoryFilter: FC = observer(() => {
  const router = useRouter()
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

  return (
    <div className='bg-white border border-shadow-b rounded-lg px-4 py-4 divide-y shadow-md'>
      <FilterForm />
    </div>
  )
})

export default CategoryFilter
