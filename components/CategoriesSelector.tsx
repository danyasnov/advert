import {FC, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {toJS} from 'mobx'
import IcAnimals from 'icons/categories/Animals.svg'
import IcElectronics from 'icons/categories/Electronics.svg'
import IcHealthAndBeauty from 'icons/categories/HealthAndBeauty.svg'
import IcHobbiesAndLeisure from 'icons/categories/HobbiesAndLeisure.svg'
import IcHouseAndGarden from 'icons/categories/HouseAndGarden.svg'
import IcPersonalGoods from 'icons/categories/PersonalGoods.svg'
import IcProperty from 'icons/categories/Property.svg'
import IcServices from 'icons/categories/Services.svg'
import IcVehicles from 'icons/categories/Vehicles.svg'
import IcArrowBack from 'icons/material/ArrowBack.svg'
import {useTranslation} from 'next-i18next'
import CategoriesButton from './CategoriesButton'
import {useCategoriesStore} from '../providers/RootStoreProvider'
import Button from './Button'
import {noop} from '../helpers'
import useOnClickOutside from '../hooks/useOnClickOutside'

const iconsMap = {
  animals: IcAnimals,
  electronics: IcElectronics,
  'health-and-beauty': IcHealthAndBeauty,
  'hobbies-and-leisure': IcHobbiesAndLeisure,
  'house-and-garden': IcHouseAndGarden,
  'personal-goods': IcPersonalGoods,
  property: IcProperty,
  services: IcServices,
  vehicles: IcVehicles,
}

const CategoriesSelector: FC = observer(() => {
  const categoriesStore = useCategoriesStore()
  const categories = toJS(categoriesStore.categoriesWithoutAll)
  const {t} = useTranslation()
  const [show, setShow] = useState(false)
  const ref = useRef()
  useOnClickOutside(ref, () => {
    setShow(false)
    setSubCategories(null)
  })
  const [subCategories, setSubCategories] = useState(null)
  const buttonClass =
    'flex w-full px-4 py-2 items-center justify-start text-black-b text-body-2 h-10'

  return (
    <div ref={ref}>
      <CategoriesButton
        show={show}
        onClick={() => {
          setShow(!show)
          if (show) setSubCategories(null)
        }}
      />
      <div className='s:hidden'>
        {show && (
          <div className='absolute top-89px inset-x-0 z-10 bg-white divide-y divide-shadow-b border-t flex flex-col items-start'>
            {!subCategories &&
              categories.map((c) => {
                const IconComponent = iconsMap[c.slug]
                return (
                  <Button
                    className={buttonClass}
                    key={c.id}
                    onClick={() => setSubCategories(c.items)}>
                    {IconComponent && (
                      <IconComponent className='w-6 h-6 mr-2' />
                    )}
                    {c.name}
                  </Button>
                )
              })}
            {!!subCategories && (
              <>
                <Button
                  onClick={() => setSubCategories(null)}
                  className={buttonClass}>
                  <IcArrowBack className='w-6 h-6 fill-current text-black-c mr-2' />
                  {t('BACK')}
                </Button>
                <Button onClick={noop} className={`${buttonClass} font-bold`}>
                  {t('ALL_ADVERTS')}
                </Button>
                {subCategories.reduce((acc, value) => {
                  acc.push(
                    <Button className={buttonClass} onClick={noop}>
                      {value.name}
                    </Button>,
                  )
                  return acc
                }, [])}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
})

export default CategoriesSelector
