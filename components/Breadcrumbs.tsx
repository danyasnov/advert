import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import {useTranslation} from 'next-i18next'
import Link from 'next/link'
import {toJS} from 'mobx'
import {CACategoryModel} from 'front-api'
import {useCategoriesStore} from '../providers/RootStoreProvider'

const Breadcrumbs: FC = observer(() => {
  const {query} = useRouter()
  const categoriesStore = useCategoriesStore()
  const {t} = useTranslation()
  let categoriesBreadcrumbs = []
  const categories = toJS(categoriesStore.categories)
  if (Array.isArray(query.categories)) {
    let currentCategory: CACategoryModel
    let currentHref = `/${query.country}/${query.city}/`

    categoriesBreadcrumbs = query.categories.reduce((acc, slug) => {
      let category
      if (acc.length) {
        category = currentCategory.items.find((c) => c.slug === slug)
      } else {
        category = categories.find((c) => c.slug === slug)
      }
      if (category) {
        currentCategory = category
        currentHref = `${currentHref + slug}/`
        acc.push({
          title: category.name,
          href: currentHref,
        })
      }
      return acc
    }, [])
  }

  const breadcrumbs = [
    {
      title: t('MAIN'),
      href: '/',
    },

    ...categoriesBreadcrumbs,
  ]

  return (
    <div className='text-body-2 space-x-1'>
      {breadcrumbs.flatMap((b, index, arr) => {
        const isLast = arr.length - 1 === index
        const link = isLast ? (
          <span className='text-black-c' key={b.title}>
            {b.title}
          </span>
        ) : (
          <Link href={b.href} passHref key={b.title}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className='text-brand-b1'>{b.title}</a>
          </Link>
        )
        return index === 0
          ? [link]
          : [
              <span key={`${index}-${b.title}`} className='text-black-c'>
                →
              </span>,
              link,
            ]
      })}
    </div>
  )
})
export default Breadcrumbs
