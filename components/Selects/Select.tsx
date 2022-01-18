import {FC} from 'react'
import RS from 'react-select'
import {FixedSizeList as List} from 'react-window'
import {getDefaultStyles} from './styles'

export interface SelectProps {
  options: Array<SelectItem>
  placeholder?: string
  onChange: (value: SelectItem) => void
  value?: SelectItem
  isSearchable?: boolean
  isDisabled?: boolean
  isClearable?: boolean
  isMulti?: boolean
  isInvalid?: boolean
  id?: string
  styles?
  components?
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

const Select: FC<SelectProps> = ({
  options,
  placeholder,
  onChange,
  value,
  isSearchable,
  isDisabled,
  isClearable,
  isMulti,
  id,
  styles: propsStyles,
  isInvalid,
  components,
}) => {
  return (
    <RS
      inputId={id}
      id={id}
      value={value}
      options={options}
      placeholder={placeholder}
      isSearchable={isSearchable}
      isDisabled={isDisabled}
      onChange={onChange}
      isClearable={isClearable}
      isMulti={isMulti}
      closeMenuOnSelect={!isMulti}
      menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
      styles={{
        ...getDefaultStyles(isInvalid),
        ...propsStyles,
        menuPortal: (base) => ({...base, zIndex: 9999}),
      }}
      isOptionDisabled={(option) => option.disabled}
      className='react-select'
      components={{
        MenuList,
        ...(components || {}),
      }}
    />
  )
}

export default Select
