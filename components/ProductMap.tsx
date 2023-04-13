import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcPinDrop from 'icons/material/PinDrop.svg'
import IcArrowDropDown from 'icons/material/ArrowDropDown.svg'
import GoogleMapReact from 'google-map-react'
import {degradations} from 'front-api/src/models'
import {ArrowDown, Location} from 'react-iconly'
import IcArrowDown from 'icons/material/ArrowDown.svg'
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
    <div className='bg-white rounded-2xl text-body-14 text-greyscale-900 flex flex-col shadow-1'>
      <Button
        className='group'
        onClick={() => setMapVisible(!mapVisible)}
        id='map'>
        <div className='flex justify-between p-5 w-full'>
          <div className='flex items-center '>
            <div className='fill-current text-primary-500 mr-2'>
              <Location size={20} filled />
            </div>
            <span>
              {advert.location.description}
              {`${advert.location?.distance ? ', ' : ''}`}
              {advert.location?.distance}
            </span>
          </div>
          <div className='flex items-center'>
            <IcArrowDown
              className={`w-5 h-5 fill-current text-greyscale-900 group-hover:text-primary-500 ${
                mapVisible ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </Button>

      {mapVisible && (
        <div
          className='h-96 overflow-hidden rounded-2xl mb-5 mx-5'
          data-test-id='map-body'>
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
