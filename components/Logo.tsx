import {FC} from 'react'
import IcAdvertoLogoInverseSquare from '../assets/icons/logo/AdvertoLogoInverseSquare.svg'
import IcAdvertoLogoInverseLandscape from '../assets/icons/logo/AdvertoLogoInverseLandscape.svg'

const Logo: FC = () => {
  return (
    <div className='flex flex-col justify-center '>
      <IcAdvertoLogoInverseSquare width={40} height={40} className='l:hidden' />
      <IcAdvertoLogoInverseLandscape
        width={146}
        height={32}
        className='hidden l:block'
      />
    </div>
  )
}

export default Logo
