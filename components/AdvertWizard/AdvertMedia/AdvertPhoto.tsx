import React, {ComponentClass} from 'react'
import {SortableElement, SortableElementProps} from 'react-sortable-hoc'
import IcClose from 'icons/material/Close.svg'
import IcRotate from 'icons/material/Rotate.svg'
import {Danger} from 'react-iconly'
import {useTranslation} from 'next-i18next'
import Lottie from 'react-lottie'
import Button from '../../Buttons/Button'
import ImageWrapper from '../../ImageWrapper'
import Loader from '../../../lottie/vooxee_loader.json'

const AdvertPhoto: ComponentClass<
  {
    url: string
    id: number
    isMain: boolean
    loading: boolean
    error: boolean
    onRotate: (size: {naturalWidth: number; naturalHeight: number}) => void
    onRemove: () => void
  } & SortableElementProps
> = SortableElement(({onRemove, onRotate, url, loading, id, error, isMain}) => {
  const {t} = useTranslation()
  const buttonClassname =
    'w-6 h-6 flex items-center justify-center absolute top-0 mt-2 z-10 rounded-full text-primary-500 bg-white'
  const iconClassname = 'h-3 w-3 fill-current text-primary-500'
  return (
    <div className='z-1 h-[140px] w-[212px] flex rounded-3xl overflow-hidden opacity-1 relative cursor-pointer items-center justify-center after:content-[""] after:absolute after:top-0 after:bottom-0 after:right-0 after:left-0'>
      {loading && (
        <div className='absolute z-10 inset-0 flex justify-center items-center bg-pink rounded-3xl px-4'>
          <div className='flex justify-center items-center'>
            <Lottie
              options={{animationData: Loader}}
              height={100}
              width={100}
            />
          </div>
        </div>
      )}
      {error && (
        <div className='absolute z-10 inset-0 flex justify-center items-center border-2 border-error bg-pink rounded-3xl flex-col px-4'>
          <div className='text-error mb-1'>
            <Danger filled size={32} />
          </div>
          <span className='font-medium text-body-14 text-center'>
            {t('PHOTO_UPLOAD_ERROR')}
          </span>
        </div>
      )}
      <Button
        className={`${buttonClassname} right-0 mr-2`}
        onClick={onRemove}
        disabled={loading}>
        <IcClose className={iconClassname} />
      </Button>
      {!loading && !error && (
        <>
          <Button
            disabled={loading}
            className={`${buttonClassname} left-0 ml-2 `}
            onClick={() => onRotate(id)}>
            <IcRotate className={iconClassname} />
          </Button>
          {isMain && (
            <span className='bg-greyscale-900/50 px-2 py-1 rounded-2xl text-white absolute left-10 top-2.5 z-10 text-body-10'>
              {t('MAIN_PHOTO')}
            </span>
          )}
        </>
      )}
      <div className='h-full w-full relative'>
        <ImageWrapper
          type={url}
          alt={url}
          objectFit='cover'
          layout='fill'
          id={id}
          key={url}
        />
      </div>
    </div>
  )
})

export default AdvertPhoto
