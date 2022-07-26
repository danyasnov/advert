import {FC} from 'react'
import LinkWrapper from './Buttons/LinkWrapper'
import ImageWrapper from './ImageWrapper'

const Logo: FC<{size?: number}> = ({size = 40}) => {
  return (
    <LinkWrapper
      title='logo'
      href='/'
      className='flex flex-col justify-center items-center cursor-pointer'>
      <div className='flex'>
        {/* <ImageWrapper */}
        {/*  type='/img/logo/AdvertoLogoSquare.png' */}
        {/*  alt='Logo' */}
        {/*  width={size} */}
        {/*  height={size} */}
        {/*  layout='fixed' */}
        {/* /> */}
      </div>
    </LinkWrapper>
  )
}

export default Logo
