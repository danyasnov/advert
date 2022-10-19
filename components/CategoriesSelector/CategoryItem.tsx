import {FC} from 'react'
import {CACategoryModel} from 'front-api/src/index'
import {isMobile} from 'react-device-detect'
import {useWindowSize} from 'react-use'
import {toJS} from 'mobx'
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
    isActive ? 'bg-white font-bold text-primary-500' : ''
  } categories-selector-item text-greyscale-900 s:rounded-l-lg`
  const {width} = useWindowSize()

  const elBody = (
    <>
      {!!url && (
        <div className='mr-2'>
          <ImageWrapper
            type={url}
            width={24}
            height={24}
            layout='fixed'
            alt='slug'
          />
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
    <LinkWrapper
      title={name}
      className={className}
      key={id}
      href={href}
      preventDefault={width <= 768 ? false : isMobile && !isActive}>
      {elBody}
    </LinkWrapper>
  )
}

export default CategoryItem
