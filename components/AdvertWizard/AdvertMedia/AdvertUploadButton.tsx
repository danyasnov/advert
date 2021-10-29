/* eslint-disable react/jsx-props-no-spreading */
import {FC, useRef} from 'react'
import {useTranslation} from 'next-i18next'
import {useHoverDirty} from 'react-use'
import {useDropzone} from 'react-dropzone'
import IcAddPhoto from 'icons/material/AddPhoto.svg'
import IcAddVideo from 'icons/material/AddVideo.svg'

const AdvertUploadButton: FC<{
  onDrop: (acceptedFiles: any) => void
  disabled: boolean
  type: string
  maxFiles?: number
}> = ({onDrop, disabled, maxFiles = 1, type}) => {
  const ref = useRef()
  const {t} = useTranslation()
  const isHovering = useHoverDirty(ref)
  let accept
  if (type === 'photo') {
    accept = 'image/*'
  }
  if (type === 'video') {
    accept = 'video/mp4'
  }

  const {getRootProps, getInputProps} = useDropzone({
    accept,
    maxSize: 26214400,
    onDrop,
    disabled,
    maxFiles,
  })
  const iconsClassname = 'w-6 h-6 fill-current mb-3'
  const titleClassname = `text-body-3 ${
    isHovering ? 'text-nc-title' : 'text-nc-placeholder'
  }`
  return (
    <div {...getRootProps()}>
      <div
        ref={ref}
        className={`text-nc-icon rounded-lg border border-nc-icon flex hover:text-nc-primary
         hover:border-nc-primary cursor-pointer text-nc-placeholder ${
           type === 'photo' ? 'h-34 w-34' : 'h-40 w-72'
         } `}>
        <div className='flex flex-col justify-center items-center flex-1'>
          <input {...getInputProps()} />
          {type === 'photo' && (
            <>
              <IcAddPhoto className={iconsClassname} />
              <span className={titleClassname}>{t('ADD_PHOTO')}</span>
            </>
          )}
          {type === 'video' && (
            <>
              <IcAddVideo className={iconsClassname} />
              <span className={titleClassname}>{t('ADD_VIDEO')}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdvertUploadButton
