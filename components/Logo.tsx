import {FC} from 'react'
import Icon from './Icon'

const Logo: FC = () => {
  return (
    <div className='flex flex-col justify-center '>
      <Icon
        type='icAdvertoLogoInverseSquare'
        width={40}
        height={40}
        className='l:hidden'
      />
      <Icon
        type='icAdvertoLogoInverseLandscape'
        width={146}
        height={32}
        className='hidden l:block'
      />
    </div>
  )
}

export default Logo
