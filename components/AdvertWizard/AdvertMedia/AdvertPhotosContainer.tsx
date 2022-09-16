import {
  ComponentClass,
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react'
import {SortableContainer, SortableContainerProps} from 'react-sortable-hoc'
import {get, random} from 'lodash'
import {AxiosRequestConfig} from 'axios'
import {toast} from 'react-toastify'
import {useTranslation} from 'next-i18next'
import useDropListener from '../../../hooks/useDropListener'
import {rotate} from '../../../utils'
import AdvertUploadButton from './AdvertUploadButton'
import DropZone from './DropZone'
import AdvertPhoto from './AdvertPhoto'
import {PhotoFile} from '../../../types'
import {makeRequest} from '../../../api'
import LinkButton from '../../Buttons/LinkButton'

const getNextDegree = (current) => {
  const next = current + 90
  if (next > 270) return 0
  return next
}

const AdvertPhotosContainer: ComponentClass<
  {
    maxPhotos: number
    photos: PhotoFile[]
    error: boolean
    setPhotos: Dispatch<SetStateAction<PhotoFile[]>>
  } & SortableContainerProps
> = SortableContainer(({maxPhotos, photos, setPhotos, error}) => {
  const [isDragging, setIsDragging] = useState(false)
  const canAddMore = maxPhotos > photos.length
  const {t} = useTranslation()
  const [uploadCounter, setUploadCounter] = useState(0)

  const originalPhotos = useRef({})
  useDropListener({
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  })

  const onDrop = useCallback(
    (acceptedFiles) => {
      const maxAcceptedFiles = maxPhotos - photos.length
      const slicedAcceptedFiles = acceptedFiles.slice(0, maxAcceptedFiles)
      slicedAcceptedFiles.forEach(async (f) => {
        const promise = new Promise((resolve) => {
          const image = new Image()
          image.onload = () => {
            // eslint-disable-next-line no-param-reassign
            f.width = image.width
            // eslint-disable-next-line no-param-reassign
            f.height = image.height
            resolve(f)
          }
          image.src = URL.createObjectURL(f)
        })
        await promise
        const id = random(99999).toString()

        originalPhotos.current[id] = {file: f, degree: 0}

        const formData = new FormData()
        formData.append('image', f)
        const url = URL.createObjectURL(f)
        setPhotos((prevPhotos) => [
          ...prevPhotos,
          Object.assign(f, {
            url,
            hash: id,
            id,
            loading: true,
          }),
        ])

        const config: AxiosRequestConfig = {
          headers: {'Content-Type': 'multipart/form-data'},
          method: 'post',
          data: formData,
          url: '/upload/image',
        }
        makeRequest(config, {
          retries: 2,
          retryDelay: () => 2000,
        })
          .then((res) => {
            setPhotos((prevPhotos) =>
              prevPhotos.map((p) => {
                if (p.hash === id) {
                  return {...res.data.items[0], id}
                }
                return p
              }),
            )
          })
          .catch((e) => {
            setPhotos((prevPhotos) =>
              prevPhotos.map((p) => {
                if (p.hash === id) {
                  return {...p, loading: false, error: true}
                }
                return p
              }),
            )
            const msg = get(e, 'response.data.code')
            if (msg) {
              toast.error(t(msg))
            }

            if (!e.response) {
              toast.error(t('CHECK_CONNECTION_ERROR'))
            }
          })
      })
    },
    [photos],
  )
  console.log('photos', photos)

  return (
    <div className='mb-4 w-full relative'>
      <div className='text-body-14 text-greyscale-900 mb-3 hidden s:flex l:mb-3'>
        <span className='mr-1 font-normal'>{t('ADD_PHOTO_HINT')}</span>
        <LinkButton
          onClick={() => {
            setUploadCounter(uploadCounter + 1)
          }}>
          <span className='text-body-14 font-medium'>
            {t('ADD_PHOTO_HINT_1')}
          </span>
        </LinkButton>
      </div>
      <p className='text-body-14 text-greyscale-900 mb-3 s:hidden'>
        {t('SELECT_PHOTO_FROM_PHONE')}
      </p>
      <div
        className={`${
          isDragging && canAddMore ? 'absolute inset-0 min-h-full' : 'hidden'
        }`}>
        <DropZone
          uploadCounter={uploadCounter}
          onDrop={onDrop}
          disabled={!canAddMore}
          maxFiles={maxPhotos}
          type='photo'
        />
      </div>
      <div
        className={`flex flex-wrap gap-2 ${
          isDragging && canAddMore ? 'invisible' : ''
        }`}>
        {photos.map((p, index) => (
          <AdvertPhoto
            id={p.id}
            loading={p.loading}
            error={p.error}
            url={p.url}
            index={index}
            isMain={index === 0}
            key={p.hash}
            onRemove={() => {
              setPhotos(photos.filter((v) => v.hash !== p.hash))
            }}
            onRotate={async () => {
              const dict = originalPhotos.current
              if (dict[p.id]?.file) {
                const nextDegrees = getNextDegree(dict[p.id].degree)
                const blob = await rotate({
                  degrees: nextDegrees,
                  file: dict[p.id].file,
                })
                if (!blob) return
                const formData = new FormData()
                formData.append('image', blob)
                setPhotos((prevState) =>
                  prevState.map((v) =>
                    v.hash === p.hash ? {...v, loading: true} : v,
                  ),
                )
                makeRequest({
                  headers: {'Content-Type': 'multipart/form-data'},
                  method: 'post',
                  data: formData,
                  url: '/upload/image',
                }).then((res) => {
                  dict[p.id].degree = nextDegrees
                  setPhotos(
                    photos.map((v) => {
                      if (v.hash === p.hash) {
                        return {...res.data.items[0], id: p.id}
                      }
                      return v
                    }),
                  )
                })
              }
            }}
          />
        ))}
        {canAddMore && (
          <AdvertUploadButton
            onDrop={onDrop}
            disabled={!canAddMore}
            maxFiles={maxPhotos}
            type='photo'
            error={error}
          />
        )}
      </div>
    </div>
  )
})

export default AdvertPhotosContainer
