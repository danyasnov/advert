import {FC, useEffect, useState} from 'react'
import IcFB from 'icons/social/FB.svg'
import IcInstagram from 'icons/social/Instagram.svg'
import IcYouTube from 'icons/social/YouTube.svg'
import IcTikTok from 'icons/social/TikTok.svg'
import {parseCookies} from 'nookies'
import {observer} from 'mobx-react-lite'
import LinkWrapper from './Buttons/LinkWrapper'
import {SerializedCookiesState} from '../types'

const fb = {
  icon: <IcFB width={24} height={24} />,
  title: 'Facebook',
}
const ig = {
  icon: <IcInstagram width={24} height={24} />,
  title: 'Instagram',
}
const yt = {
  icon: <IcYouTube width={24} height={24} />,
  title: 'YouTube',
}
const tt = {
  icon: <IcTikTok width={24} height={24} />,
  title: 'TikTok',
}
const socials = {
  el: [
    {
      ...fb,
      url: 'https://www.facebook.com/Adverto_EL-108380018240729',
    },
    {
      ...ig,
      url: 'https://www.instagram.com/adverto_sale',
    },
    {
      ...yt,
      url: 'https://www.youtube.com/channel/UCNw45Njh62Xq8-xPLQ2loXg',
    },
    {
      ...tt,
      url: 'https://www.tiktok.com/@adverto_sale',
    },
  ],
  ru: [
    {
      ...fb,
      url: 'https://www.facebook.com/Adverto_RU-228551712416165',
    },
    {
      ...yt,
      url: 'https://www.youtube.com/channel/UCNw45Njh62Xq8-xPLQ2loXg',
    },
  ],
  en: [
    {
      ...fb,
      url: 'https://www.facebook.com/adverto.sale.official',
    },
    {
      ...ig,
      url: 'https://www.instagram.com/adverto_sale',
    },
    {
      ...yt,
      url: 'https://www.youtube.com/channel/UCNw45Njh62Xq8-xPLQ2loXg',
    },
  ],
  uk: [
    {
      ...fb,
      url: 'https://www.facebook.com/Adverto_Ukraine-106412321776569',
    },
    {
      ...yt,
      url: 'https://www.youtube.com/channel/UCNw45Njh62Xq8-xPLQ2loXg',
    },
  ],
  ro: [
    {
      ...yt,
      url: 'https://www.youtube.com/channel/UCNw45Njh62Xq8-xPLQ2loXg',
    },
  ],
  tr: [
    {
      ...fb,
      url: 'https://www.facebook.com/Adverto_TR-102236565533884',
    },
    {
      ...yt,
      url: 'https://www.youtube.com/channel/UCNw45Njh62Xq8-xPLQ2loXg',
    },
  ],
}

const Socials: FC = observer(() => {
  const [current, setCurrent] = useState([])
  useEffect(() => {
    const state: SerializedCookiesState = parseCookies()
    const {language} = state
    setCurrent(socials[language || 'en'])
  }, [])
  return (
    <div className='flex space-x-2'>
      {current.map((s) => (
        <LinkWrapper key={s.url} href={s.url} title={s.title} target='_blank'>
          {s.icon}
        </LinkWrapper>
      ))}
    </div>
  )
})

export default Socials
