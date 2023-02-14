import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import {useTranslation} from 'next-i18next'
import {CACategoryModel} from 'front-api'
import {useCategoriesStore} from '../providers/RootStoreProvider'
import LinkWrapper from './Buttons/LinkWrapper'

const Breadcrumbs: FC = observer(() => {
  const {query} = useRouter()
  const {categories} = useCategoriesStore()
  const {t} = useTranslation()
  let categoriesBreadcrumbs = []
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
    <div className='text-body-14 space-x-1'>
      {breadcrumbs.flatMap((b, index, arr) => {
        const isLast = arr.length - 1 === index
        const link = isLast ? (
          <span className='text-greyscale-900' key={b.title}>
            {b.title}
          </span>
        ) : (
          <LinkWrapper
            title={b.title}
            href={b.href}
            key={b.title}
            className='text-primary-500'>
            {b.title}
          </LinkWrapper>
        )
        return index === 0
          ? [link]
          : [
              <span key={`${index}-${b.title}`} className='text-greyscale-900'>
                /
              </span>,
              link,
            ]
      })}
    </div>
  )
})
export default Breadcrumbs
