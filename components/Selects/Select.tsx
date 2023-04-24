import React, {FC, useEffect, useMemo, useState} from 'react'
import RS, {components as RSComponents} from 'react-select'
import {FixedSizeList as List} from 'react-window'
import IcArrowDown from 'icons/material/ArrowDown.svg'
import {isEqual} from 'lodash'
import IcCheck from 'icons/Check.svg'
import {getDefaultStyles} from './styles'
import {getTextWidth} from '../../utils'

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
  menuIsOpen?: boolean
  isIconSelect?: boolean
  id?: string
  filterStyle?: boolean
  styles?
  components?
  classNameOpt?
}

export interface SelectItem {
  value: string | number
  label: string
  disabled?: boolean
  icon?: string
}

const ROWS = 10

const MenuList = (optionHeight) => {
  return ({options, children, getValue}) => {
    const [value] = getValue()
    let initialOffset
    if (
      options.indexOf(value) !== -1 &&
      Array.isArray(children) &&
      children.length >= ROWS &&
      options.indexOf(value) >= ROWS
    ) {
      initialOffset = options.indexOf(value) * optionHeight - optionHeight * 5
    } else {
      initialOffset = 0
    }

    return Array.isArray(children) ? (
      <List
        height={
          children.length >= ROWS
            ? optionHeight * ROWS
            : children.length * optionHeight
        }
        itemCount={children.length}
        itemSize={optionHeight}
        initialScrollOffset={initialOffset}>
        {({style, index}) => {
          return (
            <div style={style} className='flex items-center'>
              {children[index]}
            </div>
          )
        }}
      </List>
    ) : (
      <div>{children}</div>
    )
  }
}

const DropdownIndicator = (props) => {
  const {menuIsOpen} = props.selectProps
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <RSComponents.DropdownIndicator {...props}>
      <IcArrowDown
        className={`w-5 h-5 fill-current text-greyscale-900 mr-3 ${
          menuIsOpen ? 'rotate-180' : ''
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
      {/* <input type='checkbox' checked={isSelected} onChange={() => null} /> */}
      <input
        type='checkbox'
        name={label}
        checked={isSelected}
        id={label}
        onChange={() => null}
        className='opacity-0 '
      />
      <div className='bg-white border-2 rounded-md h-4 w-4 flex shrink-0 justify-center items-center border-primary-500'>
        <IcCheck className='h-2.5 w-2.5 hidden' />
      </div>
    </RSComponents.Option>
  )
}

const Select: FC<SelectProps> = ({
  filterStyle,
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
  const menuWidth = useMemo(() => {
    if (typeof window === 'undefined' || !filterStyle) return 0
    const arr = options.map((o) => o.label.length)
    const index = arr.indexOf(Math.max(...arr))
    const width = getTextWidth(options[index].label, 'normal 12px Euclid')
    return width
  }, [options])
  return (
    <>
      <RS
        inputId={id}
        id={id}
        value={value}
        options={sorted}
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
          MenuList: MenuList(filterStyle ? 34 : 52),
          DropdownIndicator,
          ...(isMulti ? {Option} : {}),
          ...(components || {}),
        }}
        // @ts-ignore
        {...(filterStyle ? {menuWidth} : {})}
      />
      <input
        className={`invisible absolute ${isInvalid ? 'border-error' : ''}`}
      />
    </>
  )
}

export default Select
