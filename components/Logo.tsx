import {FC} from 'react'
import Icon from './Icon'

const Logo: FC = () => {
  return (
    <div className='flex flex-col justify-center '>
      <div className='l:hidden'>
        <Icon type='icAdvertoLogoInverseSquare' width={40} height={40} />
      </div>
      <div className='hidden l:block'>
        <Icon type='icAdvertoLogoInverseLandscape' width={146} height={32} />
      </div>
    </div>
  )
}

export default Logo
