import {FC} from 'react'
import LinkWrapper from './Buttons/LinkWrapper'
import ImageWrapper from './ImageWrapper'

const Logo: FC<{size?: number}> = ({size = 40}) => {
  return (
    <LinkWrapper
      title='logo'
      href='/'
      className='flex flex-col justify-center items-center cursor-pointer'>
      <div className='m:block hidden'>
        <ImageWrapper
          type='/img/logo/FullLogo.png'
          alt='Logo'
          width={150}
          height={size}
          layout='fixed'
        />
      </div>
      <div className='m:hidden'>
        <ImageWrapper
          type='/img/logo/ShortLogo.png'
          alt='Logo'
          width={size}
          height={size}
          layout='fixed'
        />
      </div>
    </LinkWrapper>
  )
}

export default Logo
