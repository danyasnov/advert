// @ts-nocheck
// in progress
// eslint-disable-next-line max-classes-per-file
import {source, target} from 'react-aim'
import {Component} from 'react'
import CategoryItem from './CategoryItem'
import {notImplementedAlert} from '../../helpers'
import Button from '../Button'

@source({
  mouseEnter: (props) => props.onMouseEnter(props.category),
})
class FirstColItem extends Component {
  render() {
    const {category} = this.props
    const {name} = category

    return (
      <CategoryItem category={category} onClick={notImplementedAlert}>
        {name}
      </CategoryItem>
    )
  }
}

@target()
class SecondColItemWrapper extends Component {
  render() {
    const {category, onMouseEnter} = this.props
    const {name, items} = category
    return <SecondColItem category={category} onMouseEnter={onMouseEnter} />
  }
}

@source({
  mouseEnter: (props) => props.onMouseEnter(props.category),
})
class SecondColItem extends Component {
  render() {
    const {category} = this.props
    const {name, items} = category
    return (
      <Button
        className='categories-selector-item'
        onClick={notImplementedAlert}>
        {name}
      </Button>
    )
  }
}

@target()
class ThirdColItem extends Component {
  render() {
    const {category} = this.props
    const {name, items} = category
    return (
      <Button
        className='categories-selector-item'
        onClick={notImplementedAlert}>
        {name}
      </Button>
    )
  }
}

export {FirstColItem, SecondColItemWrapper, ThirdColItem}
