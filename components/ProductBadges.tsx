import {FC, useEffect, useState} from 'react'
import IcBedroom from 'icons/Bedroom.svg'
import IcBathroom from 'icons/Bathroom.svg'
import IcSquare from 'icons/Square.svg'
import {observer} from 'mobx-react-lite'
import {get, isEmpty, keyBy} from 'lodash'
import {useTranslation} from 'next-i18next'
import {useProductsStore} from '../providers/RootStoreProvider'

const ProductBadges: FC = observer(() => {
  const {t} = useTranslation()
  const {product} = useProductsStore()
  const {advert} = product
  const {fields} = advert
  const [badges, setBadges] = useState([])
  useEffect(() => {
    const fieldsDict = keyBy(fields, 'fieldId')
    const bedrooms = {
      field: fieldsDict[40],
      id: 'bedrooms',
      icon: IcBedroom,
    }
    const bathrooms = {
      field: fieldsDict[526],
      key: 'bathrooms',
      icon: IcBathroom,
    }
    const square = {
      field: fieldsDict[272] || fieldsDict[273],
      key: 'square',
      icon: IcSquare,
      label: (
        <span>
          m<sup>2</sup>
        </span>
      ),
    }
    setBadges(
      [bedrooms, bathrooms, square].filter((badge) =>
        get(badge, 'field.fieldValueText[0]'),
      ),
    )
  }, [])

  if (isEmpty(badges)) return null
  return (
    <div className='flex space-x-4 mb-6'>
      {badges.map((badge) => {
        const value = get(badge, 'field.fieldValueText[0]')
        const label = badge.label || get(badge, 'field.fieldNameText')
        return (
          <div className='space-x-1 flex justify-center items-center'>
            <badge.icon className='w-8 h-8' />
            <span className='lowercase text-greyscale-800 text-body-14'>
              {value} {label}
            </span>
          </div>
        )
      })}
    </div>
  )
})
export default ProductBadges
