import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import useEmblaCarousel from 'embla-carousel-react'
import {isEmpty} from 'lodash'
import IcSort from 'icons/material/Sort.svg'
import {useCategoriesStore} from '../providers/RootStoreProvider'
import {findCategoryByQuery} from '../helpers'
import LinkWrapper from './Buttons/LinkWrapper'
import {clearUrlFromQuery} from '../utils'
import Button from './Buttons/Button'

const QuickCategories: FC = observer(() => {
  const {categories} = useCategoriesStore()
  const {query, asPath} = useRouter()
  const [sort, setSort] = useState<'asc' | 'desc'>('asc')
  const currentCategory = findCategoryByQuery(query.categories, categories)
  const [viewportRef] = useEmblaCarousel({
    dragFree: true,
    align: 'start',
    containScroll: 'trimSnaps',
  })
  if (isEmpty(currentCategory?.items)) return null

  const sorted = currentCategory.items.slice().sort((a, b) => {
    return sort === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  })
  return (
    <div className='overflow-hidden relative -mx-4 mt-4' ref={viewportRef}>
      <div className='flex mx-4 space-x-2 items-center'>
        <Button
          className='w-6 h-6 text-black-c'
          onClick={() => setSort(sort === 'asc' ? 'desc' : 'asc')}>
          {sort === 'desc' ? (
            <IcSort className='fill-current w-6' />
          ) : (
            <IcSort className='fill-current rotate-180	w-6' />
          )}
        </Button>
        {sorted.map((c) => {
          return (
            <LinkWrapper
              key={c.id}
              title={c.name}
              href={`${clearUrlFromQuery(asPath)}/${c.slug}`}
              className='relative max-w-full whitespace-nowrap flex-initial text-body-14 text-greyscale-900 rounded-sm p-2 border border-shadow-b '>
              {c.name}
            </LinkWrapper>
          )
        })}
      </div>
    </div>
  )
})

export default QuickCategories
