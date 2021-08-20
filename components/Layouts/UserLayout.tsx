import {FC, useEffect, useState} from 'react'
import Head from 'next/head'
import {observer} from 'mobx-react-lite'
import {TFunction, useTranslation} from 'next-i18next'
import {toJS} from 'mobx'
import ScrollableCardGroup from '../Cards/ScrollableCardGroup'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import {useUserStore} from '../../providers/RootStoreProvider'
import UserProfile from '../UserProfile'
import Tabs from '../Tabs'

const getTabs = (t: TFunction) => [
  {title: t('SALE'), id: 1},
  {title: t('SOLD'), id: 2},
  {title: t('REVIEWS'), id: 3},
]
const UserLayout: FC = observer(() => {
  const {t} = useTranslation()
  const [activeTab, setActiveTab] = useState(1)
  const {products, user, fetchProducts} = useUserStore()
  const {userSale, userSold} = products
  console.log(toJS(user))
  useEffect(() => {
    fetchProducts({page: 1, path: 'userSold'})
  }, [fetchProducts])
  const seoString = `${user.name} - ${t('SELLER_PROFILE')}`
  return (
    <HeaderFooterWrapper>
      <Head>
        <title>{seoString}</title>
        <meta name='description' content={seoString} />
      </Head>
      <div className='bg-white px-4 s:px-8 flex'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto s:w-full justify-center w-full'>
          <aside className='hidden m:block w-72 mt-8'>
            <UserProfile />
          </aside>
          <main className='m:w-608px l:w-896px relative'>
            <Tabs
              items={getTabs(t)}
              onChange={(id) => setActiveTab(id)}
              value={activeTab}
            />
            {activeTab === 1 && (
              <ScrollableCardGroup
                products={userSale.items}
                page={userSale.page}
                count={userSale.count}
                state={userSale.state}
                limit={userSale.limit}
                fetchProducts={() => {
                  fetchProducts({page: userSale.page + 1, path: 'userSale'})
                }}
              />
            )}
            {activeTab === 2 && (
              <ScrollableCardGroup
                products={userSold.items}
                page={userSold.page}
                count={userSold.count}
                state={userSold.state}
                limit={userSold.limit}
                fetchProducts={() => {
                  fetchProducts({page: userSold.page + 1, path: 'userSold'})
                }}
              />
            )}
          </main>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
})

export default UserLayout
