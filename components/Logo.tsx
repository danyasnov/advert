import {FC} from 'react'
import IcAdvertoLogoInverseSquare from 'icons/logo/AdvertoLogoInverseSquare.svg'
import IcAdvertoLogoInverseLandscape from 'icons/logo/AdvertoLogoInverseLandscape.svg'
import {useRouter} from 'next/router'
import Button from './Buttons/Button'

const Logo: FC = () => {
  const router = useRouter()
  return (
    <Button
      onClick={() => router.push('/')}
      className='flex flex-col justify-center cursor-pointer'>
      <IcAdvertoLogoInverseSquare width={40} height={40} className='l:hidden' />
      <IcAdvertoLogoInverseLandscape
        width={146}
        height={32}
        className='hidden l:block'
      />
    </Button>
  )
}

export default Logo
