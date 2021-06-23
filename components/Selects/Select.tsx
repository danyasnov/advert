import {FC} from 'react'
import RS from 'react-select'
import {FixedSizeList as List} from 'react-window'
import styles from './styles'

interface Props {
  options: Array<SelectItem>
  placeholder: string
  onChange: (value: SelectItem) => void
  value?: SelectItem
  isSearchable?: boolean
  isDisabled?: boolean
  isClearable?: boolean
  isMulti?: boolean
}

export interface SelectItem {
  value: string | number
  label: string
}

const OPTION_HEIGHT = 40
const ROWS = 10

const MenuList = ({options, children, getValue}) => {
  const [value] = getValue()
  let initialOffset
  if (
    options.indexOf(value) !== -1 &&
    Array.isArray(children) &&
    children.length >= ROWS &&
    options.indexOf(value) >= ROWS
  ) {
    initialOffset = options.indexOf(value) * OPTION_HEIGHT - OPTION_HEIGHT * 5
  } else {
    initialOffset = 0
  }

  return Array.isArray(children) ? (
    <List
      height={
        children.length >= ROWS
          ? OPTION_HEIGHT * ROWS
          : children.length * OPTION_HEIGHT
      }
      itemCount={children.length}
      itemSize={OPTION_HEIGHT}
      initialScrollOffset={initialOffset}>
      {({style, index}) => {
        return <div style={style}>{children[index]}</div>
      }}
    </List>
  ) : (
    <div>{children}</div>
  )
}

const Select: FC<Props> = ({
  options,
  placeholder,
  onChange,
  value,
  isSearchable,
  isDisabled,
  isClearable,
  isMulti,
}) => {
  return (
    <RS
      value={value}
      options={options}
      placeholder={placeholder}
      isSearchable={isSearchable}
      isDisabled={isDisabled}
      onChange={onChange}
      isClearable={isClearable}
      isMulti={isMulti}
      styles={styles}
      components={{
        MenuList,
      }}
    />
  )
}

export default Select
