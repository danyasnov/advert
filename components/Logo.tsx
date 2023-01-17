import {FC} from 'react'
import LinkWrapper from './Buttons/LinkWrapper'
import ImageWrapper from './ImageWrapper'

const Logo: FC = () => {
  const body = (
    <div className='h-10'>
      <ImageWrapper
        type='/img/logo/FullLogo.svg'
        alt='Logo'
        width={172}
        height={40}
        layout='fixed'
      />
    </div>
  )
  return (
    <LinkWrapper
      title='logo'
      href='/'
      className='flex flex-col justify-center items-center cursor-pointer '>
      {body}
    </LinkWrapper>
  )
}

export default Logo
