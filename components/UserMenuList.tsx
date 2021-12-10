import {FC} from 'react'
import IcAdvert from 'icons/material/Advert.svg'
import IcStar from 'icons/material/Star.svg'
import IcLike from 'icons/material/Like.svg'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {noop} from 'lodash'
import IcCreate from 'icons/material/Create.svg'
import {useGeneralStore, useUserStore} from '../providers/RootStoreProvider'
import Button from './Buttons/Button'
import {PagesType} from '../stores/GeneralStore'

interface Props {
  collapsed: boolean
  onSelect?: () => void
}
const UserMenuList: FC<Props> = observer(({collapsed, onSelect = noop}) => {
  const {t} = useTranslation()
  const {setActiveUserPage, activeUserPage, userHash} = useGeneralStore()
  const {user} = useUserStore()
  const isCurrentUser = userHash === user.hash

  const list = [
    {
      icon: <IcAdvert className='fill-current h-6 w-6' />,
      title: t('ADS'),
      id: 'adverts',
      show: true,
    },
    {
      icon: <IcStar className='fill-current h-6 w-6' />,
      title: t('REVIEWS'),
      id: 'reviews',
      show: true,
    },
    {
      icon: <IcCreate className='fill-current h-6 w-6 mr-1' />,
      title: t('DRAFTS'),
      id: 'drafts',
      show: isCurrentUser,
    },
    {
      icon: <IcLike className='fill-current h-6 w-6' />,
      title: t('FAVORITE'),
      id: 'favorites',
      show: isCurrentUser,
    },
  ]
  return (
    <div className='flex flex-col'>
      {list.map((i) => {
        if (!i.show) return null
        return (
          <Button
            onClick={() => {
              setActiveUserPage(i.id as PagesType)
              onSelect()
            }}>
            <div
              className={`flex text-black-f items-center ${
                collapsed ? 'py-3 px-3' : 'py-3 pl-4'
              } w-full rounded-lg ${
                i.id === activeUserPage ? 'bg-brand-a2' : ''
              }`}>
              <div className={collapsed ? '' : 'mr-1'}>{i.icon}</div>
              {!collapsed && (
                <span className='text-body-2 ml-2 flex items-center h-full text-black-b'>
                  {i.title}
                </span>
              )}
            </div>
          </Button>
        )
      })}
    </div>
  )
})

export default UserMenuList
