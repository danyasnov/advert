import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {toJS} from 'mobx'
import {useTranslation} from 'next-i18next'
import {Swiper, SwiperSlide} from 'swiper/react'
import ImageWrapper from './ImageWrapper'
import {useCategoriesStore} from '../providers/RootStoreProvider'

const CategoriesSlider: FC = observer(() => {
  const store = useCategoriesStore()
  const {t} = useTranslation()
  const categories = toJS(store.categoriesWithoutAll)
  return (
    <>
      <div className='mx-4 s:mx-8 m:mx-10 l:mx-24 text-black-b text-h-2 pb-4 mb-6 border-b border-shadow-b'>
        {t('CATEGORIES')}
      </div>
      <Swiper spaceBetween={16} width={136} loop loopAdditionalSlides={5}>
        {categories.map((c) => (
          <SwiperSlide key={c.id}>
            <div className='flex justify-center flex-col'>
              <ImageWrapper
                type={`categories/${c.slug}`}
                width={136}
                height={136}
                alt={c.name}
                className='rounded-xl'
              />
              <span className='text-body-2 text-black-b pt-4'>{c.name}</span>
            </div>
          </SwiperSlide>
        ))}
        <div slot='wrapper-start' className='pl-4 s:pl-8 m:pl-10 l:pl-24' />
      </Swiper>
    </>
  )
})

export default CategoriesSlider
