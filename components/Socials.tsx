import {FC, useEffect, useState} from 'react'
import IcFB from 'icons/social/FB.svg'
import IcInstagram from 'icons/social/Instagram.svg'
import {parseCookies} from 'nookies'
import {observer} from 'mobx-react-lite'
import LinkWrapper from './Buttons/LinkWrapper'
import {SerializedCookiesState} from '../types'

const socialsStyle = 'fill-current group-hover:fill-primary-500'

const socials = [
  {
    icon: <IcFB className={socialsStyle} width={9} height={19} />,
    title: 'Facebook',
    url: 'https://www.facebook.com/vooxee.cy/',
  },
  {
    icon: <IcInstagram className={socialsStyle} width={16} height={16} />,
    title: 'Instagram',
    url: 'https://www.instagram.com/vooxee/',
  },
]

const Socials: FC = observer(() => {
  return (
    <div className='flex space-x-4'>
      {socials.map((s) => (
        <LinkWrapper key={s.url} href={s.url} title={s.title} target='_blank'>
          <div className='flex group w-10 h-10 justify-center items-center rounded-full border-[1.5px] border-greyscale-900 hover:border-primary-500'>
            {s.icon}
          </div>
        </LinkWrapper>
      ))}
    </div>
  )
})

export default Socials
