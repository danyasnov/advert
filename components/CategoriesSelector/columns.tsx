// eslint-disable-next-line max-classes-per-file
import {source, target} from 'react-aim'
import {PureComponent, ReactNode} from 'react'
import {CACategoryModel} from 'front-api'
import CategoryItem from './CategoryItem'
import LinkWrapper from '../Buttons/LinkWrapper'

interface ColItemProps {
  category: CACategoryModel
  isActive: boolean
  onMouseEnter?: (c: CACategoryModel) => void
  href: string
  activeCategory?: CACategoryModel
}

interface ColProps {
  items: Array<CACategoryModel>
  onMouseEnter?: (c: CACategoryModel) => void
  activeId?: number | undefined
  activeCategory: CACategoryModel
  secondActiveCategory?: CACategoryModel
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
@target()
class SecondCol extends PureComponent<ColProps> {
  render(): ReactNode {
    const {items, onMouseEnter, activeId, activeCategory} = this.props
    return (
      <div className='h-full'>
        {items.map((c) => {
          return (
            <SecondColItem
              key={c.id}
              href={`/all/all/${activeCategory.slug}/${c.slug || ''}`}
              activeCategory={activeCategory}
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
@source({
  mouseEnter: (props) => {
    props.onMouseEnter(props.category)
  },
})
class SecondColItem extends PureComponent<ColItemProps> {
  render(): ReactNode {
    const {category, isActive, href} = this.props
    const {name} = category
    return (
      <LinkWrapper
        className={`${
          isActive ? 'bg-brand-a2' : ''
        } categories-selector-item first:font-bold`}
        href={href}>
        {name}
      </LinkWrapper>
    )
  }
}

// @ts-ignore
@target()
class ThirdCol extends PureComponent<ColProps> {
  render(): ReactNode {
    const {items, activeCategory, secondActiveCategory} = this.props
    return (
      <div className='h-full'>
        {items.map((c) => (
          <LinkWrapper
            className='categories-selector-item first:font-bold '
            key={c.id}
            href={`/all/all/${activeCategory.slug}/${
              secondActiveCategory.slug
            }/${c.slug || ''}`}>
            {c.name}
          </LinkWrapper>
        ))}
      </div>
    )
  }
}

export {FirstColItem, SecondCol, ThirdCol}
