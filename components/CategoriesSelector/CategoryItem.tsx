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
import LinkWrapper from '../Buttons/LinkWrapper'

interface Props {
  category: CACategoryModel
  href?: string
  onClick?: () => void
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
const CategoryItem: FC<Props> = ({category, href, isActive, onClick}) => {
  const {slug, id, name} = category
  const IconComponent = iconsMap[slug]
  const icon = IconComponent && <IconComponent className='w-6 h-6 mr-2' />
  const className = `${isActive ? 'bg-brand-a2' : ''} categories-selector-item`
  return onClick ? (
    <Button className={className} key={id} onClick={onClick}>
      {icon}
      {name}
    </Button>
  ) : (
    <LinkWrapper className={className} key={id} href={href}>
      {icon}
      {name}
    </LinkWrapper>
  )
}

export default CategoryItem
