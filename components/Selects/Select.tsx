import {FC, useEffect, useState} from 'react'
import RS, {components as RSComponents} from 'react-select'
import {FixedSizeList as List} from 'react-window'
import IcArrowDown from 'icons/material/ArrowDown.svg'
import {isEqual} from 'lodash'
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
  classNameOpt?
}

export interface SelectItem {
  value: string | number
  label: string
  disabled?: boolean
}

const OPTION_HEIGHT = 52
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

const DropdownIndicator = (props) => {
  const {isFocused} = props
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <RSComponents.DropdownIndicator {...props}>
      <IcArrowDown
        className={`w-5 h-5 fill-current text-greyscale-900 mr-3 ${
          isFocused ? 'rotate-180' : ''
        }`}
      />
    </RSComponents.DropdownIndicator>
  )
}
const Option = (props) => {
  const {isSelected, label} = props
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <RSComponents.Option {...props}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>{label}</label>
      <input type='checkbox' checked={isSelected} onChange={() => null} />
    </RSComponents.Option>
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
  const [sorted, setSorted] = useState(options)
  useEffect(() => {
    if (isMulti && Array.isArray(value)) {
      const tempOptions = [...options]
      const selected = value.map((v) => {
        const currentIndex = tempOptions.findIndex((o) => o.value === v.value)
        const currentOption = tempOptions[currentIndex]
        tempOptions.splice(currentIndex, 1)
        return currentOption
      })
      setSorted([...selected, ...tempOptions])
    } else if (!isEqual(sorted, options)) {
      setSorted(options)
    }
  }, [value, options])
  return (
    <>
      <RS
        inputId={id}
        id={id}
        value={value}
        options={sorted}
        hideSelectedOptions={!isMulti}
        placeholder={placeholder}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        onChange={onChange}
        isClearable={isClearable}
        isMulti={isMulti}
        closeMenuOnSelect={!isMulti}
        menuPortalTarget={
          typeof document !== 'undefined' ? document.body : null
        }
        styles={{
          ...getDefaultStyles(isInvalid),
          ...propsStyles,
          menuPortal: (base) => ({...base, zIndex: 9999}),
        }}
        isOptionDisabled={(option) => option.disabled}
        className='react-select'
        components={{
          MenuList,
          DropdownIndicator,
          ...(isMulti ? {Option} : {}),
          ...(components || {}),
        }}
      />
      <input
        className={`invisible absolute ${isInvalid ? 'border-error' : ''}`}
      />
    </>
  )
}

export default Select
