import {FC} from 'react'
import IcAdvertoLogoInverseSquare from 'icons/logo/AdvertoLogoInverseSquare.svg'
import IcAdvertoLogoInverseLandscape from 'icons/logo/AdvertoLogoInverseLandscape.svg'
import LinkWrapper from './Buttons/LinkWrapper'

const Logo: FC = () => {
  return (
    <LinkWrapper
      title='logo'
      href='/'
      className='flex flex-col justify-center cursor-pointer'>
      <IcAdvertoLogoInverseSquare width={40} height={40} className='l:hidden' />
      <IcAdvertoLogoInverseLandscape
        width={146}
        height={32}
        className='hidden l:block'
      />
    </LinkWrapper>
  )
}

export default Logo
