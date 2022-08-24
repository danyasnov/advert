import {FC, useRef, useState} from 'react'
import IcCopy from 'icons/material/Copy.svg'
import IcShare from 'icons/material/Share.svg'
import {useTranslation} from 'next-i18next'
import {useClickAway} from 'react-use'
import {toast} from 'react-toastify'
import {Upload} from 'react-iconly'
import SocialShareButtons from './SocialShareButtons'
import SecondaryButton from './Buttons/SecondaryButton'
import {makeRequest} from '../api'
import Button from './Buttons/Button'

interface Props {
  userHash: string
  productHash?: string
  size?: number
}
const SharePopup: FC<Props> = ({userHash, productHash, size = 16}) => {
  const {t} = useTranslation()
  const [link, setLink] = useState()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)
  const linkRef = useRef(null)
  useClickAway(ref, () => {
    setShow(false)
  })
  return (
    <div className='relative'>
      <Button
        id='share'
        onClick={async () => {
          if (link && !show) {
            setShow(true)
          } else if (link && show) {
            setShow(false)
          } else {
            try {
              setLoading(true)
              const linkResponse = await makeRequest({
                url: '/api/dynamic-links',
                method: 'post',
                data: {
                  userHash,
                  productHash,
                },
              })
              setShow(true)
              setLink(linkResponse.data)
              setLoading(false)
            } catch (e) {
              toast.error(e.message)
            }
          }
        }}
        className='text-greyscale-500 space-x-2'>
        <Upload size={size} filled />
        <span className='text-body-14'>
          {t(loading ? 'LOADING_LO' : 'SHARE')}
        </span>
      </Button>
      <div className='absolute -right-25 bottom-0 w-[280px]' ref={ref}>
        {show && link && (
          <div
            className='z-10 flex flex-col absolute bg-white shadow-2xl rounded-2xl py-4 px-6 mt-3'
            data-test-id='share-popup'>
            <h2 className='text-body-14 text-greyscale-900 font-bold'>
              {t('SHARE')}
            </h2>
            {/* <SocialShareButtons link={link} /> */}
            <div className='bg-black-e p-2 mt-5 flex justify-between rounded'>
              <input
                type='text'
                readOnly
                ref={linkRef}
                value={link}
                className='text-body-14 text-greyscale-900 w-full bg-black-e'
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(link)
                  linkRef.current.select()
                }}>
                <IcCopy className='fill-current text-black-c h-4 w-4 ml-1' />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SharePopup
