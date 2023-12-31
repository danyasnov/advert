import {FC} from 'react'
import {components} from 'react-select'
import {LinkStyles} from './styles'
import Select, {SelectItem} from './Select'

const {SingleValue} = components

interface Props {
  options: Array<SelectItem>
  placeholder: string
  onChange: (value: SelectItem) => void
  value?: SelectItem
  isSearchable?: boolean
  isDisabled?: boolean
  isClearable?: boolean
  isMulti?: boolean
  id?: string
}

const CustomSingleValue = (props) => {
  const {data} = props
  const {icon, label} = data
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <SingleValue {...props} className='flex items-center justify-end'>
      {!!icon && <span className='flex mr-2 w-5 h-5'>{icon}</span>}
      <span className='text-body-12 text-greyscale-800'>{label}</span>
    </SingleValue>
  )
}
const LinkSelect: FC<Props> = ({
  options,
  placeholder,
  onChange,
  value,
  isSearchable,
  isDisabled,
  isClearable,
  isMulti,
  id,
}) => {
  return (
    <Select
      id={id}
      value={value}
      options={options}
      placeholder={placeholder}
      isSearchable={isSearchable}
      isDisabled={isDisabled}
      onChange={onChange}
      isClearable={isClearable}
      isMulti={isMulti}
      styles={LinkStyles}
      components={{SingleValue: CustomSingleValue}}
    />
  )
}

export default LinkSelect
