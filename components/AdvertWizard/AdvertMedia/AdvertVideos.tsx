import {FC, useCallback, useEffect, useState} from 'react'
import {FieldProps} from 'formik'
import {toast} from 'react-toastify'
import {useTranslation} from 'next-i18next'
import {size} from 'lodash'
import useDropListener from '../../../hooks/useDropListener'
import {makeRequest} from '../../../api'
import DropZone from './DropZone'
import AdvertUploadButton from './AdvertUploadButton'
import AdvertVideo from './AdvertVideo'
import {VideoFile} from '../../../types'

interface Props {
  maxVideoDuration: number
  categoryId: number
}
const AdvertVideos: FC<FieldProps & Props> = ({
  field,
  form,
  categoryId,
  maxVideoDuration,
}) => {
  const {t} = useTranslation()
  const {name, value} = field

  const [video, setVideo] = useState<VideoFile>(value || null)
  const {setFieldValue} = form
  const [isDragging, setIsDragging] = useState(false)
  useEffect(() => {
    if (size(value) > 0) {
      setVideo(value[0])
    }
  }, [value])

  useDropListener({
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  })

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (!file) return
      const formData = new FormData()
      formData.append('video', file)
      formData.append('categoryId', categoryId.toString())
      setVideo({...file, loading: true})
      makeRequest({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        method: 'post',
        data: formData,
        url: '/api/upload/video',
      })
        .then((res) => {
          const result = res.data.items[0]
          setVideo(res.data.items[0])
          setFieldValue(name, [result])
        })
        .catch((e) => {
          setVideo(null)
          if (e.response.data.code) {
            toast.error(t(e?.response?.data?.code))
          }
        })
    },
    [video],
  )
  const maxSize = maxVideoDuration * 1000000
  return (
    <div className='mb-4 w-full relative'>
      <div
        className={`${
          isDragging && !video ? 'absolute inset-0 min-h-full' : 'hidden'
        }`}>
        <DropZone
          onDrop={onDrop}
          disabled={!!video}
          type='video'
          maxSize={maxSize}
        />
      </div>
      <div
        className={`flex flex-wrap gap-2 ${
          isDragging && !video ? 'invisible' : ''
        }`}>
        {video && (
          <AdvertVideo
            loading={video.loading}
            url={video.url}
            onRemove={() => {
              setVideo(null)
              setFieldValue(name, [])
            }}
          />
        )}

        {!video && (
          <AdvertUploadButton
            onDrop={onDrop}
            disabled={!!video}
            type='video'
            maxSize={maxSize}
          />
        )}
      </div>
    </div>
  )
}

// const getVideoDuration = (file) => {
//   return new Promise((resolve) => {
//     const video = document.createElement('video')
//     video.preload = 'metadata'
//     video.onloadedmetadata = () => {
//       window.URL.revokeObjectURL(video.src)
//       const {duration} = video
//       resolve(duration)
//     }
//
//     video.srcObject = file
//   })
// }

export default AdvertVideos
