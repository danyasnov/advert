import {FC} from 'react'
import {CACategoryModel} from 'front-api/src/index'
import {isMobile} from 'react-device-detect'
import {useWindowSize} from 'react-use'
import {toJS} from 'mobx'
import Button from '../Buttons/Button'
import LinkWrapper from '../Buttons/LinkWrapper'
import ImageWrapper from '../ImageWrapper'
import {handleMetrics} from '../../helpers'

interface Props {
  category: CACategoryModel
  href?: string
  onClick?: () => void
  onLinkClick?: () => void
  isActive?: boolean
}

const CategoryItem: FC<Props> = ({
  category,
  href,
  isActive,
  onClick,
  onLinkClick,
}) => {
  const {id, name, icon} = category
  const url = icon?.icon?.url
  const className = `${
    isActive ? 'bg-white text-primary-500' : ''
  } categories-selector-item py-2 h-10 text-greyscale-900 s:rounded-l-lg group`
  const {width} = useWindowSize()

  const elBody = (
    <>
      {!!url && (
        <div className='mr-2 transition ease-in-out delay-150 group-hover:scale-125 duration-300'>
          <ImageWrapper
            type={url}
            width={24}
            height={24}
            layout='fixed'
            alt='slug'
            quality={100}
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
      preventDefault={width <= 768 ? false : isMobile && !isActive}
      handleClick={() => {
        if (onLinkClick) onLinkClick()
        handleMetrics('clickCategory', {categoryId: id})
      }}>
      {elBody}
    </LinkWrapper>
  )
}

export default CategoryItem
