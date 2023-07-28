import React, {FC, useEffect, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {Field} from 'formik'
import useEmblaCarousel from 'embla-carousel-react'
import {WheelGesturesPlugin} from 'embla-carousel-wheel-gestures'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import {toJS} from 'mobx'
import {ArrowDown} from 'react-iconly'
import {FormikSegmented} from './FormikComponents'
import {FilterProps} from '../types'
import ImageWrapper from './ImageWrapper'
import FullHeightSliderButton from './Buttons/FullHeightSliderButton'
import useSliderButtons from '../hooks/useSliderButtons'
import PrimaryButton from './Buttons/PrimaryButton'
import {
  useCategoriesStore,
  useGeneralStore,
  useProductsStore,
} from '../providers/RootStoreProvider'
import FormikRangeSlider from './FormikComponents/FormikRangeSlider'
import {clearUrlFromQuery} from '../utils'
import LinkWrapper from './Buttons/LinkWrapper'
import {makeRequest} from '../api'
import Button from './Buttons/Button'
import PopularBrands from './PopularBrands'

const popular = [
  {img: 'audi', path: '/vehicles-cars?brands-of-cars=Audi'},
  {img: 'bmw', path: '/vehicles-cars?brands-of-cars=BMW'},
  {img: 'mercedes', path: '/vehicles-cars?brands-of-cars=Mercedes-Benz'},
  {img: 'volkswagen', path: '/vehicles-cars?brands-of-cars=Volkswagen'},
  {img: 'lexus', path: '/vehicles-cars?brands-of-cars=Lexus'},
  {img: 'nissan', path: '/vehicles-cars?brands-of-cars=Nissan'},
  {img: 'mazda', path: '/vehicles-cars?brands-of-cars=Mazda'},
  {img: 'honda', path: '/vehicles-cars?brands-of-cars=Honda'},
  {img: 'suzuki', path: '/vehicles-cars?brands-of-cars=Suzuki'},
  {img: 'toyota', path: '/vehicles-cars?brands-of-cars=Toyota'},
  {img: 'porsche', path: '/vehicles-cars?brands-of-cars=Porsche'},
  {img: 'maserati', path: '/vehicles-cars?brands-of-cars=Maserati'},
  {img: 'land_rover', path: '/vehicles-cars?brands-of-cars=Land Rover'},
  {img: 'renault', path: '/vehicles-cars?brands-of-cars=Renault'},
  {img: 'mitsubishi', path: '/vehicles-cars?brands-of-cars=Mitsubishi'},
]
const PopularCars: FC<Pick<FilterProps, 'conditionOptions'>> = observer(
  ({conditionOptions}) => {
    const {t} = useTranslation()

    const {newCount} = useProductsStore()
    const router = useRouter()
    const [viewportRef, embla] = useEmblaCarousel(
      {
        dragFree: true,
        align: 'start',
        containScroll: 'trimSnaps',
      },
      [WheelGesturesPlugin()],
    )
    const modelsSlider = useSliderButtons(embla)

    return (
      <div className='w-full rounded-3xl drop-shadow-card flex flex-col py-8 px-6 bg-white'>
        <span className='text-h-4 font-bold mb-6'>{t('POPULAR_CARS')}</span>
        <div className='flex mb-6'>
          <Field
            component={FormikSegmented}
            name='condition'
            options={conditionOptions}
          />
        </div>
        <div className='flex items-center mb-6'>
          <FullHeightSliderButton
            size={20}
            onClick={modelsSlider.scrollPrev}
            enabled
            direction='left'
            className='shrink-0 max-w-[20px] mr-5'
          />
          <div className='overflow-hidden relative -mx-4' ref={viewportRef}>
            <div className='flex mx-4 space-x-5 items-center'>
              {popular.map((p) => {
                return (
                  <LinkWrapper
                    href={`${clearUrlFromQuery(router.asPath)}${p.path}`}
                    title={p.img}
                    className='w-20 h-20 shrink-0'>
                    <ImageWrapper
                      type={`/img/popular-cars/${p.img}.png`}
                      alt={p.img}
                      width={80}
                      height={80}
                    />
                  </LinkWrapper>
                )
              })}
            </div>
          </div>
          <FullHeightSliderButton
            size={20}
            onClick={modelsSlider.scrollNext}
            enabled
            direction='right'
            className='shrink-0 max-w-[20px] ml-5'
          />
        </div>
        <PopularBrands />
        <div className='flex items-center justify-between'>
          <div className='h-[54px] w-[417px] m:w-[558px] shrink-0 flex items-center self-start'>
            <Field
              name='priceRange'
              minValue={0}
              maxValue={300000}
              component={FormikRangeSlider}
            />
          </div>
          <PrimaryButton
            className='s:w-[168px] m:w-[240px] h-10'
            onClick={() => {
              const params = new URLSearchParams(window.location.search)
              const query = {}

              for (const [key, value] of params) {
                if (key === 'condition' && value) {
                  query[key] = value
                }
                if (key === 'priceMin') {
                  query[key] = value || 1000
                }
                if (key === 'priceMax') {
                  query[key] = value || 100000
                }
              }

              router.push({
                pathname: `${clearUrlFromQuery(router.asPath)}/vehicles-cars`,
                query,
              })
            }}>
            {t('SHOW_CARS_COUNT', {count: newCount})}
          </PrimaryButton>
        </div>
      </div>
    )
  },
)

export default PopularCars
