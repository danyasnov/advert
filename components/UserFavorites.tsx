import React, {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useUserStore} from '../providers/RootStoreProvider'
import UserTabWrapper from './UserTabWrapper'

const UserFavorites: FC = observer(() => {
  const {fetchProducts, userFavorite} = useUserStore()
  return (
    <UserTabWrapper
      products={userFavorite.items}
      page={userFavorite.page}
      count={userFavorite.count}
      state={userFavorite.state}
      enableTwoColumnsForS
      disableVipWidth
      limit={userFavorite.limit}
      fetchProducts={() => {
        fetchProducts({
          page: userFavorite.page + 1,
          path: 'userFavorite',
        })
      }}
      tab='favorites'
    />
  )
})

export default UserFavorites
