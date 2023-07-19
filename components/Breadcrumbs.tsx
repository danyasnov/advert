import {FC, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import {useTranslation} from 'next-i18next'
import {CACategoryModel} from 'front-api'
import {parseCookies} from 'nookies'
import {toJS} from 'mobx'
import {
  useCategoriesStore,
  useProductsStore,
} from '../providers/RootStoreProvider'
import LinkWrapper from './Buttons/LinkWrapper'
import LinkButton from './Buttons/LinkButton'
import {getUrlQueryFromFilter, shallowUpdateQuery} from '../helpers'
import {SerializedCookiesState} from '../types'

const Breadcrumbs: FC<{brandLabel?: string; modelLabel?: string}> = observer(
  ({brandLabel, modelLabel}) => {
    const [location, setLocation] = useState('')
    const cookies: SerializedCookiesState = parseCookies()

    useEffect(() => {
      if (cookies.cookieAccepted === 'true') {
        setLocation(`: ${cookies.address}`)
      } else {
        setLocation('')
      }
    }, [cookies.address])
    const {query} = useRouter()
    const {categories} = useCategoriesStore()
    const {setFilter, filter, aggregatedFields, fetchProducts, applyFilter} =
      useProductsStore()
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
    const transportBreadcrumbs = []
    if (brandLabel) {
      transportBreadcrumbs.push({
        title: brandLabel,
        onClick: () => {
          // todo update formik form
          const updatedFilter = setFilter({
            fields: {1991: filter.fields['1991'], 1992: []},
          })

          const params = new URLSearchParams(window.location.search)
          const sortBy = params.get('sortBy')
          const newParams = new URLSearchParams(
            getUrlQueryFromFilter(
              updatedFilter,
              aggregatedFields.reduce(
                (acc, val) => ({...acc, [val.id]: val}),
                {},
              ),
            ),
          )
          if (sortBy) newParams.set('sortBy', sortBy)
          shallowUpdateQuery(newParams.toString())
          fetchProducts({query}).then(() => {
            applyFilter()
          })
          // setFilter({fiel})
        },
      })
      if (modelLabel) {
        transportBreadcrumbs.push({
          title: modelLabel,
        })
      }
    }

    const breadcrumbs = [
      {
        title: t('MAIN'),
        href: '/',
      },
      ...categoriesBreadcrumbs,
      ...transportBreadcrumbs,
    ]

    if (breadcrumbs.length === 1) {
      return (
        <span className='text-body-14 text-greyscale-900'>
          {t('ALL_ADS')}
          {location}
        </span>
      )
    }

    return (
      <div className='text-body-14 space-x-1'>
        {breadcrumbs.flatMap((b, index, arr) => {
          const isLast = arr.length - 1 === index
          const isButton = !!b.onClick
          let link
          if (isLast) {
            link = (
              <span className='text-greyscale-900' key={b.title}>
                {b.title}
              </span>
            )
          } else if (isButton) {
            link = (
              <LinkButton
                onClick={b.onClick}
                key={b.title}
                className='text-primary-500 font-normal !inline'>
                {b.title}
              </LinkButton>
            )
          } else {
            link = (
              <LinkWrapper
                title={b.title}
                href={b.href}
                key={b.title}
                className='text-primary-500'>
                {b.title}
              </LinkWrapper>
            )
          }

          return index === 0
            ? [link]
            : [
                <span
                  key={`${index}-${b.title}`}
                  className='text-greyscale-900'>
                  /
                </span>,
                link,
              ]
        })}
      </div>
    )
  },
)
export default Breadcrumbs
