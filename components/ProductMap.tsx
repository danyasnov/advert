import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcPinDrop from 'icons/material/PinDrop.svg'
import IcArrowDropDown from 'icons/material/ArrowDropDown.svg'
import GoogleMapReact from 'google-map-react'
import {useProductsStore} from '../providers/RootStoreProvider'
import Button from './Buttons/Button'

const ProductMap: FC = observer(() => {
  const {product} = useProductsStore()

  const [mapVisible, setMapVisible] = useState(false)
  const {t} = useTranslation()
  if (!product) return null

  return (
    <div className='bg-white s:rounded-lg text-body-2 text-black-b'>
      <div className='flex justify-between px-6 py-5'>
        <div className='flex items-center'>
          <IcPinDrop className='w-6 h-6 fill-current text-black-c mr-2' />
          <span>{product.advert.location.description}</span>
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
            center={{
              lat: product.advert.location.latitude,
              lng: product.advert.location.longitude,
            }}
            yesIWantToUseGoogleMapApiInternals
            margin={[1, 2, 3, 4]}
            defaultZoom={15}
            onGoogleApiLoaded={({map, maps}) => {
              const svgMarker = {
                path: 'M14 39L13.6274 39.3334L14 39.7499L14.3726 39.3334L14 39ZM14 39C14.3726 39.3334 14.3727 39.3333 14.3729 39.3331L14.3734 39.3325L14.3754 39.3302L14.3829 39.3218L14.4117 39.2894C14.437 39.2608 14.4741 39.2187 14.5224 39.1635C14.6189 39.0532 14.7599 38.8906 14.9391 38.6804C15.2974 38.2602 15.8084 37.6495 16.4213 36.8855C17.6465 35.358 19.281 33.2152 20.9164 30.7547C22.5509 28.2956 24.1923 25.5102 25.4266 22.6982C26.6582 19.8922 27.5 17.025 27.5 14.4118C27.5 6.75161 21.4624 0.5 14 0.5C6.53761 0.5 0.5 6.75161 0.5 14.4118C0.5 17.025 1.34179 19.8922 2.57341 22.6982C3.80766 25.5102 5.44909 28.2956 7.08359 30.7547C8.719 33.2152 10.3535 35.358 11.5787 36.8855C12.1916 37.6495 12.7026 38.2602 13.0609 38.6804C13.2401 38.8906 13.3811 39.0532 13.4776 39.1635C13.5259 39.2187 13.563 39.2608 13.5883 39.2894L13.6171 39.3218L13.6246 39.3302L13.6266 39.3325L13.6271 39.3331C13.6273 39.3333 13.6274 39.3334 14 39Z',
                fillColor: '#FF9514',
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
            }}
          />
        </div>
      )}
    </div>
  )
})

export default ProductMap
