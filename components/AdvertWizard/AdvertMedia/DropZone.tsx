/* eslint-disable react/jsx-props-no-spreading */
import {FC, useEffect} from 'react'
import {useTranslation} from 'next-i18next'
import {useDropzone} from 'react-dropzone'
import IcAddPhoto from 'icons/material/AddPhoto.svg'
import IcAddVideo from 'icons/material/AddVideo.svg'

const DropZone: FC<{
  onDrop: (acceptedFiles: any, rejectedFiles: any) => void
  uploadCounter?: number
  disabled: boolean
  type: 'photo' | 'video'
  maxFiles?: number
  maxSize?: number
}> = ({onDrop, disabled, maxFiles = 1, type, maxSize, uploadCounter}) => {
  const {t} = useTranslation()
  let accept
  if (type === 'photo') {
    accept = 'image/*'
  }
  if (type === 'video') {
    accept = 'video/mp4'
  }

  const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
    accept,
    maxSize: type === 'photo' ? 26214400 : maxSize || 31457280,
    onDrop,
    disabled,
    maxFiles,
  })
  const iconsClassname = `w-6 h-6 fill-current mb-1 ${
    isDragActive ? 'text-primary-500' : 'text-nc-icon'
  }`
  const titleClassname = `text-body-12 ${
    isDragActive ? 'text-nc-title' : 'text-nc-placeholder'
  }`

  useEffect(() => {
    if (uploadCounter) open()
  }, [uploadCounter])
  return (
    <div {...getRootProps()} className='h-full'>
      <div
        className={`flex bg-nc-back h-full min-h-20 rounded-lg border-dashed border
           items-center justify-center flex-col ${
             isDragActive ? 'border-nc-primary' : 'border-nc-border'
           }`}>
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
  )
}

export default DropZone
