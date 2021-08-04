// eslint-disable-next-line max-classes-per-file
import {source, target} from 'react-aim'
import {PureComponent, ReactNode} from 'react'
import {CACategoryModel} from 'front-api'
import CategoryItem from './CategoryItem'
import LinkWrapper from '../Buttons/LinkWrapper'
import {getLocationCodes} from '../../helpers'

interface ColItemProps {
  category: CACategoryModel
  isActive: boolean
  onMouseEnter?: (c: CACategoryModel) => void
  href: string
}

interface ColProps {
  items: Array<CACategoryModel>
  onMouseEnter?: (c: CACategoryModel) => void
  activeId?: number | undefined
  urlPath: string
}

// @ts-ignore
@source({
  mouseEnter: (props) => props.onMouseEnter(props.category),
})
class FirstColItem extends PureComponent<ColItemProps> {
  render(): ReactNode {
    const {category, isActive, href} = this.props
    const {name} = category

    return (
      <CategoryItem category={category} href={href} isActive={isActive}>
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
        title={name}
        className={`${
          isActive ? 'bg-brand-a2' : ''
        } categories-selector-item text-black-b first:text-brand-b1 first:border-b`}
        href={href}>
        {name}
      </LinkWrapper>
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

export {FirstColItem, Col}
