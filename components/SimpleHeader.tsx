import {FC} from 'react'
import Logo from './Logo'
import Auth from './Auth'

const SimpleHeader: FC<{title?: string}> = ({title}) => {
  return (
    <header className='hidden s:block relative z-10 header-width mx-auto py-8'>
      <div className='w-full l:w-1208px flex items-center justify-between'>
        <div className='flex items-center'>
          <Logo />
          {!!title && <span className='ml-6 text-h-4 font-bold'>{title}</span>}
        </div>
        <div className='flex items-center px-6'>
          <Auth />
        </div>
      </div>
    </header>
  )
}

export default SimpleHeader
