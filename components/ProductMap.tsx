import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcPinDrop from 'icons/material/PinDrop.svg'
import IcArrowDropDown from 'icons/material/ArrowDropDown.svg'
import GoogleMapReact from 'google-map-react'
import {degradations} from 'front-api/src/models'
import {useProductsStore} from '../providers/RootStoreProvider'
import Button from './Buttons/Button'
import SvgMapMarker from '../assets/icons/SvgMapMarker'

const zoomRadiusMap = {
  0: 15,
  1: 14,
  2: 13,
}

const ProductMap: FC = observer(() => {
  const {product} = useProductsStore()
  const {advert} = product

  const [mapVisible, setMapVisible] = useState(false)
  const {t} = useTranslation()
  if (!product) return null

  const location = {
    lat: advert.location.latitude,
    lng: advert.location.longitude,
  }
  const radius =
    degradations.find((d) => d.key === advert.degradation)?.radius ?? 0

  return (
    <div className='bg-white s:rounded-lg text-body-14 text-black-b'>
      <div className='flex justify-between px-6 py-5'>
        <div className='flex items-center'>
          <IcPinDrop className='w-6 h-6 fill-current text-black-c mr-2' />
          <span>{advert.location.description}</span>
        </div>
        <Button onClick={() => setMapVisible(!mapVisible)} id='map'>
          <span className='hidden s:block'>{t('LOCATION_OF_GOODS')}</span>
          <IcArrowDropDown className='w-6 h-6 fill-current text-black-c ml-2' />
        </Button>
      </div>
      {mapVisible && (
        <div className='w-full h-96' data-test-id='map-body'>
          <GoogleMapReact
            bootstrapURLKeys={{key: process.env.NEXT_PUBLIC_GOOGLE_API}}
            center={location}
            yesIWantToUseGoogleMapApiInternals
            margin={[1, 2, 3, 4]}
            defaultZoom={zoomRadiusMap[radius]}
            onGoogleApiLoaded={({map, maps}) => {
              if (radius) {
                // eslint-disable-next-line no-new
                new maps.Circle({
                  strokeColor: '#7210FF',
                  strokeWeight: 2,
                  fillColor: '#7210FF',
                  fillOpacity: 0.2,
                  map,
                  center: location,
                  radius: radius * 1000,
                })
              } else {
                const svgMarker = {
                  path: SvgMapMarker,
                  fillColor: '#7210FF',
                  fillOpacity: 1,
                  strokeColor: '#FFFFFF',
                  strokeOpacity: 1,
                  anchor: new maps.Point(14, 35),
                }
                // eslint-disable-next-line no-new
                new maps.Marker({
                  position: map.getCenter(),
                  icon: svgMarker,
                  map,
                })
              }
            }}
          />
        </div>
      )}
    </div>
  )
})

export default ProductMap
