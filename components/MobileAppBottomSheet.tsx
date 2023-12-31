import {FC, useState} from 'react'
import {BottomSheet} from 'react-spring-bottom-sheet'
import {MobileView, browserName} from 'react-device-detect'
import IcChrome from 'icons/browsers/Chrome.svg'
import IcSafari from 'icons/browsers/Safari.svg'
import IcFirefox from 'icons/browsers/Firefox.svg'
import IcOpera from 'icons/browsers/Opera.svg'
import IcSamsung from 'icons/browsers/SamsungInternet.svg'
import IcUc from 'icons/browsers/Uc.svg'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import {observer} from 'mobx-react-lite'
import ImageWrapper from './ImageWrapper'
import Button from './Buttons/Button'
import {SerializedCookiesState} from '../types'
import {setCookiesObject} from '../helpers'
import LinkWrapper from './Buttons/LinkWrapper'
import {useProductsStore} from '../providers/RootStoreProvider'

const MobileAppBottomSheet: FC = observer(() => {
  const [open, setOpen] = useState(false)
  const {t} = useTranslation()
  const {product} = useProductsStore()

  useState(() => {
    const state: SerializedCookiesState = parseCookies()
    if (state.showBottomSheet !== 'false') {
      setOpen(true)
    }
    // @ts-ignore
  }, [])
  return null
  return (
    <MobileView className='fixed inset-x-0 bottom-0 w-94'>
      <BottomSheet
        open={open}
        onDismiss={() => {
          setOpen(false)
          setCookiesObject({showBottomSheet: false})
        }}
        snapPoints={({minHeight}) => minHeight}>
        <div className='flex flex-col items-center justify-center w-full p-4 pt-0'>
          <h3 className='text-h-6 font-medium text-greyscale-900 mb-6'>
            {t('OPEN_VOOXEE_IN')}
          </h3>
          <div className='flex justify-between w-full mb-7 items-center h-8'>
            <div className='flex items-center'>
              {/* <ImageWrapper */}
              {/*  type='/img/logo/AdvertoLogoSquare.png' */}
              {/*  alt='Logo' */}
              {/*  width={32} */}
              {/*  height={32} */}
              {/*  layout='fixed' */}
              {/* /> */}
              <span className='ml-3 text-body-16 text-greyscale-900'>
                {t('OPEN_IN_VOOXEE_APP')}
              </span>
            </div>
            <Button
              onClick={() => {
                // navigator.clipboard.writeText(
                //   `https://adverto.sale/${productId}?action=advert&id=${productId}&dynamic_link_refer_hash=${linkHash}&user=${ownerId})`,
                // )
                setOpen(false)
                setCookiesObject({showBottomSheet: false})
              }}
              className='rounded-lg py-1.5 text-body-16 text-white-a nc-gradient-brand w-26'>
              {/* <LinkWrapper */}
              {/*  target='_blank' */}
              {/*  href='https://adverto.drru.agconnect.link/kmarket' */}
              {/*  title='app link'> */}
              {/*  {t('OPEN')} */}
              {/* </LinkWrapper> */}
            </Button>
          </div>
          <div className='flex justify-between w-full items-center'>
            <div className='flex items-center'>
              <BrowserIcon />
              <span className='ml-3 text-body-16 text-greyscale-900'>
                {t('OPEN_IN_BROWSER')}
              </span>
            </div>
            <Button
              onClick={() => {
                setOpen(false)
                setCookiesObject({showBottomSheet: false})
              }}
              className='py-1.5 border border-shadow-b rounded-lg text-greyscale-900 text-body-16 w-26'>
              {t('CONTINUE')}
            </Button>
          </div>
        </div>
      </BottomSheet>
    </MobileView>
  )
})

const BrowserIcon: FC = () => {
  let Icon
  const browser = (browserName || '').toLowerCase()

  if (browser.includes('opera')) {
    Icon = IcOpera
  } else if (browser.includes('safari')) {
    Icon = IcSafari
  } else if (browser.includes('samsung')) {
    Icon = IcSamsung
  } else if (browser.includes('uc')) {
    Icon = IcUc
  } else if (browser.includes('firefox')) {
    Icon = IcFirefox
  } else if (browser.includes('chrome') || !Icon) {
    Icon = IcChrome
  }

  return <Icon className='w-8 h-8' />
}

export default MobileAppBottomSheet
