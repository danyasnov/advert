import {FC, useRef, useState} from 'react'
import IcCopy from 'icons/material/Copy.svg'
import IcShare from 'icons/material/Share.svg'
import {useTranslation} from 'next-i18next'
import {useClickAway} from 'react-use'
import {toast} from 'react-toastify'
import SocialShareButtons from './SocialShareButtons'
import SecondaryButton from './Buttons/SecondaryButton'
import {makeRequest} from '../api'
import Button from './Buttons/Button'

interface Props {
  userHash: string
  productHash?: string
}
const SharePopup: FC<Props> = ({userHash, productHash}) => {
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
    <div className='absolute' ref={ref}>
      <SecondaryButton
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
        className='mb-2 s:mb-0 px-15'>
        <IcShare className='fill-current text-black-c h-4 w-4 mr-2' />
        {t(loading ? 'LOADING_LO' : 'SHARE')}
      </SecondaryButton>
      {show && link && (
        <div
          className='z-10 flex flex-col absolute bg-white shadow-2xl rounded-2xl py-4 px-6 mt-3 arrow-top'
          data-test-id='share-popup'>
          <h2 className='text-body-14 text-black-b font-bold mb-4'>
            {t('SHARE')}
          </h2>
          <SocialShareButtons link={link} />
          <div className='bg-black-e p-2 mt-5 flex justify-between rounded'>
            <input
              type='text'
              readOnly
              ref={linkRef}
              value={link}
              className='text-body-14 text-black-b w-full bg-black-e'
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
  )
}

export default SharePopup
