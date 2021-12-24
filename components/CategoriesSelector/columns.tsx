// eslint-disable-next-line max-classes-per-file
import {source, target} from 'react-aim'
import {PureComponent, ReactNode} from 'react'
import {CACategoryModel} from 'front-api'
import {isMobile} from 'react-device-detect'
import CategoryItem from './CategoryItem'
import LinkWrapper from '../Buttons/LinkWrapper'
import {getLocationCodes} from '../../helpers'
import Button from '../Buttons/Button'

interface ColItemProps {
  category: CACategoryModel
  isActive: boolean
  onMouseEnter?: (c: CACategoryModel) => void
  href?: string
  onClick?: () => void
}

interface ColProps {
  items: Array<CACategoryModel>
  onMouseEnter?: (c: CACategoryModel) => void
  activeId?: number | undefined
  urlPath?: string
  onClick?: () => void
}

// @ts-ignore
@source({
  mouseEnter: (props) => props.onMouseEnter(props.category),
})
class FirstColItem extends PureComponent<ColItemProps> {
  render(): ReactNode {
    const {category, isActive, href, onClick} = this.props
    const {name} = category

    return (
      <CategoryItem
        category={category}
        href={href}
        isActive={isActive}
        onClick={onClick}>
        {name}
      </CategoryItem>
    )
  }
}

// @ts-ignore
@source({
  mouseEnter: (props) => {
    props.onMouseEnter(props.category)
  },
})
class ColItem extends PureComponent<ColItemProps> {
  render(): ReactNode {
    const {category, isActive, href} = this.props
    const {name} = category
    return (
      <LinkWrapper
        preventDefault={isMobile && !isActive && category.id !== 0}
        title={name}
        className={`${
          isActive ? 'bg-nc-accent' : ''
        } categories-selector-item text-black-b first:text-brand-b1 first:border-b`}
        href={href}>
        {name}
      </LinkWrapper>
    )
  }
}

// @ts-ignore
@source({
  mouseEnter: (props) => {
    props.onMouseEnter(props.category)
  },
})
class ButtonColItem extends PureComponent<ColItemProps> {
  render(): ReactNode {
    const {category, isActive, onClick} = this.props
    const {name} = category
    return (
      <Button
        className={`${
          isActive ? 'bg-nc-accent' : ''
        } categories-selector-item text-black-b`}
        onClick={onClick}>
        {name}
      </Button>
    )
  }
}

// @ts-ignore
@target()
class Col extends PureComponent<ColProps> {
  render(): ReactNode {
    const {items, onMouseEnter, activeId, urlPath} = this.props
    return (
      <div className='h-full'>
        {items.map((c) => {
          return (
            <ColItem
              key={c.id}
              href={`/${getLocationCodes()}/${urlPath}/${c.slug || ''}`}
              isActive={c.id === activeId}
              category={c}
              onMouseEnter={onMouseEnter}
            />
          )
        })}
      </div>
    )
  }
}

// @ts-ignore
@target()
class ButtonCol extends PureComponent<ColProps> {
  render(): ReactNode {
    const {items, onMouseEnter, activeId, onClick} = this.props
    return (
      <div className='h-full'>
        {items.map((c) => {
          return (
            <ButtonColItem
              key={c.id}
              onClick={onClick}
              isActive={c.id === activeId}
              category={c}
              onMouseEnter={onMouseEnter}
            />
          )
        })}
      </div>
    )
  }
}

export {FirstColItem, Col, ButtonColItem, ButtonCol}
