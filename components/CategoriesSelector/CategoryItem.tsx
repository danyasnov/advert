import {FC} from 'react'
import {CACategoryModel} from 'front-api/src/index'
import IcAnimals from 'icons/categories/Animals.svg'
import IcElectronics from 'icons/categories/Electronics.svg'
import IcHealthAndBeauty from 'icons/categories/HealthAndBeauty.svg'
import IcHobbiesAndLeisure from 'icons/categories/HobbiesAndLeisure.svg'
import IcHouseAndGarden from 'icons/categories/HouseAndGarden.svg'
import IcPersonalGoods from 'icons/categories/PersonalGoods.svg'
import IcProperty from 'icons/categories/Property.svg'
import IcServices from 'icons/categories/Services.svg'
import IcVehicles from 'icons/categories/Vehicles.svg'
import Button from '../Buttons/Button'

interface Props {
  category: CACategoryModel
  onClick: () => void
  isActive?: boolean
}

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
const CategoryItem: FC<Props> = ({category, onClick, isActive}) => {
  const {slug, id, name} = category
  const IconComponent = iconsMap[slug]
  return (
    <Button
      className={`${isActive ? 'bg-brand-a2' : ''} categories-selector-item`}
      key={id}
      onClick={onClick}>
      {IconComponent && <IconComponent className='w-6 h-6 mr-2' />}
      {name}
    </Button>
  )
}

export default CategoryItem
