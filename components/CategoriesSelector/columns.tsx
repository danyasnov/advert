// eslint-disable-next-line max-classes-per-file
import {source, target} from 'react-aim'
import {PureComponent, ReactNode} from 'react'
import {CACategoryModel} from 'front-api'
import CategoryItem from './CategoryItem'
import {notImplementedAlert} from '../../helpers'
import Button from '../Buttons/Button'

interface ColItemProps {
  category: CACategoryModel
  isActive: boolean
  onMouseEnter?: (c: CACategoryModel) => void
  onClick?: () => void
}

interface ColProps {
  items: Array<CACategoryModel>
  onMouseEnter?: (c: CACategoryModel) => void
  activeId?: number | undefined
}

// @ts-ignore
@source({
  mouseEnter: (props) => props.onMouseEnter(props.category),
})
class FirstColItem extends PureComponent<ColItemProps> {
  render(): ReactNode {
    const {category, isActive, onClick} = this.props
    const {name} = category

    return (
      <CategoryItem category={category} onClick={onClick} isActive={isActive}>
        {name}
      </CategoryItem>
    )
  }
}

// @ts-ignore
@target()
class SecondCol extends PureComponent<ColProps> {
  render(): ReactNode {
    const {items, onMouseEnter, activeId} = this.props
    return (
      <div className='h-full'>
        {items.map((c) => {
          return (
            <SecondColItem
              key={c.id}
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
    const {category, isActive} = this.props
    const {name} = category
    return (
      <Button
        className={`${
          isActive ? 'bg-brand-a2' : ''
        } categories-selector-item first:font-bold`}
        onClick={notImplementedAlert}>
        {name}
      </Button>
    )
  }
}

// @ts-ignore
@target()
class ThirdCol extends PureComponent<ColProps> {
  render(): ReactNode {
    const {items} = this.props
    return (
      <div className='h-full'>
        {items.map((c) => (
          <Button
            className='categories-selector-item first:font-bold'
            key={c.id}
            onClick={notImplementedAlert}>
            {c.name}
          </Button>
        ))}
      </div>
    )
  }
}

export {FirstColItem, SecondCol, ThirdCol}
