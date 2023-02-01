import {FC} from 'react'
import {useWindowSize} from 'react-use'
import {isEmpty} from 'lodash'
import Select, {SelectItem} from './Selects/Select'
import MobileSelect from './Selects/MobileSelect'

interface Props {
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

const SelectWrapper: FC<Props> = ({
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

  if (!isEmpty(options) && width >= 768) {
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
