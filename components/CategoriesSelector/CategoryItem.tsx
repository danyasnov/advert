import {FC} from 'react'
import {CACategoryModel} from 'front-api/src/index'
import Button from '../Buttons/Button'
import LinkWrapper from '../Buttons/LinkWrapper'
import ImageWrapper from '../ImageWrapper'

interface Props {
  category: CACategoryModel
  href?: string
  onClick?: () => void
  isActive?: boolean
}

const CategoryItem: FC<Props> = ({category, href, isActive, onClick}) => {
  const {id, name, icon} = category
  const url = icon?.icon?.url
  const className = `${
    isActive ? 'bg-brand-a2' : ''
  } categories-selector-item text-black-b`
  return onClick ? (
    <Button className={className} key={id} onClick={onClick}>
      <ImageWrapper type={url} width={24} height={24} alt='slug' />
      <span className='pl-2'>{name}</span>
    </Button>
  ) : (
    <LinkWrapper className={className} key={id} href={href}>
      <ImageWrapper type={url} width={24} height={24} alt='slug' />
      <span className='pl-2'>{name}</span>
    </LinkWrapper>
  )
}

export default CategoryItem
