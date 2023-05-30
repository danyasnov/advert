import {FC, useCallback, useEffect, useState} from 'react'
import {FieldProps} from 'formik'
import move from 'lodash-move'
import {useWindowSize} from 'react-use'
import AdvertPhotosContainer from './AdvertPhotosContainer'
import {PhotoFile} from '../../../types'

const AdvertPhotos: FC<
  {
    maxPhotos: number
  } & FieldProps
> = ({maxPhotos, field, form}) => {
  const {width} = useWindowSize()
  const {name, value} = field
  const {setFieldValue, errors, setFieldError} = form
  const [photos, setPhotos] = useState<PhotoFile[]>(value || [])
  const onSortEnd = useCallback(
    ({oldIndex, newIndex}) => {
      setPhotos(move(photos, oldIndex, newIndex))
    },
    [photos],
  )
  useEffect(() => {
    if (!photos.some((p) => p instanceof File)) {
      setFieldError(name, undefined)
      setFieldValue(name, photos)
    }
  }, [photos])
  useEffect(() => {
    if (value) setPhotos(value)
  }, [value])

  return (
    <AdvertPhotosContainer
      distance={1}
      onSortEnd={onSortEnd}
      axis={`${width >= 768 ? 'xy' : 'y'}`}
      maxPhotos={maxPhotos}
      photos={photos}
      setPhotos={setPhotos}
      error={!!errors[name]}
    />
  )
}

export default AdvertPhotos
