import {FC} from 'react'
import RS from 'react-select'
import styles from './styles'

interface Props {
  options: Array<SelectItem>
  placeholder: string
  onChange: (value: SelectItem) => void
  value: SelectItem
  isSearchable?: boolean
  isDisabled?: boolean
}

interface SelectItem {
  value: string | number
  label: string
}

const Select: FC<Props> = ({
  options,
  placeholder,
  onChange,
  value,
  isSearchable,
  isDisabled,
}) => {
  return (
    <RS
      value={value}
      options={options}
      placeholder={placeholder}
      isSearchable={isSearchable}
      isDisabled={isDisabled}
      onChange={onChange}
      styles={styles}
    />
  )
}

export default Select
