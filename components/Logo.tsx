import {FC} from 'react'
import IcAdvertoLogoInverseLandscape from 'icons/logo/AdvertoLogoInverseLandscape.svg'
import LinkWrapper from './Buttons/LinkWrapper'
import ImageWrapper from './ImageWrapper'

const Logo: FC = () => {
  return (
    <LinkWrapper
      title='logo'
      href='/'
      className='flex flex-col justify-center items-center cursor-pointer'>
      <IcAdvertoLogoInverseLandscape
        width={146}
        height={32}
        className='hidden l:block'
      />
      <div className='flex l:hidden h-10'>
        <ImageWrapper
          type='/img/logo/AdvertoLogoSquare.png'
          alt='Logo'
          width={40}
          height={40}
          layout='fixed'
        />
      </div>
    </LinkWrapper>
  )
}

export default Logo
