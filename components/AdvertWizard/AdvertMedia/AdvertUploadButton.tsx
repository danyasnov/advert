/* eslint-disable react/jsx-props-no-spreading */
import {FC, useRef} from 'react'
import {useTranslation} from 'next-i18next'
import {useHoverDirty} from 'react-use'
import {useDropzone} from 'react-dropzone'
import IcAddPhoto from 'icons/material/AddPhoto.svg'
import IcAddVideo from 'icons/material/AddVideo.svg'
import {Camera} from 'react-iconly'

const AdvertUploadButton: FC<{
  onDrop: (acceptedFiles: any, rejectedFiles: any) => void
  disabled: boolean
  type: string
  error?: boolean
  maxFiles?: number
  maxSize?: number
}> = ({onDrop, disabled, maxFiles = 1, type, maxSize, error}) => {
  const ref = useRef()
  const {t} = useTranslation()
  let accept
  if (type === 'photo') {
    accept = 'image/*'
  }
  if (type === 'video') {
    accept = 'video/mp4'
  }

  const {getRootProps, getInputProps} = useDropzone({
    accept,
    maxSize: type === 'photo' ? 26214400 : maxSize || Infinity,
    onDrop,
    disabled,
    maxFiles,
  })
  return (
    <div {...getRootProps()}>
      <div
        ref={ref}
        className={`text-primary-500 rounded-3xl border flex cursor-pointer
         text-primary-500 px-2 h-[140px] w-[224px] ${
           error ? 'border-error' : 'border-primary-500'
         }`}>
        <div className='flex flex-col justify-center items-center flex-1'>
          <input {...getInputProps()} />
          <>
            <Camera filled size={32} />
            <span className='text-body-12 text-center mt-3'>
              {t(type === 'photo' ? 'ADD_PHOTO' : 'ADD_VIDEO')}
            </span>
          </>
        </div>
      </div>
    </div>
  )
}

export default AdvertUploadButton
