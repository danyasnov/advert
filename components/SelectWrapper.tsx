import {FC} from 'react'
import {useWindowSize} from 'react-use'
import {isEmpty} from 'lodash'
import Select, {SelectItem, SelectProps} from './Selects/Select'
import MobileSelect from './Selects/MobileSelect'

const SelectWrapper: FC<SelectProps> = ({
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
  classNameOpt,
}) => {
  const {width} = useWindowSize()
  if (isEmpty(options)) return null
  if (width >= 768) {
    return (
      <Select
        options={options}
        placeholder={placeholder}
        value={value}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        isClearable={isClearable}
        isMulti={isMulti}
        id={id}
        styles={propsStyles}
        isInvalid={isInvalid}
        components={components}
        classNameOpt={classNameOpt}
        onChange={onChange}
      />
    )
  }

  return (
    <MobileSelect
      options={options}
      placeholder={placeholder}
      value={value}
      isSearchable={isSearchable}
      isDisabled={isDisabled}
      isClearable={isClearable}
      isMulti={isMulti}
      id={id}
      styles={propsStyles}
      isInvalid={isInvalid}
      components={components}
      classNameOpt={classNameOpt}
      onChange={onChange}
    />
  )
}

export default SelectWrapper
