import {FC} from 'react'
import LinkWrapper from './Buttons/LinkWrapper'
import ImageWrapper from './ImageWrapper'

const Logo: FC = () => {
  return (
    <LinkWrapper
      title='logo'
      href='/'
      className='flex flex-col justify-center items-center cursor-pointer'>
      <div className='flex h-10'>
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
