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

  const elBody = (
    <>
      {!!url && (
        <div className='mr-2'>
          <ImageWrapper type={url} width={24} height={24} alt='slug' />
        </div>
      )}
      <span>{name}</span>
    </>
  )
  return onClick ? (
    <Button className={className} key={id} onClick={onClick}>
      {elBody}
    </Button>
  ) : (
    <LinkWrapper className={className} key={id} href={href}>
      {elBody}
    </LinkWrapper>
  )
}

export default CategoryItem
