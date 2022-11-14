import {FC} from 'react'
import LinkWrapper from './Buttons/LinkWrapper'
import ImageWrapper from './ImageWrapper'

interface Props {
  variant?: 'small' | 'big' | 'both'
}
const Logo: FC<Props> = ({variant = 'both'}) => {
  let body = null
  const small = (
    <ImageWrapper
      type='/img/logo/ShortLogo.svg'
      alt='Logo'
      width={40}
      height={40}
      layout='fixed'
    />
  )
  const big = (
    <ImageWrapper
      type='/img/logo/FullLogo.svg'
      alt='Logo'
      width={172}
      height={40}
      layout='fixed'
    />
  )
  if (variant === 'both') {
    body = (
      <>
        <div className='m:block hidden h-10'>{big}</div>
        <div className='m:hidden h-10 w-10'>{small}</div>
      </>
    )
  }
  if (variant === 'small') {
    body = <div className='h-10 w-10'>{small}</div>
  }
  if (variant === 'big') {
    body = <div className='h-10'>{big}</div>
  }
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
