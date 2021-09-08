import {FC, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import IcShare from 'icons/material/Share.svg'
import IcClear from 'icons/material/Clear.svg'
import IcKeyboardArrowRight from 'icons/material/KeyboardArrowRight.svg'
import {useClickAway} from 'react-use'
import UserProfile from './UserProfile'
import {useUserStore} from '../providers/RootStoreProvider'
import UserAvatar from './UserAvatar'
import Button from './Buttons/Button'

const UserSidebar: FC = observer(() => {
  const {user} = useUserStore()
  const ref = useRef(null)
  const [collapsed, setCollapsed] = useState(true)
  useClickAway(ref, () => {
    setCollapsed(true)
  })
  const collapsedClassname = 'w-14 p-2'
  const expandedClassname = 'w-80 px-4 py-6'
  return (
    <div
      ref={ref}
      className={`bg-white shadow-xl relative ${
        collapsed ? collapsedClassname : expandedClassname
      }`}>
      {!collapsed && (
        <div className=''>
          <Button
            className='absolute top-4 -right-4 w-8 h-8 z-10 bg-white rounded-r-full shadow-2xl'
            onClick={() => setCollapsed(true)}>
            <IcClear className='fill-current text-black-c h-7 w-7' />
          </Button>
          <UserProfile />
        </div>
      )}
      {collapsed && (
        <>
          <Button
            className='absolute top-3 -right-4 w-8 h-8 bg-white rounded-r-full'
            onClick={() => setCollapsed(false)}>
            <IcKeyboardArrowRight className='fill-current text-black-c h-8 w-8' />
          </Button>
          <div className='flex flex-col items-center space-y-4'>
            <UserAvatar url={user.imageUrl} size={10} name={user.name} />
            <IcShare className='fill-current text-black-c h-6 w-6' />
          </div>
        </>
      )}
    </div>
  )
})
export default UserSidebar
