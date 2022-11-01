import React, {FC, useEffect, useState, useRef} from 'react'
import RS, {components as RSComponents} from 'react-select'
import {FixedSizeList as List} from 'react-window'
import IcArrowDown from 'icons/material/ArrowDown.svg'
import {isEqual} from 'lodash'
import IcCheck from 'icons/Check.svg'
import {getDefaultStyles} from './styles'
import Button from '../Buttons/Button'
import useOnClickOutside from '../../hooks/useOnClickOutside'

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
  const { isFocused } = props
  const [show, setShow] = useState(false)
  const ref = useRef()
  useOnClickOutside(ref, () => {
    setShow(false)
  })
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    /*
    <RSComponents.DropdownIndicator {...props}>
      <IcArrowDown
        className={`w-5 h-5 fill-current text-greyscale-900 mr-3 ${
          isFocused ? 'rotate-180 text-primary-500' : ''
        }`}
      />
    </RSComponents.DropdownIndicator>
      */
    <div ref={ref}>
      <Button onClick = {() => setShow(!show)}>
        <RSComponents.DropdownIndicator {...props}>
          <IcArrowDown
            className={`w-5 h-5 fill-current text-greyscale-900 mr-3 ${
            (isFocused && show) ? 'rotate-180 text-primary-500' : ''
            }`}
          />
        </RSComponents.DropdownIndicator>
      </Button> 
    </div>
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
