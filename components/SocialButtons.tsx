import {FC} from 'react'
import IcViber from 'icons/material/Viber.svg'
import IcWhatsapp from 'icons/material/Whatsapp.svg'
import IcTelegram from 'icons/material/Telegram.svg'
import IcFacebook from 'icons/material/Facebook.svg'
import IcVk from 'icons/material/Vk.svg'
import LinkWrapper from './Buttons/LinkWrapper'

interface Props {
  link: string
}
const SocialButtons: FC<Props> = ({link}) => {
  return (
    <div className='flex space-x-2 mt-4 mb-2 justify-between'>
      <LinkWrapper
        target='_blank'
        title='Telegram'
        href={`https://telegram.me/share/url?url=${link}`}
        className='p-2 border border-shadow-b rounded-lg'>
        <IcTelegram className='fill-current text-black-c h-6 w-6 ' />
      </LinkWrapper>
      <LinkWrapper
        target='_blank'
        title='Facebook'
        href={`https://www.facebook.com/sharer.php?u=${link}`}
        className='p-2 border border-shadow-b rounded-lg'>
        <IcFacebook className='fill-current text-black-c h-6 w-6 ' />
      </LinkWrapper>
      <LinkWrapper
        target='_blank'
        title='Viber'
        href={`viber://forward?text=${link}`}
        className='p-2 border border-shadow-b rounded-lg'>
        <IcViber className='fill-current text-black-c h-6 w-6 ' />
      </LinkWrapper>
      <LinkWrapper
        target='_blank'
        title='Whatsapp'
        href={`whatsapp://send?text=${link}`}
        className='p-2 border border-shadow-b rounded-lg'>
        <IcWhatsapp className='fill-current text-black-c h-6 w-6 ' />
      </LinkWrapper>
      <LinkWrapper
        target='_blank'
        title='VK'
        href={`https://vk.com/share.php?url=${link}`}
        className='p-2 border border-shadow-b rounded-lg'>
        <IcVk className='fill-current text-black-c h-6 w-6 ' />
      </LinkWrapper>
    </div>
  )
}

export default SocialButtons
