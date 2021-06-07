import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import {useTranslation} from 'next-i18next'
import Link from 'next/link'
import {useCategoriesStore} from '../providers/RootStoreProvider'

const Breadcrumbs: FC = observer(() => {
  const router = useRouter()
  const categoriesStore = useCategoriesStore()
  const {t} = useTranslation()
  const breadcrumbs = [
    {
      title: t('MAIN'),
      href: '/',
    },
    {
      // @ts-ignore
      title: categoriesStore.bySlug[router.query.category]?.name,
      href: router.asPath,
    },
  ]

  return (
    <div className=''>
      {breadcrumbs.map((b) => (
        <Link href={b.href}>{b.title}</Link>
      ))}
    </div>
  )
})
export default Breadcrumbs
